/**
 * Debug Mode Manager
 * URL参数调试模式管理器
 * 
 * 支持的URL参数：
 * ?debug=1 - 启用调试模式
 * ?debug=1&reset=true - 自动重置状态
 * ?debug=1&trigger=break - 强制触发下午茶
 * ?debug=1&trigger=lunch - 强制触发午餐
 * ?debug=1&break_time=16:05 - 设置下午茶时间
 * ?debug=1&lunch_time=12:30 - 设置午餐时间
 */

class DebugModeManager {
    constructor() {
        this.isDebugMode = false;
        this.urlParams = new URLSearchParams(window.location.search);
        this.debugConfig = {
            enabled: false,
            autoReset: false,
            triggerType: null,
            breakTime: null,
            lunchTime: null
        };
        
        // 解析URL参数
        this.parseUrlParameters();
        
        // 如果启用调试模式，初始化调试功能
        if (this.isDebugMode) {
            this.initializeDebugMode();
        }
    }
    
    /**
     * 解析URL参数
     * @private
     */
    parseUrlParameters() {
        // 检查是否启用调试模式
        const debugParam = this.urlParams.get('debug');
        this.isDebugMode = debugParam === '1' || debugParam === 'true';
        
        if (!this.isDebugMode) {
            return;
        }
        
        // 解析调试配置
        this.debugConfig.enabled = true;
        this.debugConfig.autoReset = this.urlParams.get('reset') === 'true';
        this.debugConfig.triggerType = this.urlParams.get('trigger');
        this.debugConfig.breakTime = this.urlParams.get('break_time');
        this.debugConfig.lunchTime = this.urlParams.get('lunch_time');
        
        console.log('🔧 调试模式URL参数解析完成:', this.debugConfig);
    }
    
    /**
     * 初始化调试模式
     * @private
     */
    initializeDebugMode() {
        console.log('🔧 调试模式已启用');
        
        // 不再显示调试模式指示器 - 用户反馈没有实际用途
        // this.showDebugIndicator();
        
        // 增强现有的testEasterEgg对象
        this.enhanceTestEasterEgg();
        
        // 等待应用初始化完成后执行URL参数指令
        // Use multiple strategies to ensure commands execute after app initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    this.executeUrlCommands();
                }, 2000); // Increased delay to ensure app is fully loaded
            });
        } else {
            setTimeout(() => {
                this.executeUrlCommands();
            }, 2000);
        }
        
        // Also try to execute when the app object becomes available
        const checkAppReady = () => {
            if (window.app || window.testEasterEgg) {
                setTimeout(() => {
                    this.executeUrlCommands();
                }, 500);
            } else {
                setTimeout(checkAppReady, 200);
            }
        };
        checkAppReady();
    }
    
    /**
     * 显示调试模式指示器
     * @private
     */
    showDebugIndicator() {
        // 创建调试模式指示器
        const indicator = document.createElement('div');
        indicator.id = 'debug-mode-indicator';
        indicator.innerHTML = '🔧 调试模式';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #f39c12;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        // 添加到页面
        document.body.appendChild(indicator);
        
        // 5秒后自动隐藏
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 5000);
    }
    
    /**
     * 增强testEasterEgg对象
     * @private
     */
    enhanceTestEasterEgg() {
        // 等待testEasterEgg对象创建
        const checkTestEasterEgg = () => {
            if (window.testEasterEgg) {
                this.addDebugMethods();
            } else {
                setTimeout(checkTestEasterEgg, 100);
            }
        };
        checkTestEasterEgg();
    }
    
    /**
     * 为testEasterEgg对象添加调试方法
     * @private
     */
    addDebugMethods() {
        // 保存原有方法
        const originalMethods = { ...window.testEasterEgg };
        
        // 扩展调试方法
        Object.assign(window.testEasterEgg, {
            // 时间设置方法
            setBreakTime: (time) => {
                this.setTriggerTime('break', time);
            },
            
            setLunchTime: (time) => {
                this.setTriggerTime('lunch', time);
            },
            
            // 强制触发方法（使用友好的命名）
            triggerBreak: () => {
                this.forceTrigger('break');
            },
            
            triggerLunch: () => {
                this.forceTrigger('lunch');
            },
            
            // 直接触发彩蛋（绕过时间检查）
            forceEasterEgg: () => {
                console.log('🔧 Forcing easter egg popup display...');
                
                // 优先使用新版POC逻辑
                if (window.testEasterEggPOC && window.testEasterEggPOC.showEasterEgg) {
                    console.log('🔧 Using new POC easter egg logic');
                    window.testEasterEggPOC.showEasterEgg();
                    return;
                }
                
                // 备用 - 绝对有效的弹窗函数（旧版）
                if (typeof createGuaranteedEasterEggModal === 'function') {
                    console.log('🔧 Using guaranteed popup function (old version)');
                    createGuaranteedEasterEggModal();
                    return;
                }
                
                // 备用方案：通过正常流程触发
                if (window.afternoonTeaEasterEgg) {
                    // Reset state to allow showing
                    localStorage.removeItem('afternoonTeaFirstEasterEggShown');
                    
                    // Ensure UI is created
                    if (!window.afternoonTeaEasterEgg.ui) {
                        window.afternoonTeaEasterEgg.createUI();
                    }
                    
                    // Try direct UI trigger
                    if (window.afternoonTeaEasterEgg.ui && window.afternoonTeaEasterEgg.ui.showFirstEasterEgg) {
                        window.afternoonTeaEasterEgg.ui.showFirstEasterEgg();
                        console.log('🔧 ✅ Easter egg popup forced via UI');
                    } else {
                        // Fallback to checkFirstTimeTrigger
                        window.afternoonTeaEasterEgg.checkFirstTimeTrigger();
                        console.log('🔧 ✅ Easter egg forced via checkFirstTimeTrigger');
                    }
                } else {
                    console.warn('🔧 afternoonTeaEasterEgg not available');
                    // 创建简单的紧急弹窗
                    const emergency = document.createElement('div');
                    emergency.innerHTML = '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:30px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:999999;text-align:center;"><h2>🎉 测试弹窗</h2><p>彩蛋功能测试成功！</p><button onclick="this.parentElement.parentElement.remove()">关闭</button></div>';
                    document.body.appendChild(emergency);
                }
            },
            
            // 手动显示第一层彩蛋
            showEasterEgg: () => {
                if (window.afternoonTeaEasterEgg && window.afternoonTeaEasterEgg.manualTriggerFirst) {
                    window.afternoonTeaEasterEgg.manualTriggerFirst();
                    console.log('🔧 Manually triggered first easter egg');
                } else {
                    console.warn('🔧 manualTriggerFirst method not available');
                }
            },
            
            // 测试通知权限
            testNotification: () => {
                if (window.app && window.app.notificationService) {
                    window.app.notificationService.showNotification(
                        'water',
                        '🔧 Debug Test',
                        'This is a debug notification test'
                    );
                    console.log('🔧 Test notification sent');
                } else {
                    console.warn('🔧 Notification service not available');
                }
            },
            
            // 分别重置状态
            resetBreak: () => {
                this.resetSpecificState('break');
            },
            
            resetLunch: () => {
                this.resetSpecificState('lunch');
            },
            
            // 获取调试信息
            getDebugInfo: () => {
                return this.getDebugInfo();
            },
            
            // 显示调试帮助
            help: () => {
                this.showDebugHelp();
            }
        });
        
        console.log('🔧 testEasterEgg对象已增强，新增调试方法:');
        console.log('  - testEasterEgg.setBreakTime("16:05") // 设置下午茶时间');
        console.log('  - testEasterEgg.setLunchTime("12:30") // 设置午餐时间');
        console.log('  - testEasterEgg.triggerBreak() // 强制触发下午茶');
        console.log('  - testEasterEgg.triggerLunch() // 强制触发午餐');
        console.log('  - testEasterEgg.forceEasterEgg() // 直接触发彩蛋（绕过时间检查）');
        console.log('  - testEasterEgg.showEasterEgg() // 手动显示第一层彩蛋');
        console.log('  - testEasterEgg.testNotification() // 测试通知权限');
        console.log('  - testEasterEgg.resetBreak() // 重置下午茶状态');
        console.log('  - testEasterEgg.resetLunch() // 重置午餐状态');
        console.log('  - testEasterEgg.getDebugInfo() // 获取调试信息');
        console.log('  - testEasterEgg.help() // 显示帮助');
    }
    
    /**
     * 设置触发时间
     * @param {string} type - 类型 ('break' | 'lunch')
     * @param {string} time - 时间格式 'HH:MM'
     */
    setTriggerTime(type, time) {
        if (!this.validateTimeFormat(time)) {
            console.error(`🔧 时间格式错误: ${time}，正确格式: HH:MM (如 16:05)`);
            return;
        }
        
        const [hour, minute] = time.split(':').map(num => parseInt(num, 10));
        
        try {
            if (type === 'break') {
                // 临时修改下午茶时间
                if (window.AFTERNOON_TEA_CONSTANTS) {
                    window.AFTERNOON_TEA_CONSTANTS.REMINDER_TIME.HOUR = hour;
                    window.AFTERNOON_TEA_CONSTANTS.REMINDER_TIME.MINUTE = minute;
                    console.log(`🔧 下午茶时间已设置为: ${time}`);
                }
            } else if (type === 'lunch') {
                // 临时修改午餐时间
                if (window.LUNCH_REMINDER_CONSTANTS) {
                    window.LUNCH_REMINDER_CONSTANTS.REMINDER_TIME.HOUR = hour;
                    window.LUNCH_REMINDER_CONSTANTS.REMINDER_TIME.MINUTE = minute;
                    console.log(`🔧 午餐时间已设置为: ${time}`);
                }
            }
        } catch (error) {
            console.error(`🔧 设置${type}时间失败:`, error);
        }
    }
    
    /**
     * 强制触发功能
     * @param {string} type - 类型 ('break' | 'lunch')
     */
    forceTrigger(type) {
        try {
            console.log(`🔧 Force trigger called for type: ${type}`);
            console.log('🔧 Available objects:', {
                testEasterEgg: !!window.testEasterEgg,
                afternoonTeaEasterEgg: !!window.afternoonTeaEasterEgg,
                lunchReminder: !!window.lunchReminder,
                afternoonTeaReminder: !!window.afternoonTeaReminder
            });
            
            if (type === 'break') {
                // For afternoon tea, we want to trigger both the notification AND the easter egg
                console.log('🔧 Triggering afternoon tea easter egg...');
                
                // ✨ Method 1: 优先使用新版POC逻辑（最高优先级）
                if (window.testEasterEggPOC && window.testEasterEggPOC.showEasterEgg) {
                    console.log('🔧 ✅ Using new POC easter egg logic - This WILL show the updated version!');
                    window.testEasterEggPOC.showEasterEgg();
                    return; // 成功，直接返回
                }
                
                // Method 1.5: 备用 - 绝对有效的弹窗函数（旧版）
                if (typeof createGuaranteedEasterEggModal === 'function') {
                    console.log('🔧 ⚠️ Using guaranteed popup function (old version) - fallback');
                    createGuaranteedEasterEggModal();
                    return; // 成功，直接返回
                }
                
                // Method 2: Direct easter egg popup trigger (PRIORITY - this is what user wants to see)
                if (window.afternoonTeaEasterEgg) {
                    try {
                        // Reset states to ensure popup shows
                        console.log('🔧 Resetting easter egg states for testing...');
                        localStorage.removeItem('afternoonTeaFirstEasterEggShown');
                        localStorage.removeItem('afternoonTeaLastTrigger');
                        
                        // Force create UI if not exists
                        if (!window.afternoonTeaEasterEgg.ui) {
                            window.afternoonTeaEasterEgg.createUI();
                            console.log('🔧 UI controller created');
                        }
                        
                        // Method A: Direct UI trigger (shows the actual popup)
                        if (window.afternoonTeaEasterEgg.ui && window.afternoonTeaEasterEgg.ui.showFirstEasterEgg) {
                            window.afternoonTeaEasterEgg.ui.showFirstEasterEgg();
                            console.log('🔧 ✅ Easter egg popup triggered via UI controller');
                            return;
                        }
                        
                        // Method B: Manual trigger method
                        if (window.afternoonTeaEasterEgg.manualTriggerFirst) {
                            window.afternoonTeaEasterEgg.manualTriggerFirst();
                            console.log('🔧 ✅ Easter egg popup triggered via manualTriggerFirst');
                            return;
                        }
                        
                        // Method C: Check first time trigger
                        window.afternoonTeaEasterEgg.checkFirstTimeTrigger();
                        console.log('🔧 ✅ Easter egg triggered via checkFirstTimeTrigger');
                        
                    } catch (error) {
                        console.warn('🔧 Direct easter egg trigger failed:', error);
                    }
                }
                
                // Method 3: Fallback to testEasterEgg approach
                if (window.testEasterEgg && window.testEasterEgg.triggerAfternoonTea) {
                    window.testEasterEgg.triggerAfternoonTea();
                    console.log('🔧 Triggered via testEasterEgg.triggerAfternoonTea');
                }
                
                // Method 4: Also trigger the notification for completeness
                if (window.afternoonTeaReminder) {
                    window.afternoonTeaReminder.triggerReminder();
                    console.log('🔧 Also triggered notification via afternoonTeaReminder');
                }
                
                console.warn('🔧 If popup didn\'t show, try: testEasterEgg.forceEasterEgg() in console');
                
            } else if (type === 'lunch') {
                console.log('🔧 Triggering lunch reminder...');
                
                // For lunch, try multiple approaches
                if (window.testEasterEgg && window.testEasterEgg.triggerLunch) {
                    window.testEasterEgg.triggerLunch();
                    console.log('🔧 Triggered lunch via testEasterEgg.triggerLunch');
                } else if (window.lunchReminder && window.lunchReminder.triggerReminder) {
                    // Reset state first
                    localStorage.removeItem('lunchReminderLastTrigger');
                    window.lunchReminder.triggerReminder();
                    console.log('🔧 Triggered lunch via lunchReminder.triggerReminder');
                } else if (window.afternoonTeaEasterEgg && window.afternoonTeaEasterEgg.forceLunchReminderTrigger) {
                    window.afternoonTeaEasterEgg.forceLunchReminderTrigger();
                    console.log('🔧 Triggered lunch via afternoonTeaEasterEgg.forceLunchReminderTrigger');
                } else {
                    console.warn('🔧 No lunch trigger method available');
                    console.log('🔧 Available lunchReminder methods:', window.lunchReminder ? Object.keys(window.lunchReminder) : 'lunchReminder not found');
                }
            }
        } catch (error) {
            console.error(`🔧 Force trigger ${type} failed:`, error);
        }
    }
    
    /**
     * 重置特定状态
     * @param {string} type - 类型 ('break' | 'lunch')
     */
    resetSpecificState(type) {
        try {
            if (type === 'break') {
                localStorage.removeItem('afternoonTeaLastTrigger');
                localStorage.removeItem('afternoonTeaFirstEasterEggShown');
                console.log('🔧 下午茶状态已重置');
            } else if (type === 'lunch') {
                localStorage.removeItem('lunchReminderLastTrigger');
                localStorage.removeItem('lunchReminderUnlocked');
                console.log('🔧 午餐状态已重置');
            }
        } catch (error) {
            console.error(`🔧 重置${type}状态失败:`, error);
        }
    }
    
    /**
     * 获取调试信息
     * @returns {Object}
     */
    getDebugInfo() {
        const info = {
            debugMode: this.isDebugMode,
            urlConfig: this.debugConfig,
            currentTime: new Date().toLocaleTimeString(),
            instances: {
                afternoonTeaEasterEgg: !!window.afternoonTeaEasterEgg,
                lunchReminder: !!window.lunchReminder,
                afternoonTeaReminder: !!window.afternoonTeaReminder
            },
            storage: {
                afternoonTeaLastTrigger: localStorage.getItem('afternoonTeaLastTrigger'),
                lunchReminderLastTrigger: localStorage.getItem('lunchReminderLastTrigger'),
                firstEasterEggShown: localStorage.getItem('afternoonTeaFirstEasterEggShown'),
                lunchReminderUnlocked: localStorage.getItem('lunchReminderUnlocked')
            },
            constants: {
                afternoonTeaTime: window.AFTERNOON_TEA_CONSTANTS ? 
                    `${window.AFTERNOON_TEA_CONSTANTS.REMINDER_TIME.HOUR}:${String(window.AFTERNOON_TEA_CONSTANTS.REMINDER_TIME.MINUTE).padStart(2, '0')}` : '未知',
                lunchTime: window.LUNCH_REMINDER_CONSTANTS ? 
                    `${window.LUNCH_REMINDER_CONSTANTS.REMINDER_TIME.HOUR}:${String(window.LUNCH_REMINDER_CONSTANTS.REMINDER_TIME.MINUTE).padStart(2, '0')}` : '未知'
            }
        };
        
        console.log('🔧 调试信息:', info);
        return info;
    }
    
    /**
     * 显示调试帮助
     */
    showDebugHelp() {
        console.log('🔧 调试模式帮助文档');
        console.log('');
        console.log('📖 URL参数使用方法:');
        console.log('  https://hydrate-move.lightyearai.info/zh?debug=1');
        console.log('  https://hydrate-move.lightyearai.info/zh?debug=1&reset=true');
        console.log('  https://hydrate-move.lightyearai.info/zh?debug=1&trigger=break');
        console.log('  https://hydrate-move.lightyearai.info/zh?debug=1&trigger=lunch');
        console.log('  https://hydrate-move.lightyearai.info/zh?debug=1&break_time=16:05');
        console.log('  https://hydrate-move.lightyearai.info/zh?debug=1&lunch_time=12:30');
        console.log('');
        console.log('🛠️ 控制台命令:');
        console.log('  testEasterEgg.setBreakTime("16:05") // 设置下午茶时间');
        console.log('  testEasterEgg.setLunchTime("12:30") // 设置午餐时间');
        console.log('  testEasterEgg.triggerBreak() // 强制触发下午茶');
        console.log('  testEasterEgg.triggerLunch() // 强制触发午餐');
        console.log('  testEasterEgg.forceEasterEgg() // 直接触发彩蛋（绕过时间检查）');
        console.log('  testEasterEgg.showEasterEgg() // 手动显示第一层彩蛋');
        console.log('  testEasterEgg.testNotification() // 测试通知权限');
        console.log('  testEasterEgg.resetBreak() // 重置下午茶状态');
        console.log('  testEasterEgg.resetLunch() // 重置午餐状态');
        console.log('  testEasterEgg.getDebugInfo() // 获取调试信息');
        console.log('  testEasterEgg.reset() // 重置所有状态');
        console.log('  testEasterEgg.showStatus() // 显示状态');
    }
    
    /**
     * Execute URL commands
     * @private
     */
    executeUrlCommands() {
        if (!this.isDebugMode) {
            return;
        }
        
        console.log('🔧 Executing URL debug commands...');
        
        // Wait for testEasterEgg to be available before executing commands
        const executeWithRetry = (attempt = 1, maxAttempts = 30) => {
            console.log(`🔧 Execute attempt ${attempt}/${maxAttempts}`);
            
            // Check if essential objects are available
            const essentialObjectsReady = window.testEasterEgg && 
                                        (window.afternoonTeaEasterEgg || window.afternoonTeaReminder);
            
            if (!essentialObjectsReady) {
                if (attempt <= maxAttempts) {
                    console.log(`🔧 Waiting for essential objects... attempt ${attempt}`);
                    console.log('🔧 Object status:', {
                        testEasterEgg: !!window.testEasterEgg,
                        afternoonTeaEasterEgg: !!window.afternoonTeaEasterEgg,
                        afternoonTeaReminder: !!window.afternoonTeaReminder,
                        lunchReminder: !!window.lunchReminder
                    });
                    setTimeout(() => executeWithRetry(attempt + 1, maxAttempts), 500);
                    return;
                } else {
                    console.error('🔧 Essential objects not available after 15 seconds');
                    console.error('🔧 Final object status:', {
                        testEasterEgg: !!window.testEasterEgg,
                        afternoonTeaEasterEgg: !!window.afternoonTeaEasterEgg,
                        afternoonTeaReminder: !!window.afternoonTeaReminder,
                        lunchReminder: !!window.lunchReminder
                    });
                    return;
                }
            }
            
            console.log('🔧 testEasterEgg found, executing URL commands...');
            
            // Auto-reset state
            if (this.debugConfig.autoReset) {
                if (window.testEasterEgg.reset) {
                    window.testEasterEgg.reset();
                    console.log('🔧 Auto-reset all states completed');
                } else {
                    console.warn('🔧 testEasterEgg.reset method not found');
                }
            }
            
            // Set times
            if (this.debugConfig.breakTime) {
                this.setTriggerTime('break', this.debugConfig.breakTime);
            }
            
            if (this.debugConfig.lunchTime) {
                this.setTriggerTime('lunch', this.debugConfig.lunchTime);
            }
            
            // Force trigger
            if (this.debugConfig.triggerType) {
                setTimeout(() => {
                    console.log(`🔧 Attempting to force trigger: ${this.debugConfig.triggerType}`);
                    this.forceTrigger(this.debugConfig.triggerType);
                }, 500);
            }
            
            // Show debug info
            setTimeout(() => {
                this.getDebugInfo();
            }, 1000);
        };
        
        executeWithRetry();
    }
    
    /**
     * Validate time format
     * @param {string} time 
     * @returns {boolean}
     */
    validateTimeFormat(time) {
        if (typeof time !== 'string') return false;
        
        const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;
        return timeRegex.test(time);
    }
}

// Auto-initialize debug mode manager
if (typeof window !== 'undefined') {
    // Ensure DOM is ready before initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.debugModeManager = new DebugModeManager();
        });
    } else {
        window.debugModeManager = new DebugModeManager();
    }
}

// Export for other modules
window.DebugModeManager = DebugModeManager;