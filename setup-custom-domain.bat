@echo off
echo 设置 Cloudflare Pages 自定义域名...
echo.
echo 项目: hydrate-move
echo 目标域名: hydrate-move.lightyearai.info
echo.
echo 步骤说明：
echo 1. 确保你已经在百度域名管理后台添加了DNS记录
echo 2. 记录类型: CNAME
echo 3. 主机记录: hydrate-move
echo 4. 记录值: hydrate-move.pages.dev
echo.
echo 现在开始部署...
echo.

REM 检查wrangler
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo 安装wrangler...
    npm install -g wrangler
)

REM 登录Cloudflare
echo 登录Cloudflare...
npx wrangler login

REM 部署项目
echo 部署项目到Cloudflare Pages...
npx wrangler pages deploy . --project-name=hydrate-move

echo.
echo ✅ 部署完成！
echo.
echo 下一步操作：
echo 1. 访问 https://dash.cloudflare.com
echo 2. 选择 Pages -> hydrate-move
echo 3. 点击 "Custom domains"
echo 4. 添加域名: hydrate-move.lightyear.info
echo.
echo DNS配置：
echo 主机记录: hydrate-move
echo 记录类型: CNAME
echo 记录值: hydrate-move.pages.dev
echo.
pause