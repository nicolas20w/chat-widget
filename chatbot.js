// ESPAÑOL
// Interactive Chat Widget for n8n
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load font resource
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Inject styles
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #10b981);
            --chat-color-secondary: var(--chat-widget-secondary, #059669);
            --chat-color-tertiary: var(--chat-widget-tertiary, #047857);
            --chat-color-light: var(--chat-widget-light, #d1fae5);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-shadow-sm: 0 1px 3px rgba(16, 185, 129, 0.1);
            --chat-shadow-md: 0 4px 6px rgba(16, 185, 129, 0.15);
            --chat-shadow-lg: 0 10px 15px rgba(16, 185, 129, 0.2);
            --chat-radius-sm: 8px;
            --chat-radius-md: 12px;
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Poppins', sans-serif;
        }

        /* Make chat-window a column flex so header/body/footer stack */
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            height: 580px;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid var(--chat-color-light);
            overflow: hidden;
        }
        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .chat-assist-widget .chat-window.right-side { right: 20px; }
        .chat-assist-widget .chat-window.left-side  { left: 20px; }

        /* Header fixed */
        .chat-assist-widget .chat-header {
            flex-shrink: 0;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            position: relative;
            z-index: 1;
        }
        .chat-assist-widget .chat-header-logo {
            width: 32px; height: 32px;
            border-radius: var(--chat-radius-sm);
            background: white;
            padding: 4px;
            object-fit: contain;
        }
        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
        }
        .chat-assist-widget .chat-close-btn {
            position: absolute;
            right: 16px; top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none; color: white;
            width: 28px; height: 28px;
            border-radius: var(--chat-radius-full);
            cursor: pointer;
            transition: var(--chat-transition);
            font-size: 18px;
            display: flex; align-items: center; justify-content: center;
        }
        .chat-assist-widget .chat-close-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-50%) scale(1.1);
        }

        /* Body expands, only messages scroll */
        .chat-assist-widget .chat-body {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .chat-assist-widget .chat-messages {
            flex: 1 1 auto;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        /* Controls bar sticky at bottom */
        .chat-assist-widget .chat-controls {
            flex-shrink: 0;
            position: sticky;
            bottom: 0;
            padding: 16px;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-light);
            display: flex;
            gap: 10px;
        }
        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 14px 16px;
            border: 1px solid var(--chat-color-light);
            border-radius: var(--chat-radius-md);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            max-height: 120px;
            min-height: 48px;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
        }
        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            width: 48px; height: 48px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex; align-items: center; justify-content: center;
            box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .chat-submit:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-md);
        }

        /* Registration form centered */
        .chat-assist-widget .user-registration {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            padding: 24px;
            text-align: center;
            width: 100%; max-width: 320px;
        }
        .chat-assist-widget .user-registration.active { display: block; }
        .chat-assist-widget .registration-title {
            font-size: 18px; font-weight: 600;
            color: var(--chat-color-text);
            margin-bottom: 16px; line-height: 1.3;
        }
        .chat-assist-widget .registration-form {
            display: flex; flex-direction: column; gap: 12px;
        }
        .chat-assist-widget .form-field {
            display: flex; flex-direction: column; gap: 4px; text-align: left;
        }
        .chat-assist-widget .form-label {
            font-size: 14px; font-weight: 500; color: var(--chat-color-text);
        }
        .chat-assist-widget .form-input {
            padding: 12px 14px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit; font-size: 14px;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
        }
        .chat-assist-widget .form-input.error {
            border-color: #ef4444;
        }
        .chat-assist-widget .error-text {
            font-size: 12px; color: #ef4444; margin-top: 2px;
        }
        .chat-assist-widget .submit-registration {
            display: flex; align-items: center; justify-content: center;
            width: 100%; padding: 14px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white; border: none; border-radius: var(--chat-radius-md);
            cursor: pointer; font-size: 15px; font-weight: 600; font-family: inherit;
            box-shadow: var(--chat-shadow-md);
            transition: var(--chat-transition);
        }
        .chat-assist-widget .submit-registration:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }
        /* Skip button */
        .chat-assist-widget .skip-registration {
            background: none; border: none;
            color: #6b7280; text-decoration: underline;
            font-size: 14px; margin-top: 8px;
            cursor: pointer; font-family: inherit;
        }
        .chat-assist-widget .skip-registration:hover {
            opacity: 0.8;
        }

        /* (Plus your bubbles, typing-indicator, launcher styles… just keep them below) */
    `;
    document.head.appendChild(widgetStyles);

    // Default config
    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '', name: '', welcomeText: '', responseTimeText: '',
            poweredBy: { text: 'Powered by n8n', link: 'https://n8n.partnerlinks.io/fabimarkl' }
        },
        style: {
            primaryColor: '#10b981',
            secondaryColor: '#059669',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        },
        suggestedQuestions: []
    };
    const settings = window.ChatWidgetConfig
        ? {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: {
                ...defaultSettings.style,
                ...window.ChatWidgetConfig.style,
                primaryColor: window.ChatWidgetConfig.style?.primaryColor === '#854fff'
                    ? '#10b981'
                    : (window.ChatWidgetConfig.style?.primaryColor || '#10b981'),
                secondaryColor: window.ChatWidgetConfig.style?.secondaryColor === '#6b3fd4'
                    ? '#059669'
                    : (window.ChatWidgetConfig.style?.secondaryColor || '#059669')
            },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions
        }
        : defaultSettings;

    // State
    let conversationId = '';
    let isWaitingForResponse = false;

    // Build DOM
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;

    chatWindow.innerHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn">×</button>
        </div>

        <div class="user-registration active">
            <h2 class="registration-title">Por favor ingresa tus datos para empezar</h2>
            <form class="registration-form">
                <div class="form-field">
                    <label class="form-label" for="chat-user-name">Nombre</label>
                    <input type="text" id="chat-user-name" class="form-input" placeholder="Nombre Completo" required>
                    <div class="error-text" id="name-error"></div>
                </div>
                <div class="form-field">
                    <label class="form-label" for="chat-user-email">Email</label>
                    <input type="email" id="chat-user-email" class="form-input" placeholder="Dirección de mail" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <button type="submit" class="submit-registration">Listo!</button>
                <button type="button" class="skip-registration">Saltar</button>
            </form>
        </div>

        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Escribe tu mensaje acá..." rows="1"></textarea>
                <button class="chat-submit">
                    <!-- your send-icon SVG here -->
                </button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank">
                    ${settings.branding.poweredBy.text}
                </a>
            </div>
        </div>
    `;

    // Launcher
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `
        <!-- your launcher SVG here -->
        <span class="chat-launcher-text">Conversemos</span>
    `;

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Element refs
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea  = chatWindow.querySelector('.chat-textarea');
    const sendButton       = chatWindow.querySelector('.chat-submit');
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatBody         = chatWindow.querySelector('.chat-body');
    const nameInput        = chatWindow.querySelector('#chat-user-name');
    const emailInput       = chatWindow.querySelector('#chat-user-email');
    const nameError        = chatWindow.querySelector('#name-error');
    const emailError       = chatWindow.querySelector('#email-error');
    const skipButton       = chatWindow.querySelector('.skip-registration');

    // Helpers
    function createSessionId() { return crypto.randomUUID(); }
    function createTypingIndicator() {
        const el = document.createElement('div');
        el.className = 'typing-indicator';
        el.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        return el;
    }
    function linkifyText(text) {
        return text.replace(/(\b(https?|ftp):\/\/[^\s]+)/gi, url =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`
        );
    }
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Registration handler
    async function handleRegistration(e) {
        e.preventDefault();
        // reset errors
        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');

        const name  = nameInput.value.trim();
        const email = emailInput.value.trim();
        let valid = true;
        if (!name)  { nameError.textContent = 'Por favor ingresa tu nombre';  nameInput.classList.add('error'); valid = false; }
        if (!email) { emailError.textContent = 'Por favor ingresa tu mail'; emailInput.classList.add('error'); valid = false; }
        else if (!isValidEmail(email)) { emailError.textContent = 'Por favor ingresa un mail valido'; emailInput.classList.add('error'); valid = false; }
        if (!valid) return;

        // init session
        conversationId = createSessionId();
        userRegistration.classList.remove('active');
        chatBody.classList.add('active');

        // load previous session & send user info to webhook…
        // (keep your existing fetch logic here)
    }

    registrationForm.addEventListener('submit', handleRegistration);
    skipButton.addEventListener('click', () => {
        conversationId = createSessionId();
        userRegistration.classList.remove('active');
        chatBody.classList.add('active');
    });

    // Message sending
    async function submitMessage(text) {
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;

        // display user bubble
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user-bubble';
        userBubble.textContent = text;
        messagesContainer.appendChild(userBubble);

        // typing indicator
        const typing = createTypingIndicator();
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // your fetch to webhook here, then remove typing & append bot bubble…
        // finally set isWaitingForResponse = false
    }

    sendButton.addEventListener('click', () => {
        const txt = messageTextarea.value.trim();
        if (txt) {
            submitMessage(txt);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
        }
    });
    messageTextarea.addEventListener('input', () => {
        messageTextarea.style.height = 'auto';
        messageTextarea.style.height = Math.min(messageTextarea.scrollHeight, 120) + 'px';
    });
    messageTextarea.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Launcher toggle
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    // Close btns
    chatWindow.querySelectorAll('.chat-close-btn')
        .forEach(btn => btn.addEventListener('click', () => chatWindow.classList.remove('visible')));
})();
