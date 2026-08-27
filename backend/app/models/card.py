from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base
from app.database.config import engine

# 创建 Base 基类，所有 ORM 模型都要继承它
Base = declarative_base()


class Card(Base):
    """
    卡片表模型

    对应数据库中的 cards 表
    每个字段对应表中的一列
    """
    __tablename__ = "cards"

    # 主键：唯一标识每张卡片
    id = Column(Integer, primary_key=True, index=True)

    # 必填字段
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)

    # 可选字段，默认值为空字符串或 medium（难度中等）
    tag = Column(String, default="")
    difficulty = Column(String, default="medium")

    # 创建时间：自动填充当前时间
    created_at = Column(DateTime, server_default=func.now())

    # 间隔重复算法相关字段
    next_review = Column(DateTime, nullable=True)  # 下次复习时间
    interval = Column(Integer, default=0)          # 复习间隔（天数）
    review_count = Column(Integer, default=0)      # 已复习次数
    ease_factor = Column(Float, default=2.5)       # 难度系数（SM-2 算法）


# 创建表（如果表不存在则创建）
Base.metadata.create_all(bind=engine)
