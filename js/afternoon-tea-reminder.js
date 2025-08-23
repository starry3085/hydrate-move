/**
 * Afternoon Tea Reminder - Easter Egg Feature (Chinese Version Only)
 * 
 * 继承ReminderManager，遵循MVP原则和项目架构标准
 * 使用依赖注入，避免全局变量依赖
 * 复用现有的NotificationService和UI样式
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
        
        // 语言检查 - 仅在中文版启用
        if (!this.config.isChineseVersionOnly()) {
            console.log('🍵 非中文版，下午茶提醒彩蛋未启用');
            this.enabled = false;
            return;
        }
        
        // 功能开关检查
        if (!this.config.ENABLED) {
            console.log('🍵 下午茶提醒功能已禁用');
            this.enabled = false;
            return;
        }
        
        this.enabled = true;
        this.initializeAfternoonTea();
    }
    
    /**
     * 初始化下午茶提醒特定功能
     * @private
     */
    initializeAfternoonTea() {
        // 获取上次触发日期
        this.lastTriggerDate = localStorage.getItem('afternoonTeaLastTrigger');
        
        // 开始特殊时间检查（每分钟检查一次）
        this.startSpecialTimeCheck();
        
        console.log(`🍵 下午茶提醒彩蛋已启用 - 将在 ${this.config.getReminderTimeString()} 触发`);
    }
    
    /**
     * 开始特殊时间检查
     * @private
     */
    startSpecialTimeCheck() {
        // 立即检查一次
        this.checkSpecialTime();
        
        // 每分钟检查一次
        this.specialCheckInterval = setInterval(() => {
            this.checkSpecialTime();
        }, 60000); // 60秒检查一次
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
        
        // 调试信息
        console.log(`🍵 下午茶时间检查: 当前 ${currentHour}:${currentMinute.toString().padStart(2, '0')}, 目标 ${targetHour}:${targetMinute.toString().padStart(2, '0')}, 今日已触发: ${this.lastTriggerDate === today}`);
        
        // 检查是否为目标时间且今日未触发
        if (currentHour === targetHour && 
            currentMinute === targetMinute && 
            this.lastTriggerDate !== today) {
            
            this.triggerAfternoonTea();
        }
    }
    
    /**
     * 触发下午茶提醒
     * @private
     */
    triggerAfternoonTea() {
        console.log('🍵 下午茶提醒触发');
        
        // 记录触发日期，防止重复触发
        const today = new Date().toDateString();
        localStorage.setItem('afternoonTeaLastTrigger', today);
        this.lastTriggerDate = today;
        
        // 获取本地化的通知消息
        const notificationConfig = NOTIFICATION_CONSTANTS.getMessage('AFTERNOON_TEA');
        
        // 使用父类的通知服务显示提醒
        this.notificationService.showNotification(
            'water', // 使用water类型保持视觉一致性
            notificationConfig.TITLE,
            notificationConfig.BODY
        );
        
        console.log('🍵 下午茶提醒已显示');
    }
    
    /**
     * 重写父类的triggerReminder方法，使用下午茶特定的通知消息
     * @override
     */
    triggerReminder() {
        this.triggerAfternoonTea();
    }
    
    /**
     * 手动触发下午茶提醒（用于测试）
     * @public
     */
    manualTrigger() {
        if (!this.enabled) {
            console.warn('🍵 下午茶提醒未启用');
            return;
        }
        
        console.log('🍵 手动触发下午茶提醒');
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
}

// 导出类供其他模块使用
window.AfternoonTeaReminder = AfternoonTeaReminder;