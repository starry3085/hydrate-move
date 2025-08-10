# 手动部署指南 - lightyearai.info 域名配置

## 域名已修正
✅ 已从 `lightyear.info` 更正为 `lightyearai.info`

## 当前状态
- 项目: hydrate-move
- 目标域名: `hydrate-move.lightyearai.info`
- 由于系统执行策略限制，需要手动执行部署

## 步骤1: 安装必要工具

### 安装Wrangler CLI
打开 **命令提示符 (CMD)** 或 **PowerShell (管理员权限)**，执行：

```bash
npm install -g wrangler
```

如果提示权限问题，使用：
```bash
npm install -g wrangler --force
```

### 验证安装
```bash
wrangler --version
```

## 步骤2: 登录Cloudflare

```bash
wrangler login
```

这会打开浏览器让你登录Cloudflare账号。

## 步骤3: 部署项目

在项目目录下执行：

```bash
wrangler pages deploy . --project-name=hydrate-move
```

## 步骤4: 配置自定义域名

### 在Cloudflare Dashboard配置
1. 访问 https://dash.cloudflare.com
2. 选择你的账号
3. 点击左侧菜单 **Pages**
4. 选择 **hydrate-move** 项目
5. 点击 **Custom domains** 选项卡
6. 点击 **Set up a custom domain**
7. 输入: `hydrate-move.lightyearai.info`
8. 点击 **Continue**

### DNS配置（在百度域名管理后台）

登录你的百度域名管理后台，为 `lightyearai.info` 添加DNS记录：

```
记录类型: CNAME
主机记录: hydrate-move
记录值: hydrate-move.pages.dev
TTL: 自动 或 600
```

## 步骤5: 验证配置

### 检查DNS生效
等待5-10分钟后，执行：
```bash
nslookup hydrate-move.lightyearai.info
```

### 访问测试
浏览器访问：https://hydrate-move.lightyearai.info

## 备用方案（如果自动部署失败）

### 方案A: 使用Cloudflare Web界面
1. 访问 https://dash.cloudflare.com
2. 上传项目文件手动部署

### 方案B: 使用GitHub Actions
项目已包含 `.github/workflows/deploy.yml`，可以配置GitHub自动部署。

## 常见问题解决

### 权限问题
如果遇到执行策略错误：
```bash
# 以管理员身份运行PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node.js问题
确保Node.js版本 >= 16.0.0：
```bash
node --version
```

### Wrangler配置问题
```bash
wrangler whoami
wrangler config
```

## 完成确认

部署成功后，你将拥有：
- 主域名: https://hydrate-move.pages.dev
- 自定义域名: https://hydrate-move.lightyearai.info

## 下一步操作

1. ✅ 执行上述手动部署步骤
2. ✅ 在百度域名管理后台配置DNS
3. ✅ 在Cloudflare配置自定义域名
4. ✅ 等待DNS生效（5-30分钟）

如需帮助，请随时询问！