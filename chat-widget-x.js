// Minimal Interactive Chat Widget for n8n (no Start Chatting view or Authentication)
(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    const webhookUrl = window.ChatWidgetConfig?.webhook?.url || '';
    const route = window.ChatWidgetConfig?.webhook?.route || '';
    const sessionId = crypto.randomUUID();

    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: #10b981;
            --chat-color-secondary: #059669;
            font-family: 'Poppins', sans-serif;
        }
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 580px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 15px rgba(16, 185, 129, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 1000;
        }
        .chat-assist-widget .chat-window.visible {
            display: flex;
        }
        .chat-assist-widget .chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: white;
            position: relative;
        }
        .chat-assist-widget .chat-close-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 9999px;
        }
        .chat-assist-widget .chat-body {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .chat-assist-widget .chat-bubble {
            padding: 14px 18px;
            border-radius: 12px;
            font-size: 14px;
            max-width: 85%;
        }
        .chat-assist-widget .chat-bubble.user-bubble {
            align-self: flex-end;
            background: var(--chat-color-primary);
            color: white;
        }
        .chat-assist-widget .chat-bubble.bot-bubble {
            align-self: flex-start;
            background: white;
            color: #1f2937;
            border: 1px solid #d1fae5;
        }
        .chat-assist-widget .chat-controls {
            padding: 16px;
            display: flex;
            gap: 10px;
            border-top: 1px solid #e5e7eb;
        }
        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            resize: none;
        }
        .chat-assist-widget .chat-submit {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            border: none;
            background: var(--chat-color-primary);
            color: white;
            cursor: pointer;
        }
        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            right: 20px;
            height: 56px;
            width: 56px;
            border-radius: 9999px;
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
        }
    `;
    document.head.appendChild(widgetStyles);

    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';

    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = `
        <div class="chat-header">
            <span>Chat</span>
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Type a message..."></textarea>
                <button class="chat-submit">→</button>
            </div>
        </div>
    `;

    const launcher = document.createElement('button');
    launcher.className = 'chat-launcher';
    launcher.textContent = '💬';

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launcher);
    document.body.appendChild(widgetRoot);

    const textarea = chatWindow.querySelector('.chat-textarea');
    const submitButton = chatWindow.querySelector('.chat-submit');
    const messages = chatWindow.querySelector('.chat-messages');
    const closeButton = chatWindow.querySelector('.chat-close-btn');

    function addMessage(text, isUser = false) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;
        bubble.textContent = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    async function sendToWebhook(text) {
        addMessage(text, true);

        try {
            const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'sendMessage',
                    sessionId,
                    route,
                    chatInput: text
                })
            });

            const data = await res.json();
            const response = Array.isArray(data) ? data[0].output : data.output;
            addMessage(response);
        } catch (e) {
            addMessage("⚠️ Failed to send message. Please try again later.");
        }
    }

    function handleSend() {
        const text = textarea.value.trim();
        if (!text) return;
        textarea.value = '';
        sendToWebhook(text);
    }

    submitButton.addEventListener('click', handleSend);
    textarea.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    launcher.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    closeButton.addEventListener('click', () => {
        chatWindow.classList.remove('visible');
    });
})();
