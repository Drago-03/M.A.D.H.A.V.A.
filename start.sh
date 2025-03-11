#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=5000
FRONTEND_PORT=5173
MONGODB_PORT=27017
HOST=0.0.0.0

echo -e "${GREEN}Starting M.A.D.H.A.V.A. Services...${NC}\n"

# Create necessary directories
mkdir -p logs
mkdir -p data/mongodb

# Function to check if a port is in use
check_port() {
    lsof -i :"$1" > /dev/null 2>&1
    return $?
}

# Function to kill process on a port
kill_port() {
    echo -e "${YELLOW}Killing process on port $1...${NC}"
    lsof -ti :"$1" | xargs kill -9 2>/dev/null || true
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check and create Python virtual environment
setup_venv() {
    echo -e "${GREEN}Setting up Python virtual environment...${NC}"
    if [ ! -d "venv" ]; then
        python3.11 -m venv venv
    fi
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
}

# Check and install frontend dependencies
setup_frontend() {
    echo -e "${GREEN}Setting up frontend dependencies...${NC}"
    cd client
    # Create .env file for frontend
    cat > .env << EOF
SKIP_PREFLIGHT_CHECK=true
VITE_API_URL=http://localhost:${BACKEND_PORT}
HOST=${HOST}
PORT=${FRONTEND_PORT}
EOF
    npm install
    cd ..
}

# Kill existing processes
kill_port $BACKEND_PORT  # Backend
kill_port $FRONTEND_PORT # Frontend
kill_port $MONGODB_PORT  # MongoDB

# Setup virtual environment and install dependencies
setup_venv

# Setup frontend
setup_frontend

# Start MongoDB
echo -e "${GREEN}Starting MongoDB...${NC}"
if command_exists mongod; then
    mongod --dbpath data/mongodb --port $MONGODB_PORT --fork --logpath logs/mongodb.log
else
    echo -e "${RED}MongoDB not found. Please install MongoDB first.${NC}"
    exit 1
fi

# Start backend server
echo -e "${GREEN}Starting backend server...${NC}"
(cd backend && uvicorn main:app --host ${HOST} --port ${BACKEND_PORT} --reload > ../logs/backend.log 2>&1 &)

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 5

# Start frontend server
echo -e "${GREEN}Starting frontend server...${NC}"
(cd client && npm run dev > ../logs/frontend.log 2>&1 &)

# Print status
echo -e "\n${GREEN}All services started!${NC}"
echo -e "${YELLOW}Frontend:${NC} http://localhost:${FRONTEND_PORT}"
echo -e "${YELLOW}Backend:${NC} http://localhost:${BACKEND_PORT}"
echo -e "${YELLOW}API Docs:${NC} http://localhost:${BACKEND_PORT}/docs"
echo -e "\n${GREEN}Logs are available in the logs directory:${NC}"
echo "- Frontend: logs/frontend.log"
echo "- Backend: logs/backend.log"
echo "- MongoDB: logs/mongodb.log"
echo -e "\n${YELLOW}To stop all services, run: ./stop.sh${NC}"

# Create stop script
cat > stop.sh << EOL
#!/bin/bash
echo "Stopping all services..."
kill_port() {
    lsof -ti :"\$1" | xargs kill -9 2>/dev/null || true
}
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT
kill_port $MONGODB_PORT
echo "All services stopped."
EOL

chmod +x stop.sh

# Keep the script running and show logs
echo -e "\n${GREEN}Showing logs (Ctrl+C to stop viewing logs, services will continue running)${NC}\n"
tail -f logs/*.log 