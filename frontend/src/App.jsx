import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Study from './pages/Study'
import Manage from './pages/Manage'
import Dashboard from './pages/Dashboard'

/**
 * App - 根组件
 * 职责：配置路由规则
 *
 * BrowserRouter: 路由容器，使用 HTML5 History API
 * Routes: 路由匹配容器
 * Route: 每条路由定义 URL 路径 → 组件的映射
 *
 * 路由结构：
 * /          → Home（首页）
 * /study     → Study（学习页）
 * /manage    → Manage（管理页）
 * /dashboard → Dashboard（统计页）
 *
 * 所有页面都嵌套在 Layout 内，共享导航栏
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
