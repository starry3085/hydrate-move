/**
 * Lunch Reminder - Chinese Version Exclusive Easter Egg Feature
 * 午餐提醒 - 中文版专属第二个彩蛋功能
 * 
 * 继承ReminderManager，遵循MVP原则和项目架构标准
 * 使用依赖注入，避免全局变量依赖
 * 复用现有的NotificationService和UI样式
 * 
 * 支持功能:
 * - 中文版专属: 午餐提醒 (12:00) - "开饭啦！事已至此，先吃饭吧"
 * - 10秒显示时长，与下午茶提醒保持一致
 */
class LunchReminder extends ReminderManager {
    /**
     * 创建午餐提醒实例
     * @param {Object} settings - 提醒设置
     * @param {NotificationService} notificationService - 通知服务实例
     */
    constructor(settings, notificationService) {
        // 调用父类构造函数，使用'water'作为类型（复用现有的通知样式和音效）
        super('water', settings, notificationService);
        
        // 初始化午餐提醒特定配置
        this.config = LUNCH_REMINDER_CONSTANTS;
        this.lastTriggerDate = null;
        this.specialCheckInterval = null;
        
        // 检测是否为中文版
        this.isChineseVersion = this.config.isChineseVersionOnly();
        
        // 仅在中文版且功能启用时工作
        this.enabled = this.isChineseVersion && this.config.ENABLED;
        
        if (!this.isChineseVersion) {
            console.log('🍚 非中文版，午餐提醒彩蛋未启用');
            return;
        }
        
        if (!this.config.ENABLED) {
            console.log('🍚 午餐提醒功能已禁用');
            return;
        }
        
        this.initializeLunchReminder();
    }
    
    /**
     * 初始化午餐提醒特定功能
     * @private
     */
    initializeLunchReminder() {
        // 获取上次触发日期
        this.lastTriggerDate = localStorage.getItem('lunchReminderLastTrigger');
        
        // 开始特殊时间检查（每分钟检查一次）
        this.startSpecialTimeCheck();
        
        console.log(`🍚 午餐提醒已启用 - 将在 ${this.config.getReminderTimeString()} 触发`);
    }
    
    /**
     * 开始特殊时间检查
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
        
        console.log('🍚 午餐时间检查定时器已启动');
    }
    
    /**
     * 检查是否到达午餐时间
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
            console.log(`🍚 午餐时间检查: 当前 ${currentHour}:${currentMinute.toString().padStart(2, '0')}, 目标 ${targetHour}:${targetMinute.toString().padStart(2, '0')}`);
        }
        
        // 检查是否为目标时间且今日未触发
        if (isTargetTime && !hasTriggeredToday) {
            console.log('🍚 ✅ 满足触发条件，开始触发午餐提醒');
            this.triggerLunchReminder();
        }
        
        // 检查是否跨日（新的一天开始时显示日志）
        if (currentHour === 0 && currentMinute === 0 && hasTriggeredToday) {
            console.log('🍚 新的一天开始，午餐提醒重置');
        }
    }
    
    /**
     * 触发午餐提醒
     * @private
     */
    triggerLunchReminder() {
        console.log('🍚 午餐提醒触发');
        
        // Track easter egg trigger for analytics
        if (window.app && window.app.analytics) {
            window.app.analytics.trackEasterEggTriggered('lunch_reminder', 'zh-CN');
        }
        
        // 记录触发日期，防止重复触发
        const today = new Date().toDateString();
        localStorage.setItem('lunchReminderLastTrigger', today);
        this.lastTriggerDate = today;
        
        // 调用重写后的triggerReminder方法
        this.triggerReminder();
    }
    
    /**
     * 重写父类的triggerReminder方法，使用午餐提醒的通知消息
     * @override
     */
    triggerReminder() {
        // 午餐提醒不需要检查isActive状态，因为它有自己的启用逻辑
        
        // 获取午餐提醒的本地化通知消息
        const notificationConfig = NOTIFICATION_CONSTANTS.getMessage('LUNCH_REMINDER');
        
        const title = notificationConfig.TITLE;
        const message = notificationConfig.BODY;
        
        // 使用与喝水提醒完全相同的方式显示通知（包括音效）
        this.notificationService.showNotification(
            this.type,  // 使用类型（'water'）保持视觉和音效一致性
            title,
            message,
            'lunch_reminder'  // Source for analytics tracking
        );
        
        console.log(`${this.type} reminder triggered - 午餐提醒已显示`);
    }
    
    /**
     * 手动触发午餐提醒（用于测试）
     * @public
     */
    manualTrigger() {
        if (!this.enabled) {
            console.warn('🍚 午餐提醒未启用');
            return;
        }
        
        console.log('🍚 手动触发午餐提醒');
        this.triggerReminder();
    }
    
    /**
     * 重写父类的start方法 - 午餐提醒不需要常规的计时器启动
     * @override
     */
    start() {
        if (!this.enabled) {
            console.log('🍚 午餐提醒未启用，无法启动');
            return;
        }
        
        // 午餐提醒使用特殊时间检查，而不是常规的倒计时
        console.log('🍚 午餐提醒已运行（基于特殊时间检查）');
    }
    
    /**
     * 重写父类的stop方法
     * @override
     */
    stop() {
        if (this.specialCheckInterval) {
            clearInterval(this.specialCheckInterval);
            this.specialCheckInterval = null;
            console.log('🍚 午餐提醒时间检查已停止');
        }
    }
    
    /**
     * 重写父类的isActive方法
     * @override
     * @returns {boolean} 午餐提醒的活跃状态
     */
    isActive() {
        return this.enabled && this.specialCheckInterval !== null;
    }
    
    /**
     * 获取调试信息（用于测试和调试）
     * @public
     * @returns {Object} 调试信息
     */
    getDebugInfo() {
        return {
            enabled: this.enabled,
            isChineseVersion: this.isChineseVersion,
            reminderTime: this.config.getReminderTimeString(),
            lastTriggerDate: this.lastTriggerDate,
            isActive: this.isActive(),
            config: {
                ENABLED: this.config.ENABLED,
                REMINDER_TIME: this.config.REMINDER_TIME,
                DISPLAY: this.config.DISPLAY
            }
        };
    }
}

// Export for browser use
window.LunchReminder = LunchReminder;