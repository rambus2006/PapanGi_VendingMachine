from pydantic import BaseModel

class BuyRequest(BaseModel):
    drink_id: int
    money: int