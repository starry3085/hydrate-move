# PowerShell部署脚本 - 避免执行策略问题
Write-Host "🚀 开始部署到Cloudflare Pages..." -ForegroundColor Green
Write-Host "项目: hydrate-move" -ForegroundColor Yellow
Write-Host "目标域名: hydrate-move.lightyearai.info" -ForegroundColor Yellow
Write-Host ""

# 检查Node.js
try {
    $nodeVersion = node --version
    Write-Host "📊 Node.js版本: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Node.js未安装，请先安装Node.js" -ForegroundColor Red
    exit 1
}

# 检查并安装wrangler
Write-Host "📦 检查wrangler..." -ForegroundColor Cyan
try {
    $wranglerVersion = npx wrangler --version
    Write-Host "✅ wrangler已安装: $wranglerVersion" -ForegroundColor Green
} catch {
    Write-Host "安装wrangler..." -ForegroundColor Yellow
    npm install -g wrangler
}

# 部署项目
Write-Host "🚀 开始部署..." -ForegroundColor Green
try {
    npx wrangler pages deploy . --project-name=hydrate-move
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 部署成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "下一步操作：" -ForegroundColor Yellow
        Write-Host "1. 访问 https://dash.cloudflare.com" -ForegroundColor White
        Write-Host "2. 选择 Pages -> hydrate-move" -ForegroundColor White
        Write-Host "3. 点击 'Custom domains'" -ForegroundColor White
        Write-Host "4. 添加域名: hydrate-move.lightyearai.info" -ForegroundColor White
        Write-Host ""
        Write-Host "DNS配置：" -ForegroundColor Yellow
        Write-Host "主机记录: hydrate-move" -ForegroundColor White
        Write-Host "记录类型: CNAME" -ForegroundColor White
        Write-Host "记录值: hydrate-move.pages.dev" -ForegroundColor White
    } else {
        Write-Host "❌ 部署失败，请检查错误信息" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 执行部署时出错: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")