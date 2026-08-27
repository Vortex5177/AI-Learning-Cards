from fastapi import APIRouter, HTTPException
from app.schemas.card import CardCreate, CardResponse
from app.services import card_service
from app.schemas.review import ReviewRequest
from app.services import review_service

# 创建路由器
# prefix="/api/cards" → 下面所有接口自动加上 /api/cards 前缀
# tags=["cards"] → Swagger 文档中的分组标签
router = APIRouter(prefix="/api/cards", tags=["cards"])


# 1. 获取所有卡片
# GET /api/cards/
@router.get("/")
def get_cards():
    return card_service.get_all_cards()


# 2. 获取单个卡片
# GET /api/cards/5 → card_id = 5
@router.get("/{card_id}", response_model=CardResponse)
def get_card(card_id: int):
    card = card_service.get_card_by_id(card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="卡片不存在")
    return card


# 3. 创建卡片
# POST /api/cards/  请求体: {"question": "...", "answer": "..."}
@router.post("/", response_model=CardResponse, status_code=201)
def create_card(card: CardCreate):
    return card_service.create_card(card)


# 4. 更新卡片
# PUT /api/cards/5  请求体: {"question": "...", "answer": "..."}
@router.put("/{card_id}", response_model=CardResponse)
def update_card(card_id: int, card: CardCreate):
    result = card_service.update_card(card_id, card)
    if result is None:
        raise HTTPException(status_code=404, detail="卡片不存在")
    return result


# 5. 删除卡片
# DELETE /api/cards/5
@router.delete("/{card_id}")
def delete_card(card_id: int):
    success = card_service.delete_card(card_id)
    if not success:
        raise HTTPException(status_code=404, detail="卡片不存在")
    return {"message": "删除成功"}


@router.post("/{card_id}/review")
def review_card(card_id: int, review: ReviewRequest):
    # 1. 查找卡片，找不到返回 404
    card = card_service.get_card_by_id(card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="卡片不存在")
    
    # 2. 调用算法计算
    review_data = review_service.calculate_review(card, review.result)
    
    # 3. 更新数据库
    updated_card = card_service.update_card_review(card_id, review_data)
    
    return updated_card