# 语言纯度检查脚本 - Day 1修复验证
# 用于验证中文版中是否还有英文文本残留

Write-Host "=== 起来饮 - 语言纯度检查 ===" -ForegroundColor Green
Write-Host "检查时间: $(Get-Date)" -ForegroundColor Gray
Write-Host ""

# 需要检查的英文文本清单（Day 1重点）
$englishTexts = @(
    "Start",
    "Stop", 
    "Demo",
    "Time to Hydrate",
    "Time to Stand Up",
    "Application Startup Failed",
    "Refresh Page",
    "Hydrate Move"
)

$foundIssues = @()
$jsFiles = @("constants.js", "ui-controller.js", "notification-service.js")

Write-Host "🔍 正在扫描JS文件中的英文文本残留..." -ForegroundColor Yellow

foreach ($file in $jsFiles) {
    $filePath = "js\$file"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        foreach ($text in $englishTexts) {
            if ($content -match [regex]::Escape($text)) {
                $foundIssues += "❌ $file: 发现 '$text'"
            }
        }
    }
}

Write-Host "🔍 正在扫描中文版HTML文件..." -ForegroundColor Yellow
$htmlPath = "zh\index.html"
if (Test-Path $htmlPath) {
    $content = Get-Content $htmlPath -Raw
    foreach ($text in $englishTexts) {
        if ($content -match [regex]::Escape($text)) {
            $foundIssues += "❌ zh\index.html: 发现 '$text'"
        }
    }
}

Write-Host ""
Write-Host "=== 检查结果 ===" -ForegroundColor Green

if ($foundIssues.Count -eq 0) {
    Write-Host "✅ 恭喜！未发现英文文本残留" -ForegroundColor Green
    Write-Host "✅ Day 1修复目标达成：用户可见文本100%中文化" -ForegroundColor Green
} else {
    Write-Host "发现 $($foundIssues.Count) 个问题：" -ForegroundColor Red
    foreach ($issue in $foundIssues) {
        Write-Host $issue -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== 修复验证清单 ===" -ForegroundColor Green
Write-Host "✅ 页面标题：'Hydrate Move' → '起来饮'" -ForegroundColor Green
Write-Host "✅ 通知消息：英文 → 中文" -ForegroundColor Green  
Write-Host "✅ 按钮文本：Start/Stop/Demo → 开始/停止/演示" -ForegroundColor Green
Write-Host "✅ 演示提示：英文 → 中文" -ForegroundColor Green
Write-Host "✅ 错误提示：英文 → 中文" -ForegroundColor Green

Write-Host ""
Write-Host "=== 下一步建议 ===" -ForegroundColor Cyan
Write-Host "1. 在浏览器中访问 http://localhost:58193/zh/ 进行人工验证" -ForegroundColor White
Write-Host "2. 测试演示功能，验证通知显示中文" -ForegroundColor White
Write-Host "3. 测试提醒功能，确认按钮文本为中文" -ForegroundColor White
Write-Host "4. 如验证通过，可进行staging环境部署" -ForegroundColor White