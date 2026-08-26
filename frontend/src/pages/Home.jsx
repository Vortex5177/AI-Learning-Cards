import { useState } from 'react'
import Button from '../components/Button'

/**
 * Home - 首页
 *
 * 功能：
 * - 用户输入学习主题
 * - 点击按钮，调用 AI 生成学习卡片
 * - 显示生成结果（卡片预览）
 *
 * 知识点：
 * - 受控组件：input 的值由 state 控制
 * - loading 状态：请求中禁用按钮，防止重复提交
 * - 条件渲染：根据 loading / 结果 状态显示不同内容
 *
 * 当前模拟 AI 返回数据，阶段 8 接入真实 AI API
 */

// 模拟 AI 返回的卡片数据
const mockAICards = [
  {
    question: 'HTTP 的全称是什么？',
    answer: 'HyperText Transfer Protocol（超文本传输协议）',
    tag: 'HTTP',
    difficulty: 'easy',
  },
  {
    question: 'HTTP 默认使用哪个端口？',
    answer: '80 端口（HTTPS 使用 443 端口）',
    tag: 'HTTP',
    difficulty: 'easy',
  },
  {
    question: 'HTTP 和 HTTPS 的主要区别是什么？',
    answer: 'HTTPS 在 HTTP 基础上增加了 SSL/TLS 加密，数据传输更安全',
    tag: 'HTTP,安全',
    difficulty: 'medium',
  },
]

export default function Home() {
  // topic: 用户输入的学习主题
  const [topic, setTopic] = useState('')
  // loading: 是否正在生成中
  const [loading, setLoading] = useState(false)
  // generatedCards: AI 生成的卡片结果
  const [generatedCards, setGeneratedCards] = useState([])

  /**
   * 处理生成按钮点击
   * 后续替换为：调用 POST /api/ai/generate
   */
  const handleGenerate = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setGeneratedCards([])

    // 模拟 API 请求延迟（1.5秒）
    // 后续替换为真实 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    setGeneratedCards(mockAICards)
    setLoading(false)
  }

  return (
    <div>
      {/* 标题区域 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          AI 学习卡片生成器
        </h1>
        <p className="text-gray-600">
          输入学习主题，AI 将自动生成学习卡片
        </p>
      </div>

      {/* 输入区域 */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="输入学习主题，如：HTTP协议基础"
            disabled={loading}
          />
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="px-6 py-3 text-lg"
          >
            {loading ? '生成中...' : '生成卡片'}
          </Button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          按 Enter 或点击按钮，AI 将为你生成相关学习卡片
        </p>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-gray-500">AI 正在生成卡片...</p>
        </div>
      )}

      {/* 生成结果 */}
      {generatedCards.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            已生成 {generatedCards.length} 张卡片
          </h2>
          <div className="space-y-3">
            {generatedCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-4"
              >
                <p className="font-medium text-gray-800">{card.question}</p>
                <p className="text-sm text-gray-500 mt-1">{card.answer}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                    {card.tag}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    card.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {card.difficulty === 'easy' ? '简单' : card.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 保存到卡片库按钮（后续实现） */}
          <div className="text-center mt-6">
            <Button variant="success">
              保存全部到卡片库
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
