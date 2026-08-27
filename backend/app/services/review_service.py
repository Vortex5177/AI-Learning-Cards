from datetime import datetime, timedelta


def calculate_review(card, result: str) -> dict:
    """
    根据评分计算下次复习参数

    参数：
    - card: 当前卡片（有 interval, ease_factor, review_count 属性）
    - result: 用户评分 ("forget" / "hard" / "good" / "easy")

    返回：
    - dict: { interval, ease_factor, next_review, review_count }
    """
    # 获取当前值
    interval = card.interval or 0
    ease_factor = card.ease_factor or 2.5
    review_count = card.review_count or 0

    # 根据评分计算
    if result == "forget":
        # 忘记：重置间隔为约 1 小时
        interval = 0.04
        ease_factor = max(1.3, ease_factor - 0.2)
    elif result == "hard":
        # 困难：重置间隔为 1 天
        interval = 1
        ease_factor = max(1.3, ease_factor - 0.15)
    elif result == "good":
        # 一般：正常增长
        if interval == 0:
            interval = 2
        else:
            interval = int(interval * ease_factor)
    elif result == "easy":
        # 简单：加速增长
        if interval == 0:
            interval = 4
        else:
            interval = int(interval * ease_factor * 1.3)
        ease_factor += 0.1

    # 计算下次复习时间
    next_review = datetime.now() + timedelta(days=interval)

    return {
        "interval": interval,
        "ease_factor": ease_factor,
        "next_review": next_review,
        "review_count": review_count + 1,
    }
