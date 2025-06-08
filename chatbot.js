// ESPAÑOL
// Interactive Chat Widget for n8n
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load font resource - using Poppins for a fresh look
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Apply widget styles with completely different design approach
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
        /* … all your existing style rules … */
    `;
    document.head.appendChild(widgetStyles);

    // Default configuration
    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
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

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig
        ? { /* … merging logic unchanged … */ }
        : defaultSettings;

    // Session tracking
    let conversationId = '';
    let isWaitingForResponse = false;

    // Create widget root
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Create chat panel
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;

    // Build HTML without the welcome screen
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
                    <input type="email" id="chat-user-email" class="form-input" placeholder="Direccion de mail" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <button type="submit" class="submit-registration">Listo!</button>
            </form>
        </div>

        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Escribe tu mensaja acá..." rows="1"></textarea>
                <button class="chat-submit">
                    <!-- send icon SVG -->
                </button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank">
                    ${settings.branding.poweredBy.text}
                </a>
            </div>
        </div>
    `;

    // Create launcher button
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `
        <!-- launcher SVG + text -->
        <span class="chat-launcher-text">Conversemos</span>
    `;

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Grab elements
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

    // Helper to create session IDs & typing indicator (unchanged)
    function createSessionId() { return crypto.randomUUID(); }
    function createTypingIndicator() { /* … */ }
    function linkifyText(text) { /* … */ }
    function isValidEmail(email) { /* … */ }

    // Handle registration form submission
    async function handleRegistration(event) {
        event.preventDefault();
        // … validation, load session, swap UI to chatBody.active …
    }
    registrationForm.addEventListener('submit', handleRegistration);

    // Send message function (unchanged)
    async function submitMessage(messageText) { /* … */ }
    sendButton.addEventListener('click', () => {
        const txt = messageTextarea.value.trim();
        if (txt && !isWaitingForResponse) {
            submitMessage(txt);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
        }
    });
    messageTextarea.addEventListener('input', () => { /* auto-resize */ });
    messageTextarea.addEventListener('keypress', (e) => { /* enter to send */ });

    // Launcher toggle
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    // Close button(s)
    chatWindow.querySelectorAll('.chat-close-btn')
        .forEach(btn => btn.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
        }));
})();
