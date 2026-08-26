import { Link, Outlet } from 'react-router-dom'

/**
 * Layout - 公共布局组件
 * 包含顶部导航栏 + 内容区域
 * Outlet 是 React Router 的占位符，用于渲染当前路由对应的子页面
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 左侧 Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
            AI 学习卡片
          </Link>

          {/* 右侧导航链接 */}
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              首页
            </Link>
            <Link
              to="/study"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              学习
            </Link>
            <Link
              to="/manage"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              管理
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              统计
            </Link>
          </div>
        </div>
      </nav>

      {/* 内容区域 - Outlet 渲染当前路由匹配的页面组件 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
