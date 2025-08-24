/**
 * Easter Egg UI Controller
 * 彩蛋UI控制器
 * 
 * 负责管理彩蛋弹窗的显示、隐藏和交互
 * - 无Canvas依赖，确保兼容性
 * - 响应式设计，支持移动端
 * - 动画效果（bounceIn等）
 * - 事件处理和交互逻辑
 */
class EasterEggUI {
    /**
     * 创建彩蛋UI控制器实例
     * @param {AfternoonTeaEasterEgg} easterEggManager - 彩蛋管理器实例
     */
    constructor(easterEggManager) {
        this.easterEggManager = easterEggManager;
        this.config = AFTERNOON_TEA_EASTER_EGG_CONSTANTS;
        
        // DOM元素引用
        this.modal = null;
        this.backdrop = null;
        
        // 状态管理
        this.isVisible = false;
        this.isAnimating = false;
        
        console.log('🎉 彩蛋UI控制器已创建');
    }
    
    /**
     * 显示第一层彩蛋弹窗
     * @public
     */
    showFirstEasterEgg() {
        try {
            if (this.isVisible || this.isAnimating) {
                console.log('🎉 彩蛋弹窗已显示或正在动画中，跳过');
                return;
            }
            
            console.log('🎉 开始显示第一层彩蛋弹窗');
            
            // 检查配置是否可用
            if (!this.config || !this.config.MESSAGES || !this.config.MESSAGES.FIRST_EASTER_EGG) {
                console.error('🎉 配置不可用:', this.config);
                return;
            }
            
            // 创建弹窗
            this.createEasterEggModal();
            
            // 显示弹窗
            this.showModal();
            
        } catch (error) {
            console.error('🎉 显示第一层彩蛋时出错:', error);
        }
    }
    
    /**
     * 创建彩蛋弹窗DOM结构
     * @private
     */
    createEasterEggModal() {
        console.log('🎉 开始创建彩蛋弹窗DOM...');
        
        // 清理现有弹窗
        this.cleanup();
        
        // 创建背景遮罩
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'easter-egg-backdrop';
        this.backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2147483646;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        `;
        
        // 创建主弹窗
        this.modal = document.createElement('div');
        this.modal.className = 'easter-egg-modal';
        this.modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 480px;
            max-width: 90vw;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 2147483647;
            isolation: isolate;
            padding: 24px;
            opacity: 0;
            transition: all 0.3s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        // 创建弹窗内容
        const content = this.getModalContent();
        console.log('🎉 弹窗内容长度:', content.length);
        this.modal.innerHTML = content;
        
        // 添加到页面
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.modal);
        
        console.log('🎉 弹窗DOM元素已添加到页面');
        console.log('🎉 Backdrop元素:', this.backdrop);
        console.log('🎉 Modal元素:', this.modal);
        
        // 绑定事件
        this.bindEvents();
        
        console.log('🎉 彩蛋弹窗DOM已创建');
    }
    
    /**
     * 获取弹窗内容HTML
     * @returns {string} HTML内容
     * @private
     */
    getModalContent() {
        let messages;
        
        // 安全获取配置信息
        try {
            messages = this.config.MESSAGES.FIRST_EASTER_EGG;
            if (!messages) {
                throw new Error('配置中缺少 FIRST_EASTER_EGG 消息');
            }
        } catch (error) {
            console.warn('🎉 使用默认配置:', error);
            // 使用默认配置
            messages = {
                TITLE: '🎉 恭喜成功解锁下午茶提醒彩蛋！',
                SUBTITLE: '三点几啦！饮茶先啦！',
                DESCRIPTION: '把这个贴心小工具分享给朋友们吧~',
                SHARE_BUTTONS: {
                    WECHAT: '保存分享到朋友圈/微信',
                    XIAOHONGSHU: '生成笔记发到小红书'
                }
            };
        }
        
        const content = `
            <div class="modal-header">
                <button class="close-button" aria-label="关闭" title="关闭">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-title">${messages.TITLE}</div>
                <div class="modal-subtitle">${messages.SUBTITLE}</div>
            </div>
            
            <div class="modal-content">
                <div class="congratulations-text">
                    ${messages.DESCRIPTION}
                </div>
                
                <div class="share-image-container">
                    <img src="assets/afternoon_tea_share.png" alt="下午茶分享图片" class="share-image" 
                         onerror="this.style.display='none'; this.nextElementSibling.innerHTML='⚠️ 分享图片暂时不可用，请直接点击下方按钮分享'">
                    <div class="share-tip">
                        💡 长按图片保存，或点击下方按钮分享
                    </div>
                </div>
                
                <div class="share-buttons" role="group" aria-label="分享选项">
                    <button class="share-button share-wechat" 
                            data-share-type="wechat" 
                            aria-label="分享到微信朋友圈">
                        <span class="share-icon">📱</span>
                        <span class="share-text">${messages.SHARE_BUTTONS.WECHAT}</span>
                    </button>
                    <button class="share-button share-xiaohongshu" 
                            data-share-type="xiaohongshu" 
                            aria-label="分享到小红书">
                        <span class="share-icon">📝</span>
                        <span class="share-text">${messages.SHARE_BUTTONS.XIAOHONGSHU}</span>
                    </button>
                </div>
            </div>
        `;
        
        console.log('🎉 弹窗内容已生成，长度:', content.length);
        return content;
    }
    
    /**
     * 绑定事件监听器
     * @private
     */
    bindEvents() {
        // 关闭按钮
        const closeButton = this.modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hideModal());
        }
        
        // 背景点击关闭
        this.backdrop.addEventListener('click', () => this.hideModal());
        
        // 分享按钮 - 使用事件委托处理嵌套元素
        const shareButtons = this.modal.querySelectorAll('.share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const shareType = e.target.closest('.share-button')?.getAttribute('data-share-type');
                if (shareType) {
                    this.handleShareClick(shareType);
                }
            });
        });
        
        // ESC键关闭
        this.escapeKeyHandler = (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideModal();
            }
        };
        document.addEventListener('keydown', this.escapeKeyHandler);
        
        console.log('🎉 事件监听器已绑定');
    }
    
    /**
     * 显示弹窗
     * @private
     */
    showModal() {
        if (this.isAnimating) {
            console.warn('🎉 弹窗正在动画中，跳过显示');
            return;
        }
        
        console.log('🎉 开始显示弹窗动画...');
        
        this.isAnimating = true;
        this.isVisible = true;
        
        // 防止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 使用bounceIn动画显示
        requestAnimationFrame(() => {
            console.log('🎉 执行弹窗显示动画...');
            
            if (this.backdrop) {
                this.backdrop.style.opacity = '1';
                console.log('🎉 Backdrop 透明度已设置为 1');
            }
            
            if (this.modal) {
                this.modal.classList.add('bounceIn');
                this.modal.style.opacity = '1';
                this.modal.style.transform = 'translate(-50%, -50%) scale(1)';
                console.log('🎉 Modal 显示属性已设置');
                console.log('🎉 Modal 元素在页面中:', document.body.contains(this.modal));
            }
        });
        
        // 动画完成后重置状态
        setTimeout(() => {
            this.isAnimating = false;
            // 移除动画类，防止重复触发
            if (this.modal) {
                this.modal.classList.remove('bounceIn');
            }
            console.log('🎉 弹窗动画完成');
        }, 750); // bounceIn动画时长为0.75秒
        
        console.log('🎉 彩蛋弹窗已显示（bounceIn动画）');
    }
    
    /**
     * 隐藏弹窗
     * @private
     */
    hideModal() {
        if (this.isAnimating || !this.isVisible) return;
        
        this.isAnimating = true;
        this.isVisible = false;
        
        // 动画隐藏
        this.backdrop.style.opacity = '0';
        this.modal.style.opacity = '0';
        this.modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        // 动画完成后清理
        setTimeout(() => {
            this.cleanup();
            this.isAnimating = false;
            
            // 恢复页面滚动
            document.body.style.overflow = '';
        }, 300);
        
        console.log('🎉 彩蛋弹窗已隐藏');
    }
    
    /**
     * 处理分享按钮点击
     * @param {string} shareType - 分享类型
     * @private
     */
    handleShareClick(shareType) {
        console.log(`🎉 UI: 分享按钮点击 - ${shareType}`);
        
        // 获取被点击的按钮元素
        const clickedButton = this.modal.querySelector(`[data-share-type="${shareType}"]`);
        if (clickedButton) {
            // 添加加载状态
            this.setButtonLoadingState(clickedButton, true);
        }
        
        // 生成分享内容
        const shareContent = this.generateShareContent(shareType);
        if (!shareContent) {
            console.error('生成分享内容失败');
            return;
        }
        
        // 根据分享类型处理
        let successMessage;
        if (shareType === 'wechat') {
            successMessage = '微信分享文案已复制！请长按图片保存到相册';
        } else if (shareType === 'xiaohongshu') {
            successMessage = '小红书文案已复制！请长按图片保存到相册';
        } else {
            successMessage = '分享内容已复制到剪贴板！';
        }
        
        // 执行复制操作
        this.copyToClipboard(shareContent, successMessage);
        
        // 调用主控制器的分享处理（如果需要）
        if (this.easterEggManager) {
            this.easterEggManager.handleShareClick(shareType);
        }
        
        // 延迟关闭弹窗，让用户看到分享操作
        setTimeout(() => {
            if (clickedButton) {
                this.setButtonLoadingState(clickedButton, false);
            }
            this.hideModal();
        }, 1500);
    }
    
    /**
     * 设置按钮加载状态
     * @param {HTMLElement} button - 按钮元素
     * @param {boolean} isLoading - 是否加载中
     * @private
     */
    setButtonLoadingState(button, isLoading) {
        if (!button) return;
        
        const shareText = button.querySelector('.share-text');
        const shareIcon = button.querySelector('.share-icon');
        
        if (isLoading) {
            button.disabled = true;
            button.style.opacity = '0.7';
            if (shareText) {
                shareText.textContent = '处理中...';
            }
            if (shareIcon) {
                shareIcon.textContent = '⏳'; // 沙漏图标
            }
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            // 显示成功状态
            if (shareText) {
                shareText.textContent = '已复制';
            }
            if (shareIcon) {
                shareIcon.textContent = '✓'; // 对勾图标
            }
        }
    }
    
    /**
     * 显示第二层彩蛋解锁提示
     * @public
     */
    showSecondEasterEggUnlock() {
        if (this.isVisible) {
            // 如果第一层弹窗还在显示，先关闭
            this.hideModal();
        }
        
        // 延迟显示解锁提示
        setTimeout(() => {
            this.showUnlockNotification();
        }, 500);
    }
    
    /**
     * 显示解锁通知
     * @private
     */
    showUnlockNotification() {
        const messages = this.config.MESSAGES.SECOND_EASTER_EGG_UNLOCK;
        
        // 创建通知弹窗
        const notification = document.createElement('div');
        notification.className = 'easter-egg-unlock-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            max-width: calc(100vw - 40px);
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            z-index: 2147483647;
            padding: 16px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 8px;">
                ${messages.TITLE}
            </div>
            <div style="font-size: 14px; color: #666; line-height: 1.4;">
                ${messages.MESSAGE}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 动画显示
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        console.log('🎊 第二层彩蛋解锁通知已显示');
    }
    
    /**
     * 清理DOM元素
     * @private
     */
    cleanup() {
        // 移除事件监听器
        if (this.escapeKeyHandler) {
            document.removeEventListener('keydown', this.escapeKeyHandler);
            this.escapeKeyHandler = null;
        }
        
        // 移除DOM元素
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
            this.modal = null;
        }
        
        if (this.backdrop && this.backdrop.parentNode) {
            this.backdrop.parentNode.removeChild(this.backdrop);
            this.backdrop = null;
        }
        
        console.log('🎉 UI元素已清理');
    }
    
    /**
     * 复制到剪贴板
     * @param {string} text - 要复制的文本
     * @param {string} successMessage - 成功提示消息
     * @public
     */
    copyToClipboard(text, successMessage = '内容已复制到剪贴板！') {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccessToast(successMessage);
                // 延迟触发解锁，避免提示重叠
                setTimeout(() => {
                    this.triggerSecondEasterEgg();
                }, 2000);
            }).catch(() => {
                this.fallbackCopy(text, successMessage);
            });
        } else {
            this.fallbackCopy(text, successMessage);
        }
    }
    
    /**
     * 备用复制方案
     * @param {string} text - 要复制的文本
     * @param {string} successMessage - 成功提示消息
     * @private
     */
    fallbackCopy(text, successMessage = '内容已复制到剪贴板！') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showSuccessToast(successMessage);
            // 延迟触发解锁，避免提示重叠
            setTimeout(() => {
                this.triggerSecondEasterEgg();
            }, 2000);
        } catch (err) {
            console.warn('复制失败:', err);
            prompt('请手动复制以下内容:', text);
            // 即使手动复制也触发解锁
            setTimeout(() => {
                this.triggerSecondEasterEgg();
            }, 1000);
        }
        
        document.body.removeChild(textarea);
    }
    
    /**
     * 触发第二层彩蛋解锁
     * @public
     */
    triggerSecondEasterEgg() {
        // 检查是否已经解锁过，避免重复提示
        const alreadyUnlocked = localStorage.getItem('lunchReminderUnlocked') === 'true';
        
        if (alreadyUnlocked) {
            console.log('🍲 午餐提醒已经解锁过了');
            return;
        }
        
        // 记录解锁状态
        localStorage.setItem('lunchReminderUnlocked', 'true');
        
        // 启用午餐提醒功能
        console.log('🍲 第二层彩蛋已解锁：午餐提醒功能已启用');
        
        // 调用实际的午餐提醒启用逻辑
        if (window.lunchReminder) {
            window.lunchReminder.enabled = true;
            console.log('🍲 午餐提醒实例已启用');
        }
        
        // 分析埋点
        if (window.app && window.app.analytics) {
            window.app.analytics.trackEasterEggTriggered('second_easter_egg_unlocked', 'zh-CN');
        }
        
        // 显示解锁成功提示
        this.showUnlockSuccessToast();
    }
    
    /**
     * 显示解锁成功提示
     * @private
     */
    showUnlockSuccessToast() {
        const toast = document.createElement('div');
        toast.className = 'success-toast unlock-success-toast';
        
        // 分两行显示文字
        toast.innerHTML = `
            <div>🎊 恭喜解锁午餐提醒彩蛋！</div>
            <div>明天12:00见~</div>
        `;
        
        // 使用CSS样式类，但需要覆盖一些属性以保证居中显示
        toast.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(0.8) !important;
            z-index: 2147483650 !important;
        `;
        
        document.body.appendChild(toast);
        
        // 显示动画 - 缩放弹出效果
        requestAnimationFrame(() => {
            toast.classList.add('show');
            toast.style.transform = 'translate(-50%, -50%) scale(1) !important';
        });
        
        // 自动隐藏 - 缩放消失
        setTimeout(() => {
            toast.classList.remove('show');
            toast.style.transform = 'translate(-50%, -50%) scale(0.8) !important';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * 显示成功提示
     * @param {string} message - 提示消息
     * @public
     */
    showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 显示动画
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * 生成分享内容
     * @param {string} shareType - 分享类型
     * @returns {string} 分享文本
     * @public
     */
    generateShareContent(shareType) {
        const baseUrl = 'https://hydrate-move.lightyearai.info/zh/';
        
        if (shareType === 'wechat') {
            const config = {
                text: '哈哈哈，下午茶时间到！\n\n工作再忙也要记得：\n💧 多喝水\n🧘 多站立\n🍵 享受下午茶时光\n\n这个小工具还有彩蛋，太有意思了！',
                hashtags: '#办公室健康 #下午茶时间 #健康生活'
            };
            return `${config.text}\n\n🔗 ${baseUrl}\n\n${config.hashtags}`;
        } else if (shareType === 'xiaohongshu') {
            const currentTime = new Date().toLocaleString('zh-CN', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const config = {
                text: '哈哈哈，下午茶时间到！\n\n工作再忙也要记得：\n💧 多喝水\n🧘 多站立\n🍵 享受下午茶时光\n\n这个小工具还有彩蛋，太有意思了！',
                hashtags: '#办公室健康 #下午茶 #健康生活 #打工人'
            };
            
            return `🍵 ${currentTime} 的小惊喜\n\n${config.text}\n\n🔗 ${baseUrl}\n\n${config.hashtags}`;
        }
        
        console.warn(`未找到分享模板: ${shareType}`);
        return '';
    }
    
    /**
     * 销毁UI控制器
     * @public
     */
    destroy() {
        this.cleanup();
        this.easterEggManager = null;
        console.log('🎉 UI控制器已销毁');
    }
}

// 全局暴露给其他模块使用
window.EasterEggUI = EasterEggUI;