from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# 创建数据库引擎（连接到 SQLite 文件）
engine = create_engine("sqlite:///./app.db", connect_args={"check_same_thread": False})

# 创建 Session 工厂
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
