from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime


class AddSocial(BaseModel):
    username: str
    price: str
    followers: str
    region: str
    likes: str
    messaging_guaranteed: bool
    status: str

    model_config = ConfigDict(from_attributes=True)

class DisplaySocialModel(BaseModel):
    sid: uuid.UUID
    username: str
    price: str
    followers: str
    region: str
    likes: str
    messaging_guaranteed: bool
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)