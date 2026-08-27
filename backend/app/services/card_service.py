from app.schemas.card import CardCreate, CardResponse
from app.database.config import SessionLocal
from app.models.card import Card


def get_all_cards() -> list[CardResponse]:
    """获取所有卡片"""
    db = SessionLocal()
    try:
        return db.query(Card).all()
    finally:
        db.close()


def get_card_by_id(card_id: int) -> CardResponse | None:
    """根据 ID 查找单张卡片，找不到返回 None"""
    db = SessionLocal()
    try:
        return db.query(Card).filter(Card.id == card_id).first()
    finally:
        db.close()


def create_card(card_data: CardCreate) -> CardResponse:
    """
    创建新卡片

    1. 用 CardCreate 的数据构造 Card ORM 对象
    2. db.add() 加入会话，db.commit() 提交到数据库
    3. db.refresh() 从数据库读取自动生成的 id
    """
    new_card = Card(
        question=card_data.question,
        answer=card_data.answer,
        tag=card_data.tag,
        difficulty=card_data.difficulty,
    )

    db = SessionLocal()
    try:
        db.add(new_card)
        db.commit()
        db.refresh(new_card)
    finally:
        db.close()

    return new_card


def update_card(card_id: int, card_data: CardCreate) -> CardResponse | None:
    """
    更新卡片

    通过 ORM 查询找到目标卡片，更新字段后提交
    找不到返回 None
    """
    db = SessionLocal()
    try:
        card = db.query(Card).filter(Card.id == card_id).first()
        if card:
            card.question = card_data.question
            card.answer = card_data.answer
            card.tag = card_data.tag
            card.difficulty = card_data.difficulty
            db.commit()
            db.refresh(card)
            return card
    finally:
        db.close()
   
    return None


def delete_card(card_id: int) -> bool:
    """
    删除卡片

    通过 ORM 查询找到目标卡片，db.delete() 删除后提交
    找不到返回 False
    """
    db = SessionLocal()
    try:
        card = db.query(Card).filter(Card.id == card_id).first()
        if card:
            db.delete(card)
            db.commit()
            return True
    finally:
        db.close()
    return False


def update_card_review(card_id: int, review_data: dict):
    """把算法计算的结果更新到数据库

    参数：
    - card_id: 卡片 ID
    - review_data: 算法返回的 dict { interval, ease_factor, next_review, review_count }
    """
    db = SessionLocal()
    try:
        card = db.query(Card).filter(Card.id == card_id).first()
        if card:
            card.interval = review_data["interval"]
            card.ease_factor = review_data["ease_factor"]
            card.next_review = review_data["next_review"]
            card.review_count = review_data["review_count"]
            db.commit()
            db.refresh(card)
            return card
    finally:
        db.close()
    return None
