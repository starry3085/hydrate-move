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
}

// Create global analytics instance
window.Analytics = Analytics;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}