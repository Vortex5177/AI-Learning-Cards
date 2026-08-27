import { useState, useEffect } from 'react'
import request from '../api/request'

/**
 * Dashboard - 数据统计页面
 *
 * 功能：
 * - 展示学习统计数据
 * - 总卡片数、待复习数、今日复习数
 * - 掌握程度分布（已掌握、学习中、未学习）
 * - 总复习次数
 *
 * 知识点：
 * - useEffect: 页面加载时获取统计数据
 * - 数据可视化：用 Tailwind CSS 做简单的进度条
 */
export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await request.get('/api/stats/')
      setStats(res.data)
    } catch (err) {
      console.error('获取统计数据失败:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">获取数据失败</p>
      </div>
    )
  }

  // 计算掌握程度百分比
  const masteredPercent = stats.total_cards > 0
    ? Math.round((stats.mastered / stats.total_cards) * 100)
    : 0
  const learningPercent = stats.total_cards > 0
    ? Math.round((stats.learning / stats.total_cards) * 100)
    : 0
  const newPercent = stats.total_cards > 0
    ? Math.round((stats.new_cards / stats.total_cards) * 100)
    : 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">学习统计</h1>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="总卡片数"
          value={stats.total_cards}
          color="bg-blue-500"
        />
        <StatCard
          label="待复习"
          value={stats.due_cards}
          color="bg-orange-500"
        />
        <StatCard
          label="今日已复习"
          value={stats.reviewed_today}
          color="bg-green-500"
        />
        <StatCard
          label="总复习次数"
          value={stats.total_reviews}
          color="bg-purple-500"
        />
      </div>

      {/* 掌握程度分布 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          掌握程度分布
        </h2>

        {/* 进度条 */}
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex mb-4">
          {stats.mastered > 0 && (
            <div
              className="bg-green-500 h-full transition-all duration-500"
              style={{ width: `${masteredPercent}%` }}
              title={`已掌握: ${stats.mastered}`}
            />
          )}
          {stats.learning > 0 && (
            <div
              className="bg-yellow-500 h-full transition-all duration-500"
              style={{ width: `${learningPercent}%` }}
              title={`学习中: ${stats.learning}`}
            />
          )}
          {stats.new_cards > 0 && (
            <div
              className="bg-gray-400 h-full transition-all duration-500"
              style={{ width: `${newPercent}%` }}
              title={`未学习: ${stats.new_cards}`}
            />
          )}
        </div>

        {/* 图例 */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">
              已掌握 {stats.mastered} ({masteredPercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-600">
              学习中 {stats.learning} ({learningPercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-gray-600">
              未学习 {stats.new_cards} ({newPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* 详细说明 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          统计说明
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <strong>已掌握</strong>：难度系数 ≥ 2.5 且复习间隔 ≥ 7 天
          </li>
          <li>
            <strong>学习中</strong>：已复习但尚未达到掌握标准
          </li>
          <li>
            <strong>未学习</strong>：从未复习过的卡片
          </li>
          <li>
            <strong>待复习</strong>：复习时间已到或从未复习的卡片
          </li>
        </ul>
      </div>
    </div>
  )
}

/**
 * StatCard - 统计数据卡片组件
 */
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className={`w-10 h-10 rounded-lg ${color} mb-3 flex items-center justify-center`}>
        <span className="text-white text-lg font-bold">{value}</span>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
