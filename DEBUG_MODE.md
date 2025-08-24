# 调试模式使用文档

## 📖 概述

URL参数调试模式是为了方便测试下午茶和午餐彩蛋功能而设计的开发工具。通过URL参数可以快速重置状态、设置触发时间、强制触发事件，大大提高测试效率。

## 🚀 快速开始

### 基础启用
```
https://hydrate-move.lightyearai.info/zh?debug=1
```

访问上述URL即可启用调试模式，页面右上角会显示"🔧 调试模式"指示器。

## 📋 URL参数说明

### 基础参数

| 参数 | 值 | 说明 |
|-----|-----|-----|
| `debug` | `1` | 启用调试模式（必需） |

### 功能参数

| 参数 | 值 | 说明 | 示例 |
|-----|-----|-----|-----|
| `reset` | `true` | 自动重置所有彩蛋状态 | `?debug=1&reset=true` |
| `trigger` | `break` | 强制触发下午茶彩蛋 | `?debug=1&trigger=break` |
| `trigger` | `lunch` | 强制触发午餐彩蛋 | `?debug=1&trigger=lunch` |
| `break_time` | `HH:MM` | 设置下午茶触发时间 | `?debug=1&break_time=16:05` |
| `lunch_time` | `HH:MM` | 设置午餐触发时间 | `?debug=1&lunch_time=12:30` |

### 组合使用示例

```bash
# 完整测试流程：重置状态 + 设置时间 + 强制触发
https://hydrate-move.lightyearai.info/zh?debug=1&reset=true&break_time=16:05&trigger=break

# 快速午餐测试
https://hydrate-move.lightyearai.info/zh?debug=1&lunch_time=12:30&trigger=lunch

# 时间测试：设置两个彩蛋的触发时间
https://hydrate-move.lightyearai.info/zh?debug=1&break_time=15:30&lunch_time=12:00
```

## 🛠️ 控制台命令

调试模式启用后，`testEasterEgg` 对象会被增强，新增以下调试方法：

### 时间设置
```javascript
// 设置下午茶时间
testEasterEgg.setBreakTime("16:05");

// 设置午餐时间
testEasterEgg.setLunchTime("12:30");
```

### 强制触发
```javascript
// 强制触发下午茶（使用友好命名）
testEasterEgg.triggerBreak();

// 强制触发午餐
testEasterEgg.triggerLunch();
```

### 状态管理
```javascript
// 重置下午茶状态
testEasterEgg.resetBreak();

// 重置午餐状态
testEasterEgg.resetLunch();

// 重置所有状态
testEasterEgg.reset();
```

### 调试信息
```javascript
// 获取详细调试信息
testEasterEgg.getDebugInfo();

// 显示帮助信息
testEasterEgg.help();

// 显示状态信息
testEasterEgg.showStatus();
```

### 原有方法（保持兼容）
```javascript
// 触发下午茶提醒
testEasterEgg.triggerAfternoonTea();

// 显示第一层彩蛋
testEasterEgg.showFirstEgg();

// 模拟分享操作
testEasterEgg.simulateShare("wechat");

// 运行完整测试
testEasterEgg.runFullTest();
```

## 🔍 调试信息详解

`getDebugInfo()` 方法返回的信息包含：

```javascript
{
  debugMode: true,                    // 调试模式状态
  urlConfig: {                        // URL参数配置
    enabled: true,
    autoReset: false,
    triggerType: "break",
    breakTime: "16:05",
    lunchTime: "12:30"
  },
  currentTime: "16:05:23",           // 当前时间
  instances: {                        // 实例状态
    afternoonTeaEasterEgg: true,
    lunchReminder: true,
    afternoonTeaReminder: true
  },
  storage: {                          // 本地存储状态
    afternoonTeaLastTrigger: "2024-08-24",
    lunchReminderLastTrigger: null,
    firstEasterEggShown: "true",
    lunchReminderUnlocked: "false"
  },
  constants: {                        // 当前时间配置
    afternoonTeaTime: "15:15",
    lunchTime: "12:00"
  }
}
```

## 📝 测试流程建议

### 下午茶彩蛋测试
```javascript
// 1. 重置状态
testEasterEgg.reset();

// 2. 设置测试时间（当前时间+1分钟）
testEasterEgg.setBreakTime("16:05");

// 3. 等待自动触发或强制触发
testEasterEgg.triggerBreak();

// 4. 测试分享功能
testEasterEgg.simulateShare("wechat");

// 5. 检查状态
testEasterEgg.getDebugInfo();
```

### 午餐彩蛋测试
```javascript
// 1. 确保下午茶彩蛋已解锁午餐功能
testEasterEgg.simulateShare("wechat");

// 2. 设置午餐时间
testEasterEgg.setLunchTime("12:30");

// 3. 强制触发午餐提醒
testEasterEgg.triggerLunch();

// 4. 检查状态
testEasterEgg.getDebugInfo();
```

### URL参数自动化测试
```bash
# 自动重置并触发下午茶
https://hydrate-move.lightyearai.info/zh?debug=1&reset=true&trigger=break

# 设置时间并等待自动触发
https://hydrate-move.lightyearai.info/zh?debug=1&break_time=16:06

# 完整流程测试
https://hydrate-move.lightyearai.info/zh?debug=1&reset=true&break_time=16:05&lunch_time=12:30
```

## ⚠️ 注意事项

### 环境隔离
- 调试模式只在URL包含 `debug=1` 参数时启用
- 生产环境用户不会意外触发调试功能
- 调试状态不会持久化，刷新页面后需重新设置

### 时间格式
- 时间格式必须为 `HH:MM`（如 16:05, 09:30）
- 24小时制
- 分钟必须为两位数

### 存储状态
- 调试模式修改的是临时配置，不影响原始常量
- localStorage的状态修改是持久的，需要手动重置
- 建议测试完成后使用 `reset()` 清理状态

### 多标签页
- 调试模式在每个标签页独立工作
- localStorage状态在所有标签页间共享
- 建议在单个标签页中进行测试

## 🧪 测试页面

项目根目录提供了专用的测试页面：
```
http://localhost:58193/debug-test.html
```

该页面包含：
- 所有URL参数的示例链接
- 手动测试按钮
- 实时控制台输出
- 测试结果显示

## 🚨 故障排除

### 调试模式未启用
1. 检查URL是否包含 `debug=1` 参数
2. 确认页面右上角是否显示调试指示器
3. 查看控制台是否有初始化错误

### testEasterEgg对象方法缺失
1. 确认页面已完全加载
2. 检查 debug-mode.js 是否成功加载
3. 验证 afternoon-tea-easter-egg.js 是否正常加载

### 时间设置无效
1. 检查时间格式是否正确（HH:MM）
2. 验证常量对象是否存在（AFTERNOON_TEA_CONSTANTS）
3. 查看控制台错误信息

### 强制触发无响应
1. 确认相关实例已正确初始化
2. 检查浏览器通知权限
3. 验证彩蛋功能是否在当前环境下启用

## 📞 技术支持

如遇到调试模式相关问题，请：
1. 查看浏览器控制台错误信息
2. 使用 `testEasterEgg.getDebugInfo()` 获取详细状态
3. 确认当前环境是否为中文版页面（彩蛋功能限制）

---

*文档版本：v1.0 | 最后更新：2024-08-24*