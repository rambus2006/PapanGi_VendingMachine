# admin_model.py
# 관리자 데이터 처리

from .connectdb import get_connection


# 관리자 로그인 확인
def check_admin(password):
    conn = get_connection()
    cursor = conn.cursor()

    sql = "SELECT * FROM admin WHERE password = %s"

    cursor.execute(sql, (password,))

    admin = cursor.fetchone()

    conn.close()

    return admin


# 재고 보충
def refill_stock(drink_id, amount):
    conn = get_connection()
    cursor = conn.cursor()

    sql = """
    UPDATE drinks
    SET stock = stock + %s
    WHERE id = %s
    """

    cursor.execute(sql, (amount, drink_id))

    conn.commit()
    conn.close()