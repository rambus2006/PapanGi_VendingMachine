# controllers/vending_controller.py

from models.drink_model import (
    get_all_drinks,
    get_drink_by_id,
    decrease_stock
)


# 전체 음료 조회
def get_drinks():
    return get_all_drinks()


# 특정 음료 조회
def get_drink(drink_id):

    drink = get_drink_by_id(drink_id)

    if not drink:
        return {
            "success": False,
            "message": "음료 없음"
        }

    return drink


# 기존 구매 로직 유지
def purchase_drink(drink_id, money):

    drink = get_drink_by_id(drink_id)

    if not drink:
        return {
            "success": False,
            "message": "음료 없음"
        }

    if drink["stock"] <= 0:
        return {
            "success": False,
            "message": "품절"
        }

    if money < drink["price"]:
        return {
            "success": False,
            "message": "금액 부족",
            "need_more": drink["price"] - money
        }

    decrease_stock(drink_id)

    change = money - drink["price"]

    return {
        "success": True,
        "message": "구매 성공",
        "change": change
    }