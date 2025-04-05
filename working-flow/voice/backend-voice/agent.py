import logging
import os
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
    metrics,
)
from livekit.agents.pipeline import VoicePipelineAgent
from services.openai import Openai
from livekit.plugins import (
    deepgram,
    silero,
)
from health_server import start_health_server

# Load environment variables
load_dotenv()
logger = logging.getLogger("voice-agent")
logger.setLevel(logging.DEBUG)  # Set to DEBUG for more verbose logging

def prewarm(proc: JobProcess):
    try:
        logger.info("Starting VAD model loading...")
        proc.userdata["vad"] = silero.VAD.load()
        logger.info("VAD model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading VAD model: {str(e)}")
        raise

async def entrypoint(ctx: JobContext):
    try:
        logger.info("Initializing agent with system prompt...")
        initial_ctx = llm.ChatContext().append(
            role="system",
            text=(
                "You are a voice assistant created by LiveKit. Your interface with users will be voice. "
                "You should use short and concise responses, and avoiding usage of unpronouncable punctuation. "
                "You were created as a demo to showcase the capabilities of LiveKit's agents framework."
            ),
        )

        logger.info(f"Connecting to room {ctx.room.name}")
        await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
        logger.info(f"Successfully connected to room {ctx.room.name}")

        logger.info("Waiting for participant...")
        participant = await ctx.wait_for_participant()
        logger.info(f"Participant joined: {participant.identity}")

        logger.info("Initializing OpenAI service...")
        openai = Openai()
        logger.info("OpenAI service initialized")

        logger.info("Creating voice pipeline agent...")
        agent = VoicePipelineAgent(
            vad=ctx.proc.userdata["vad"],
            stt=deepgram.STT(),
            llm=openai.llm,
            tts=deepgram.TTS(),
            min_endpointing_delay=0.5,
            max_endpointing_delay=5.0,
            chat_ctx=initial_ctx,
        )
        logger.info("Voice pipeline agent created")

        usage_collector = metrics.UsageCollector()

        @agent.on("metrics_collected")
        def on_metrics_collected(agent_metrics: metrics.AgentMetrics):
            metrics.log_metrics(agent_metrics)
            usage_collector.collect(agent_metrics)

        logger.info("Starting agent...")
        agent.start(ctx.room, participant)
        logger.info("Agent started and ready")
        
        logger.info("Sending initial greeting...")
        await agent.say("Hey, how can I help you today?", allow_interruptions=True)
        logger.info("Initial greeting sent")
    except Exception as e:
        logger.error(f"Error in entrypoint: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger.info("Starting voice agent")
    
    # Start health check server
    health_thread = start_health_server()
    logger.info("Health check server started")
    
    # Print environment variables for debugging (masking secrets)
    livekit_url = os.getenv("LIVEKIT_URL")
    livekit_api_key = os.getenv("LIVEKIT_API_KEY")
    deepgram_api_key = os.getenv("DEEPGRAM_API_KEY")
    litellm_api_key = os.getenv("LITELLM_API_KEY")
    
    logger.info(f"LIVEKIT_URL: {livekit_url}")
    logger.info(f"LIVEKIT_API_KEY: {livekit_api_key[:5]}..." if livekit_api_key else "LIVEKIT_API_KEY: Not set")
    logger.info(f"DEEPGRAM_API_KEY: {deepgram_api_key[:5]}..." if deepgram_api_key else "DEEPGRAM_API_KEY: Not set")
    logger.info(f"LITELLM_API_KEY: {litellm_api_key[:5]}..." if litellm_api_key else "LITELLM_API_KEY: Not set")
    
    try:
        logger.info("Running agent with WorkerOptions...")
        cli.run_app(
            WorkerOptions(
                entrypoint_fnc=entrypoint,
                load_threshold=0.9,
                prewarm_fnc=prewarm,
                job_memory_warn_mb=2000,
                initialize_process_timeout=120,
            )
        )
    except Exception as e:
        logger.error(f"Failed to start agent: {str(e)}", exc_info=True)
