"""
Authentication routes for M.A.D.H.A.V.A
"""

import os
from fastapi import APIRouter, Request, Response, Depends, HTTPException, status, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
import jwt
from datetime import datetime, timedelta
from pathlib import Path

# Import Pinecone for API key validation
try:
    import pinecone
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False

# Setup templates
templates_dir = Path(__file__).parent.parent / "templates"
templates = Jinja2Templates(directory=str(templates_dir))

# Create router
router = APIRouter()

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET", "your_jwt_secret_key_here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    pinecone_api_key: Optional[str] = None

class User(BaseModel):
    email: str
    pinecone_api_key: str

# Helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_pinecone_api_key(api_key: str) -> bool:
    """Verify if the Pinecone API key is valid."""
    if not PINECONE_AVAILABLE:
        # If Pinecone is not available, accept any key for development
        return True
    
    try:
        # Initialize Pinecone with the provided API key
        pinecone.init(api_key=api_key, environment="us-west1-gcp")
        
        # Try to list indexes to verify the key works
        pinecone.list_indexes()
        return True
    except Exception as e:
        print(f"Error verifying Pinecone API key: {str(e)}")
        return False

# Routes
@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Render the login page."""
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
async def login(
    email: str = Form(...),
    pinecone_api_key: str = Form(...)
):
    """Process login form submission."""
    # Verify the Pinecone API key
    if not verify_pinecone_api_key(pinecone_api_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Pinecone API key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email, "pinecone_api_key": pinecone_api_key},
        expires_delta=access_token_expires
    )
    
    # Set cookie and redirect to dashboard
    response = RedirectResponse(url="/dashboard", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return response

@router.get("/logout")
async def logout():
    """Log out the user by clearing the token cookie."""
    response = RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    response.delete_cookie(key="access_token")
    return response

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 compatible token endpoint."""
    # This is a simplified version - in a real app, you'd verify against a database
    if not verify_pinecone_api_key(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username, "pinecone_api_key": form_data.password},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"} 