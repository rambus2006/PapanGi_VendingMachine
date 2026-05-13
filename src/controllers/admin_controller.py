# controllers/admin_controller.py

from models.drink_model import add_drink, delete_drink


def create_drink(name, price, stock, image_path=""):
    """
    음료 추가
    """

    if not name or price <= 0 or stock < 0:
        return {
            "success": False,
            "message": "입력값 오류"
        }

    add_drink(name, price, stock, image_path)

    return {
        "success": True,
        "message": "음료 추가 완료"
    }


def remove_drink(drink_id):
    """
    음료 삭제
    """

    delete_drink(drink_id)

    return {
        "success": True,
        "message": "삭제 완료"
    }