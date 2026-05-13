# controllers/vending_controller.py

from models.drink_model import get_drink_by_id, decrease_stock


def purchase_drink(drink_id, money):
    """
    음료 구매 로직 (핵심 컨트롤러)
    """

    # 1. 음료 조회
    drink = get_drink_by_id(drink_id)

    if not drink:
        return {"success": False, "message": "음료 없음"}

    # 2. 품절 체크
    if drink["stock"] <= 0:
        return {"success": False, "message": "품절"}

    # 3. 금액 체크
    if money < drink["price"]:
        return {
            "success": False,
            "message": "금액 부족",
            "need_more": drink["price"] - money
        }

    # 4. 재고 감소
    decrease_stock(drink_id)

    # 5. 거스름돈 계산
    change = money - drink["price"]

    return {
        "success": True,
        "message": "구매 성공",
        "change": change
    }