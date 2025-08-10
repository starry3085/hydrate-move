#!/usr/bin/env node

/**
 * 无GitHub自动化部署脚本
 * 使用Wrangler CLI直接部署到Cloudflare Pages
 * 支持：本地一键部署 + 定时自动部署
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Cloudflare Pages 无GitHub自动部署...');

// 检查Node.js版本
const nodeVersion = process.version;
console.log(`📊 Node.js版本: ${nodeVersion}`);

// 检查wrangler是否已安装
function checkWrangler() {
  try {
    execSync('npx wrangler --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// 创建部署配置
function createDeployConfig() {
  const config = {
    name: 'hydrate-move',
    account_id: '58213c02ef32bb1dba9214ebea647bec',
    compatibility_date: '2024-01-01',
    pages_build_output_dir: '.'
  };

  const configContent = `name = "hydrate-move"
account_id = "58213c02ef32bb1dba9214ebea647bec"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."

[env.production]
name = "hydrate-move"
`;

  fs.writeFileSync('wrangler.toml', configContent);
  console.log('✅ wrangler.toml 配置文件已创建');
}

// 创建一键部署脚本
function createDeployScript() {
  const deployScript = `@echo off
echo 正在部署到Cloudflare Pages...
echo 项目: hydrate-move
echo 目录: %cd%

echo.
echo 1. 检查wrangler...
npx wrangler --version

if %errorlevel% neq 0 (
    echo 正在安装wrangler...
    npm install -g wrangler
)

echo.
echo 2. 登录Cloudflare...
npx wrangler login

echo.
echo 3. 开始部署...
npx wrangler pages deploy . --project-name=hydrate-move

echo.
echo 部署完成！
echo 访问: https://hydrate-move.pages.dev
pause`;

  fs.writeFileSync('deploy.bat', deployScript);
  console.log('✅ deploy.bat 一键部署脚本已创建');
}

// 创建定时部署脚本（Windows任务计划程序）
function createScheduledScript() {
  const scheduledScript = `@echo off
echo [%date% %time%] 开始自动部署...

REM 切换到项目目录
cd /d "%~dp0"

REM 执行部署
npx wrangler pages deploy . --project-name=hydrate-move --branch=main

REM 记录日志
echo [%date% %time%] 部署完成 >> deploy.log

REM 可选：发送通知（需要额外配置）
echo 部署完成！`;

  fs.writeFileSync('auto-deploy.bat', scheduledScript);
  console.log('✅ auto-deploy.bat 定时部署脚本已创建');
}

// 创建Linux/Mac部署脚本
function createUnixScript() {
  const unixScript = `#!/bin/bash

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
echo "访问: https://hydrate-move.pages.dev"`;

  fs.writeFileSync('deploy.sh', unixScript);
  fs.chmodSync('deploy.sh', '755');
  console.log('✅ deploy.sh Unix部署脚本已创建');
}

// 创建定时任务配置
function createTaskScheduler() {
  const taskConfig = `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Date>2024-01-01T00:00:00</Date>
    <Author>hydrate-move</Author>
    <Description>自动部署到Cloudflare Pages</Description>
  </RegistrationInfo>
  <Triggers>
    <TimeTrigger>
      <Repetition>
        <Interval>PT1H</Interval>
      </Repetition>
      <StartBoundary>2024-01-01T00:00:00</StartBoundary>
      <Enabled>true</Enabled>
    </TimeTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <LogonType>InteractiveToken</LogonType>
      <UserId></UserId>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>false</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>true</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT30M</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>cmd.exe</Command>
      <Arguments>/c "${__dirname}\auto-deploy.bat"</Arguments>
    </Exec>
  </Actions>
</Task>`;

  fs.writeFileSync('auto-deploy.xml', taskConfig);
  console.log('✅ auto-deploy.xml 定时任务配置已创建');
}

// 主执行流程
function main() {
  console.log('📁 当前目录:', process.cwd());
  
  createDeployConfig();
  createDeployScript();
  createScheduledScript();
  createUnixScript();
  createTaskScheduler();

  console.log('\n🎯 部署方案已准备就绪！');
  console.log('\n📋 使用方式：');
  console.log('1. 一键部署：运行 deploy.bat');
  console.log('2. 定时部署：设置 auto-deploy.bat 为定时任务');
  console.log('3. Unix系统：运行 ./deploy.sh');
  console.log('4. 手动命令：npx wrangler pages deploy . --project-name=hydrate-move');

  console.log('\n🔗 访问地址：https://hydrate-move.pages.dev');
}

// 执行主流程
main();