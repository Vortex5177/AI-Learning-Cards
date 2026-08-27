import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# 加载 .env 环境变量（读取 AI_API_KEY）
load_dotenv()

# 创建 DeepSeek 客户端
# DeepSeek 兼容 OpenAI 接口格式，所以用同一个 SDK
client = OpenAI(
    api_key=os.getenv("AI_API_KEY"),       # 从环境变量读取 API Key
    base_url="https://api.deepseek.com",    # DeepSeek API 地址
)

# Prompt 模板：告诉 AI 生成什么格式的内容
SYSTEM_PROMPT = """你是一个专业的学习卡片生成器。

用户输入有两种情况，你需要判断：

1. 宽泛主题（如"HTTP协议"、"Python基础"）：
   → 生成 5-8 张卡片，覆盖核心知识点，难度有梯度

2. 具体问题（如"TCP三次握手是什么"、"React的useState怎么用"）：
   → 只生成 1-2 张卡片，精准回答该问题
   → 不要生成与问题无关的卡片

通用要求：
- 问题要简洁明确，答案要准确完整
- 每张卡片要有合适的标签
- 不要生成重复或高度相似的卡片

返回格式必须是 JSON：
{
  "cards": [
    {
      "question": "问题内容",
      "answer": "答案内容",
      "tag": "标签1,标签2",
      "difficulty": "easy/medium/hard"
    }
  ]
}

只返回 JSON，不要有其他内容。"""


def generate_cards(topic: str) -> list[dict]:
    """
    根据学习主题调用 AI 生成卡片

    参数：
    - topic: 学习主题（如 "HTTP协议"）

    返回：
    - list[dict]: 卡片列表，每张卡片包含 question, answer, tag, difficulty
    """
    response = client.chat.completions.create(
        model="deepseek-chat",       # DeepSeek 模型名称
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},   # 系统提示词
            {"role": "user", "content": f"学习主题：{topic}"},  # 用户输入
        ],
        temperature=0.7,   # 控制随机性，0=确定性，1=创造性
    )

    # 获取 AI 返回的文本内容
    content = response.choices[0].message.content

    # 解析 JSON
    try:
        data = json.loads(content)
        return data.get("cards", [])
    except json.JSONDecodeError:
        # 如果 AI 返回的不是纯 JSON，尝试提取 JSON 部分
        # 有时 AI 会在 JSON 前后加上 ```json ... ```
        start = content.find("{")
        end = content.rfind("}") + 1
        if start != -1 and end > start:
            data = json.loads(content[start:end])
            return data.get("cards", [])
        raise ValueError("AI 返回的内容无法解析为 JSON")
