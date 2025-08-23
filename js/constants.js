/**
 * Application Constants
 * Centralized configuration values for the Office Wellness Reminder app
 */

/**
 * Reminder Configuration Constants
 */
const REMINDER_CONSTANTS = {
    // Fixed reminder interval in minutes (MVP requirement)
    DEFAULT_INTERVAL_MINUTES: 30,
    
    // Demo mode interval in seconds (for quick demonstration)
    DEMO_INTERVAL_SECONDS: 30,
    
    // Timer update frequency in milliseconds
    UPDATE_INTERVAL_MS: 1000,
    
    // Auto-restart delay after reminder trigger (milliseconds)
    AUTO_RESTART_DELAY_MS: 5000
};

/**
 * UI Configuration Constants
 */
const UI_CONSTANTS = {
    // Mobile breakpoint in pixels
    MOBILE_BREAKPOINT: 768,
    
    // Update loop interval in milliseconds
    UPDATE_LOOP_INTERVAL_MS: 1000
};

/**
 * Storage Configuration Constants
 */
const STORAGE_CONSTANTS = {
    // Storage keys
    SETTINGS_KEY: 'officeWellnessSettings',
    
    // Session storage keys
    FORCE_REFRESH_FLAG: 'forceRefreshFlag'
};

/**
 * Demo Configuration Constants
 */
const DEMO_CONSTANTS = {
    // Demo timing configuration
    WATER_START_DELAY_MS: 0,        // Start water reminder immediately
    STANDUP_START_DELAY_MS: 10000,  // Start standup reminder after 10 seconds
    
    // 双语演示状态消息 - 根据页面语言动态选择
    STATUS_MESSAGES: {
        READY: {
            'zh-CN': '点击演示查看提醒如何工作',
            'en': 'Click Demo to see how reminders work'
        },
        STARTING: {
            'zh-CN': '演示启动中...',
            'en': 'Demo starting...'
        },
        WATER_STARTING: {
            'zh-CN': '正在启动喝水提醒（演示模式 - 30秒间隔）',
            'en': 'Starting water reminder (Demo mode - 30s intervals)'
        },
        STANDUP_STARTING: {
            'zh-CN': '正在启动站立提醒（演示模式 - 30秒间隔）',
            'en': 'Starting standup reminder (Demo mode - 30s intervals)'
        },
        RUNNING: {
            'zh-CN': '演示运行中 - 请注意通知！',
            'en': 'Demo running - watch for notifications!'
        },
        COMPLETED: {
            'zh-CN': '演示完成 - 提醒已重置为正常模式',
            'en': 'Demo complete - reminders reset to normal mode'
        }
    },
    
    // 获取当前语言的状态消息
    getStatusMessage(key) {
        const lang = document.documentElement.lang || 'en';
        return this.STATUS_MESSAGES[key][lang] || this.STATUS_MESSAGES[key]['en'];
    }
};

/**
 * Afternoon Tea Easter Egg Configuration Constants
 * 下午茶彩蛋配置常量 - 现在支持多语言版本
 */
const AFTERNOON_TEA_CONSTANTS = {
    // 功能开关 - 现在支持多语言版本
    ENABLED: true,
    
    // 提醒时间配置 (24小时制)
    REMINDER_TIME: {
        HOUR: 15,     // 小时 (0-23)
        MINUTE: 15    // 分钟 (0-59) - 15:15下午茶时间
    },
    
    // 显示配置
    DISPLAY: {
        DURATION_MS: 10000,  // 显示时长 (毫秒) - 下午茶提醒10秒
        POSITION: 'top-right' // 显示位置
    },
    
    // 新增：多语言支持配置
    MULTI_LANGUAGE_SUPPORT: true,
    
    // 语言检测方法扩展
    isChineseVersionOnly() {
        return document.documentElement.lang === 'zh-CN' && 
               window.location.pathname.includes('/zh/');
    },
    
    isEnglishVersionOnly() {
        return document.documentElement.lang === 'en' || 
               (!this.isChineseVersionOnly());
    },
    
    // 获取格式化的提醒时间字符串
    getReminderTimeString() {
        return `${this.REMINDER_TIME.HOUR.toString().padStart(2, '0')}:${this.REMINDER_TIME.MINUTE.toString().padStart(2, '0')}`;
    }
};

/**
 * Lunch Reminder Configuration Constants
 * 午餐提醒配置常量 - 中文版专属第二个彩蛋
 */
const LUNCH_REMINDER_CONSTANTS = {
    ENABLED: true,  // 配置开关
    REMINDER_TIME: { 
        HOUR: 12, 
        MINUTE: 0 
    },
    DISPLAY: { 
        DURATION_MS: 10000,  // 10秒显示时长，与下午茶提醒一致
        POSITION: 'top-right' 
    },
    
    // 仅中文版启用
    isChineseVersionOnly() {
        return document.documentElement.lang === 'zh-CN' && 
               window.location.pathname.includes('/zh/');
    },
    
    getReminderTimeString() {
        return `${this.REMINDER_TIME.HOUR.toString().padStart(2, '0')}:${this.REMINDER_TIME.MINUTE.toString().padStart(2, '0')}`;
    }
};

/**
 * Notification Configuration Constants
 */
const NOTIFICATION_CONSTANTS = {
    // Notification types
    TYPES: {
        WATER: 'water',
        STANDUP: 'standup',
        AFTERNOON_TEA: 'afternoon_tea'
    },
    
    // 双语通知消息 - 根据页面语言动态选择
    MESSAGES: {
        WATER: {
            'zh-CN': {
                TITLE: '💧 该喝水了！',
                BODY: '长时间工作容易导致脱水，记得要多喝水哦！'
            },
            'en': {
                TITLE: '💧 Time to Hydrate!',
                BODY: 'Working for long periods can lead to dehydration. Remember to drink water!'
            }
        },
        STANDUP: {
            'zh-CN': {
                TITLE: '🧘 该起来活动了！',
                BODY: '久坐对健康有害，起来走走，伸伸腰吧！'
            },
            'en': {
                TITLE: '🧘 Time to Stand Up!',
                BODY: 'Sitting too long is harmful to your health. Get up and stretch!'
            }
        },
        AFTERNOON_TEA: {
            'zh-CN': {
                TITLE: '🍵 下午茶时间到！',
                BODY: '三点几啦！饮茶先啦！'
            },
            'en': {
                TITLE: '☕ Coffee Break',
                BODY: 'Coffee, tea, or meme?'
            }
        },
        
        // 新增午餐提醒消息 - 中文版专属
        LUNCH_REMINDER: {
            'zh-CN': {
                TITLE: '🍚 开饭啦！',
                BODY: '事已至此，先吃饭吧'
            }
        }
    },
    
    // 获取当前语言的通知消息
    getMessage(type) {
        const lang = document.documentElement.lang || 'en';
        return this.MESSAGES[type][lang] || this.MESSAGES[type]['en'];
    }
};

// Export constants for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        REMINDER_CONSTANTS,
        UI_CONSTANTS,
        STORAGE_CONSTANTS,
        DEMO_CONSTANTS,
        NOTIFICATION_CONSTANTS,
        AFTERNOON_TEA_CONSTANTS,
        LUNCH_REMINDER_CONSTANTS
    };
}

// Export for browser use
window.REMINDER_CONSTANTS = REMINDER_CONSTANTS;
window.UI_CONSTANTS = UI_CONSTANTS;
window.STORAGE_CONSTANTS = STORAGE_CONSTANTS;
window.DEMO_CONSTANTS = DEMO_CONSTANTS;
window.NOTIFICATION_CONSTANTS = NOTIFICATION_CONSTANTS;
window.AFTERNOON_TEA_CONSTANTS = AFTERNOON_TEA_CONSTANTS;
window.LUNCH_REMINDER_CONSTANTS = LUNCH_REMINDER_CONSTANTS;