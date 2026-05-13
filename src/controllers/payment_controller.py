# controllers/payment_controller.py

def add_money(current_money, input_money):
    """
    금액 누적 처리
    """

    # 숫자가 아니거나 음수면 예외
    if input_money <= 0:
        return {
            "success": False,
            "message": "올바른 금액이 아닙니다.",
            "money": current_money
        }

    total = current_money + input_money

    return {
        "success": True,
        "money": total
    }


def calculate_change(money, price):
    """
    거스름돈 계산
    """

    return money - price