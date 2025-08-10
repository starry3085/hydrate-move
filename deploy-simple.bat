@echo off
echo 正在部署 hydrate-move 到 Cloudflare Pages...
echo 目标域名: hydrate-move.lightyearai.info
echo.

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Node.js 未安装，请先安装Node.js
    pause
    exit /b 1
)

REM 检查wrangler
where wrangler >nul 2>&1
if %errorlevel% neq 0 (
    echo 安装wrangler...
    npm install -g wrangler
)

REM 部署
echo 正在部署...
npx wrangler pages deploy . --project-name=hydrate-move

if %errorlevel% neq 0 (
    echo.
    echo 部署可能遇到问题，请手动检查
    echo 你可以尝试: npx wrangler login
    pause
    exit /b 1
)

echo.
echo ✅ 部署完成！
echo.
echo 下一步: 配置自定义域名
echo 1. 访问 https://dash.cloudflare.com
echo 2. 选择 Pages -> hydrate-move
echo 3. 点击 'Custom domains'
echo 4. 添加域名: hydrate-move.lightyearai.info
echo.
echo DNS配置：
echo 主机记录: hydrate-move
echo 记录类型: CNAME
echo 记录值: hydrate-move.pages.dev
echo.
pause