import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Column, ForeignKey

import sqlalchemy.dialects.postgresql as pg
from sqlmodel import SQLModel, Field, Column, Relationship
from typing import Optional
from enum import Enum
from .user import User



class AccountStatus(str, Enum):

    AVAILABLE = "available"
    RESERVED = "reserved"
    SOLD = "sold"

class Social(SQLModel, table=True):
    __tablename__="socials"
    sid: uuid.UUID = Field(default_factory=uuid.uuid4, sa_column=Column(
        pg.UUID,
        unique=True,
        primary_key=True,
        nullable=False,
        index=True,
    ))
    username: str = Field(sa_column=Column(
        pg.VARCHAR,
        unique=False,
        nullable=False,
        index=True,
    ))
    price: str
    followers: str
    region: str
    likes: str
    messaging_guaranteed: bool

    status: AccountStatus = Field(sa_column=Column(pg.ENUM(AccountStatus, name='accountstatus'), default=AccountStatus.AVAILABLE))

    # profile_image_url = Column(String, nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column(
            pg.TIMESTAMP(timezone=True)
        ))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column(
        pg.TIMESTAMP(timezone=True)
    ))
    owner_id: uuid.UUID = Field(sa_column=Column(
        pg.UUID,
        ForeignKey("users.uid", ondelete="CASCADE"),
        nullable=False,
    ))
    owner: User = Relationship(
        back_populates="socials", sa_relationship_kwargs={"lazy": "selectin"}
    )
    