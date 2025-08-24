# Day 1 Fix Verification Script
Write-Host "=== Day 1 Fix Verification ===" -ForegroundColor Green

# Check if "Hydrate Move" is replaced with Chinese title
$htmlContent = Get-Content "zh\index.html" -Raw -Encoding UTF8
if ($htmlContent -match "起来饮") {
    Write-Host "✅ Page title fixed: Found Chinese title" -ForegroundColor Green
} else {
    Write-Host "❌ Page title issue: Chinese title not found" -ForegroundColor Red
}

# Check if English button texts are replaced
$uiContent = Get-Content "js\ui-controller.js" -Raw
if ($uiContent -match "textContent = '开始'" -and $uiContent -match "textContent = '停止'") {
    Write-Host "✅ Button texts fixed: Found Chinese button labels" -ForegroundColor Green
} else {
    Write-Host "❌ Button text issue: Chinese labels not found" -ForegroundColor Red
}

# Check if notification messages are in Chinese
$constContent = Get-Content "js\constants.js" -Raw -Encoding UTF8
if ($constContent -match "该喝水了" -and $constContent -match "该起来活动了") {
    Write-Host "✅ Notifications fixed: Found Chinese notification messages" -ForegroundColor Green
} else {
    Write-Host "❌ Notification issue: Chinese messages not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Day 1 fixes complete! Visit http://localhost:58193/zh/ to test" -ForegroundColor Cyan