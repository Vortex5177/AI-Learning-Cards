# AI 学习卡片 开发环境一键启动脚本（PowerShell）
# 用法：在项目根目录执行 .\dev.ps1
# 说明：后端端口 8001（8000 已被 AI Code Reviewer 项目占用），前端 5173

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== 启动后端 (FastAPI, :8001) ===" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; .\.venv\Scripts\uvicorn.exe app.main:app --reload --port 8001"

Write-Host "=== 启动前端 (Vite, :5173) ===" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev"

Write-Host "两个服务窗口已打开，前端访问地址：http://localhost:5173" -ForegroundColor Green
