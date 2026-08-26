import { useState } from 'react'

/**
 * Card - 学习卡片组件（可翻转）
 *
 * 知识点：
 * - useState: 管理"是否翻转"的状态
 * - 条件渲染: 根据 isFlipped 显示正面或背面
 * - CSS transform: 实现翻转动画效果
 *
 * props:
 * - question: 问题文本
 * - answer: 答案文本
 * - tag: 标签（可选）
 * - difficulty: 难度（可选）
 * - onRate: 评分回调（学习模式用）
 * - showActions: 是否显示评分按钮
 */
export default function Card({
  question,
  answer,
  tag,
  difficulty,
  onRate,
  showActions = false,
}) {
  // isFlipped: 控制卡片是否翻转（显示答案）
  const [isFlipped, setIsFlipped] = useState(false)

  // 难度对应的颜色映射
  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* 卡片主体 - 点击翻转 */}
      <div
        className={`relative bg-white rounded-xl shadow-md border border-gray-200
          p-8 min-h-[280px] flex flex-col justify-center cursor-pointer
          transition-all duration-300 hover:shadow-lg
          ${isFlipped ? 'bg-indigo-50 border-indigo-200' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* 标签和难度 */}
        <div className="absolute top-4 left-4 flex gap-2">
          {tag && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
              {tag}
            </span>
          )}
          {difficulty && (
            <span className={`px-2 py-1 text-xs rounded-full ${difficultyColor[difficulty] || 'bg-gray-100 text-gray-600'}`}>
              {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
            </span>
          )}
        </div>

        {/* 翻转提示 */}
        <div className="absolute top-4 right-4 text-xs text-gray-400">
          {isFlipped ? '点击看问题' : '点击看答案'}
        </div>

        {/* 内容区域 */}
        <div className="text-center mt-4">
          {isFlipped ? (
            <div>
              <p className="text-sm text-gray-500 mb-2">答案</p>
              <p className="text-lg text-gray-800">{answer}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-2">问题</p>
              <p className="text-lg text-gray-800">{question}</p>
            </div>
          )}
        </div>
      </div>

      {/* 评分按钮（仅学习模式显示） */}
      {showActions && isFlipped && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={(e) => { e.stopPropagation(); onRate('forget') }}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors"
          >
            忘记
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRate('hard') }}
            className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium transition-colors"
          >
            困难
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRate('good') }}
            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium transition-colors"
          >
            一般
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRate('easy') }}
            className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
          >
            简单
          </button>
        </div>
      )}
    </div>
  )
}
