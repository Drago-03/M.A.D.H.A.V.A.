#!/bin/bash
echo "Stopping all services..."
kill_port() {
    lsof -ti :"$1" | xargs kill -9 2>/dev/null || true
}
kill_port 5000
kill_port 5173
kill_port 27017
echo "All services stopped."
