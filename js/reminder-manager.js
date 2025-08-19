/**
 * Reminder Manager - Base class for reminder functionality
 * Handles timer management and error recovery
 * 
 * Architecture:
 * - Unified time handling (milliseconds internally, minutes in UI)
 * - Comprehensive error handling and recovery
 */
class ReminderManager {
    /**
     * Create reminder manager instance
     * @param {string} type - Reminder type ('water' or 'standup')
     * @param {Object} settings - Initial settings
     * @param {NotificationService} notificationService - Notification service
     */
    constructor(type, settings, notificationService) {
        if (!type || !['water', 'standup'].includes(type)) {
            throw new Error('Invalid reminder type');
        }

        this.type = type;
        this.settings = { ...settings };
        this.notificationService = notificationService;
        
        // Timer management - single timer approach
        this.timerId = null;
        this.tickInterval = REMINDER_CONSTANTS.UPDATE_INTERVAL_MS; // 1 second tick frequency
        
        // Time tracking (all in milliseconds)
        this.startTime = null;
        this.nextReminderTime = null;
        this.timeRemaining = 0;
        this.isActive = false;
        
        // Initialize with default state
        this.initializeDefaults();
        
        console.log(`${type} reminder manager created`);
    }

    /**
     * Initialize with default state
     * @public
     */
    initializeDefaults() {
        this.isActive = false;
        this.timeRemaining = this.settings.interval * 60 * 1000;
        this.nextReminderTime = 0;
    }

    /**
     * Get remaining time in milliseconds
     * @returns {number} Time remaining in milliseconds
     */
    getTimeRemaining() {
        return Math.max(0, this.timeRemaining);
    }

    /**
     * Get interval in minutes
     * @returns {number} Interval in minutes
     */
    get interval() {
        return this.settings.interval || REMINDER_CONSTANTS.DEFAULT_INTERVAL_MINUTES;
    }

    /**
     * Start reminder timer
     */
    start() {
        if (!this.settings.enabled) {
            console.warn(`${this.type} reminder not started - disabled in settings`);
            return false;
        }
        
        try {
            const intervalMs = this.settings.interval * 60 * 1000;
            this.startTime = Date.now();
            this.nextReminderTime = this.startTime + intervalMs;
            this.timeRemaining = intervalMs;
            this.isActive = true;
            
            this.startTimer();
            
            console.log(`${this.type} reminder started:`, {
                interval: this.settings.interval,
                timeRemaining: this.timeRemaining,
                nextReminderTime: this.nextReminderTime
            });
            
            return true;
            
        } catch (error) {
            console.error(`Failed to start ${this.type} reminder:`, error);
            return false;
        }
    }

    /**
     * Stop reminder timer
     */
    stop() {
        try {
            this.clearTimer();
            
            this.isActive = false;
            this.resetState();
            
            console.log(`${this.type} reminder stopped`);
            return true;
            
        } catch (error) {
            console.error(`Failed to stop ${this.type} reminder:`, error);
            return false;
        }
    }

    /**
     * Start unified timer (ticks every second)
     * @private
     */
    startTimer() {
        if (!this.isActive || this.timerId) return;
        
        this.timerId = setInterval(() => {
            if (!this.isActive) {
                this.clearTimer();
                return;
            }
            
            this.tick();
        }, this.tickInterval);
    }

    /**
     * Timer tick - updates time and checks for trigger
     * @private
     */
    tick() {
        if (!this.isActive || !this.startTime) {
            this.timeRemaining = 0;
            return;
        }
        
        const now = Date.now();
        this.timeRemaining = Math.max(0, this.nextReminderTime - now);
        
        // Check if time is up
        if (this.timeRemaining <= 0) {
            this.triggerReminder();
        }
    }

    /**
     * Clear timer (unified cleanup)
     * @private
     */
    clearTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    /**
     * Trigger reminder
     * @private
     */
    triggerReminder() {
        if (!this.isActive) return;
        
        const notificationConfig = this.type === 'water' 
            ? NOTIFICATION_CONSTANTS.MESSAGES.WATER 
            : NOTIFICATION_CONSTANTS.MESSAGES.STANDUP;
        
        const title = notificationConfig.TITLE;
        const message = notificationConfig.BODY;
        
        // Show notification
        this.notificationService.showNotification(
            this.type,
            title,
            message
        );
        
        // Auto-restart immediately
        this.resetAndRestart();
        
        console.log(`${this.type} reminder triggered and restarted`);
    }

    /**
     * Acknowledge reminder
     */
    acknowledge() {
        if (!this.isActive) return;
        
        this.resetAndRestart();
        console.log(`${this.type} reminder acknowledged`);
    }



    /**
     * Reset and restart timer
     * @private
     */
    resetAndRestart() {
        if (!this.isActive) return;
        
        const intervalMs = this.settings.interval * 60 * 1000;
        this.startTime = Date.now();
        this.nextReminderTime = this.startTime + intervalMs;
        this.timeRemaining = intervalMs;
        
        this.clearTimer();
        this.startTimer();
    }

    /**
     * Reset internal state
     * @private
     */
    resetState() {
        this.startTime = null;
        this.nextReminderTime = null;
        this.timeRemaining = 0;
    }



    /**
     * Get current status
     * @returns {Object} Current reminder status
     */
    getStatus() {
        return {
            type: this.type,
            isActive: this.isActive,
            timeRemaining: this.timeRemaining,
            nextReminderAt: this.nextReminderTime,
            interval: this.settings.interval,
            enabled: this.settings.enabled
        };
    }



    /**
     * Destroy reminder manager with cleanup
     */
    destroy() {
        try {
            this.stop();
            
            console.log(`${this.type} reminder manager destroyed with cleanup`);
            
        } catch (error) {
            console.error(`Error during ${this.type} reminder cleanup:`, error);
        }
    }
}

// Export for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReminderManager;
}

// Export for browser use
window.ReminderManager = ReminderManager;