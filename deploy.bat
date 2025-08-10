@echo off
echo Deploying to Cloudflare Pages...
echo Project: hydrate-move
echo Directory: %cd%

echo.
echo Checking wrangler...
npx wrangler --version >nul 2>&1

if %errorlevel% neq 0 (
    echo Installing wrangler...
    npm install -g wrangler
)

echo.
echo Logging into Cloudflare...
npx wrangler login

echo.
echo Starting deployment...
npx wrangler pages deploy . --project-name=hydrate-move --branch=main

echo.
echo Deployment completed!
echo Visit: https://hydrate-move.pages.dev
echo.
pause