@echo off
echo ========================================
echo Hydrate Move Deploy Script
echo ========================================
echo.

echo [1/1] Deploying to Cloudflare Pages...
echo Deploying static files using Wrangler...
wrangler pages deploy . --project-name=hydrate-move

echo.
echo ========================================
echo Deployment Complete!
echo Cloudflare Pages: https://hydrate-move.pages.dev
echo ========================================
echo.
pause
