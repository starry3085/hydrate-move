# Analytics Guide

## Overview
This application uses Baidu Analytics (百度统计) for comprehensive user engagement tracking following K2 MVP principles. The system tracks:
- Water reminder completion (`water_done`)
- Standup reminder completion (`standup_done`)
- **NEW** Notification display events (`notification.shown`)
- **NEW** Notification dismissal behavior (`notification.dismissed`) 
- **NEW** Easter egg trigger events (`easter_egg.triggered`)

## 🎯 K2 Implementation Features

### Enhanced Tracking Events

#### 1. Notification Display Tracking
**Purpose**: Track when notifications are actually shown to users
**Event**: `notification.shown`
**Parameters**: `{type}_{source}_{language}`

**Examples**:
- `water_water_reminder_en` - English water reminder displayed
- `water_afternoon_tea_zh-CN` - Chinese afternoon tea easter egg displayed
- `standup_standup_reminder_zh-CN` - Chinese standup reminder displayed
- `water_lunch_reminder_zh-CN` - Chinese lunch easter egg displayed

#### 2. Notification Dismissal Tracking
**Purpose**: Track how users dismiss notifications
**Event**: `notification.dismissed`
**Parameters**: `{type}_{dismissType}`

**Examples**:
- `water_manual_close` - User clicked X button
- `water_auto_dismiss` - Notification auto-disappeared after 5 seconds
- `standup_manual_close` - User manually closed standup notification

#### 3. Easter Egg Trigger Tracking
**Purpose**: Track when easter eggs are triggered in business logic
**Event**: `easter_egg.triggered`
**Parameters**: `{type}_{language}`

**Examples**:
- `afternoon_tea_zh-CN` - Chinese afternoon tea triggered at 15:15
- `afternoon_tea_en` - English coffee break triggered at 15:15
- `lunch_reminder_zh-CN` - Chinese lunch reminder triggered at 12:00

### Business Value Analysis
**Trigger vs Display Rate**: Compare easter egg triggers vs actual notification displays
**User Engagement**: Measure manual close vs auto-dismiss ratios  
**Feature Discovery**: Track easter egg usage across language versions
**Language Preferences**: Analyze usage patterns between Chinese and English versions

## 🔧 Configuration

### 1. Get Baidu Analytics ID
1. Visit [Baidu Analytics](https://tongji.baidu.com/)
2. Register/login with your Baidu account
3. Add your website domain: `https://starry3085.github.io/hydrate-move/`
4. Get your tracking ID (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 2. Configure Tracking ID
1. Open `index.html`
2. Find the Baidu Analytics script section:
```html
<!-- Baidu Analytics -->
<script>
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?YOUR_BAIDU_ANALYTICS_ID";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
</script>
```
3. Replace `YOUR_BAIDU_ANALYTICS_ID` with your actual tracking ID

## 🚀 Deployment

### Pre-Deployment Checklist

#### ✅ Code Implementation
- [x] Added Baidu Analytics script to `index.html`
- [x] Created `js/analytics.js` with tracking functions
- [x] Modified `js/app.js` to initialize analytics
- [x] Updated `js/notification-service.js` to handle Done button clicks
- [x] Added notification modal CSS styles to `styles/main.css`
- [x] Updated HTML script loading to include Analytics class
- [x] All JavaScript files pass syntax validation

#### ⚠️ Configuration Required
- [ ] Replace `YOUR_BAIDU_ANALYTICS_ID` in `index.html` with actual tracking ID
- [ ] Test on local server before deployment
- [ ] Verify notification modal displays correctly
- [ ] Test Done button click tracking

### Deployment Steps

#### 1. Update Configuration
```bash
# Edit index.html
# Find: hm.src = "https://hm.baidu.com/hm.js?YOUR_BAIDU_ANALYTICS_ID";
# Replace YOUR_BAIDU_ANALYTICS_ID with your actual ID
```

#### 2. Test Locally
```bash
# Start local server
npx http-server . -p 8080

# Visit http://localhost:8080
# Test reminder notifications
# Click "Done" buttons
# Check browser console for analytics logs
```

#### 3. Deploy to GitHub Pages
```bash
git add .
git commit -m "Add Baidu Analytics tracking for reminder completions"
git push origin main
```

#### 4. Verify Deployment
- [ ] Visit deployed site
- [ ] Trigger water reminder and click "Done"
- [ ] Trigger standup reminder and click "Done"  
- [ ] Check browser console for analytics events
- [ ] Wait 24-48 hours for data in Baidu Analytics dashboard

## 🧪 Testing

### K2 Testing Methods

#### Browser Console Testing
```javascript
// Test all K2 tracking events
window.testAnalytics();

// Test easter egg triggers manually
if (window.app.afternoonTeaReminder) {
    window.app.afternoonTeaReminder.manualTrigger();
}

if (window.app.lunchReminder) {
    window.app.lunchReminder.manualTrigger();
}

// Original completion tracking tests
window.app?.analytics?.trackWaterCompleted();
window.app?.analytics?.trackStandupCompleted();

// Direct K2 event testing
window.app?.analytics?.trackNotificationShown('water', 'water_reminder', 'en');
window.app?.analytics?.trackNotificationDismissed('water', 'manual_close');
window.app?.analytics?.trackEasterEggTriggered('afternoon_tea', 'zh-CN');
```

### Functionality Tests
- [ ] Water reminder triggers after 30 minutes
- [ ] Standup reminder triggers after 30 minutes
- [ ] Notification modal appears with correct content
- [ ] "Done" button closes modal and tracks event
- [ ] **NEW** Notification display automatically tracked
- [ ] **NEW** Manual close button tracks dismissal
- [ ] **NEW** Auto-dismiss after 5 seconds tracks dismissal
- [ ] **NEW** Easter eggs trigger at correct times (15:15, 12:00)
- [ ] **NEW** Easter egg triggers tracked separately from displays
- [ ] Browser console shows analytics tracking logs
- [ ] No JavaScript errors in console

### Analytics Tests
- [ ] `Analytics` class loads without errors
- [ ] Original tracking methods work: `trackWaterCompleted()`, `trackStandupCompleted()`
- [ ] **NEW** `trackNotificationShown()` logs correct parameters
- [ ] **NEW** `trackNotificationDismissed()` logs correct dismissal types
- [ ] **NEW** `trackEasterEggTriggered()` logs correct easter egg types
- [ ] **NEW** `testTracking()` method executes all test events
- [ ] Baidu Analytics `_hmt` array receives all event types
- [ ] Events appear in Baidu Analytics dashboard (24-48h delay)

### K2 Validation Checklist

#### Event Coverage Validation
- [ ] Normal water reminder: Shows as `water_water_reminder_{lang}` in display tracking
- [ ] Normal standup reminder: Shows as `standup_standup_reminder_{lang}` in display tracking
- [ ] Afternoon tea easter egg: Shows both trigger and display events
- [ ] Lunch reminder easter egg: Shows both trigger and display events
- [ ] Manual close: Shows as `{type}_manual_close` in dismissal tracking
- [ ] Auto-dismiss: Shows as `{type}_auto_dismiss` in dismissal tracking

#### Source Tracking Validation
- [ ] Water reminders have source `water_reminder`
- [ ] Standup reminders have source `standup_reminder`
- [ ] Afternoon tea has source `afternoon_tea`
- [ ] Lunch reminder has source `lunch_reminder`

#### Language Tracking Validation
- [ ] English version (/) shows language as `en`
- [ ] Chinese version (/zh/) shows language as `zh-CN`

### Verify Setup
1. Deploy the updated code to GitHub Pages
2. Visit your website and trigger some reminders
3. Click "Done" on reminder notifications
4. Check Baidu Analytics dashboard for event data (may take 24-48 hours to appear)

## 📊 What Gets Tracked

### Core Engagement Events
- **water_done**: User clicked "Done" on water reminder notification
- **standup_done**: User clicked "Done" on standup reminder notification

### K2 Enhanced Events

#### Notification Display Events
- **notification.shown**: Tracks when notifications are displayed
  - Category: `notification`
  - Action: `shown`
  - Label: `{type}_{source}_{language}`
  - Value: `1`

#### Notification Dismissal Events
- **notification.dismissed**: Tracks how notifications are dismissed
  - Category: `notification`
  - Action: `dismissed`
  - Label: `{type}_{dismissType}`
  - Value: `1`

#### Easter Egg Events
- **easter_egg.triggered**: Tracks when easter eggs are triggered
  - Category: `easter_egg`
  - Action: `triggered`
  - Label: `{type}_{language}`
  - Value: `1`

### Event Structure Examples
```javascript
// Water reminder completion (original)
_hmt.push(['_trackEvent', 'engagement', 'water_done', '', 1]);

// Notification display (K2 new)
_hmt.push(['_trackEvent', 'notification', 'shown', 'water_afternoon_tea_zh-CN', 1]);

// Notification dismissal (K2 new)
_hmt.push(['_trackEvent', 'notification', 'dismissed', 'water_manual_close', 1]);

// Easter egg trigger (K2 new)
_hmt.push(['_trackEvent', 'easter_egg', 'triggered', 'afternoon_tea_zh-CN', 1]);
```

### Success Metrics
- **Completion Rate**: % of triggered reminders that get "Done" clicks
- **Display Success Rate**: % of triggers that result in actual notification display
- **User Response Rate**: Manual close vs auto-dismiss ratios
- **Easter Egg Discovery**: How often users discover hidden features
- **Language Preference**: Usage patterns between Chinese and English versions
- **Feature Usage**: Which reminder type and easter eggs are used more

## 🔧 Code Structure

### Files Modified for K2 Implementation
- `js/analytics.js`: **Enhanced** - Added 3 new tracking methods
- `js/notification-service.js`: **Enhanced** - Added display and dismissal tracking
- `js/reminder-manager.js`: **Enhanced** - Added source parameter for tracking
- `js/afternoon-tea-reminder.js`: **Enhanced** - Added easter egg trigger tracking
- `js/lunch-reminder.js`: **Enhanced** - Added easter egg trigger tracking
- `index.html`: Baidu Analytics tracking script (unchanged)
- `js/app.js`: Analytics initialization (unchanged)

### Key Functions

#### Original Functions (Unchanged)
- `Analytics.trackWaterCompleted()`: Tracks water reminder completion
- `Analytics.trackStandupCompleted()`: Tracks standup reminder completion

#### K2 New Functions
- `Analytics.trackNotificationShown(type, source, language)`: Tracks when notifications are displayed
- `Analytics.trackNotificationDismissed(type, dismissType)`: Tracks how notifications are dismissed
- `Analytics.trackEasterEggTriggered(type, language)`: Tracks easter egg business logic triggers
- `Analytics.testTracking()`: Manual testing method for validation

#### Integration Points
- **NotificationService.showNotification()**: Now accepts optional `source` parameter and tracks display
- **NotificationService.showInPageAlert()**: Enhanced with dismissal tracking
- **AfternoonTeaReminder.triggerAfternoonTea()**: Added easter egg trigger tracking
- **LunchReminder.triggerLunchReminder()**: Added easter egg trigger tracking
- **ReminderManager.triggerReminder()**: Enhanced with source parameter passing

### Zero Functional Impact
✅ All existing functionality remains unchanged  
✅ No user experience modifications  
✅ No visual or behavioral changes  
✅ Backward compatible with existing API calls  
✅ Graceful degradation when analytics unavailable

## 🛠️ Troubleshooting

### Common Issues
1. **Analytics not loading**: Check tracking ID format
2. **Events not tracking**: Verify Done button event handlers
3. **Modal not showing**: Check CSS styles and JavaScript errors
4. **Data not in dashboard**: Wait 24-48 hours, check domain configuration

### Analytics Not Working
1. Check browser console for errors
2. Verify tracking ID is correct
3. Ensure website is deployed and accessible
4. Wait 24-48 hours for data to appear in Baidu Analytics

### Debug Commands
```javascript
// Check analytics status
console.log(window.app?.analytics?.isAnalyticsEnabled());

// Original completion tracking (unchanged)
window.app?.analytics?.trackWaterCompleted();
window.app?.analytics?.trackStandupCompleted();

// K2 New: Test all tracking methods
window.testAnalytics();

// K2 New: Test specific tracking methods
window.app?.analytics?.trackNotificationShown('water', 'water_reminder', 'en');
window.app?.analytics?.trackNotificationDismissed('standup', 'auto_dismiss');
window.app?.analytics?.trackEasterEggTriggered('afternoon_tea', 'zh-CN');

// K2 New: Test easter egg manual triggers
if (window.app.afternoonTeaReminder?.enabled) {
    window.app.afternoonTeaReminder.manualTrigger();
}
if (window.app.lunchReminder?.enabled) {
    window.app.lunchReminder.manualTrigger();
}

// Check Baidu Analytics array
console.log(_hmt);

// Disable analytics
if (window.app && window.app.analytics) {
    window.app.analytics.setEnabled(false);
}

// Enable analytics
if (window.app && window.app.analytics) {
    window.app.analytics.setEnabled(true);
}

// Check current language detection
console.log('Current language:', document.documentElement.lang || 'en');

// Debug easter egg status
console.log('Afternoon tea enabled:', window.app?.afternoonTeaReminder?.enabled);
console.log('Lunch reminder enabled:', window.app?.lunchReminder?.enabled);
```

## 🔒 Privacy

### Privacy Compliance
- ✅ No personal data collected
- ✅ Anonymous usage statistics only
- ✅ User can disable tracking via console
- ✅ Transparent about data collection in documentation

### Privacy Policy
- No personal information is collected
- No user identification or tracking across sessions
- Only anonymous usage statistics for product improvement

## 📈 Data Usage
The collected data helps answer:

### Original Questions (Unchanged)
- Are users actually using the reminder features?
- Which reminder type is more popular?
- Should we adjust the default 30-minute interval?
- Is the PWA functionality worth developing further?

### K2 Enhanced Insights
- **Display vs Trigger Success Rate**: How often business logic triggers result in actual user-visible notifications?
- **User Engagement Patterns**: Do users prefer to manually dismiss or let notifications auto-disappear?
- **Easter Egg Discovery Rate**: How many users discover the hidden afternoon tea and lunch features?
- **Language-Based Usage Patterns**: Are there behavioral differences between Chinese and English users?
- **Feature Effectiveness**: Which notification sources (regular reminders vs easter eggs) have higher completion rates?
- **Optimal Timing**: Are the fixed easter egg times (15:15, 12:00) effective for user engagement?
- **Cross-Version Feature Adoption**: Does the English coffee break feature get similar usage to the Chinese afternoon tea?

### Business Value Metrics
- **Feature ROI**: Cost-benefit analysis of maintaining easter egg features
- **User Retention Indicators**: Do users who discover easter eggs show different engagement patterns?
- **Localization Effectiveness**: Should more features be language-specific?
- **Notification Strategy Optimization**: Should we adjust auto-dismiss timing based on manual close rates?

This enhanced analytics approach maintains the "极简且合规" principle while providing deeper insights into user behavior patterns and feature effectiveness.