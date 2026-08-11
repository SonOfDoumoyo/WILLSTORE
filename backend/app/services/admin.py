import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.social import Social

class AdminService:

    async def add_social_account(self, social_data: dict, session: AsyncSession):
        try:
            new_social = Social(**social_data)
            session.add(new_social)
            session.commit()
            session.refresh(new_social)

            return new_social

        except Exception as e:
            await session.rollback()
            raise