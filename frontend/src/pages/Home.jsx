import { useState } from 'react'
import Button from '../components/Button'
import request from '../api/request'

/**
 * Home - 首页
 *
 * 功能：
 * - 用户输入学习主题
 * - 调用 AI 生成学习卡片（POST /api/generate/cards）
 * - 预览生成结果
 * - 保存到数据库（POST /api/generate/save）
 *
 * 知识点：
 * - async/await: 等待 AI 返回（AI 响应较慢，需要 loading 状态）
 * - 错误处理: try/catch 捕获 API 异常
 * - 条件渲染: 根据 loading / error / 结果 状态显示不同内容
 */

export default function Home() {
  // topic: 用户输入的学习主题
  const [topic, setTopic] = useState('')
  // loading: 是否正在生成中
  const [loading, setLoading] = useState(false)
  // generatedCards: AI 生成的卡片结果
  const [generatedCards, setGeneratedCards] = useState([])

  // error: 错误信息
  const [error, setError] = useState('')
  // saving: 是否正在保存
  const [saving, setSaving] = useState(false)

  /**
   * 处理生成按钮点击
   * 调用 POST /api/generate/cards
   */
  const handleGenerate = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setGeneratedCards([])
    setError('')

    try {
      const res = await request.post('/api/generate/cards', {
        topic: topic.trim(),
      })
      setGeneratedCards(res.data.cards)
    } catch (err) {
      setError(err.response?.data?.detail || '生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 保存 AI 生成的卡片到数据库
   * 调用 POST /api/generate/save
   */
  const handleSave = async () => {
    if (generatedCards.length === 0) return

    setSaving(true)
    try {
      await request.post('/api/generate/save', generatedCards)
      alert('保存成功！')
      setGeneratedCards([])
      setTopic('')
    } catch (err) {
      alert('保存失败: ' + (err.response?.data?.detail || '未知错误'))
    } finally {
      setSaving(false)
    }
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

      {/* 错误提示 */}
      {error && (
        <div className="max-w-xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {error}
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-gray-500">AI 正在生成卡片，请稍候...</p>
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

          {/* 保存到卡片库按钮 */}
          <div className="text-center mt-6">
            <Button
              variant="success"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '保存中...' : '保存全部到卡片库'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
