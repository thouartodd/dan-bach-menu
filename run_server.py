#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Set the port
PORT = 8000

# Determine the directory to serve (current directory)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow fetch requests from the same origin
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

# Create the server
Handler = MyHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving at http://localhost:{PORT}")
print("Press Ctrl+C to stop the server")

# Try to open the browser automatically (optional)
try:
    webbrowser.open(f"http://localhost:{PORT}")
except:
    pass

# Start the server
httpd.serve_forever()
