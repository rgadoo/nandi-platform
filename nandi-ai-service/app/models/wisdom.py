from pydantic import BaseModel, Field
from typing import Optional

class WisdomRequest(BaseModel):
    pet_type: str = Field(..., description="Type of pet")
    interaction_type: str = Field(..., description="Type of interaction")
    pet_name: str = Field(..., description="Name of the pet")
    user_info: Optional[dict] = Field(default=None, description="User information")

class WisdomResponse(BaseModel):
    wisdom: str = Field(..., description="Generated wisdom") 