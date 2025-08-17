@echo off
echo ========================================
echo Hydrate Move 自动部署脚本
echo ========================================
echo.

echo [1/4] 检查Git状态...
git status

echo.
echo [2/4] 添加所有更改到Git...
git add .

echo.
echo [3/4] 提交更改到本地仓库...
set /p commit_msg="请输入提交信息 (默认: Update): "
if "%commit_msg%"=="" set commit_msg=Update
git commit -m "%commit_msg%"

echo.
echo [4/4] 推送到Gitee main分支...
git push origin main

echo.
echo [5/5] 部署到Cloudflare Pages...
echo 正在使用Wrangler部署静态文件...
wrangler pages deploy . --project-name=hydrate-move --compatibility-date=2024-01-01

echo.
echo ========================================
echo 部署完成！
echo Gitee仓库: 已推送到main分支
echo Cloudflare Pages: https://hydrate-move.pages.dev
echo ========================================
echo.
pause