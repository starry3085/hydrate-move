# Cloudflare Pages 自定义域名设置详细步骤

## 前提条件
- 已成功部署项目到Cloudflare Pages
- 拥有域名 lightyearai.info（已在百度购买）
- 目标子域名：hydrate-move.lightyearai.info

## 步骤1：进入Cloudflare Pages项目管理页面

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 在左侧导航栏中，点击 **Account Home**
3. 在 **Recently modified applications** 下，找到并点击 `hydrate-move` 项目
   - 如果找不到，可以点击 **View all applications** 查看所有项目

## 步骤2：进入自定义域名设置

1. 在项目页面中，点击顶部导航栏中的 **Custom domains** 选项卡
2. 点击 **Set up a custom domain** 按钮

## 步骤3：输入自定义域名

1. 在弹出的窗口中，输入 `hydrate-move.lightyearai.info`
2. 点击 **Continue** 按钮

## 步骤4：设置CNAME记录

1. Cloudflare会显示一个CNAME记录配置指南
2. 复制显示的 **目标值**（通常是类似 `db86eabf.hydrate-move.pages.dev` 的地址）
3. 保持此页面打开，接下来需要在百度域名管理后台设置DNS

## 步骤5：在百度域名管理后台配置DNS

1. 打开百度域名管理平台（登录你购买域名的账号）
2. 找到 `lightyearai.info` 域名的DNS管理
3. 添加一条新的CNAME记录：
   - 主机记录：`hydrate-move`
   - 记录类型：`CNAME`
   - 记录值：粘贴从Cloudflare复制的目标值
   - TTL：选择自动或设置为600秒
4. 保存DNS设置

## 步骤6：验证配置

1. 返回Cloudflare的自定义域名设置页面
2. 点击 **Done** 或 **Activate domain** 按钮
3. 等待几分钟，让DNS记录生效
4. 点击 **Check DNS** 按钮验证配置是否成功

## 步骤7：访问测试

配置完成并生效后，你可以通过以下方式访问：
- 自定义域名：https://hydrate-move.lightyearai.info
- Cloudflare Pages默认域名：https://db86eabf.hydrate-move.pages.dev

## 常见问题解决

1. **DNS验证失败**
   - 确保在百度域名管理后台输入的CNAME记录值与Cloudflare提供的完全一致
   - 等待DNS完全生效（可能需要5-30分钟）
   - 清除本地DNS缓存后再试

2. **访问安全警告**
   - Cloudflare会自动为你的域名配置SSL证书
   - 如果出现安全警告，等待几分钟让证书生效

3. **中国境内访问不稳定**
   - 由于域名未备案，在中国境内访问可能会受到限制
   - 建议测试不同网络环境下的访问效果

现在按照上述步骤操作，你就能成功设置自定义域名了！