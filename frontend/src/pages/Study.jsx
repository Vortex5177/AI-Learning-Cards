import { useState } from 'react'
import Card from '../components/Card'

/**
 * Study - 学习模式页面
 *
 * 流程：
 * 1. 从待复习卡片中取出当前卡片
 * 2. 用户看问题 → 点击翻转看答案
 * 3. 选择评分（忘记/困难/一般/简单）
 * 4. 进入下一张卡片
 * 5. 全部复习完显示完成页面
 *
 * 知识点：
 * - useState 管理当前卡片索引
 * - 条件渲染：学习中 vs 学习完成
 * - 回调函数：Card 组件通过 onRate 把评分传回来
 *
 * 当前使用模拟数据，后续由 /api/cards/due 接口返回
 */

// 模拟待复习卡片
const initialDueCards = [
  {
    id: 1,
    question: 'HTTP 属于哪一层协议？',
    answer: '应用层',
    tag: 'HTTP',
    difficulty: 'easy',
  },
  {
    id: 2,
    question: 'TCP 三次握手的目的是什么？',
    answer: '确认双方的发送和接收能力，同步序列号',
    tag: 'TCP',
    difficulty: 'medium',
  },
  {
    id: 3,
    question: 'React 中 useEffect 的第二个参数是什么作用？',
    answer: '依赖数组，指定 effect 仅在哪些值变化时重新执行',
    tag: 'React',
    difficulty: 'medium',
  },
]

export default function Study() {
  // currentIndex: 当前正在复习第几张卡片
  const [currentIndex, setCurrentIndex] = useState(0)
  // reviewCount: 已复习数量（统计用）
  const [reviewCount, setReviewCount] = useState(0)

  const totalCards = initialDueCards.length
  const currentCard = initialDueCards[currentIndex]

  /**
   * 处理评分
   * - 目前仅记录次数 + 跳到下一张
   * - 后续接入后端 API：POST /api/cards/{id}/review
   *   后端会根据评分运行 SM-2 算法，更新下次复习时间
   */
  const handleRate = (result) => {
    console.log(`卡片 ${currentCard.id} 评分: ${result}`)
    setReviewCount(reviewCount + 1)
    setCurrentIndex(currentIndex + 1)
  }

  /**
   * 重新开始学习（重置状态）
   */
  const handleRestart = () => {
    setCurrentIndex(0)
    setReviewCount(0)
  }

  // 全部复习完成
  if (currentIndex >= totalCards) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          本轮复习完成！
        </h1>
        <p className="text-gray-600 mb-6">
          你共复习了 {reviewCount} 张卡片
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
        >
          再来一轮
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* 顶部进度信息 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">学习模式</h1>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {totalCards}
        </span>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / totalCards) * 100}%` }}
        />
      </div>

      {/* 卡片展示 */}
      <Card
        question={currentCard.question}
        answer={currentCard.answer}
        tag={currentCard.tag}
        difficulty={currentCard.difficulty}
        onRate={handleRate}
        showActions={true}
      />

      {/* 底部提示 */}
      <p className="text-center text-sm text-gray-400 mt-8">
        点击卡片翻转查看答案，然后选择你的记忆程度
      </p>
    </div>
  )
}
