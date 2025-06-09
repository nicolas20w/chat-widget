
(function() {
    'use strict';
    
    // Get configuration from window
    const config = window.ChatWidgetConfig || {};
    
    // Simple state management
    let state = {
        isOpen: false,
        showRegistration: true,
        messages: [],
        user: null,
        sessionId: 'session_' + Date.now(),
        isTyping: false
    };
    
    // Create the chatbot
    function createChatbot() {
        // Remove any existing chatbot
        const existing = document.getElementById('simple-chatbot');
        if (existing) existing.remove();
        
        const container = document.createElement('div');
        container.id = 'simple-chatbot';
        container.innerHTML = `
            <style>
                #simple-chatbot {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                @media (max-width: 768px) {
                    #simple-chatbot {
                        bottom: 0;
                        right: 0;
                        left: 0;
                        top: 0;
                        position: fixed;
                        width: 100vw;
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        align-items: flex-end;
                        pointer-events: none;
                    }
                    
                    #simple-chatbot > * {
                        pointer-events: auto;
                    }
                }
                
                .chatbot-trigger {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #4F46E5, #7C3AED);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    transition: transform 0.2s;
                    margin-left: auto;
                    position: relative;
                    z-index: 1000001;
                }
                
                @media (max-width: 768px) {
                    .chatbot-trigger {
                        width: 56px;
                        height: 56px;
                        font-size: 22px;
                        box-shadow: 0 3px 15px rgba(0,0,0,0.2);
                        margin: 20px;
                        flex-shrink: 0;
                    }
                }
                
                .chatbot-trigger:hover {
                    transform: scale(1.1);
                }
                
                .chatbot-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 380px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                @media (max-width: 768px) {
                    .chatbot-window {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: 100vw;
                        height: 100vh;
                        height: 100dvh;
                        border-radius: 0;
                        box-shadow: none;
                        z-index: 1000000;
                        max-width: 100vw;
                        max-height: 100vh;
                        max-height: 100dvh;
                        overflow: hidden;
                    }
                }
                
                .chatbot-window.active {
                    display: flex;
                }
                
                .chatbot-header {
                    background: linear-gradient(135deg, #4F46E5, #7C3AED);
                    color: white;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                    position: relative;
                    z-index: 1;
                }
                
                @media (max-width: 768px) {
                    .chatbot-header {
                        padding: 16px;
                        min-height: 60px;
                        padding-top: max(16px, env(safe-area-inset-top, 16px));
                    }
                }
                
                .chatbot-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                @media (max-width: 768px) {
                    .chatbot-header h3 {
                        font-size: 18px;
                    }
                }
                
                .close-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }
                
                @media (max-width: 768px) {
                    .close-btn {
                        width: 32px;
                        height: 32px;
                        font-size: 18px;
                    }
                }
                
                .registration-form {
                    padding: 30px 24px;
                    text-align: center;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    overflow-y: auto;
                }
                
                @media (max-width: 768px) {
                    .registration-form {
                        padding: 24px 20px;
                        justify-content: flex-start;
                        padding-top: 40px;
                        padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
                    }
                }
                
                .registration-form h4 {
                    margin: 0 0 8px 0;
                    font-size: 22px;
                    font-weight: 700;
                    color: #1f2937;
                    background: linear-gradient(135deg, #4F46E5, #7C3AED);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                @media (max-width: 768px) {
                    .registration-form h4 {
                        font-size: 24px;
                        margin-bottom: 12px;
                    }
                }
                
                .registration-form p {
                    margin: 0 0 24px 0;
                    font-size: 15px;
                    color: #6b7280;
                    font-weight: 500;
                }
                
                @media (max-width: 768px) {
                    .registration-form p {
                        font-size: 16px;
                        margin-bottom: 32px;
                        line-height: 1.5;
                    }
                }
                
                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    margin-bottom: 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    box-sizing: border-box;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                @media (max-width: 768px) {
                    .form-input {
                        padding: 14px 16px;
                        margin-bottom: 20px;
                        font-size: 16px;
                        border-radius: 10px;
                    }
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: #4F46E5;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #4F46E5, #7C3AED);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    margin-bottom: 12px;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                @media (max-width: 768px) {
                    .btn-primary {
                        padding: 14px 24px;
                        font-size: 16px;
                        border-radius: 10px;
                        margin-bottom: 16px;
                    }
                }
                
                .btn-secondary {
                    background: none;
                    border: none;
                    color: #6b7280;
                    font-size: 13px;
                    cursor: pointer;
                    text-decoration: underline;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                @media (max-width: 768px) {
                    .btn-secondary {
                        font-size: 14px;
                        padding: 8px;
                    }
                }
                
                .chat-area {
                    flex: 1;
                    display: none;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                }
                
                .chat-area.active {
                    display: flex;
                }
                
                .messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    background: #f9fafb;
                    min-height: 0;
                    padding-bottom: 100px;
                }
                
                @media (max-width: 768px) {
                    .messages {
                        padding: 12px;
                        padding-bottom: 110px;
                        background: #ffffff;
                        padding-bottom: calc(110px + env(safe-area-inset-bottom, 0px));
                    }
                }
                
                .message {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-end;
                }
                
                @media (max-width: 768px) {
                    .message {
                        margin-bottom: 12px;
                    }
                }
                
                .message.user {
                    flex-direction: row-reverse;
                }
                
                .message-bubble {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    font-family: system-ui, -apple-system, sans-serif;
                    word-wrap: break-word;
                    word-break: break-word;
                }
                
                @media (max-width: 768px) {
                    .message-bubble {
                        max-width: 85%;
                        padding: 12px 14px;
                        font-size: 15px;
                        line-height: 1.5;
                    }
                }
                
                .message.user .message-bubble {
                    background: linear-gradient(135deg, #4F46E5, #7C3AED);
                    color: white;
                    border-bottom-right-radius: 6px;
                }
                
                .message.bot .message-bubble {
                    background: white;
                    color: #1f2937;
                    border: 1px solid #e5e7eb;
                    border-bottom-left-radius: 6px;
                }
                
                @media (max-width: 768px) {
                    .message.bot .message-bubble {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                    }
                }
                
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 18px;
                    border-bottom-left-radius: 6px;
                    max-width: 80%;
                }
                
                @media (max-width: 768px) {
                    .typing-indicator {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        max-width: 85%;
                    }
                }
                
                .typing-dots {
                    display: flex;
                    gap: 4px;
                }
                
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #9ca3af;
                    animation: typing 1.4s infinite ease-in-out;
                }
                
                .typing-dot:nth-child(1) { animation-delay: 0s; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-10px); opacity: 1; }
                }
                
                .input-area {
                    padding: 16px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
                    background: white;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 2;
                    box-sizing: border-box;
                }
                
                @media (max-width: 768px) {
                    .input-area {
                        padding: 12px;
                        gap: 10px;
                        border-top: 1px solid #e2e8f0;
                        background: #ffffff;
                        box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
                        padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));
                    }
                }
                
                .message-input {
                    flex: 1;
                    border: 2px solid #e5e7eb;
                    border-radius: 20px;
                    padding: 10px 16px;
                    font-size: 14px;
                    resize: none;
                    outline: none;
                    font-family: system-ui, -apple-system, sans-serif;
                    max-height: 100px;
                    min-height: 40px;
                    box-sizing: border-box;
                }
                
                @media (max-width: 768px) {
                    .message-input {
                        border: 2px solid #e2e8f0;
                        border-radius: 22px;
                        padding: 12px 16px;
                        font-size: 16px;
                        min-height: 44px;
                    }
                }
                
                .message-input:focus {
                    border-color: #4F46E5;
                }
                
                .send-btn {
                    background: linear-gradient(135deg, #4F46E5, #7C3AED);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                @media (max-width: 768px) {
                    .send-btn {
                        width: 44px;
                        height: 44px;
                        font-size: 16px;
                    }
                }
                
                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            </style>
            
            <button class="chatbot-trigger" onclick="toggleChat()">💬</button>
            
            <div class="chatbot-window" id="chatWindow">
                <div class="chatbot-header">
                    <h3>CloseLabs</h3>
                    <button class="close-btn" onclick="closeChat()">×</button>
                </div>
                
                <div class="registration-form" id="registrationForm">
                    <h4>¡Bienvenido!</h4>
                    <p>Por favor ingresa tus datos para empezar</p>
                    <input type="text" class="form-input" placeholder="Nombre Completo" id="userName">
                    <input type="email" class="form-input" placeholder="Dirección de mail" id="userEmail">
                    <button class="btn-primary" onclick="startChat()">Listo!</button>
                    <button class="btn-secondary" onclick="skipRegistration()">Saltar</button>
                </div>
                
                <div class="chat-area" id="chatArea">
                    <div class="messages" id="messages"></div>
                    <div class="input-area">
                        <textarea class="message-input" placeholder="Escribe tu mensaje acá..." id="messageInput" rows="1"></textarea>
                        <button class="send-btn" onclick="sendMessage()" id="sendBtn">➤</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Add enter key listener for message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
        
        console.log('Simple chatbot created successfully');
    }
    
    // Global functions
    window.toggleChat = function() {
        state.isOpen = !state.isOpen;
        const window = document.getElementById('chatWindow');
        if (state.isOpen) {
            window.classList.add('active');
        } else {
            window.classList.remove('active');
        }
    };
    
    window.closeChat = function() {
        state.isOpen = false;
        document.getElementById('chatWindow').classList.remove('active');
    };
    
    window.startChat = function() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        
        if (!name || !email) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        state.user = { name, email };
        showChatInterface();
    };
    
    window.skipRegistration = function() {
        state.user = { name: 'Invitado', email: '' };
        showChatInterface();
    };
    
    function showChatInterface() {
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('chatArea').classList.add('active');
        addMessage('bot', '¡Hola! ¿En qué puedo ayudarte hoy?');
    }
    
    window.sendMessage = function() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message || state.isTyping) return;
        
        addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send to webhook
        sendToWebhook(message);
    };
    
    function addMessage(type, content) {
        const messages = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<div class="message-bubble">${content}</div>`;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }
    
    function showTypingIndicator() {
        if (state.isTyping) return;
        
        state.isTyping = true;
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) sendBtn.disabled = true;
        
        const messages = document.getElementById('messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        state.isTyping = false;
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) sendBtn.disabled = false;
    }
    
    async function sendToWebhook(message) {
        if (!config.webhook?.url) {
            console.error('No webhook URL configured');
            hideTypingIndicator();
            addMessage('bot', 'Lo siento, hay un problema de configuración.');
            return;
        }
        
        try {
            console.log('Sending to webhook:', config.webhook.url);
            console.log('Payload:', {
                chatInput: message,
                sessionId: state.sessionId,
                route: config.webhook.route || 'general',
                action: "sendMessage",
                user: state.user
            });
            
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatInput: message,
                    sessionId: state.sessionId,
                    route: config.webhook.route || 'general',
                    action: "sendMessage",
                    user: {
                        name: state.user?.name || '',
                        email: state.user?.email || ''
                    },
                    timestamp: new Date().toISOString()
                })
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            
            // Hide typing indicator before showing response
            hideTypingIndicator();
            
            // Handle different response formats from N8N
            let botResponse = '';
            if (data.response) {
                botResponse = data.response;
            } else if (data.output) {
                botResponse = data.output;
            } else if (data.message) {
                botResponse = data.message;
            } else if (typeof data === 'string') {
                botResponse = data;
            } else {
                botResponse = 'Respuesta recibida correctamente.';
            }
            
            addMessage('bot', botResponse);
        } catch (error) {
            console.error('Webhook error:', error);
            hideTypingIndicator();
            addMessage('bot', 'Lo siento, hay un problema de conexión. Intenta de nuevo en un momento.');
        }
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createChatbot);
    } else {
        createChatbot();
    }
})();
