# Cloudflare Pages 自定义域名配置指南

## 前提条件
- 域名：lightyear.info（已在百度购买，未备案）
- 目标：配置二级域名 lightyear.info/hydrate-move
- 主域名暂时不使用

## 配置步骤

### 1. 在Cloudflare Pages设置自定义域名

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的Pages项目 "hydrate-move"
3. 点击 "Custom domains" 选项卡
4. 点击 "Set up a custom domain"
5. 输入：`hydrate-move.lightyear.info`（注意：不是路径，而是子域名）

### 2. DNS配置

由于你要使用二级域名（子域名），需要在百度域名管理后台添加DNS记录：

```
类型：CNAME
主机记录：hydrate-move
记录值：hydrate-move.pages.dev
TTL：自动或600秒
```

### 3. 验证配置

配置完成后，访问：https://hydrate-move.lightyear.info

## 重要提醒

### 关于未备案域名
- ✅ Cloudflare Pages支持未备案域名
- ⚠️ 中国境内访问可能不稳定或被阻断
- ⚠️ 建议测试访问速度和可用性

### 关于路径 vs 子域名
- 你提到的"lightyear.info/hydrate-move"是路径形式
- Cloudflare Pages不支持路径形式，需要使用子域名形式："hydrate-move.lightyear.info"
- 这是技术限制，所有静态托管服务都是如此

## 备用方案

如果子域名形式可以接受，按上述步骤操作即可。

如果坚持要用路径形式，需要：
1. 在主域名服务器上配置反向代理
2. 或者使用Cloudflare Workers实现路径转发

## 一键部署命令

```bash
# 部署到Cloudflare Pages
npx wrangler pages deploy . --project-name=hydrate-move
```

## 验证DNS生效

使用命令检查DNS是否生效：
```bash
nslookup hydrate-move.lightyear.info
```