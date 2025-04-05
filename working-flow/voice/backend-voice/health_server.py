import os
import threading
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler

logger = logging.getLogger("health-server")

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Not Found')
    
    def log_message(self, format, *args):
        logger.info(f"{self.address_string()} - {format%args}")

def run_server():
    port = int(os.getenv("PORT", 8003))
    server = HTTPServer(('0.0.0.0', port), HealthHandler)
    logger.info(f"Starting health check server on port {port}")
    server.serve_forever()

def start_health_server():
    """Start the health check server in a separate thread"""
    thread = threading.Thread(target=run_server, daemon=True)
    thread.start()
    logger.info("Health check server started in background thread")
    return thread 