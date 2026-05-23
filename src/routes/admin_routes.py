# routers/admin_router.py

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from models.admin_model import check_admin
from controllers.admin_controller import create_drink, remove_drink

router = APIRouter(prefix="/admin")
templates = Jinja2Templates(directory="templates")


# ── 인증 헬퍼 ──
def is_admin(request: Request):
    if not request.session.get("is_admin"):
        raise HTTPException(status_code=401, detail="로그인이 필요해요")


# ── 페이지 서빙 ──
@router.get("")
async def admin_page(request: Request):
    return templates.TemplateResponse(request=request, name="admin.html")

# ── 로그인 / 로그아웃 ──
class LoginBody(BaseModel):
    password: str

@router.post("/login")
async def admin_login(body: LoginBody, request: Request):
    admin = check_admin(body.password)
    if not admin:
        raise HTTPException(status_code=401, detail="비밀번호가 틀렸어요")
    request.session["is_admin"] = True
    return {"success": True}

@router.post("/logout")
async def admin_logout(request: Request):
    request.session.clear()
    return {"success": True}


# ── 음료 추가 / 삭제 ──
class DrinkBody(BaseModel):
    name:  str
    price: int
    stock: int = 0
    image_path: str = ""

@router.post("/drinks")
async def drinks_create(body: DrinkBody, request: Request):
    is_admin(request)
    result = create_drink(body.name, body.price, body.stock, body.image_path)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.delete("/drinks/{drink_id}")
async def drinks_delete(drink_id: int, request: Request):
    is_admin(request)
    return remove_drink(drink_id)
