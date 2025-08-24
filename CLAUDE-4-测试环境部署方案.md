# CLAUDE-4-测试环境部署方案

## 概述
当前生产环境通过 Wrangler CLI 部署到 Cloudflare Pages，域名为 `hydrate-move.lightyearai.info`。本方案提供多种测试环境搭建选项。

## 方案一：Cloudflare Pages 预览部署（推荐）

### 特点
- 最简单，无需额外配置
- 每次推送自动生成预览链接
- 与生产环境完全隔离

### 实施步骤
1. **创建测试分支**
   ```bash
   git checkout -b test
   git push origin test
   ```

2. **配置 Cloudflare Pages 预览**
   - 在 Cloudflare Dashboard 中，Pages 项目会自动为非主分支创建预览部署
   - 预览链接格式：`https://[commit-hash].hydrate-move.pages.dev`

3. **部署命令**
   ```bash
   # 推送到测试分支触发预览部署
   git push origin test
   ```

## 方案二：独立测试项目

### 特点
- 完全独立的测试环境
- 可配置独立域名
- 更好的环境隔离

### 实施步骤
1. **创建新的 Cloudflare Pages 项目**
   - 项目名：`hydrate-move-test`
   - 连接同一个 Git 仓库
   - 设置部署分支为 `test` 或 `staging`

2. **配置自定义域名（可选）**
   - 添加子域名：`test.hydrate-move.lightyearai.info`
   - 或使用默认域名：`hydrate-move-test.pages.dev`

3. **修改 wrangler.toml**
   ```toml
   # 为测试环境创建单独配置
   [env.test]
   name = "hydrate-move-test"
   compatibility_date = "2024-01-01"
   ```

4. **部署命令**
   ```bash
   wrangler pages deploy --env test
   ```

## 方案三：本地开发服务器

### 特点
- 最快的测试反馈
- 无需网络部署
- 适合快速迭代开发

### 实施步骤
1. **安装本地服务器**
   ```bash
   npm install -g live-server
   # 或
   npm install -g http-server
   ```

2. **启动本地服务**
   ```bash
   # 使用 live-server（支持热重载）
   live-server --port=3000
   
   # 或使用 http-server
   http-server -p 3000
   ```

3. **访问地址**
   - `http://localhost:3000`

## 方案四：Wrangler 本地开发

### 特点
- 使用 Cloudflare 官方工具
- 模拟真实 Cloudflare 环境
- 支持 Workers 功能测试

### 实施步骤
1. **启动开发服务器**
   ```bash
   wrangler pages dev
   ```

2. **指定端口**
   ```bash
   wrangler pages dev --port 3000
   ```

## 推荐工作流程

### 开发阶段
1. 使用本地开发服务器进行快速测试
2. 功能完成后推送到 `test` 分支
3. 使用 Cloudflare Pages 预览链接进行集成测试

### 测试阶段
1. 在预览环境进行完整功能测试
2. 确认无问题后合并到 `main` 分支
3. 自动部署到生产环境

### 分支策略
```
main (生产环境) ← merge ← test (测试环境) ← merge ← feature/* (开发分支)
```

## 环境变量管理

### 不同环境配置
```javascript
// js/config.js
const config = {
  production: {
    apiUrl: 'https://api.hydrate-move.lightyearai.info',
    debug: false
  },
  test: {
    apiUrl: 'https://test-api.hydrate-move.lightyearai.info',
    debug: true
  },
  development: {
    apiUrl: 'http://localhost:3001',
    debug: true
  }
};

const currentEnv = window.location.hostname.includes('test') ? 'test' : 
                   window.location.hostname.includes('localhost') ? 'development' : 'production';

export default config[currentEnv];
```

## 部署脚本优化

### 创建部署脚本
```bash
# deploy-test.bat
@echo off
echo 正在部署到测试环境...
git checkout test
git merge main
git push origin test
wrangler pages deploy --env test
echo 测试环境部署完成！
```

## 监控和日志

### 测试环境监控
- 使用 Cloudflare Analytics 分别监控生产和测试环境
- 设置不同的错误报告配置
- 测试环境可启用更详细的日志记录

## 总结

**推荐方案**：方案一（Cloudflare Pages 预览部署）+ 方案三（本地开发）
- 开发时使用本地服务器
- 测试时使用 Cloudflare Pages 预览
- 生产部署保持现有流程

这样既保证了开发效率，又确保了环境的一致性和安全性。