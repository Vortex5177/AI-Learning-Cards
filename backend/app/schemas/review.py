from pydantic import BaseModel


class ReviewRequest(BaseModel):
    result: str  # "forget" / "hard" / "good" / "easy"