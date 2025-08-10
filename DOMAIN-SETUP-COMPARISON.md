# Cloudflare Pages 自定义域名设置：转移DNS vs CNAME设置

## 两种方式对比

| 特性 | 转移DNS到Cloudflare | 使用CNAME设置 |
|------|-------------------|---------------|
| 复杂度 | 较高 | 较低 |
| 生效时间 | 24-48小时 | 几分钟到几小时 |
| 所需权限 | 域名完全控制权 | 仅需DNS记录添加权限 |
| Cloudflare功能 | 全部可用 | 部分可用 |
| 管理位置 | 仅Cloudflare | 百度(主DNS) + Cloudflare |
| 适用场景 | 长期使用Cloudflare服务 | 快速设置或临时使用 |

## 方式一：转移DNS到Cloudflare

### 步骤1：在Cloudflare添加域名
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 **Add site** 按钮
3. 输入你的域名 `lightyearai.info` 并点击 **Add site**
4. 选择一个套餐（免费套餐已足够）并点击 **Confirm plan**
5. Cloudflare会扫描你的域名现有DNS记录，点击 **Continue**
6. 记录Cloudflare提供的DNS服务器地址（如 `lisa.ns.cloudflare.com` 和 `mike.ns.cloudflare.com`）

### 步骤2：在百度域名管理平台更改DNS服务器
1. 登录百度域名管理平台
2. 找到 `lightyearai.info` 域名的管理页面
3. 找到DNS服务器设置选项
4. 将DNS服务器更改为Cloudflare提供的两个DNS服务器地址
5. 保存更改

### 步骤3：等待DNS生效
- DNS更改通常需要24-48小时才能全球生效
- 期间可以在Cloudflare控制台查看状态

### 步骤4：在Cloudflare设置自定义域名
1. 等待DNS生效后，回到Cloudflare Pages的 `hydrate-move` 项目
2. 进入 **Custom domains** 选项卡
3. 点击 **Set up a custom domain**
4. 输入 `hydrate-move.lightyearai.info` 并按照提示完成设置

## 方式二：使用CNAME设置（推荐）

### 步骤1：进入Cloudflare Pages自定义域名设置
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 `hydrate-move` 项目
3. 点击 **Custom domains** 选项卡
4. 点击 **Set up a custom domain**
5. 输入 `hydrate-move.lightyearai.info` 并点击 **Continue**

### 步骤2：选择CNAME设置方式
1. 在 **Choose setup method** 中选择 **My DNS provider**
2. 点击 **Begin CNAME setup** 按钮
3. 复制Cloudflare提供的CNAME目标值（类似 `db86eabf.hydrate-move.pages.dev`）

### 步骤3：在百度域名管理平台添加CNAME记录
1. 登录百度域名管理平台
2. 找到 `lightyearai.info` 域名的DNS管理页面
3. 添加一条新的CNAME记录：
   - 主机记录：`hydrate-move`
   - 记录类型：`CNAME`
   - 记录值：粘贴从Cloudflare复制的目标值
   - TTL：选择自动或设置为600秒
4. 保存DNS设置

### 步骤4：验证配置
1. 返回Cloudflare的自定义域名设置页面
2. 点击 **Done** 按钮
3. 等待几分钟，让DNS记录生效
4. 点击 **Check DNS** 按钮验证配置是否成功

## 推荐选择

对于你的情况，我推荐使用 **方式二：CNAME设置**，原因如下：
1. 操作简单，不需要更改域名的DNS服务器
2. 生效时间快，可以尽快使用自定义域名
3. 风险较低，即使设置有误，也不会影响域名的其他服务
4. 适合临时或长期使用Cloudflare Pages服务

如果你计划长期使用Cloudflare的其他服务（如CDN、安全功能等），可以考虑未来转移DNS到Cloudflare。