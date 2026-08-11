from app.core.config import AsyncSessionLocal
from fastapi import Depends
from app.models.user import User
from app.models.social import Social
from app.utils.auth import hash_password
from app.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio


async def create_admin():

    async with AsyncSessionLocal() as session:

        admin = User(
            email=str(settings.ADMIN_EMAIL),
            password=str(hash_password(settings.ADMIN_PASSWORD)),
            role='admin',
            fullname='williamsagu',
            verified=True,
            status='active',
            socials=[],
        )

        session.add(admin)
        await session.commit()
        await session.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
