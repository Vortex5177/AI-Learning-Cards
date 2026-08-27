# AI 学习卡片生成器

基于 AI 大模型自动生成学习卡片，结合间隔重复算法（SM-2）智能安排复习计划。

## 功能特性

- **AI 生成卡片**：输入学习主题，AI 自动生成 5-8 张学习卡片
- **智能复习**：基于 SM-2 算法，根据记忆程度自动安排复习时间
- **卡片管理**：支持卡片的增删改查
- **数据统计**：展示学习进度、掌握程度分布

## 技术栈

### 前端
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios

### 后端
- Python 3.11+
- FastAPI
- SQLAlchemy + SQLite
- OpenAI SDK（兼容 DeepSeek API）

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/ai-learning-cards.git
cd ai-learning-cards
```

### 2. 启动后端
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload
```

后端运行在 `http://localhost:8000`

### 3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`

### 4. 配置 AI API
在 `backend/.env` 中填入 API Key：
```
AI_API_KEY=your-api-key-here
```

## 项目结构

```
├── backend/
│   ├── app/
│   │   ├── api/           # 接口定义（路由层）
│   │   ├── database/      # 数据库配置
│   │   ├── models/        # 数据模型（ORM）
│   │   ├── schemas/       # 数据验证（Pydantic）
│   │   ├── services/      # 业务逻辑
│   │   └── main.py        # 应用入口
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/           # HTTP 请求封装
    │   ├── components/    # 通用组件
    │   ├── pages/         # 页面组件
    │   └── App.jsx        # 路由配置
    └── package.json
```

## 核心功能说明

### 间隔重复算法（SM-2）

根据用户评分自动计算下次复习时间：

| 评分 | 效果 |
|------|------|
| 忘记 | 间隔重置为 1 小时，难度系数降低 |
| 困难 | 间隔重置为 1 天，难度系数略降 |
| 一般 | 间隔正常增长（interval × ease_factor） |
| 简单 | 间隔加速增长，难度系数提高 |

### AI 卡片生成

- 支持宽泛主题（如"HTTP协议"）→ 生成 5-8 张卡片
- 支持具体问题（如"TCP三次握手是什么"）→ 生成 1-2 张卡片
- AI 自动判断输入类型，调整生成数量

## API 文档

启动后端后访问 `http://localhost:8000/docs` 查看 Swagger 接口文档。

### 主要接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/cards/` | GET | 获取所有卡片 |
| `/api/cards/` | POST | 创建卡片 |
| `/api/cards/{id}` | PUT | 更新卡片 |
| `/api/cards/{id}` | DELETE | 删除卡片 |
| `/api/cards/{id}/review` | POST | 提交复习评分 |
| `/api/generate/cards` | POST | AI 生成卡片 |
| `/api/generate/save` | POST | 保存生成的卡片 |
| `/api/stats/` | GET | 获取统计数据 |

## 许可证

MIT
