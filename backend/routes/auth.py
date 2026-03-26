"""Authentication routes."""
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status

from auth.jwt import (
    create_access_token,
    verify_password,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_admin,
    seed_default_admin,
)
from database import get_db
from limiter import limiter
from models import AdminLogin, TokenResponse, AdminUser

router = APIRouter()


@router.post("/auth/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, credentials: AdminLogin) -> TokenResponse:
    """Authenticate and get JWT token."""
    # Ensure default admin exists
    seed_default_admin()
    
    with get_db() as conn:
        row = conn.execute(
            "SELECT username, password_hash, role, is_active FROM admin_users WHERE username = ?",
            (credentials.username,)
        ).fetchone()
        
        if row is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not row["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not verify_password(credentials.password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": row["username"], "role": row["role"]},
            expires_delta=access_token_expires,
        )
        
        return TokenResponse(access_token=access_token)


@router.get("/auth/me", response_model=AdminUser)
def get_current_user_info(
    current_user: Annotated[dict, Depends(get_current_admin)]
) -> AdminUser:
    """Get current authenticated user info."""
    return AdminUser(
        username=current_user["username"],
        role=current_user["role"],
    )
