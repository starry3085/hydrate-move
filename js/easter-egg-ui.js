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
        this.modal.innerHTML = this.getModalContent();
        
        // 添加到页面
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.modal);
        
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
        const messages = this.config.MESSAGES.FIRST_EASTER_EGG;
        
        return `
            <div class="easter-egg-header">
                <button class="easter-egg-close" aria-label="关闭" title="关闭">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <div class="easter-egg-content">
                <div class="easter-egg-title">
                    ${messages.TITLE}
                </div>
                
                <div class="easter-egg-subtitle">
                    ${messages.SUBTITLE}
                </div>
                
                <div class="easter-egg-image">
                    <div class="easter-egg-emoji" role="img" aria-label="茶杯图标">
                        🍵
                    </div>
                </div>
                
                <div class="easter-egg-description">
                    ${messages.DESCRIPTION}
                </div>
                
                <div class="easter-egg-buttons" role="group" aria-label="分享选项">
                    <button class="easter-egg-share-button easter-egg-share-wechat" 
                            data-share-type="wechat" 
                            aria-label="分享到微信朋友圈">
                        <span class="share-icon">📱</span>
                        <span class="share-text">${messages.SHARE_BUTTONS.WECHAT}</span>
                    </button>
                    <button class="easter-egg-share-button easter-egg-share-xiaohongshu" 
                            data-share-type="xiaohongshu" 
                            aria-label="分享到小红书">
                        <span class="share-icon">📝</span>
                        <span class="share-text">${messages.SHARE_BUTTONS.XIAOHONGSHU}</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * 绑定事件监听器
     * @private
     */
    bindEvents() {
        // 关闭按钮
        const closeButton = this.modal.querySelector('.easter-egg-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hideModal());
        }
        
        // 背景点击关闭
        this.backdrop.addEventListener('click', () => this.hideModal());
        
        // 分享按钮 - 使用事件委托处理嵌套元素
        const shareButtons = this.modal.querySelectorAll('.easter-egg-share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const shareType = e.target.closest('.easter-egg-share-button').getAttribute('data-share-type');
                this.handleShareClick(shareType);
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
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isVisible = true;
        
        // 防止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 使用bounceIn动画显示
        requestAnimationFrame(() => {
            this.backdrop.style.opacity = '1';
            this.modal.classList.add('bounceIn');
            this.modal.style.opacity = '1';
            this.modal.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // 动画完成后重置状态
        setTimeout(() => {
            this.isAnimating = false;
            // 移除动画类，防止重复触发
            if (this.modal) {
                this.modal.classList.remove('bounceIn');
            }
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
        
        // 调用主控制器的分享处理
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