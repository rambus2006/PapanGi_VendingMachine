# 초기 데이터 베이스에 데이터 json파일 추가
import json
from models.connectdb import get_connection


with open("../data/drinks.json", "r", encoding="utf-8") as file:
    drinks = json.load(file)


conn = get_connection()
cursor = conn.cursor()

sql = """
INSERT INTO drinks
(name, price, stock, image_path)
VALUES (%s, %s, %s, %s)
"""

for drink in drinks:
    cursor.execute(sql, (
        drink["name"],
        drink["price"],
        drink["stock"],
        drink["image_path"]
    ))

conn.commit()
conn.close()

print("데이터 추가 완료!")