#!/bin/bash

echo "🚀 部署到Cloudflare Pages..."
echo "项目: hydrate-move"
echo "目录: $(pwd)"

# 检查wrangler
if ! command -v wrangler &> /dev/null; then
    echo "安装wrangler..."
    npm install -g wrangler
fi

# 登录（首次需要）
echo "登录Cloudflare..."
wrangler login

# 部署
echo "开始部署..."
wrangler pages deploy . --project-name=hydrate-move

echo "✅ 部署完成！"
echo "访问: https://hydrate-move.pages.dev"