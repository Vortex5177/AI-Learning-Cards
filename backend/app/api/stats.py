from fastapi import APIRouter
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database.config import SessionLocal
from app.models.card import Card

# 创建路由器
router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/")
def get_stats():
    """
    获取学习统计数据

    返回：
    - total_cards: 总卡片数
    - due_cards: 待复习数
    - reviewed_today: 今日复习数
    - mastered: 已掌握数（ease_factor >= 2.5 且 interval >= 7）
    - learning: 学习中数（复习过但未掌握）
    - new_cards: 未学习数（从未复习过）
    - total_reviews: 总复习次数
    """
    db = SessionLocal()
    try:
        now = datetime.now()

        # 总卡片数
        total_cards = db.query(Card).count()

        # 待复习数：next_review 为空 或 next_review <= 当前时间
        due_cards = db.query(Card).filter(
            (Card.next_review == None) | (Card.next_review <= now)
        ).count()

        # 今日复习数：review_count > 0 且 next_review > 今天零点
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        reviewed_today = db.query(Card).filter(
            Card.next_review > today_start,
            Card.review_count > 0
        ).count()

        # 已掌握：ease_factor >= 2.5 且 interval >= 7
        mastered = db.query(Card).filter(
            Card.ease_factor >= 2.5,
            Card.interval >= 7
        ).count()

        # 未学习：review_count == 0
        new_cards = db.query(Card).filter(Card.review_count == 0).count()

        # 学习中：复习过但未掌握
        learning = total_cards - mastered - new_cards

        # 总复习次数
        total_reviews = db.query(func.sum(Card.review_count)).scalar() or 0

        return {
            "total_cards": total_cards,
            "due_cards": due_cards,
            "reviewed_today": reviewed_today,
            "mastered": mastered,
            "learning": learning,
            "new_cards": new_cards,
            "total_reviews": total_reviews,
        }
    finally:
        db.close()
