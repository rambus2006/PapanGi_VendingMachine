from fastapi import APIRouter
from controllers.vending_controller import purchase_drink
from schemas.drink_schema import BuyRequest

# 컨트롤러 연결 
from controllers.vending_controller import (
    purchase_drink,
    get_drinks,
    get_drink
)
'''
추가해야하는 라우터 
GET  /drinks
GET  /drinks/{id}
POST /drinks/buy
'''
router = APIRouter(
    prefix="/drinks",
    tags=["Drinks"]
)

# 전체 조회
@router.get("")
def drink_list():
    return get_drinks()


# 상세 조회
@router.get("/{drink_id}")
def drink_detail(drink_id: int):
    return get_drink(drink_id)


# 구매
@router.post("/buy")
def buy_drink(req: BuyRequest):

    return purchase_drink(
        req.drink_id,
        req.money
    )