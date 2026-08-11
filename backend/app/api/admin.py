from fastapi import APIRouter, Depends, Request, Response, BackgroundTasks, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import session
from app.services.auth import AuthService
from app.schemas.auth import LoginModel
from app.services.admin import AdminService
from app.utils.validators import create_url_safe_token, create_access_token, create_refresh_token
from app.utils.mail import send_email_verification_email
from app.schemas.social import AddSocial
from app.core.dependencies import RoleChecker
from app.utils.auth import verify_hash
from app.utils.redis import store_access_token, store_refresh_token


auth_service = AuthService()
admin_service = AdminService()
router = APIRouter()
REFRESH_TOKEN_EXPIRY = 7

admin_required = RoleChecker(["admin"])
    

@router.post("/add_social_account")
async def add_social(account_data: AddSocial, session: AsyncSession = Depends(session), role = Depends(admin_required)):
    account_details = account_data.model_dump()
    new_social = await admin_service.add_social_account(account_details, session)

    if not new_social:
        raise HTTPException(
            details="socials not added",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    return JSONResponse(
        content="added successfully",
        status_code=status.HTTP_201_CREATED
    )


@router.post("/login")
async def log_in(remember_me: bool, login_data: LoginModel, session: AsyncSession = Depends(session)):
    email = login_data.email
    password = login_data.password

    user = await auth_service.get_user(email, session)
    if user is None:
        raise HTTPException(
            detail="User not found",
            status_code=status.HTTP_404_NOT_FOUND
        )

    if user.role != "admin":
        raise HTTPException(
            detail="Not an admin",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    if not verify_hash(password, user.password):
        raise HTTPException(
            detail="Wrong password or email: try again",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    user_data = {
        'uid': str(user.uid),
        'email': str(user.email),
    }

    access_token, apayload = create_access_token(user_data=user_data)
    refresh_token, jti, rpayload = create_refresh_token(
        user_data=user_data, expiry=REFRESH_TOKEN_EXPIRY, refresh=True
    )
    await store_access_token(user_uid=jti, value=apayload)
    await store_refresh_token(user_uid=jti, value=rpayload)

    max_age = 60 * 60 * 24 * 30 if remember_me else 60 * 60 * 24

    response = JSONResponse(
        content={
            "email": email,
            "user_uid": str(user.uid)
        },
        status_code=status.HTTP_200_OK,
    )
    response.set_cookie(
        key=f"refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        domain="localhost",
        max_age=max_age,
    )
    response.set_cookie(
        key=f"access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
    )
    return response
    

