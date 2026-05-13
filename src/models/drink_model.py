# drink_model.py
# 음료 데이터 처리

from .connectdb import get_connection


# 전체 음료 조회
def get_all_drinks():
    conn = get_connection()
    cursor = conn.cursor()

    sql = "SELECT * FROM drinks"
    cursor.execute(sql)

    drinks = cursor.fetchall()

    conn.close()

    return drinks


# 특정 음료 조회
def get_drink_by_id(drink_id):
    conn = get_connection()
    cursor = conn.cursor()

    sql = "SELECT * FROM drinks WHERE id = %s"
    cursor.execute(sql, (drink_id,))

    drink = cursor.fetchone()

    conn.close()

    return drink


# 재고 감소
def decrease_stock(drink_id):
    conn = get_connection()
    cursor = conn.cursor()

    sql = """
    UPDATE drinks
    SET stock = stock - 1
    WHERE id = %s
    """

    cursor.execute(sql, (drink_id,))
    conn.commit()

    conn.close()


# 음료 추가
def add_drink(name, price, stock):
    conn = get_connection()
    cursor = conn.cursor()

    sql = """
    INSERT INTO drinks(name, price, stock)
    VALUES (%s, %s, %s)
    """

    cursor.execute(sql, (name, price, stock))
    conn.commit()

    conn.close()


# 음료 삭제
def delete_drink(drink_id):
    conn = get_connection()
    cursor = conn.cursor()

    sql = "DELETE FROM drinks WHERE id = %s"

    cursor.execute(sql, (drink_id,))
    conn.commit()

    conn.close()