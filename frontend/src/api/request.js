import axios from 'axios'

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8001', // 后端地址（8000 已被 AI Code Reviewer 项目占用）
  timeout: 10000,                 // 超时 10 秒
})

// 导出实例
export default request
