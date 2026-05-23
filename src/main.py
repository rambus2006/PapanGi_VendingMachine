from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from routes.admin_routes import router as admin_router  # 추가
from routes.drink_routes import router
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(
    title="Vending Machine API",
    version="1.0.0"
)
app.add_middleware(SessionMiddleware, secret_key="1234")  # 추가

# 라우터 등록
app.include_router(router)
app.include_router(admin_router)
# templates 폴더 연결
templates = Jinja2Templates(directory="templates")

# css/js/static 연결
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )