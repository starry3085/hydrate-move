/**
 * Afternoon Tea Reminder - Easter Egg Feature (Now Supports Multi-Language)
 * 下午茶提醒 - 彩蛋功能（现在支持多语言版本）
 * 
 * 继承ReminderManager，遵循MVP原则和项目架构标准
 * 使用依赖注入，避免全局变量依赖
 * 复用现有的NotificationService和UI样式
 * 
 * 支持功能:
 * - 中文版: 下午茶提醒 (15:15)
 * - 英文版: Coffee Break (15:15)
 */
class AfternoonTeaReminder extends ReminderManager {
    /**
     * 创建下午茶提醒实例
     * @param {Object} settings - 提醒设置
     * @param {NotificationService} notificationService - 通知服务实例
     */
    constructor(settings, notificationService) {
        // 调用父类构造函数，使用'water'作为类型（复用现有的通知样式）
        super('water', settings, notificationService);
        
        // 初始化下午茶特定配置
        this.config = AFTERNOON_TEA_CONSTANTS;
        this.lastTriggerDate = null;
        this.specialCheckInterval = null;
        
        // 检测当前语言环境
        this.isChineseVersion = this.config.isChineseVersionOnly();
        this.isEnglishVersion = this.config.isEnglishVersionOnly();
        
        // 根据语言版本和多语言支持配置决定是否启用
        if (this.config.MULTI_LANGUAGE_SUPPORT) {
            // 多语言支持模式：中文版或英文版都可启用
            this.enabled = (this.isChineseVersion || this.isEnglishVersion) && this.config.ENABLED;
            
            if (this.enabled) {
                const versionType = this.isChineseVersion ? '中文版（下午茶）' : '英文版（Coffee Break）';
                console.log(`🍵 多语言下午茶提醒已启用 - ${versionType}`);
            } else {
                console.log('🍵 多语言下午茶提醒未启用（功能关闭）');
                return;
            }
        } else {
            // 传统模式：仅中文版启用
            this.enabled = this.isChineseVersion && this.config.ENABLED;
            
            if (!this.isChineseVersion) {
                console.log('🍵 非中文版，下午茶提醒彩蛋未启用');
                return;
            }
            
            if (!this.config.ENABLED) {
                console.log('🍵 下午茶提醒功能已禁用');
                return;
            }
        }
        
        this.initializeAfternoonTea();
    }
    
    /**
     * 初始化下午茶提醒特定功能（现在支持多语言）
     * @private
     */
    initializeAfternoonTea() {
        // 获取上次触发日期（根据语言版本使用不同的存储键）
        const storageKey = this.isChineseVersion ? 'afternoonTeaLastTrigger' : 'coffeeBreakLastTrigger';
        this.lastTriggerDate = localStorage.getItem(storageKey);
        this.storageKey = storageKey; // 保存存储键以便后续使用
        
        // 开始特殊时间检查（每分钟检查一次）
        this.startSpecialTimeCheck();
        
        const featureType = this.isChineseVersion ? '下午茶提醒' : 'Coffee Break';
        console.log(`🍵 ${featureType}已启用 - 将在 ${this.config.getReminderTimeString()} 触发`);
    }
    
    /**
     * 开始特殊时间检查（支持多语言版本）
     * @private
     */
    startSpecialTimeCheck() {
        // 清理现有的定时器，防止重复
        if (this.specialCheckInterval) {
            clearInterval(this.specialCheckInterval);
            this.specialCheckInterval = null;
        }
        
        // 立即检查一次
        this.checkSpecialTime();
        
        // 每分钟检查一次
        this.specialCheckInterval = setInterval(() => {
            this.checkSpecialTime();
        }, 60000); // 60秒检查一次
        
        const featureType = this.isChineseVersion ? '下午茶' : 'Coffee Break';
        console.log(`🍵 ${featureType}时间检查定时器已启动`);
    }
    
    /**
     * 检查是否到达下午茶时间
     * @private
     */
    checkSpecialTime() {
        if (!this.enabled) return;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const today = now.toDateString();
        
        const targetHour = this.config.REMINDER_TIME.HOUR;
        const targetMinute = this.config.REMINDER_TIME.MINUTE;
        
        const isTargetTime = (currentHour === targetHour && currentMinute === targetMinute);
        const hasTriggeredToday = (this.lastTriggerDate === today);
        
        // 日志显示逻辑：只在未触发当天或新的一天显示日志
        const shouldShowLog = !hasTriggeredToday;
        
        if (shouldShowLog && isTargetTime) {
            console.log(`🍵 下午茶时间检查: 当前 ${currentHour}:${currentMinute.toString().padStart(2, '0')}, 目标 ${targetHour}:${targetMinute.toString().padStart(2, '0')}`);
        }
        
        // 检查是否为目标时间且今日未触发
        if (isTargetTime && !hasTriggeredToday) {
            console.log('🍵 ✅ 满足触发条件，开始触发下午茶提醒');
            this.triggerAfternoonTea();
        }
        
        // 检查是否跨日（新的一天开始时显示日志）
        if (currentHour === 0 && currentMinute === 0 && hasTriggeredToday) {
            console.log('🍵 新的一天开始，下午茶提醒重置');
        }
    }
    
    /**
     * 触发下午茶/咖啡休息提醒（多语言支持）
     * @private
     */
    triggerAfternoonTea() {
        const featureType = this.isChineseVersion ? '下午茶提醒' : 'Coffee Break';
        console.log(`🍵 ${featureType}触发`);
        
        // Track easter egg trigger for analytics
        const language = this.isChineseVersion ? 'zh-CN' : 'en';
        if (window.app && window.app.analytics) {
            window.app.analytics.trackEasterEggTriggered('afternoon_tea', language);
        }
        
        // 记录触发日期，防止重复触发（使用对应语言的存储键）
        const today = new Date().toDateString();
        localStorage.setItem(this.storageKey, today);
        this.lastTriggerDate = today;
        
        // 调用重写后的triggerReminder方法
        this.triggerReminder();
    }
    
    /**
     * 重写父类的triggerReminder方法，使用多语言的通知消息
     * @override
     */
    triggerReminder() {
        // 下午茶/咖啡休息提醒不需要检查isActive状态，因为它有自己的启用逻辑
        
        // 获取对应语言版本的本地化通知消息
        const notificationConfig = NOTIFICATION_CONSTANTS.getMessage('AFTERNOON_TEA');
        
        const title = notificationConfig.TITLE;
        const message = notificationConfig.BODY;
        
        // 使用与喝水提醒完全相同的方式显示通知（包括音效）
        this.notificationService.showNotification(
            this.type,  // 使用类型（'water'）保持视觉和音效一致性
            title,
            message,
            'afternoon_tea'  // Source for analytics tracking
        );
        
        const featureType = this.isChineseVersion ? '下午茶提醒' : 'Coffee Break';
        console.log(`${this.type} reminder triggered - ${featureType}已显示`);
    }
    
    /**
     * 手动触发下午茶/咖啡休息提醒（用于测试）
     * @public
     */
    manualTrigger() {
        if (!this.enabled) {
            console.warn('🍵 下午茶/咖啡休息提醒未启用');
            return;
        }
        
        const featureType = this.isChineseVersion ? '下午茶提醒' : 'Coffee Break';
        console.log(`🍵 手动触发${featureType}`);
        this.triggerReminder();
    }
    
    /**
     * 重写父类的start方法 - 下午茶提醒不需要常规的计时器启动
     * @override
     */
    start() {
        if (!this.enabled) {
            console.warn('🍵 下午茶提醒未启用，无法启动');
            return false;
        }
        
        console.log('🍵 下午茶提醒已在后台运行，等待特定时间触发');
        return true;
    }
    
    /**
     * 重写父类的stop方法
     * @override
     */
    stop() {
        if (this.specialCheckInterval) {
            clearInterval(this.specialCheckInterval);
            this.specialCheckInterval = null;
        }
        
        console.log('🍵 下午茶提醒已停止');
        return true;
    }
    
    /**
     * 销毁下午茶提醒实例
     * @override
     */
    destroy() {
        this.stop();
        
        // 调用父类的destroy方法
        if (super.destroy) {
            super.destroy();
        }
        
        console.log('🍵 下午茶提醒已销毁');
    }
    
    /**
     * 获取配置信息（用于调试）
     * @public
     */
    getConfig() {
        return {
            enabled: this.enabled,
            reminderTime: this.config.getReminderTimeString(),
            displayDuration: this.config.DISPLAY.DURATION_MS,
            lastTriggerDate: this.lastTriggerDate,
            isChineseVersion: this.config.isChineseVersionOnly()
        };
    }
    
    /**
     * 调试方法 - 检查localStorage中的触发记录
     * @public
     */
    debugTriggerRecord() {
        const storedDate = localStorage.getItem('afternoonTeaLastTrigger');
        const today = new Date().toDateString();
        
        console.log('🔍 下午茶提醒调试信息:');
        console.log(`   localStorage中的记录: ${storedDate}`);
        console.log(`   当前实例记录: ${this.lastTriggerDate}`);
        console.log(`   今日日期: ${today}`);
        console.log(`   是否匹配: ${storedDate === today}`);
        
        return {
            storedDate,
            instanceDate: this.lastTriggerDate,
            today,
            isMatched: storedDate === today
        };
    }
    
    /**
     * 清理触发记录（用于测试）
     * @public
     */
    clearTriggerRecord() {
        localStorage.removeItem('afternoonTeaLastTrigger');
        this.lastTriggerDate = null;
        console.log('🧹 下午茶提醒触发记录已清理');
    }
}

// 导出类供其他模块使用
window.AfternoonTeaReminder = AfternoonTeaReminder;

// 添加全局辅助函数供调试使用
window.clearAfternoonTeaTrigger = function() {
    localStorage.removeItem('afternoonTeaLastTrigger');
    if (window.afternoonTeaReminder) {
        window.afternoonTeaReminder.lastTriggerDate = null;
    }
    console.log('🧹 下午茶提醒触发记录已清理，可以重新测试');
};

