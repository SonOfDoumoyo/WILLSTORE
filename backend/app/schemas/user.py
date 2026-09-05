from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime
from typing import List
from .social import DisplaySocialModel


class AbstractUserDataModel(BaseModel):

    uid: uuid.UUID
    email: str
    firstname: str
    lastname: str
    role: str
    verified: bool
    status: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

class UserDataModel(BaseModel):

    uid: uuid.UUID
    email: str
    fullname: str
    role: str
    verified: bool
    status: str
    created_at: datetime
    updated_at: datetime
    socials: List[DisplaySocialModel]

    model_config = ConfigDict(
            from_attributes=True
    )