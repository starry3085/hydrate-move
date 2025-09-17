/**
 * Afternoon Tea Easter Egg - Main Controller
 * 下午茶提醒彩蛋功能主控制器
 * 
 * 基于QODER优化版设计，严守MVP原则
 * - 双层彩蛋体验：首次触发解锁 + 分享解锁第二层
 * - 不使用Canvas，确保兼容性和性能
 * - 不影响原有下午茶提醒功能
 * - 午餐提醒在解锁前暂不启用
 */
class AfternoonTeaEasterEgg extends EventTarget {
    /**
     * 创建下午茶彩蛋管理器实例
     * @param {StorageManager} storageManager - 存储管理器
     * @param {Object} analytics - 分析工具（可选）
     */
    constructor(storageManager, analytics = null) {
        super();
        
        this.storageManager = storageManager;
        this.analytics = analytics;
        
        // 配置常量
        this.config = AFTERNOON_TEA_EASTER_EGG_CONSTANTS;
        
        // UI控制器将在后续阶段创建
        this.ui = null;
        
        // 状态管理
        this.isFirstTimeShown = false;
        this.isSecondEasterEggUnlocked = false;
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化彩蛋管理器
     * @private
     */
    init() {
        // 检查语言环境，仅中文版启用
        if (!this.isChineseVersion()) {
            console.log('🎉 下午茶彩蛋：非中文版，功能未启用');
            return;
        }
        
        // 检查配置是否启用
        if (!this.config.ENABLED) {
            console.log('🎉 下午茶彩蛋：功能已禁用');
            return;
        }
        
        // 加载存储状态
        this.loadStorageState();
        
        // 检查是否需要恢复午餐提醒状态
        this.checkAndRestoreLunchReminderState();
        
        console.log('🎉 下午茶彩蛋管理器已初始化');
    }
    
    /**
     * 检查并恢复午餐提醒状态
     * @private
     */
    checkAndRestoreLunchReminderState() {
        // 如果第二层彩蛋已解锁，确保午餐提醒启用
        if (this.isSecondEasterEggUnlocked) {
            console.log('🍲 检测到第二层彩蛋已解锁，恢复午餐提醒状态');
            
            // 延迟执行，确保其他组件已初始化
            setTimeout(() => {
                this.enableLunchReminder();
            }, 1000);
        } else {
            console.log('🍲 第二层彩蛋未解锁，午餐提醒保持禁用状态');
        }
    }
    
    /**
     * 检查是否为中文版
     * @returns {boolean}
     * @private
     */
    isChineseVersion() {
        return document.documentElement.lang === 'zh-CN' && 
               window.location.pathname.includes('/zh/');
    }
    
    /**
     * 加载存储状态
     * @private
     */
    loadStorageState() {
        try {
            const firstEasterEggShown = localStorage.getItem(this.config.STORAGE_KEYS.FIRST_EASTER_EGG_SHOWN);
            this.isFirstTimeShown = firstEasterEggShown === 'true';
            
            const secondEasterEggUnlocked = localStorage.getItem(this.config.STORAGE_KEYS.LUNCH_REMINDER_UNLOCKED);
            this.isSecondEasterEggUnlocked = secondEasterEggUnlocked === 'true';
            
            console.log(`🎉 彩蛋状态加载 - 首次显示:${this.isFirstTimeShown}, 第二层解锁:${this.isSecondEasterEggUnlocked}`);
        } catch (error) {
            console.warn('🎉 彩蛋状态加载失败:', error);
            this.isFirstTimeShown = false;
            this.isSecondEasterEggUnlocked = false;
        }
    }
    
    /**
     * 检查是否为首次触发下午茶提醒
     * 这个方法会被下午茶提醒调用
     * @public
     */
    checkFirstTimeTrigger() {
        // 如果不是中文版或功能未启用，直接返回
        if (!this.isChineseVersion() || !this.config.ENABLED) {
            return;
        }
        
        // 检查是否为调试模式
        const isDebugMode = window.location.search.includes('debug=true') || 
                           window.location.search.includes('easter_egg=true');
        
        // 如果已经显示过第一次彩蛋，且不是调试模式，不再显示
        if (this.isFirstTimeShown && !isDebugMode) {
            console.log('🎉 下午茶彩蛋：已显示过，跳过');
            return;
        }
        
        if (isDebugMode) {
            console.log('🔧 调试模式：强制显示彩蛋');
        }
        
        console.log('🎉 检测到首次触发下午茶提醒，准备显示彩蛋');
        this.showFirstEasterEgg();
    }
    
    /**
     * 显示第一层彩蛋
     * @private
     */
    showFirstEasterEgg() {
        try {
            // 分析埋点
            if (this.analytics) {
                this.analytics.trackEasterEggTriggered('first_afternoon_tea_egg', 'zh-CN');
            }
            
            // 记录已显示状态
            this.markFirstEasterEggAsShown();
            
            // 创建并显示UI（后续阶段实现）
            this.createUI();
            this.ui.showFirstEasterEgg();
            
            console.log('🎉 第一层下午茶彩蛋已显示');
            
            // 触发事件
            this.dispatchEvent(new CustomEvent('firstEasterEggShown'));
            
        } catch (error) {
            console.error('🎉 显示第一层彩蛋时出错:', error);
        }
    }
    
    /**
     * 处理分享按钮点击
     * @param {string} shareType - 分享类型 ('wechat' | 'xiaohongshu')
     * @public
     */
    handleShareClick(shareType) {
        try {
            console.log(`🎉 用户点击分享按钮: ${shareType}`);
            
            // 分析埋点
            if (this.analytics) {
                this.analytics.trackEasterEggAction('share_clicked', {
                    shareType: shareType,
                    language: 'zh-CN'
                });
            }
            
            // 解锁第二层彩蛋（分享操作由UI层处理）
            if (!this.isSecondEasterEggUnlocked) {
                this.unlockSecondEasterEgg();
            }
            
        } catch (error) {
            console.error('🎉 处理分享点击时出错:', error);
        }
    }
    
    /**
     * 生成分享内容（无Canvas版本）
     * @param {string} shareType - 分享类型
     * @private
     */
    generateShareContent(shareType) {
        console.log(`🎉 生成${shareType}分享内容`);
        
        // 获取分享模板
        const shareTemplate = this.config.SHARE_TEMPLATES[shareType];
        if (!shareTemplate) {
            console.warn(`🎉 未找到${shareType}的分享模板`);
            return;
        }
        
        // 生成完整的分享文案
        const shareText = this.buildShareText(shareTemplate, shareType);
        const shareUrl = this.generateShareUrl(shareType);
        
        // 尝试使用Web Share API
        if (navigator.share && this.supportsWebShare()) {
            this.webShareContent(shareTemplate, shareText, shareUrl);
        } else {
            this.fallbackShare(shareText, shareUrl);
        }
    }
    
    /**
     * 生成分享链接
     * @param {string} shareType - 分享类型
     * @returns {string} 带跟踪参数的链接
     * @private
     */
    generateShareUrl(shareType) {
        if (this.config.SHARE_LINKS && this.config.SHARE_LINKS.generateTrackingUrl) {
            return this.config.SHARE_LINKS.generateTrackingUrl(shareType);
        }
        
        // 备用方案
        return window.location.origin + '/zh/';
    }
    
    /**
     * 构建分享文案
     * @param {Object} template - 分享模板
     * @param {string} shareType - 分享类型
     * @returns {string} 完整的分享文案
     * @private
     */
    buildShareText(template, shareType) {
        const currentTime = new Date().toLocaleString('zh-CN', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let shareText = template.TEXT;
        
        // 根据平台优化文案
        if (shareType === 'xiaohongshu') {
            // 小红书样式：添加时间和更多表情
            shareText = `🍵 ${currentTime} 的小惊喜\n\n${shareText}\n\n🔗 下面链接可以直接体验：`;
        } else if (shareType === 'wechat') {
            // 微信样式：简洁明了
            shareText = `${shareText}\n\n🔗 点击链接立即体验：`;
        }
        
        return shareText;
    }
    
    /**
     * 检查是否支持Web Share API
     * @returns {boolean}
     * @private
     */
    supportsWebShare() {
        return 'share' in navigator && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * 使用Web Share API分享
     * @param {Object} template - 分享模板
     * @param {string} text - 分享文本
     * @param {string} url - 分享链接
     * @private
     */
    webShareContent(template, text, url) {
        navigator.share({
            title: template.TITLE,
            text: text,
            url: url
        })
        .then(() => {
            this.showShareSuccess('分享成功！');
            console.log('🎉 Web Share API分享成功');
        })
        .catch(err => {
            if (err.name !== 'AbortError') {
                console.log('🎉 Web Share API失败，使用备用方案:', err);
                this.fallbackShare(text, url);
            }
        });
    }
    
    /**
     * 备用分享方案
     * @param {string} text - 分享文本
     * @param {string} url - 分享链接
     * @private
     */
    fallbackShare(text, url) {
        // 复制到剪贴板
        const shareContent = `${text}\n${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareContent).then(() => {
                this.showShareSuccess('内容已复制到剪贴板！');
            }).catch(() => {
                this.showShareFallback(shareContent);
            });
        } else {
            this.showShareFallback(shareContent);
        }
    }
    
    /**
     * 显示分享成功提示
     * @param {string} message - 提示消息
     * @private
     */
    showShareSuccess(message) {
        // 创建成功提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #27ae60;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 2147483648;
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 动画显示
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }
    
    /**
     * 显示分享备用方案
     * @param {string} content - 分享内容
     * @private
     */
    showShareFallback(content) {
        // 显示文本选择框让用户手动复制
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showShareSuccess('内容已复制到剪贴板！');
        } catch (err) {
            console.warn('🎉 复制失败:', err);
            prompt('请手动复制以下内容:', content);
        }
        
        document.body.removeChild(textarea);
    }
    
    /**
     * 解锁第二层彩蛋
     * @private
     */
    unlockSecondEasterEgg() {
        try {
            console.log('🎊 解锁第二层彩蛋！');
            
            // 分析埋点
            if (this.analytics) {
                this.analytics.trackEasterEggTriggered('second_easter_egg_unlocked', 'zh-CN');
            }
            
            // 记录解锁状态
            this.markSecondEasterEggAsUnlocked();
            
            // 启用午餐提醒功能
            this.enableLunchReminder();
            
            // 显示解锁提示
            this.showSecondEasterEggUnlock();
            
            // 触发事件
            this.dispatchEvent(new CustomEvent('secondEasterEggUnlocked'));
            
        } catch (error) {
            console.error('🎊 解锁第二层彩蛋时出错:', error);
        }
    }
    
    /**
     * 启用午餐提醒功能
     * @private
     */
    enableLunchReminder() {
        try {
            console.log('🍲 正在启用午餐提醒功能...');
            
            // 检查午餐提醒是否已经存在
            if (window.lunchReminder) {
                // 如果已经存在，只需要更新配置
                this.updateLunchReminderConfig();
                console.log('🍲 午餐提醒配置已更新');
            } else {
                // 如果不存在，创建新实例
                this.createLunchReminderInstance();
                console.log('🍲 午餐提醒实例已创建');
            }
            
        } catch (error) {
            console.error('🍲 启用午餐提醒时出错:', error);
        }
    }
    
    /**
     * 更新午餐提醒配置
     * @private
     */
    updateLunchReminderConfig() {
        if (window.LUNCH_REMINDER_CONSTANTS) {
            // 更新全局配置
            window.LUNCH_REMINDER_CONSTANTS.ENABLED = true;
            
            // 更新实例配置
            if (window.lunchReminder && window.lunchReminder.config) {
                window.lunchReminder.config.ENABLED = true;
                window.lunchReminder.enabled = true;
                
                // 重新初始化午餐提醒
                if (typeof window.lunchReminder.initializeLunchReminder === 'function') {
                    window.lunchReminder.initializeLunchReminder();
                }
            }
        }
    }
    
    /**
     * 创建午餐提醒实例
     * @private
     */
    createLunchReminderInstance() {
        // 先更新配置
        if (window.LUNCH_REMINDER_CONSTANTS) {
            window.LUNCH_REMINDER_CONSTANTS.ENABLED = true;
        }
        
        // 创建新实例
        if (window.LunchReminder && window.notificationService) {
            window.lunchReminder = new LunchReminder({}, window.notificationService);
            
            // 同步到主应用实例
            if (window.app) {
                window.app.lunchReminder = window.lunchReminder;
            }
            
            console.log('🍲 午餐提醒实例创建成功');
        } else {
            console.warn('🍲 无法创建午餐提醒实例：缺少必要的类或服务');
        }
    }
    
    /**
     * 记录第一次彩蛋已显示
     * @private
     */
    markFirstEasterEggAsShown() {
        try {
            localStorage.setItem(this.config.STORAGE_KEYS.FIRST_EASTER_EGG_SHOWN, 'true');
            this.isFirstTimeShown = true;
            console.log('🎉 已记录第一次彩蛋显示状态');
        } catch (error) {
            console.warn('🎉 记录第一次彩蛋状态失败:', error);
        }
    }
    
    /**
     * 记录第二层彩蛋已解锁
     * @private
     */
    markSecondEasterEggAsUnlocked() {
        try {
            localStorage.setItem(this.config.STORAGE_KEYS.LUNCH_REMINDER_UNLOCKED, 'true');
            this.isSecondEasterEggUnlocked = true;
            console.log('🎊 已记录第二层彩蛋解锁状态');
        } catch (error) {
            console.warn('🎊 记录第二层彩蛋状态失败:', error);
        }
    }
    
    /**
     * 创建UI控制器（后续阶段实现）
     * @private
     */
    createUI() {
        if (!this.ui && window.EasterEggUI) {
            this.ui = new EasterEggUI(this);
            console.log('🎉 UI控制器已创建');
        } else if (!window.EasterEggUI) {
            console.warn('🎉 EasterEggUI类不可用，无法创建UI控制器');
        }
    }
    
    /**
     * 显示第二层彩蛋解锁提示（通过UI控制器）
     * @private
     */
    showSecondEasterEggUnlock() {
        if (this.ui && this.ui.showSecondEasterEggUnlock) {
            this.ui.showSecondEasterEggUnlock();
        } else {
            // 如果UI不可用，使用简单提示
            const message = '🎊 太棒了！您已解锁第二个彩蛋！\n明天中午12:00请留意特别提醒哦~\n记得保存分享让更多朋友体验这个小工具！';
            setTimeout(() => {
                alert(message);
            }, 1000);
        }
    }
    
    /**
     * 手动触发第一层彩蛋（用于测试）
     * @public
     */
    manualTriggerFirst() {
        console.log('🎉 手动触发第一层彩蛋（测试）');
        this.showFirstEasterEgg();
    }
    
    /**
     * 重置彩蛋状态（用于测试）
     * @public
     */
    resetEasterEggState() {
        try {
            localStorage.removeItem(this.config.STORAGE_KEYS.FIRST_EASTER_EGG_SHOWN);
            localStorage.removeItem(this.config.STORAGE_KEYS.LUNCH_REMINDER_UNLOCKED);
            this.isFirstTimeShown = false;
            this.isSecondEasterEggUnlocked = false;
            console.log('🎉 彩蛋状态已重置');
        } catch (error) {
            console.warn('🎉 重置彩蛋状态失败:', error);
        }
    }
    
    /**
     * 获取彩蛋状态信息（用于调试）
     * @returns {Object}
     * @public
     */
    getEasterEggStatus() {
        return {
            isChineseVersion: this.isChineseVersion(),
            isEnabled: this.config.ENABLED,
            isFirstTimeShown: this.isFirstTimeShown,
            isSecondEasterEggUnlocked: this.isSecondEasterEggUnlocked,
            storageKeys: this.config.STORAGE_KEYS,
            uiCreated: !!this.ui,
            lunchReminderExists: !!window.lunchReminder,
            lunchReminderEnabled: window.LUNCH_REMINDER_CONSTANTS?.ENABLED || false
        };
    }
    
    /**
     * 手动触发分享操作（用于测试）
     * @param {string} shareType - 分享类型 ('wechat' | 'xiaohongshu')
     * @public
     */
    manualTriggerShare(shareType = 'wechat') {
        console.log(`🎉 手动触发分享操作（测试）: ${shareType}`);
        this.handleShareClick(shareType);
    }
    
    /**
     * 运行完整的彩蛋测试流程（用于测试）
     * @public
     */
    runFullEasterEggTest() {
        console.log('🎉 开始运行完整彩蛋测试流程...');
        
        // 步骤1：重置状态
        this.resetEasterEggState();
        console.log('✓ 步骤1：状态已重置');
        
        // 步骤2：检查初始状态
        const initialStatus = this.getEasterEggStatus();
        console.log('✓ 步骤2：初始状态检查', initialStatus);
        
        // 步骤3：触发第一层彩蛋
        setTimeout(() => {
            this.manualTriggerFirst();
            console.log('✓ 步骤3：第一层彩蛋已触发');
            
            // 步骤4：模拟分享操作
            setTimeout(() => {
                this.manualTriggerShare('wechat');
                console.log('✓ 步骤4：分享操作已触发');
                
                // 步骤5：检查最终状态
                setTimeout(() => {
                    const finalStatus = this.getEasterEggStatus();
                    console.log('✓ 步骤5：最终状态检查', finalStatus);
                    console.log('🎉 完整彩蛋测试流程完成！');
                }, 2000);
            }, 3000);
        }, 1000);
    }
    
    /**
     * 验证存储状态（用于测试）
     * @public
     */
    verifyStorageState() {
        const storage = {
            firstEasterEggShown: localStorage.getItem(this.config.STORAGE_KEYS.FIRST_EASTER_EGG_SHOWN),
            lunchReminderUnlocked: localStorage.getItem(this.config.STORAGE_KEYS.LUNCH_REMINDER_UNLOCKED)
        };
        
        console.log('🎉 存储状态验证:', storage);
        return storage;
    }
    
    /**
     * 重置所有每日触发状态（用于测试）
     * @public
     */
    resetDailyTriggers() {
        try {
            // 重置下午茶提醒状态
            localStorage.removeItem('afternoonTeaLastTrigger');
            localStorage.removeItem('coffeeBreakLastTrigger');
            
            // 重置午餐提醒状态
            localStorage.removeItem('lunchReminderLastTrigger');
            
            // 重置彩蛋状态
            this.resetEasterEggState();
            
            console.log('🔄 所有每日触发状态已重置');
        } catch (error) {
            console.warn('🔄 重置每日触发状态失败:', error);
        }
    }
    
    /**
     * 强制触发下午茶提醒（用于测试）
     * @public
     */
    forceAfternoonTeaTrigger() {
        if (window.afternoonTeaReminder) {
            console.log('🍵 强制触发下午茶提醒（测试）');
            window.afternoonTeaReminder.triggerReminder();
        } else {
            console.warn('🍵 未找到下午茶提醒实例');
        }
    }
    
    /**
     * 强制触发午餐提醒（用于测试）
     * @public
     */
    forceLunchReminderTrigger() {
        if (window.lunchReminder) {
            console.log('🍲 强制触发午餐提醒（测试）');
            window.lunchReminder.triggerReminder();
        } else {
            console.warn('🍲 未找到午餐提醒实例');
        }
    }
    
    /**
     * 显示所有状态信息（用于测试）
     * @public
     */
    showDetailedStatus() {
        const status = {
            easterEgg: this.getEasterEggStatus(),
            storage: this.verifyStorageState(),
            instances: {
                afternoonTeaReminder: !!window.afternoonTeaReminder,
                lunchReminder: !!window.lunchReminder,
                app: !!window.app
            },
            timestamps: {
                afternoonTeaLastTrigger: localStorage.getItem('afternoonTeaLastTrigger'),
                lunchReminderLastTrigger: localStorage.getItem('lunchReminderLastTrigger'),
                now: new Date().toISOString()
            }
        };
        
        console.log('📊 详细状态信息:', status);
        return status;
    }
}

// 全局暴露给其他模块使用
window.AfternoonTeaEasterEgg = AfternoonTeaEasterEgg;

// 添加全局测试方法，方便调试和验证
window.testEasterEggPOC = {
    // 重置所有状态
    reset: () => {
        localStorage.removeItem('afternoonTeaFirstEasterEggShown');
        localStorage.removeItem('lunchReminderUnlocked');
        localStorage.removeItem('afternoonTeaLastTrigger');
        localStorage.removeItem('lunchReminderLastTrigger');
        console.log('🔄 所有彩蛋和提醒状态已重置');
        location.reload();
    },
    
    // 强制显示彩蛋（绕过所有检查）
    showEasterEgg: () => {
        console.log('🎯 强制显示彩蛋弹窗...');
        if (window.afternoonTeaEasterEgg && window.afternoonTeaEasterEgg.ui) {
            window.afternoonTeaEasterEgg.ui.showFirstEasterEgg();
        } else if (window.afternoonTeaEasterEgg) {
            window.afternoonTeaEasterEgg.checkFirstTimeTrigger();
        } else {
            console.error('❌ 彩蛋管理器不可用');
        }
    },
    
    // 模拟下午茶提醒触发
    triggerAfternoonTea: () => {
        console.log('🍵 模拟下午茶提醒触发...');
        if (window.afternoonTeaReminder) {
            window.afternoonTeaReminder.triggerReminder();
        } else {
            console.error('❌ 下午茶提醒不可用');
        }
    },
    
    // 模拟午餐提醒触发
    triggerLunch: () => {
        console.log('🍲 模拟午餐提醒触发...');
        if (window.lunchReminder) {
            window.lunchReminder.triggerReminder();
        } else {
            console.error('❌ 午餐提醒不可用');
        }
    },
    
    // 查看状态
    showStatus: () => {
        const status = {
            firstEasterEggShown: localStorage.getItem('afternoonTeaFirstEasterEggShown'),
            lunchReminderUnlocked: localStorage.getItem('lunchReminderUnlocked'),
            afternoonTeaLastTrigger: localStorage.getItem('afternoonTeaLastTrigger'),
            lunchReminderLastTrigger: localStorage.getItem('lunchReminderLastTrigger'),
            instances: {
                afternoonTeaEasterEgg: !!window.afternoonTeaEasterEgg,
                afternoonTeaReminder: !!window.afternoonTeaReminder,
                lunchReminder: !!window.lunchReminder
            }
        };
        console.log('📊 彩蛋状态:', status);
        return status;
    },
    
    // 解锁午餐提醒
    unlockLunch: () => {
        localStorage.setItem('lunchReminderUnlocked', 'true');
        console.log('🍲 午餐提醒已手动解锁');
        if (window.lunchReminder) {
            window.lunchReminder.enabled = true;
        }
    },
    
    // 显示帮助
    help: () => {
        console.log('🎯 彩蛋测试工具帮助:');
        console.log('  testEasterEggPOC.reset() - 重置所有状态');
        console.log('  testEasterEggPOC.showEasterEgg() - 强制显示彩蛋');
        console.log('  testEasterEggPOC.triggerAfternoonTea() - 触发下午茶提醒');
        console.log('  testEasterEggPOC.triggerLunch() - 触发午餐提醒');
        console.log('  testEasterEggPOC.showStatus() - 查看状态');
        console.log('  testEasterEggPOC.unlockLunch() - 解锁午餐提醒');
    }
};

console.log('🧪 彩蛋测试工具已加载：testEasterEggPOC');
console.log('💡 输入 testEasterEggPOC.help() 查看可用命令');

// 全局测试方法（仅在开发环境）
if (typeof window !== 'undefined') {
    window.testEasterEgg = {
        // 重置所有状态
        reset: () => {
            if (window.afternoonTeaEasterEgg) {
                window.afternoonTeaEasterEgg.resetDailyTriggers();
            }
            console.log('🔄 所有彩蛋和提醒状态已重置');
        },
        
        // 触发下午茶彩蛋
        triggerAfternoonTea: () => {
            if (window.afternoonTeaEasterEgg) {
                window.afternoonTeaEasterEgg.forceAfternoonTeaTrigger();
            } else {
                console.warn('未找到下午茶彩蛋实例');
            }
        },
        
        // 触发午餐提醒
        triggerLunch: () => {
            if (window.afternoonTeaEasterEgg) {
                window.afternoonTeaEasterEgg.forceLunchReminderTrigger();
            } else {
                console.warn('未找到下午茶彩蛋实例');
            }
        },
        
        // 显示状态
        showStatus: () => {
            if (window.afternoonTeaEasterEgg) {
                return window.afternoonTeaEasterEgg.showDetailedStatus();
            } else {
                console.warn('未找到下午茶彩蛋实例');
                return null;
            }
        },
        
        // 手动触发第一层彩蛋
        showFirstEgg: () => {
            if (window.afternoonTeaEasterEgg) {
                window.afternoonTeaEasterEgg.manualTriggerFirst();
            } else {
                console.warn('未找到下午茶彩蛋实例');
            }
        },
        
        // 模拟分享操作
        simulateShare: (type = 'wechat') => {
            if (window.afternoonTeaEasterEgg) {
                window.afternoonTeaEasterEgg.manualTriggerShare(type);
            } else {
                console.warn('未找到下午茶彩蛋实例');
            }
        },
        
        // 运行完整测试
        runFullTest: () => {
            if (window.afternoonTeaEasterEgg) {
                window.afternoonTeaEasterEgg.runFullEasterEggTest();
            } else {
                console.warn('未找到下午茶彩蛋实例');
            }
        },
        
        // === 调试模式专用方法 ===
        
        // 直接触发彩蛋弹窗（绕过所有检查）
        forceEasterEgg: () => {
            console.log('🔧 强制触发彩蛋弹窗...');
            
            // 立即创建绝对有效的弹窗
            if (typeof createGuaranteedEasterEggModal === 'function') {
                createGuaranteedEasterEggModal();
            } else {
                console.error('createGuaranteedEasterEggModal function not found!');
                // 创建紧急备用弹窗
                const modal = document.createElement('div');
                modal.innerHTML = '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:999999;text-align:center;font-family:Arial,sans-serif;"><h2 style="color:#2c3e50;margin:0 0 20px 0;">🎉 彩蛋触发成功！</h2><p style="color:#666;margin:0 0 20px 0;">下午茶提醒彩蛋已解锁！</p><button onclick="this.parentElement.parentElement.remove()" style="background:#007bff;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">确定</button></div>';
                document.body.appendChild(modal);
            }
        },
        
        // 强制触发下午茶（通知+彩蛋）
        triggerBreak: () => {
            console.log('🔧 触发下午茶完整流程...');
            if (window.afternoonTeaEasterEgg) {
                // 重置状态
                localStorage.removeItem('afternoonTeaFirstEasterEggShown');
                localStorage.removeItem('afternoonTeaLastTrigger');
                
                // 触发彩蛋
                window.afternoonTeaEasterEgg.checkFirstTimeTrigger();
                
                // 也触发通知
                if (window.afternoonTeaReminder) {
                    window.afternoonTeaReminder.triggerReminder();
                }
                console.log('✅ 下午茶完整流程已触发');
            } else {
                console.warn('❌ afternoonTeaEasterEgg 实例不可用');
            }
        },
        
        // 强制触发午餐
        triggerLunch: () => {
            if (window.afternoonTeaEasterEgg) {
                window.afternoonTeaEasterEgg.forceLunchReminderTrigger();
            } else {
                console.warn('未找到下午茶彩蛋实例');
            }
        },
        testNotification: () => {
            if (window.app && window.app.notificationService) {
                window.app.notificationService.showNotification(
                    'water',
                    '🔧 调试测试',
                    '这是一个调试模式的通知测试'
                );
                console.log('✅ 测试通知已发送');
            } else {
                console.warn('❌ 通知服务不可用');
            }
        },
        
        // 获取调试信息
        getDebugInfo: () => {
            const info = {
                debugMode: !!window.debugModeManager,
                currentTime: new Date().toLocaleTimeString(),
                instances: {
                    afternoonTeaEasterEgg: !!window.afternoonTeaEasterEgg,
                    lunchReminder: !!window.lunchReminder,
                    afternoonTeaReminder: !!window.afternoonTeaReminder,
                    app: !!window.app
                },
                storage: {
                    afternoonTeaLastTrigger: localStorage.getItem('afternoonTeaLastTrigger'),
                    afternoonTeaFirstEasterEggShown: localStorage.getItem('afternoonTeaFirstEasterEggShown'),
                    lunchReminderUnlocked: localStorage.getItem('lunchReminderUnlocked')
                },
                ui: {
                    easterEggUI: window.afternoonTeaEasterEgg ? !!window.afternoonTeaEasterEgg.ui : false
                }
            };
            
            console.log('🔧 调试信息:', info);
            return info;
        },
        
        // 显示帮助
        help: () => {
            console.log('🔧 彩蛋调试帮助');
            console.log('');
            console.log('📖 基础方法:');
            console.log('  testEasterEgg.reset() // 重置所有状态');
            console.log('  testEasterEgg.showFirstEgg() // 显示第一层彩蛋');
            console.log('  testEasterEgg.simulateShare("wechat") // 模拟分享');
            console.log('');
            console.log('🔧 调试专用方法:');
            console.log('  testEasterEgg.forceEasterEgg() // 强制显示彩蛋弹窗');
            console.log('  testEasterEgg.triggerBreak() // 触发完整下午茶流程');
            console.log('  testEasterEgg.testNotification() // 测试通知权限');
            console.log('  testEasterEgg.getDebugInfo() // 获取调试信息');
        }
    };
    
    console.log('🧪 彩蛋测试工具已加载：window.testEasterEgg');
    console.log('');
    console.log('💡 基础方法:');
    console.log('  - testEasterEgg.reset() // 重置所有状态');
    console.log('  - testEasterEgg.showFirstEgg() // 显示第一层彩蛋');
    console.log('  - testEasterEgg.simulateShare() // 模拟分享操作');
    console.log('  - testEasterEgg.showStatus() // 查看状态');
    console.log('');
    console.log('🔧 调试专用方法（重要！）:');
    console.log('  - testEasterEgg.forceEasterEgg() // 🎯 直接强制显示彩蛋弹窗');
    console.log('  - testEasterEgg.triggerBreak() // 触发完整下午茶流程');
    console.log('  - testEasterEgg.testNotification() // 测试通知权限');
    console.log('  - testEasterEgg.getDebugInfo() // 获取调试信息');
    console.log('  - testEasterEgg.help() // 显示调试帮助');
}

// 紧急备用弹窗函数（如果主系统失败时使用）
function createEmergencyEasterEggModal() {
    console.log('🆘 创建紧急备用彩蛋弹窗...');
    
    // 创建背景遮罩
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 2147483646;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // 创建弹窗
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        max-width: 90vw;
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 2147483647;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;
    
    modal.innerHTML = `
        <h2 style="color: #2c3e50; margin-bottom: 16px;">🎉 恭喜成功解锁下午茶提醒彩蛋！</h2>
        <p style="color: #666; margin-bottom: 20px;">三点几啦！饮茶先啦！</p>
        <p style="color: #666; margin-bottom: 24px;">把这个贴心小工具分享给朋友们吧~</p>
        <button onclick="this.parentElement.parentElement.remove(); this.parentElement.remove(); document.body.style.overflow=''" 
                style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
            关闭
        </button>
    `;
    
    // 添加到页面并显示
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 显示动画
    requestAnimationFrame(() => {
        backdrop.style.opacity = '1';
    });
    
    // 点击背景关闭
    backdrop.onclick = () => {
        backdrop.remove();
        modal.remove();
        document.body.style.overflow = '';
    };
    
    console.log('✅ 紧急备用弹窗已显示');
}

// 绝对有效的彩蛋弹窗（绕过所有CSS问题）
function createGuaranteedEasterEggModal() {
    console.log('🎆 创建绝对有效的彩蛋弹窗...');
    
    // 清理现有的弹窗
    const existing = document.querySelectorAll('.guaranteed-easter-egg-modal, .guaranteed-easter-egg-backdrop');
    existing.forEach(el => el.remove());
    
    // 创建背景遮罩（使用!important强制样式）
    const backdrop = document.createElement('div');
    backdrop.className = 'guaranteed-easter-egg-backdrop';
    backdrop.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, 0.6) !important;
        z-index: 999999 !important;
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
    `;
    
    // 创建弹窗（使用!important强制样式）
    const modal = document.createElement('div');
    modal.className = 'guaranteed-easter-egg-modal';
    modal.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 450px !important;
        max-width: 90vw !important;
        background: white !important;
        border-radius: 12px !important;
        padding: 30px !important;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3) !important;
        z-index: 1000000 !important;
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        text-align: center !important;
        color: #333 !important;
        line-height: 1.5 !important;
    `;
    
    // 弹窗内容
    modal.innerHTML = `
        <div style="margin-bottom: 20px !important;">
            <h2 style="color: #2c3e50 !important; margin: 0 0 10px 0 !important; font-size: 22px !important; font-weight: 600 !important;">
                🎉 恭喜成功解锁下午茶提醒彩蛋！
            </h2>
            <p style="color: #e67e22 !important; margin: 0 0 15px 0 !important; font-size: 18px !important; font-weight: 500 !important;">
                三点几啦！饮茶先啦！
            </p>
            <p style="color: #666 !important; margin: 0 0 25px 0 !important; font-size: 16px !important;">
                把这个贴心小工具分享给朋友们吧~
            </p>
        </div>
        
        <div style="margin-bottom: 25px !important;">
            <div style="background: #f8f9fa !important; padding: 15px !important; border-radius: 8px !important; margin-bottom: 20px !important;">
                <p style="margin: 0 !important; color: #666 !important; font-size: 14px !important;">
                    💡 点击下方按钮分享到微信或小红书
                </p>
            </div>
        </div>
        
        <div style="display: flex !important; gap: 15px !important; justify-content: center !important; flex-wrap: wrap !important;">
            <button onclick="handleEasterEggShare('wechat')" style="
                background: #07c160 !important;
                color: white !important;
                border: none !important;
                padding: 12px 20px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                min-width: 120px !important;
                transition: all 0.2s !important;
            " onmouseover="this.style.background='#06ad56'" onmouseout="this.style.background='#07c160'">
                📱 分享到微信
            </button>
            
            <button onclick="handleEasterEggShare('xiaohongshu')" style="
                background: #ff2442 !important;
                color: white !important;
                border: none !important;
                padding: 12px 20px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                min-width: 120px !important;
                transition: all 0.2s !important;
            " onmouseover="this.style.background='#e01e3a'" onmouseout="this.style.background='#ff2442'">
                📝 分享到小红书
            </button>
        </div>
        
        <div style="margin-top: 20px !important;">
            <button onclick="closeGuaranteedEasterEggModal()" style="
                background: transparent !important;
                color: #999 !important;
                border: 1px solid #ddd !important;
                padding: 8px 16px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 13px !important;
            " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
                关闭
            </button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 点击背景关闭
    backdrop.onclick = closeGuaranteedEasterEggModal;
    
    console.log('✅ 绝对有效的彩蛋弹窗已显示！');
    
    // 延迟显示成功消息
    setTimeout(() => {
        console.log('🎆 彩蛋弹窗显示成功！用户应该可以看到弹窗了！');
    }, 100);
}

// 关闭绝对有效弹窗
function closeGuaranteedEasterEggModal() {
    const elements = document.querySelectorAll('.guaranteed-easter-egg-modal, .guaranteed-easter-egg-backdrop');
    elements.forEach(el => el.remove());
    document.body.style.overflow = '';
    console.log('✅ 彩蛋弹窗已关闭');
}

// 处理分享点击
function handleEasterEggShare(type) {
    console.log('🎆 分享按钮被点击:', type);
    
    let message;
    if (type === 'wechat') {
        message = '🍵 下午茶时间到！\n\n发现一个超贴心的办公室健康提醒小工具，定时提醒喝水和站立，还有这样的小彩蛋🎉\n\n分享给你们，一起做健康的打工人！\n\n链接: https://hydrate-move.lightyearai.info/zh/';
    } else {
        message = '🍵 办公室下午茶彩蛋\n\n哈哈哈，下午茶时间到！\n\n工作再忙也要记得：\n💧 多喝水\n🧘 多站立\n🍵 享受下午茶时光\n\n这个小工具还有彩蛋，太有意思了！\n\n#办公室健康 #下午茶 #打工人的小确幸';
    }
    
    // 复制到剪贴板
    if (navigator.clipboard) {
        navigator.clipboard.writeText(message).then(() => {
            alert('✅ 分享文案已复制到剪贴板！');
        }).catch(() => {
            prompt('请复制以下内容:', message);
        });
    } else {
        prompt('请复制以下内容:', message);
    }
    
    // 解锁第二个彩蛋
    localStorage.setItem('lunchReminderUnlocked', 'true');
    console.log('✅ 第二个彩蛋（午餐提醒）已解锁！');
    
    // 1.5秒后关闭弹窗
    setTimeout(() => {
        closeGuaranteedEasterEggModal();
        
        // 显示解锁消息
        setTimeout(() => {
            alert('🎆 太棒了！您已解锁第二个彩蛋！\n明天中午12:00请留意特别提醒哦~');
        }, 300);
    }, 1500);
}