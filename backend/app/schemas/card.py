from pydantic import BaseModel


class CardCreate(BaseModel):
    """
    创建/更新卡片时的请求体结构

    Pydantic 会自动验证：
    - question 和 answer 必须是字符串，且必填
    - tag 和 difficulty 可以不传，有默认值
    """
    question: str
    answer: str
    tag: str = ""
    difficulty: str = "medium"


class CardResponse(CardCreate):
    """
    返回给前端的卡片结构

    继承 CardCreate → 自动拥有 question, answer, tag, difficulty
    额外加上 id 字段（由后端生成，前端不需要传）
    """
    id: int
