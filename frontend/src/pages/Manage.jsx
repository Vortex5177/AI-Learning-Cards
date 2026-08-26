import { useState } from 'react'
import Button from '../components/Button'

/**
 * Manage - 卡片管理页面
 *
 * 功能：
 * - 查看卡片列表
 * - 手动创建新卡片
 * - 编辑已有卡片
 * - 删除卡片
 *
 * 知识点：
 * - useState 管理列表数据和表单数据
 * - 列表渲染：map() 遍历数组生成组件
 * - 条件渲染：编辑模式 vs 创建模式
 * - 不可变更新：不直接修改 state，而是创建新数组
 *
 * 当前使用模拟数据（mockCards），后续连接后端 API 替换
 */

// 模拟数据（后续由 API 返回）
const initialCards = [
  {
    id: 1,
    question: 'HTTP 属于哪一层协议？',
    answer: '应用层',
    tag: 'HTTP,网络',
    difficulty: 'easy',
  },
  {
    id: 2,
    question: 'TCP 三次握手的目的是什么？',
    answer: '确认双方的发送和接收能力，同步序列号',
    tag: 'TCP,网络',
    difficulty: 'medium',
  },
  {
    id: 3,
    question: 'React 中 useState 的作用是什么？',
    answer: '在函数组件中声明状态变量，状态变化时触发重新渲染',
    tag: 'React,前端',
    difficulty: 'easy',
  },
]

// 空表单模板
const emptyForm = { question: '', answer: '', tag: '', difficulty: 'medium' }

export default function Manage() {
  // cards: 卡片列表
  const [cards, setCards] = useState(initialCards)
  // form: 当前表单数据
  const [form, setForm] = useState(emptyForm)
  // editingId: 正在编辑的卡片 ID，null 表示创建模式
  const [editingId, setEditingId] = useState(null)

  /**
   * 处理表单输入变化
   * e.target.name 自动匹配字段名，实现一个函数处理所有输入框
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /**
   * 提交表单（创建或更新）
   * - editingId 为 null → 创建新卡片
   * - editingId 有值 → 更新已有卡片
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.question || !form.answer) return

    if (editingId) {
      // 更新：遍历列表，找到目标，替换数据
      setCards(cards.map(card =>
        card.id === editingId ? { ...card, ...form } : card
      ))
    } else {
      // 创建：生成新卡片，追加到列表
      const newCard = { ...form, id: Date.now() }
      setCards([...cards, newCard])
    }

    // 重置表单
    setForm(emptyForm)
    setEditingId(null)
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
   * 删除卡片：过滤掉目标 ID
   */
  const handleDelete = (id) => {
    setCards(cards.filter(card => card.id !== id))
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
