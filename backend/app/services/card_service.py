from app.schemas.card import CardCreate, CardResponse

# 模拟数据库：用列表存储卡片
cards_db: list[dict] = []

# 自增 ID 计数器
next_id = 1


def get_all_cards() -> list[CardResponse]:
    """获取所有卡片"""
    return cards_db


def get_card_by_id(card_id: int) -> CardResponse | None:
    """根据 ID 查找单张卡片，找不到返回 None"""
    for card in cards_db:
        if card["id"] == card_id:
            return card
    return None


def create_card(card_data: CardCreate) -> CardResponse:
    """
    创建新卡片

    1. 声明 global next_id，才能修改模块级变量
    2. 用当前 next_id 作为卡片 ID
    3. 把 CardCreate 转成字典，加上 id，存入列表
    4. next_id 自增
    """
    global next_id

    new_card = {
        "id": next_id,
        "question": card_data.question,
        "answer": card_data.answer,
        "tag": card_data.tag,
        "difficulty": card_data.difficulty,
    }
    cards_db.append(new_card)
    next_id += 1

    return new_card


def update_card(card_id: int, card_data: CardCreate) -> CardResponse | None:
    """
    更新卡片

    遍历列表找到目标 ID，更新字段内容
    找不到返回 None
    """
    for card in cards_db:
        if card["id"] == card_id:
            card["question"] = card_data.question
            card["answer"] = card_data.answer
            card["tag"] = card_data.tag
            card["difficulty"] = card_data.difficulty
            return card
    return None


def delete_card(card_id: int) -> bool:
    """
    删除卡片

    遍历列表找到目标 ID，用 remove 移除
    找不到返回 False
    """
    for card in cards_db:
        if card["id"] == card_id:
            cards_db.remove(card)
            return True
    return False
