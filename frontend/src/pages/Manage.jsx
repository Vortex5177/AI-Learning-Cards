import { useState, useEffect } from 'react'
import Button from '../components/Button'
import request from '../api/request'

/**
 * Manage - 卡片管理页面
 *
 * 功能：
 * - 查看卡片列表（从后端获取）
 * - 手动创建新卡片（POST /api/cards/）
 * - 编辑已有卡片（PUT /api/cards/{id}）
 * - 删除卡片（DELETE /api/cards/{id}）
 *
 * 知识点：
 * - useEffect: 组件挂载时执行 API 请求
 * - async/await: 异步等待后端响应
 * - request.get/post/put/delete: Axios 封装的 HTTP 方法
 */

// 空表单模板
const emptyForm = { question: '', answer: '', tag: '', difficulty: 'medium' }

export default function Manage() {
  // cards: 卡片列表（初始为空，由 API 填充）
  const [cards, setCards] = useState([])
  // form: 当前表单数据
  const [form, setForm] = useState(emptyForm)
  // editingId: 正在编辑的卡片 ID，null 表示创建模式
  const [editingId, setEditingId] = useState(null)

  /**
   * 页面加载时获取所有卡片
   * useEffect 第二个参数 [] 表示只在组件挂载时执行一次
   */
  useEffect(() => {
    fetchCards()
  }, [])

  /**
   * 从后端获取卡片列表
   * GET /api/cards/
   */
  async function fetchCards() {
    try {
      const res = await request.get('/api/cards/')
      setCards(res.data)
    } catch (error) {
      console.error('获取卡片失败:', error)
    }
  }

  /**
   * 处理表单输入变化
   * e.target.name 自动匹配字段名，实现一个函数处理所有输入框
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /**
   * 提交表单（创建或更新）
   * - editingId 为 null → POST 创建新卡片
   * - editingId 有值 → PUT 更新已有卡片
   */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.question || !form.answer) return

    try {
      if (editingId) {
        // 更新：PUT /api/cards/{id}
        await request.put(`/api/cards/${editingId}`, form)
      } else {
        // 创建：POST /api/cards/
        await request.post('/api/cards/', form)
      }

      // 操作成功后，重新获取列表
      await fetchCards()

      // 重置表单
      setForm(emptyForm)
      setEditingId(null)
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  /**
   * 进入编辑模式：把卡片数据填入表单
   */
  const handleEdit = (card) => {
    setForm({
      question: card.question,
      answer: card.answer,
      tag: card.tag,
      difficulty: card.difficulty,
    })
    setEditingId(card.id)
  }

  /**
   * 删除卡片
   * DELETE /api/cards/{id}
   */
  async function handleDelete(id) {
    if (!confirm('确定删除这张卡片吗？')) return

    try {
      await request.delete(`/api/cards/${id}`)
      // 删除成功后，重新获取列表
      await fetchCards()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  /**
   * 取消编辑：重置表单和状态
   */
  const handleCancel = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">卡片管理</h1>

      {/* 表单区域 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? '编辑卡片' : '新建卡片'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 问题 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              问题
            </label>
            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入问题..."
            />
          </div>

          {/* 答案 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              答案
            </label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入答案..."
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签（逗号分隔）
            </label>
            <input
              name="tag"
              value={form.tag}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="如：HTTP,网络"
            />
          </div>

          {/* 难度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              难度
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
        </div>

        {/* 提交 / 取消按钮 */}
        <div className="flex gap-3">
          <Button type="submit" variant="primary">
            {editingId ? '保存修改' : '添加卡片'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              取消
            </Button>
          )}
        </div>
      </form>

      {/* 卡片列表 */}
      <h2 className="text-lg font-semibold mb-4">
        全部卡片（{cards.length} 张）
      </h2>

      {cards.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无卡片，请先创建</p>
      ) : (
        <div className="space-y-3">
          {cards.map(card => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-sm border p-4 flex items-start justify-between"
            >
              {/* 左侧内容 */}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{card.question}</p>
                <p className="text-sm text-gray-500 mt-1">{card.answer}</p>
                <div className="flex gap-2 mt-2">
                  {card.tag && card.tag.split(',').map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {t.trim()}
                    </span>
                  ))}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    card.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {card.difficulty === 'easy' ? '简单' : card.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                </div>
              </div>

              {/* 右侧操作按钮 */}
              <div className="flex gap-2 ml-4">
                <Button variant="secondary" onClick={() => handleEdit(card)}>
                  编辑
                </Button>
                <Button variant="danger" onClick={() => handleDelete(card.id)}>
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
