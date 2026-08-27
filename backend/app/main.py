from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.cards import router as cards_router
from app.api.generate import router as generate_router
from app.api.stats import router as stats_router
from app.models.card import Card  # 导入模型，触发 create_all 建表

# 创建 FastAPI 实例
app = FastAPI(title="AI 学习卡片 API", version="0.1.0")

# CORS 配置：允许前端（localhost:5173）跨域访问后端
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],    # 允许所有 HTTP 方法（GET/POST/PUT/DELETE）
    allow_headers=["*"],    # 允许所有请求头
)

# 注册路由：把 cards.py 中定义的接口挂载到 app 上
app.include_router(cards_router)
app.include_router(generate_router)
app.include_router(stats_router)


# 根路径测试接口
@app.get("/")
def root():
    return {"message": "AI 学习卡片 API 运行中"}
