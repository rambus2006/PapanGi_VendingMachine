import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from models.drink_model import get_all_drinks
from controllers.vending_controller import purchase_drink
from controllers.admin_controller import create_drink, remove_drink

app = FastAPI(title="자판기 API")


class BuyRequest(BaseModel):
    drink_id: int
    money: int


class DrinkCreateRequest(BaseModel):
    name: str
    price: int
    stock: int
    image_path: str = ""

@app.get("/", response_class=HTMLResponse)
def home():
    return "<h1>자판기 서버 실행됨</h1>"

@app.get("/drinks")
def list_drinks():
    return get_all_drinks()


@app.post("/drinks/buy")
def buy_drink(req: BuyRequest):
    result = purchase_drink(req.drink_id, req.money)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result


@app.post("/admin/drinks")
def add_drink(req: DrinkCreateRequest):
    result = create_drink(req.name, req.price, req.stock, req.image_path)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result


@app.delete("/admin/drinks/{drink_id}")
def delete_drink(drink_id: int):
    return remove_drink(drink_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
