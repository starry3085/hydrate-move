/**
 * Office Wellness App - Simple reminder application
 * Basic water and standup reminders for office workers
 */
class OfficeWellnessApp {
    constructor() {
        this.uiController = null;
        this.waterReminder = null;
        this.standupReminder = null;
        this.afternoonTeaReminder = null; // 新增下午茶提醒
        this.lunchReminder = null; // 新增午餐提醒
        this.demoController = null;
        this.errorHandler = null;
        this.storage = null;
        this.analytics = null;
        this.feedbackButton = null;
        
        // Error recovery configuration
        this.retryCount = 0;
        this.config = {
            maxRetries: 3
        };
        
        this.init();
    }

    /**
     * Public initialize method for external calls
     * @public
     */
    async initialize() {
        return this.init();
    }

    async init() {
        try {
            console.log('Starting application initialization...');
            
            // Initialize in strict order with validation
            this.initializeErrorHandler();
            this.initializeStorage();
            this.initializeAnalytics();
            this.initializeUI();
            this.initializeReminders();
            this.initializeAfternoonTea(); // 初始化下午茶提醒
            this.initializeLunchReminder(); // 初始化午餐提醒
            this.initializeDemoController();
            this.initializeFeedbackButton();
            
            // Validate all components are ready
            this.validateInitialization();
            
            // Ensure reminders are properly set before linking to UI
            if (this.waterReminder && this.standupReminder && this.uiController) {
                this.uiController.setReminders(this.waterReminder, this.standupReminder);
                
                // Link demo controller to UI
                if (this.demoController) {
                    this.uiController.setDemoController(this.demoController);
                }
                
                // Sync initial intervals from HTML inputs
                this.syncInitialIntervals();
                
                // 初始化演示状态文本（确保语言纯度）
                this.initializeDemoStatusText();
                
            console.log('Reminders and demo controller linked to UI controller');
        } else {
            console.warn('Some components not ready for linking');
        }
        
        // Initial UI update is now handled by setReminders - no need for separate force update
        
        console.log('Office Wellness App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize:', error);
            this.handleInitializationError(error);
        }
    }

    initializeErrorHandler() {
        try {
            this.errorHandler = new ErrorHandler();
            console.log('Error handler initialized');
        } catch (error) {
            console.warn('Failed to initialize error handler:', error);
        }
    }

    /**
     * Initialize storage manager for simple persistence
     * @private
     */
    initializeStorage() {
        try {
            this.storage = new StorageManager();
            console.log('Storage manager initialized');
        } catch (error) {
            console.warn('Storage initialization failed, using defaults:', error);
            this.storage = null;
        }
    }

    /**
     * Initialize analytics for user engagement tracking
     * @private
     */
    initializeAnalytics() {
        try {
            this.analytics = new Analytics();
            console.log('Analytics initialized');
        } catch (error) {
            console.warn('Analytics initialization failed:', error);
            this.analytics = null;
        }
    }

    /**
     * Initialize UI Controller without StateManager dependency
     * @private
     */
    initializeUI() {
        try {
            this.uiController = new UIController({
                updateInterval: 1000,
                mobileBreakpoint: 768
            });
            
            console.log('UI Controller initialized');
        } catch (error) {
            throw new Error(`UI Controller initialization failed: ${error.message}`);
        }
    }

    /**
     * Initialize reminder managers with simplified initialization
     * @private
     */
    initializeReminders() {
        try {
            console.log('Starting reminder initialization...');
            
            // Initialize notification service first
            const notificationService = new NotificationService();
            
            // 将notificationService暴露到全局，供下午茶提醒使用
            window.notificationService = notificationService;
            
            // Load saved settings from storage with proper null handling
            const savedSettings = this.storage ? this.storage.getItem('appSettings') : null;
            const settings = savedSettings || {};
            
            // Ensure water and standup settings exist with defaults
            const waterSettings = (savedSettings && savedSettings.water) ? savedSettings.water : {};
            const standupSettings = (savedSettings && savedSettings.standup) ? savedSettings.standup : {};
            
            // Water Reminder
            this.waterReminder = new WaterReminder('water', {
                interval: 30,
                enabled: true,
                sound: true,
                ...waterSettings
            }, notificationService);

            // Standup Reminder
            this.standupReminder = new StandupReminder('standup', {
                interval: 30,
                enabled: true,
                sound: true,
                ...standupSettings
            }, notificationService);

            console.log('Reminder managers initialized successfully');
        } catch (error) {
            console.error('Reminder initialization failed:', error);
            throw new Error(`Reminder initialization failed: ${error.message}`);
        }
    }

    /**
     * Initialize demo controller with required dependencies
     * @private
     */
    initializeDemoController() {
        try {
            console.log('Starting demo controller initialization...');
            
            if (!this.waterReminder || !this.standupReminder || !this.uiController) {
                throw new Error('Demo controller requires water reminder, standup reminder, and UI controller');
            }
            
            this.demoController = new DemoController({
                waterReminder: this.waterReminder,
                standupReminder: this.standupReminder,
                uiController: this.uiController
            });
            
            console.log('Demo controller initialized successfully');
        } catch (error) {
            console.error('Demo controller initialization failed:', error);
            // Demo is not critical - continue without it
            this.demoController = null;
        }
    }

    /**
     * Initialize feedback button for GitHub Issues integration
     * @private
     */
    initializeFeedbackButton() {
        try {
            this.feedbackButton = new FeedbackButton();
            this.feedbackButton.init();
            console.log('Feedback button initialized');
        } catch (error) {
            console.warn('Feedback button initialization failed:', error);
            this.feedbackButton = null;
        }
    }

    /**
     * Initialize afternoon tea reminder (Easter egg feature for Chinese version)
     * @private
     */
    initializeAfternoonTea() {
        try {
            // 防止重复初始化
            if (window.afternoonTeaReminder) {
                console.log('🍵 下午茶提醒已存在，跳过初始化');
                return;
            }
            
            // 检查是否启用多语言支持
            if (!AFTERNOON_TEA_CONSTANTS.MULTI_LANGUAGE_SUPPORT) {
                // 传统模式：仅中文版启用
                if (!AFTERNOON_TEA_CONSTANTS.isChineseVersionOnly() || !AFTERNOON_TEA_CONSTANTS.ENABLED) {
                    console.log('🍵 下午茶提醒彩蛋未启用（非中文版或功能关闭）');
                    return;
                }
            } else {
                // 多语言模式：中文版和英文版都可启用
                const isChineseVersion = AFTERNOON_TEA_CONSTANTS.isChineseVersionOnly();
                const isEnglishVersion = AFTERNOON_TEA_CONSTANTS.isEnglishVersionOnly();
                
                if (!AFTERNOON_TEA_CONSTANTS.ENABLED || (!isChineseVersion && !isEnglishVersion)) {
                    console.log('🍵 下午茶/咖啡提醒未启用（功能关闭或未检测到支持的语言）');
                    return;
                }
                
                const featureType = isChineseVersion ? '下午茶提醒' : 'Coffee Break';
                console.log(`🍵 检测到${featureType}环境，开始初始化`);
            }
            
            // 确保通知服务已初始化
            const notificationService = window.notificationService;
            if (!notificationService) {
                console.warn('🍵 通知服务未初始化，下午茶提醒跳过');
                return;
            }
            
            // 创建下午茶提醒实例，传入空设置和通知服务
            this.afternoonTeaReminder = new AfternoonTeaReminder({}, notificationService);
            
            // 将实例暴露到全局供调试使用
            window.afternoonTeaReminder = this.afternoonTeaReminder;
            
            const isChineseVersion = AFTERNOON_TEA_CONSTANTS.isChineseVersionOnly();
            const featureType = isChineseVersion ? '下午茶提醒彩蛋' : 'Coffee Break';
            console.log(`🍵 ${featureType}初始化成功`);
            
        } catch (error) {
            console.error('🍵 下午茶提醒初始化失败:', error);
            // 下午茶提醒是可选功能，不影响主应用
            this.afternoonTeaReminder = null;
        }
    }

    /**
     * Initialize lunch reminder (Chinese version exclusive easter egg feature)
     * 初始化午餐提醒（中文版专属第二个彩蛋功能）
     * @private
     */
    initializeLunchReminder() {
        try {
            // 仅在中文版且功能启用时初始化
            if (!LUNCH_REMINDER_CONSTANTS.isChineseVersionOnly() || !LUNCH_REMINDER_CONSTANTS.ENABLED) {
                console.log('🍲 午餐提醒未启用（非中文版或功能关闭）');
                return;
            }
            
            // 防止重复初始化
            if (window.lunchReminder) {
                console.log('🍲 午餐提醒已存在，跳过初始化');
                return;
            }
            
            // 确保通知服务已初始化
            const notificationService = window.notificationService;
            if (!notificationService) {
                console.warn('🍲 通知服务未初始化，午餐提醒跳过');
                return;
            }
            
            // 创建午餐提醒实例
            this.lunchReminder = new LunchReminder({}, notificationService);
            
            // 将实例暴露到全局供调试使用
            window.lunchReminder = this.lunchReminder;
            
            console.log('🍲 午餐提醒初始化成功');
            
        } catch (error) {
            console.error('🍲 午餐提醒初始化失败:', error);
            // 午餐提醒是可选功能，不影响主应用
            this.lunchReminder = null;
        }
    }

    /**
     * Validate all components are properly initialized
     * @private
     */
    validateInitialization() {
        const components = {
            uiController: this.uiController,
            waterReminder: this.waterReminder,
            standupReminder: this.standupReminder,
            storage: this.storage,
            feedbackButton: this.feedbackButton
            // demoController is optional - not required for core functionality
        };

        const missing = Object.entries(components)
            .filter(([name, component]) => !component)
            .map(([name]) => name);

        if (missing.length > 0) {
            throw new Error(`Missing components: ${missing.join(', ')}`);
        }

        console.log('All components validated');
    }



    /**
     * Handle initialization errors with user-friendly messages
     * @param {Error} error - Initialization error
     * @private
     */
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        // Increment retry count
        this.retryCount++;
        
        // Show user-friendly error
        const errorMessage = error.message || 'Application failed to start';
        const userMessage = `Office Wellness App Error:\n${errorMessage}\n\nPlease refresh the page to try again.`;
        
        // Try recovery if within retry limits
        if (this.retryCount < this.config.maxRetries) {
            console.log(`Attempting recovery (attempt ${this.retryCount}/${this.config.maxRetries})`);
            setTimeout(() => {
                this.attemptRecovery();
            }, 1000 * this.retryCount);
        } else {
            // Show error to user after max retries
            setTimeout(() => {
                if (window.alert) {
                    alert(userMessage);
                }
            }, 100);
        }
    }



    /**
     * Sync initial intervals from HTML inputs
     * @private
     */
    syncInitialIntervals() {
        try {
            // Get HTML input values
            const waterInput = document.querySelector('#water-interval-display');
            const standupInput = document.querySelector('#standup-interval-display');
            
            if (waterInput && this.waterReminder) {
                const waterInterval = parseInt(waterInput.value, 10);
                if (waterInterval >= 1 && waterInterval <= 120) {
                    this.waterReminder.settings.interval = waterInterval;
                    this.waterReminder.timeRemaining = waterInterval * 60 * 1000;
                }
            }
            
            if (standupInput && this.standupReminder) {
                const standupInterval = parseInt(standupInput.value, 10);
                if (standupInterval >= 1 && standupInterval <= 120) {
                    this.standupReminder.settings.interval = standupInterval;
                    this.standupReminder.timeRemaining = standupInterval * 60 * 1000;
                }
            }
            
            console.log('Initial intervals synced from HTML');
        } catch (error) {
            console.warn('Failed to sync initial intervals:', error);
        }
    }
    
    /**
     * 初始化演示状态文本 - 确保语言纯度
     * @private
     */
    initializeDemoStatusText() {
        try {
            // 获取演示状态元素
            const demoStatusElement = document.getElementById('demo-status');
            if (demoStatusElement) {
                // 使用DEMO_CONSTANTS的双语获取方法设置初始状态
                const initialMessage = DEMO_CONSTANTS.getStatusMessage('READY');
                demoStatusElement.textContent = initialMessage;
                console.log('演示状态文本已初始化:', initialMessage);
            }
        } catch (error) {
            console.warn('Failed to initialize demo status text:', error);
        }
    }

    /**
     * Save current settings to storage
     * @private
     */
    saveSettings() {
        if (!this.storage) return;
        
        try {
            const settings = {
                water: this.waterReminder ? this.waterReminder.settings : {},
                standup: this.standupReminder ? this.standupReminder.settings : {}
            };
            
            this.storage.setItem('appSettings', settings);
            console.log('Settings saved successfully');
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    /**
     * Handle application errors with recovery
     * @param {Error} error - Error object
     * @param {string} context - Error context
     * @private
     */
    handleAppError(error, context = 'Application') {
        console.error(`${context} Error:`, error);
        
        if (this.retryCount < this.config.maxRetries) {
            this.retryCount++;
            console.log(`Attempting recovery (attempt ${this.retryCount}/${this.config.maxRetries})`);
            
            setTimeout(() => {
                this.attemptRecovery();
            }, 1000 * this.retryCount);
        } else {
            console.error('Max retries exceeded, showing error to user');
            this.showErrorToUser(error);
        }
    }

    /**
     * Attempt application recovery
     * @private
     */
    async attemptRecovery() {
        try {
            console.log('Starting recovery process...');
            
            // Reinitialize components
            this.cleanup();
            await this.init();
            
            this.retryCount = 0;
            console.log('Recovery successful');
            
        } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
            this.showErrorToUser(recoveryError);
        }
    }

    /**
     * Show error to user in a user-friendly way
     * @param {Error} error - Error object
     * @private
     */
    showErrorToUser(error) {
        try {
            const errorMessage = error.message || 'An unexpected error occurred';
            
            if (this.uiController) {
                // Use UI to show error (simplified notification)
                console.error('Application Error:', errorMessage);
                alert(`Office Wellness App Error:\n${errorMessage}\n\nPlease refresh the page to continue.`);
            } else {
                // Fallback to basic alert
                alert(`Office Wellness App Error:\n${errorMessage}`);
            }
        } catch (uiError) {
            console.error('Failed to show error to user:', uiError);
        }
    }

    /**
     * Cleanup application resources
     * @private
     */
    cleanup() {
        try {
            if (this.waterReminder) {
                this.waterReminder.destroy();
                this.waterReminder = null;
            }
            
            if (this.standupReminder) {
                this.standupReminder.destroy();
                this.standupReminder = null;
            }
            
            if (this.afternoonTeaReminder) {
                this.afternoonTeaReminder.destroy();
                this.afternoonTeaReminder = null;
            }
            
            if (this.lunchReminder) {
                this.lunchReminder.destroy();
                this.lunchReminder = null;
            }
            
            if (this.demoController) {
                this.demoController.destroy();
                this.demoController = null;
            }
            
            if (this.uiController) {
                this.uiController.destroy();
                this.uiController = null;
            }
            
            if (this.feedbackButton) {
                this.feedbackButton.destroy();
                this.feedbackButton = null;
            }
            
            console.log('Application cleanup completed');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

}

// Global app instance for debugging
window.OfficeWellnessApp = OfficeWellnessApp;