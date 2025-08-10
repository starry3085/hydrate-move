@echo off
echo 环境检查工具
echo ==================
echo.

echo 1. 检查Node.js:
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装或不在PATH中
    echo 请访问 https://nodejs.org 下载安装
) else (
    echo ✅ Node.js 已安装
)

echo.
echo 2. 检查npm:
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm 未安装或不在PATH中
) else (
    echo ✅ npm 已安装
)

echo.
echo 3. 检查项目文件:
if exist "index.html" (
    echo ✅ index.html 存在
) else (
    echo ❌ index.html 不存在
)

if exist "wrangler.toml" (
    echo ✅ wrangler.toml 存在
) else (
    echo ❌ wrangler.toml 不存在
)

echo.
echo 4. 当前目录: %cd%
echo.
echo 请按上述检查结果，按MANUAL-DEPLOY-GUIDE.md中的步骤操作
pause