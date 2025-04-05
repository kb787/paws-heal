import os
import torch
from pathlib import Path

def download_models():
    # Create models directory
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Set environment variables
    os.environ["HUGGINGFACE_HUB_CACHE"] = str(models_dir)
    os.environ["TRANSFORMERS_CACHE"] = str(models_dir)
    os.environ["TORCH_HOME"] = str(models_dir)
    
    # Download Silero VAD
    print("Downloading Silero VAD...")
    model, utils = torch.hub.load(
        repo_or_dir='snakers4/silero-vad',
        model='silero_vad',
        force_reload=True
    )
    
    print("Models downloaded successfully!")

if __name__ == "__main__":
    download_models() 