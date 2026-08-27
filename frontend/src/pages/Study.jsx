import { useState, useEffect } from 'react'
import Card from '../components/Card'
import request from '../api/request'

/**
 * Study - 学习模式页面
 *
 * 流程：
 * 1. 页面加载时获取所有卡片，过滤出待复习的
 * 2. 从待复习卡片中取出当前卡片
 * 3. 用户看问题 → 点击翻转看答案
 * 4. 选择评分（忘记/困难/一般/简单）
 * 5. 进入下一张卡片
 * 6. 全部复习完显示完成页面
 *
 * 知识点：
 * - useEffect: 页面加载时获取数据
 * - async/await: 异步等待 API 响应
 * - filter(): 过滤出待复习的卡片
 */

export default function Study() {
  // dueCards: 待复习的卡片列表
  const [dueCards, setDueCards] = useState([])
  // currentIndex: 当前正在复习第几张卡片
  const [currentIndex, setCurrentIndex] = useState(0)
  // reviewCount: 已复习数量（统计用）
  const [reviewCount, setReviewCount] = useState(0)

  /**
   * 页面加载时获取待复习卡片
   * 逻辑：获取所有卡片，过滤出 next_review 为空或早于当前时间的
   */
  useEffect(() => {
    fetchDueCards()
  }, [])

  async function fetchDueCards() {
    try {
      const res = await request.get('/api/cards/')
      const allCards = res.data
      const now = new Date()

      // 过滤待复习卡片：
      // 1. next_review 为空（从未复习过）
      // 2. next_review 早于当前时间（到了复习时间）
      const due = allCards.filter(card =>
        !card.next_review || new Date(card.next_review) < now
      )
      setDueCards(due)
    } catch (error) {
      console.error('获取卡片失败:', error)
    }
  }

  const totalCards = dueCards.length
  const currentCard = dueCards[currentIndex]

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
   * 重新开始学习（重新获取待复习卡片）
   */
  const handleRestart = () => {
    setCurrentIndex(0)
    setReviewCount(0)
    fetchDueCards()
  }

  // 加载中
  if (dueCards.length === 0 && currentIndex === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
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
      {/* key={currentCard.id} 确保切换卡片时重新创建组件，重置翻转状态 */}
      <Card
        key={currentCard.id}
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
