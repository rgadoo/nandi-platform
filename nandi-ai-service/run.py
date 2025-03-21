#!/usr/bin/env python3
"""
Nandi AI Service Entry Point

This script serves as the entry point for the Nandi AI Service application.
It provides a command-line interface for running the service with various options.

Usage:
    python run.py [--port PORT] [--host HOST] [--reload] [--test]
    
Options:
    --port PORT   Port to run the server on (default: 8000)
    --host HOST   Host to run the server on (default: 127.0.0.1)
    --reload      Enable auto-reload for development
    --test        Run tests instead of the server
"""

import sys
import os
import uvicorn
import argparse
from app.config import settings


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Nandi AI Service")
    parser.add_argument("--port", type=int, default=8000, help="Port to run the server on")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host to run the server on")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for development")
    parser.add_argument("--test", action="store_true", help="Run tests instead of the server")
    return parser.parse_args()


def run_tests():
    """Run the test suite."""
    import pytest
    sys.exit(pytest.main(["-v"]))


def main():
    """Main entry point for the application."""
    args = parse_args()
    
    if args.test:
        run_tests()
        return
    
    # Print startup info
    print(f"Starting Nandi AI Service in {settings.ENVIRONMENT} environment")
    print(f"Server will run at http://{args.host}:{args.port}")
    
    # Run the application
    uvicorn.run(
        "server:app",
        host=args.host,
        port=args.port,
        reload=args.reload and settings.ENVIRONMENT == "development"
    )


if __name__ == "__main__":
    main() 