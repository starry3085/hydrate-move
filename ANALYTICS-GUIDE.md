# Analytics Guide

## Overview
This application uses Baidu Analytics (百度统计) for minimal user engagement tracking. Only two core events are tracked:
- Water reminder completion (`water_done`)
- Standup reminder completion (`standup_done`)

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

### Functionality Tests
- [ ] Water reminder triggers after 30 minutes
- [ ] Standup reminder triggers after 30 minutes
- [ ] Notification modal appears with correct content
- [ ] "Done" button closes modal and tracks event
- [ ] "Remind Later" button snoozes reminder
- [ ] Browser console shows analytics tracking logs
- [ ] No JavaScript errors in console

### Analytics Tests
- [ ] `Analytics` class loads without errors
- [ ] `trackWaterCompleted()` logs to console
- [ ] `trackStandupCompleted()` logs to console
- [ ] Baidu Analytics `_hmt` array receives events
- [ ] Events appear in Baidu Analytics dashboard (24-48h delay)

### Verify Setup
1. Deploy the updated code to GitHub Pages
2. Visit your website and trigger some reminders
3. Click "Done" on reminder notifications
4. Check Baidu Analytics dashboard for event data (may take 24-48 hours to appear)

## 📊 What Gets Tracked

### Core Events
- **water_done**: User clicked "Done" on water reminder notification
- **standup_done**: User clicked "Done" on standup reminder notification

### Event Parameters
- Category: `engagement`
- Action: `water_done` or `standup_done`
- Label: (empty)
- Value: `1`

### Event Structure
```javascript
// Water reminder completion
_hmt.push(['_trackEvent', 'engagement', 'water_done', '', 1]);

// Standup reminder completion  
_hmt.push(['_trackEvent', 'engagement', 'standup_done', '', 1]);
```

### Success Metrics
- **Completion Rate**: % of triggered reminders that get "Done" clicks
- **Feature Usage**: Which reminder type is used more
- **User Engagement**: How often users interact with reminders

## 🔧 Code Structure

### Files Modified
- `index.html`: Added Baidu Analytics tracking script
- `js/analytics.js`: Analytics wrapper class
- `js/app.js`: Analytics initialization
- `js/notification-service.js`: Event tracking on Done button clicks

### Key Functions
- `Analytics.trackWaterCompleted()`: Tracks water reminder completion
- `Analytics.trackStandupCompleted()`: Tracks standup reminder completion

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

// Manually trigger tracking
window.app?.analytics?.trackWaterCompleted();
window.app?.analytics?.trackStandupCompleted();

// Check Baidu Analytics
console.log(_hmt);

// Disable analytics
if (window.app && window.app.analytics) {
    window.app.analytics.setEnabled(false);
}
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
- Are users actually using the reminder features?
- Which reminder type is more popular?
- Should we adjust the default 30-minute interval?
- Is the PWA functionality worth developing further?

This minimal analytics approach follows the "极简且合规" principle - collecting only essential data for product improvement while respecting user privacy.