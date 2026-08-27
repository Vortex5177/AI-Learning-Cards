from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import ai_service
from app.schemas.card import CardCreate
from app.services import card_service

# 创建路由器
router = APIRouter(prefix="/api/generate", tags=["generate"])


# 请求体结构
class GenerateRequest(BaseModel):
    topic: str  # 学习主题


# AI 生成卡片接口
# POST /api/generate/cards  请求体: {"topic": "HTTP协议"}
@router.post("/cards")
def generate_cards(request: GenerateRequest):
    """
    根据学习主题调用 AI 生成卡片

    流程：
    1. 接收用户输入的主题
    2. 调用 AI 生成卡片内容
    3. 返回生成的卡片列表（不自动保存到数据库）
    """
    try:
        cards = ai_service.generate_cards(request.topic)
        return {"topic": request.topic, "cards": cards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 生成失败: {str(e)}")


# 保存 AI 生成的卡片到数据库
# POST /api/generate/save  请求体: {"cards": [...]}
@router.post("/save")
def save_generated_cards(cards: list[CardCreate]):
    """
    把 AI 生成的卡片保存到数据库

    前端流程：
    1. 用户输入主题 → 调用 /api/generate/cards 获取 AI 生成的卡片
    2. 用户预览、选择想要的卡片
    3. 点击"保存" → 调用 /api/generate/save 保存到数据库
    """
    saved = []
    for card_data in cards:
        card = card_service.create_card(card_data)
        saved.append(card)
    return {"message": f"成功保存 {len(saved)} 张卡片", "cards": saved}
