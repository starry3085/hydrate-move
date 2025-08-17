@echo off
echo ========================================
echo Hydrate Move Auto Deploy Script
echo ========================================
echo.

echo [1/4] Checking Git status...
git status

echo.
echo [2/4] Adding all changes to Git...
git add .

echo.
echo [3/4] Committing changes to local repository...
set /p commit_msg="Enter commit message (default: Update): "
if "%commit_msg%"=="" set commit_msg=Update
git commit -m "%commit_msg%"

echo.
echo [4/4] Pushing to Gitee main branch...
git push origin main

echo.
echo [5/5] Deploying to Cloudflare Pages...
echo Deploying static files using Wrangler...
wrangler pages deploy . --project-name=hydrate-move

echo.
echo ========================================
echo Deployment Complete!
echo Gitee Repository: Pushed to main branch
echo Cloudflare Pages: https://hydrate-move.pages.dev
echo ========================================
echo.
pause
