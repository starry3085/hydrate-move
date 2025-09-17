/**
 * Demo Controller - Manages demo mode functionality
 * Provides automated demonstration of reminder features with accelerated timing
 * 
 * Features:
 * - 30-second intervals for quick demonstration
 * - Automated sequence: Water reminder first, then Standup reminder
 * - Clear status messaging and user feedback
 * - Automatic cleanup and state restoration
 */
class DemoController {
    /**
     * Create demo controller instance
     * @param {Object} dependencies - Required dependencies
     * @param {WaterReminder} dependencies.waterReminder - Water reminder instance
     * @param {StandupReminder} dependencies.standupReminder - Standup reminder instance
     * @param {UIController} dependencies.uiController - UI controller instance
     */
    constructor({ waterReminder, standupReminder, uiController }) {
        this.waterReminder = waterReminder;
        this.standupReminder = standupReminder;
        this.uiController = uiController;
        
        // Demo state
        this.isRunning = false;
        this.timeouts = [];
        
        // Store original intervals for restoration
        this.originalIntervals = {
            water: null,
            standup: null
        };
        
        console.log('🎬 Demo Controller initialized');
    }

    /**
     * Start demo sequence
     * @public
     */
    async startDemo() {
        if (this.isRunning) {
            console.warn('Demo already running');
            return;
        }

        try {
            console.log('🎬 Starting demo sequence...');
            this.isRunning = true;
            
            // Update UI to show demo starting
            this.updateDemoStatus('STARTING');
            
            // Store original intervals
            this.storeOriginalIntervals();
            
            // Stop any existing reminders
            this.stopAllReminders();
            
            // Set demo intervals
            this.setDemoIntervals();
            
            // Start demo sequence
            await this.runDemoSequence();
            
        } catch (error) {
            console.error('Demo failed:', error);
            this.stopDemo();
            this.showError('Demo failed to start. Please try again.');
        }
    }

    /**
     * Stop demo and restore normal state
     * @public
     */
    stopDemo() {
        if (!this.isRunning) {
            return;
        }

        console.log('🎬 Stopping demo...');
        
        // Clear all timeouts
        this.clearAllTimeouts();
        
        // Stop all reminders
        this.stopAllReminders();
        
        // Restore original intervals
        this.restoreOriginalIntervals();
        
        // Update UI
        this.updateDemoStatus('COMPLETED');
        
        // Reset demo button state
        this.resetDemoButton();
        
        // Reset demo state
        this.isRunning = false;
        
        // Clear status after delay
        this.setTimeout(() => {
            this.updateDemoStatus('READY');
        }, 3000);
        
        console.log('✅ Demo stopped and state restored');
    }

    /**
     * Run the automated demo sequence
     * @private
     */
    async runDemoSequence() {
        // Step 1: Start water reminder immediately
        this.setTimeout(() => {
            this.updateDemoStatus('WATER_STARTING');
            this.waterReminder.start();
            console.log('🎬 Demo: Water reminder started');
        }, DEMO_CONSTANTS.WATER_START_DELAY_MS);

        // Step 2: Start standup reminder after delay
        this.setTimeout(() => {
            this.updateDemoStatus('STANDUP_STARTING');
            this.standupReminder.start();
            console.log('🎬 Demo: Standup reminder started');
        }, DEMO_CONSTANTS.STANDUP_START_DELAY_MS);

        // Step 3: Update status to running
        this.setTimeout(() => {
            this.updateDemoStatus('RUNNING');
        }, DEMO_CONSTANTS.STANDUP_START_DELAY_MS + 1000);

        // Step 4: Auto-stop demo after both notifications should have appeared
        // 方案A: Water: 3s, Standup: 5s (started 3s later = 8s total) + 2s buffer = 10s
        const demoEndTime = Math.max(
            DEMO_CONSTANTS.WATER_START_DELAY_MS + (REMINDER_CONSTANTS.DEMO_WATER_INTERVAL_SECONDS * 1000),
            DEMO_CONSTANTS.STANDUP_START_DELAY_MS + (REMINDER_CONSTANTS.DEMO_STANDUP_INTERVAL_SECONDS * 1000)
        ) + 2000; // Add 2 seconds buffer for 10s total

        this.setTimeout(() => {
            this.stopDemo();
        }, demoEndTime);
    }

    /**
     * Store original reminder intervals
     * @private
     */
    storeOriginalIntervals() {
        this.originalIntervals.water = this.waterReminder.settings.interval;
        this.originalIntervals.standup = this.standupReminder.settings.interval;
        
        console.log('💾 Original intervals stored:', this.originalIntervals);
    }

    /**
     * Set demo intervals - 方案A: 喝水3秒，站立5秒
     * @private
     */
    setDemoIntervals() {
        // 方案A: 使用不同的间隔时间 - 喝水3秒，站立5秒
        const waterIntervalMinutes = REMINDER_CONSTANTS.DEMO_WATER_INTERVAL_SECONDS / 60;
        const standupIntervalMinutes = REMINDER_CONSTANTS.DEMO_STANDUP_INTERVAL_SECONDS / 60;
        
        this.waterReminder.settings.interval = waterIntervalMinutes;
        this.waterReminder.timeRemaining = REMINDER_CONSTANTS.DEMO_WATER_INTERVAL_SECONDS * 1000;
        
        this.standupReminder.settings.interval = standupIntervalMinutes;
        this.standupReminder.timeRemaining = REMINDER_CONSTANTS.DEMO_STANDUP_INTERVAL_SECONDS * 1000;
        
        // 🎯 KIRO核心修复：临时禁用resetAndRestart方法防止重复触发
        this.backupAndDisableResetAndRestart();
        
        console.log('⏱️ Demo intervals set with resetAndRestart disabled - Water:', REMINDER_CONSTANTS.DEMO_WATER_INTERVAL_SECONDS, 's, Standup:', REMINDER_CONSTANTS.DEMO_STANDUP_INTERVAL_SECONDS, 's');
    }

    /**
     * Restore original reminder intervals
     * @private
     */
    restoreOriginalIntervals() {
        // 🎯 KIRO核心修复：先恢复resetAndRestart方法
        this.restoreResetAndRestart();
        
        if (this.originalIntervals.water !== null) {
            this.waterReminder.settings.interval = this.originalIntervals.water;
            this.waterReminder.timeRemaining = this.originalIntervals.water * 60 * 1000;
        }
        
        if (this.originalIntervals.standup !== null) {
            this.standupReminder.settings.interval = this.originalIntervals.standup;
            this.standupReminder.timeRemaining = this.originalIntervals.standup * 60 * 1000;
        }
        
        console.log('🔄 Original intervals and methods restored:', this.originalIntervals);
    }

    /**
     * Stop all active reminders
     * @private
     */
    stopAllReminders() {
        if (this.waterReminder.isActive) {
            this.waterReminder.stop();
        }
        if (this.standupReminder.isActive) {
            this.standupReminder.stop();
        }
    }

    /**
     * Update demo status in UI
     * @param {string} statusKey - Status key from DEMO_CONSTANTS.STATUS_MESSAGES
     * @private
     */
    updateDemoStatus(statusKey) {
        // 使用双语获取方法，根据页面语言动态获取消息
        const message = DEMO_CONSTANTS.getStatusMessage(statusKey);
        
        // Update demo status element if it exists
        const statusElement = document.getElementById('demo-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `demo-status ${statusKey.toLowerCase()}`;
        }
        
        console.log('📢 Demo status:', message);
    }

    /**
     * Set timeout with tracking for cleanup
     * @param {Function} callback - Callback function
     * @param {number} delay - Delay in milliseconds
     * @private
     */
    setTimeout(callback, delay) {
        const timeoutId = setTimeout(() => {
            // Remove from tracking array
            const index = this.timeouts.indexOf(timeoutId);
            if (index > -1) {
                this.timeouts.splice(index, 1);
            }
            callback();
        }, delay);
        
        this.timeouts.push(timeoutId);
        return timeoutId;
    }

    /**
     * Clear all tracked timeouts
     * @private
     */
    clearAllTimeouts() {
        this.timeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        this.timeouts = [];
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     * @private
     */
    showError(message) {
        console.error('Demo error:', message);
        // Simple alert for MVP - could be enhanced with better UI
        alert(`Demo Error: ${message}`);
    }

    /**
     * Check if demo is currently running
     * @returns {boolean} True if demo is running
     * @public
     */
    get isDemoRunning() {
        return this.isRunning;
    }

    /**
     * Reset demo button to initial state
     * @private
     */
    resetDemoButton() {
        const demoBtn = document.getElementById('demo-btn');
        if (demoBtn) {
            // Check if we're on Chinese page
            const isChinesePage = document.documentElement.lang === 'zh-CN';
            demoBtn.textContent = isChinesePage ? '演示' : 'Demo';
            demoBtn.className = 'btn-demo';
        }
    }

    /**
     * 备份并禁用triggerReminder方法（KIRO演示模式专用修复）
     * 防止演示期间提醒重复触发 - 每种提醒只触发一次
     * @private
     */
    backupAndDisableResetAndRestart() {
        // 备份原始方法
        this.originalWaterTriggerReminder = this.waterReminder.triggerReminder.bind(this.waterReminder);
        this.originalStandupTriggerReminder = this.standupReminder.triggerReminder.bind(this.standupReminder);
        
        // 创建单次触发版本
        let waterTriggered = false;
        let standupTriggered = false;
        
        this.waterReminder.triggerReminder = () => {
            if (!waterTriggered) {
                waterTriggered = true;
                console.log('🎬 Demo mode: Water reminder triggered once (demo mode)');
                
                // 只执行通知部分，不重启定时器
                const notificationConfig = NOTIFICATION_CONSTANTS.getMessage('WATER');
                this.waterReminder.notificationService.showNotification(
                    'water',
                    notificationConfig.TITLE,
                    notificationConfig.BODY,
                    'water_reminder_demo'
                );
            } else {
                console.log('🎬 Demo mode: Water reminder already triggered, ignoring repeat');
            }
        };
        
        this.standupReminder.triggerReminder = () => {
            if (!standupTriggered) {
                standupTriggered = true;
                console.log('🎬 Demo mode: Standup reminder triggered once (demo mode)');
                
                // 只执行通知部分，不重启定时器
                const notificationConfig = NOTIFICATION_CONSTANTS.getMessage('STANDUP');
                this.standupReminder.notificationService.showNotification(
                    'standup',
                    notificationConfig.TITLE,
                    notificationConfig.BODY,
                    'standup_reminder_demo'
                );
            } else {
                console.log('🎬 Demo mode: Standup reminder already triggered, ignoring repeat');
            }
        };
        
        console.log('💾 Original triggerReminder methods backed up and replaced with single-trigger versions');
    }

    /**
     * 恢复原始triggerReminder方法（KIRO演示模式专用修复）
     * 演示结束后完全恢复正常功能
     * @private
     */
    restoreResetAndRestart() {
        if (this.originalWaterTriggerReminder) {
            this.waterReminder.triggerReminder = this.originalWaterTriggerReminder;
            this.originalWaterTriggerReminder = null;
        }
        
        if (this.originalStandupTriggerReminder) {
            this.standupReminder.triggerReminder = this.originalStandupTriggerReminder;
            this.originalStandupTriggerReminder = null;
        }
        
        console.log('🔄 Original triggerReminder methods fully restored');
    }

    /**
     * Clean up demo controller resources
     * @public
     */
    destroy() {
        this.stopDemo();
        console.log('🎬 Demo Controller destroyed');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoController;
}

// Export for browser use
window.DemoController = DemoController;