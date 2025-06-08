
(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #10b981);
            --chat-color-secondary: var(--chat-widget-secondary, #059669);
            --chat-color-light: var(--chat-widget-light, #d1fae5);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;
            --chat-shadow-lg: 0 10px 15px rgba(16, 185, 129, 0.2);
            --chat-transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            height: 580px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid var(--chat-color-light);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .chat-window.right-side { right: 20px; }
        .chat-assist-widget .chat-window.left-side { left: 20px; }
        .chat-assist-widget .chat-window.visible { display: flex; }

        .chat-assist-widget .chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: white;
        }

        .chat-assist-widget .chat-header-logo {
            width: 32px;
            height: 32px;
            border-radius: var(--chat-radius-full);
            background: white;
            object-fit: contain;
            padding: 4px;
        }

        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
        }

        .chat-assist-widget .chat-close-btn {
            margin-left: auto;
            background: transparent;
            border: none;
            font-size: 20px;
            color: white;
            cursor: pointer;
        }

        .chat-assist-widget .chat-body {
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 100%;
        }

        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
        }

        .chat-assist-widget .chat-bubble {
            padding: 12px 16px;
            border-radius: 12px;
            margin-bottom: 10px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: var(--chat-color-primary);
            color: white;
            align-self: flex-end;
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            border: 1px solid var(--chat-color-light);
            align-self: flex-start;
        }

        .chat-assist-widget .chat-controls {
            display: flex;
            padding: 12px;
            border-top: 1px solid var(--chat-color-light);
            background: var(--chat-color-surface);
        }

        .chat-assist-widget .chat-textarea {
            flex: 1;
            resize: none;
            padding: 10px;
            font-family: inherit;
            font-size: 14px;
            border-radius: 12px;
            border: 1px solid var(--chat-color-border);
        }

        .chat-assist-widget .chat-submit {
            background: var(--chat-color-primary);
            color: white;
            border: none;
            border-radius: var(--chat-radius-full);
            width: 44px;
            height: 44px;
            margin-left: 8px;
            cursor: pointer;
        }

        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            width: 56px;
            height: 56px;
            border-radius: var(--chat-radius-full);
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: white;
            border: none;
            box-shadow: var(--chat-shadow-lg);
            cursor: pointer;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(widgetStyles);

    const settings = window.ChatWidgetConfig || {};

    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style?.primaryColor || '#10b981');
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style?.secondaryColor || '#059669');
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style?.backgroundColor || '#ffffff');
    widgetRoot.style.setProperty('--chat-widget-text', settings.style?.fontColor || '#1f2937');

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style?.position === 'left' ? 'left-side' : 'right-side'}`;
    chatWindow.innerHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding?.logo || ''}" alt="">
            <span class="chat-header-title">${settings.branding?.name || ''}</span>
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Escribe tu mensaje aquí..."></textarea>
                <button class="chat-submit">➤</button>
            </div>
        </div>
    `;

    const launcher = document.createElement('button');
    launcher.className = `chat-launcher ${settings.style?.position === 'right' ? 'right-side' : 'right-side'}`;
    launcher.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5A8.38 8.38 0 0 1 9 19l-6 2 2-6A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3a8.5 8.5 0 0 1 9 8.5Z"/></svg>`;

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launcher);
    document.body.appendChild(widgetRoot);

    const closeBtn = chatWindow.querySelector('.chat-close-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messages = chatWindow.querySelector('.chat-messages');
    const textarea = chatWindow.querySelector('.chat-textarea');
    const submitBtn = chatWindow.querySelector('.chat-submit');

    launcher.addEventListener('click', () => {
        chatWindow.classList.add('visible');
        chatBody.classList.add('active');
        if (!window.__ChatWidgetSessionId) {
            window.__ChatWidgetSessionId = crypto?.randomUUID?.() || 'chat-' + Date.now();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('visible');
    });

    submitBtn.addEventListener('click', () => {
        const msg = textarea.value.trim();
        if (!msg) return;
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble user-bubble';
        bubble.textContent = msg;
        messages.appendChild(bubble);
        textarea.value = '';
        messages.scrollTop = messages.scrollHeight;
    });

    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitBtn.click();
        }
    });
})();
