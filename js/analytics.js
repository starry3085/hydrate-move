/**
 * Analytics Module - Minimal analytics tracking for core user actions
 * Tracks only essential user engagement events for product optimization
 */
class Analytics {
    constructor() {
        this.isEnabled = true;
        this.baiduAnalyticsReady = false;
        this.checkAttempts = 0;
        this.maxCheckAttempts = 10; // 增加重试次数
        this.warningShown = false; // 避免重复警告
        
        // 延迟初始化，给百度统计脚本更多加载时间
        setTimeout(() => {
            this.initializeBaiduAnalytics();
        }, 1000);
    }

    /**
     * Initialize Baidu Analytics with retry mechanism
     * @private
     */
    initializeBaiduAnalytics() {
        this.checkBaiduAnalytics();
        
        // If not ready, retry with longer intervals
        if (!this.baiduAnalyticsReady && this.checkAttempts < this.maxCheckAttempts) {
            const delay = Math.min(1000 + (this.checkAttempts * 1000), 5000); // 1s, 2s, 3s...最多5s
            setTimeout(() => {
                this.checkAttempts++;
                this.initializeBaiduAnalytics();
            }, delay);
        }
    }

    /**
     * Check if Baidu Analytics is available
     * @private
     */
    checkBaiduAnalytics() {
        // Check if _hmt array exists (Baidu Analytics)
        if (typeof _hmt !== 'undefined' && Array.isArray(_hmt)) {
            this.baiduAnalyticsReady = true;
            console.log('✅ Baidu Analytics ready');
            return;
        }
        
        // 只在最后一次尝试时显示警告
        if (this.checkAttempts >= this.maxCheckAttempts && !this.warningShown) {
            this.warningShown = true;
            console.warn('⚠️ Baidu Analytics unavailable (may be blocked by ad blocker), events will be logged locally only');
        }
    }

    /**
     * Track water reminder completion
     * Core metric: User actually completed water reminder action
     */
    trackWaterCompleted() {
        if (!this.isEnabled) return;
        
        try {
            console.log('📊 Analytics: Water reminder completed');
            
            if (this.baiduAnalyticsReady) {
                _hmt.push(['_trackEvent', 'engagement', 'water_done', '', 1]);
            }
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    /**
     * Track standup reminder completion  
     * Core metric: User actually completed standup reminder action
     */
    trackStandupCompleted() {
        if (!this.isEnabled) return;
        
        try {
            console.log('📊 Analytics: Standup reminder completed');
            
            if (this.baiduAnalyticsReady) {
                _hmt.push(['_trackEvent', 'engagement', 'standup_done', '', 1]);
            }
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    /**
     * Track notification shown to user
     * Core metric: Track when notifications are actually displayed
     * @param {string} type - Notification type ('water' | 'standup')
     * @param {string} source - Source of notification ('water_reminder' | 'standup_reminder' | 'afternoon_tea' | 'lunch_reminder')
     * @param {string} language - Current language ('zh-CN' | 'en')
     */
    trackNotificationShown(type, source, language) {
        if (!this.isEnabled) return;
        
        try {
            console.log(`📊 Analytics: Notification shown - ${type} from ${source} (${language})`);
            
            if (this.baiduAnalyticsReady) {
                _hmt.push(['_trackEvent', 'notification', 'shown', `${type}_${source}_${language}`, 1]);
            }
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    /**
     * Track notification dismissed by user or auto-hide
     * Core metric: Track how notifications are dismissed
     * @param {string} type - Notification type ('water' | 'standup')
     * @param {string} dismissType - How dismissed ('manual_close' | 'auto_dismiss')
     */
    trackNotificationDismissed(type, dismissType) {
        if (!this.isEnabled) return;
        
        try {
            console.log(`📊 Analytics: Notification dismissed - ${type} via ${dismissType}`);
            
            if (this.baiduAnalyticsReady) {
                _hmt.push(['_trackEvent', 'notification', 'dismissed', `${type}_${dismissType}`, 1]);
            }
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    /**
     * Track easter egg triggered
     * Core metric: Track when easter eggs are triggered in business logic
     * @param {string} type - Easter egg type ('afternoon_tea' | 'lunch_reminder')
     * @param {string} language - Current language ('zh-CN' | 'en')
     */
    trackEasterEggTriggered(type, language) {
        if (!this.isEnabled) return;
        
        try {
            console.log(`📊 Analytics: Easter egg triggered - ${type} (${language})`);
            
            if (this.baiduAnalyticsReady) {
                _hmt.push(['_trackEvent', 'easter_egg', 'triggered', `${type}_${language}`, 1]);
            }
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    /**
     * Enable/disable analytics tracking
     * @param {boolean} enabled - Whether to enable tracking
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log(`Analytics tracking ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Check if analytics is enabled
     * @returns {boolean} Whether analytics is enabled
     */
    isAnalyticsEnabled() {
        return this.isEnabled;
    }

    /**
     * Manual testing method - trigger sample events for validation
     * @public
     */
    testTracking() {
        console.log('🧪 Testing K2 analytics tracking...');
        this.trackNotificationShown('water', 'water_reminder', 'en');
        this.trackNotificationDismissed('water', 'manual_close');
        this.trackEasterEggTriggered('afternoon_tea', 'zh-CN');
        console.log('🧪 Test events sent');
    }
}

// Create global analytics instance
window.Analytics = Analytics;

// Global test function for manual verification
window.testAnalytics = function() {
    if (window.app && window.app.analytics) {
        window.app.analytics.testTracking();
    } else {
        console.warn('Analytics not initialized yet');
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}