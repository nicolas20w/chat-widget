(function () {
  if (window.N8nChatWidgetLoaded) return;
  window.N8nChatWidgetLoaded = true;

  const settings = window.ChatWidgetConfig || {};
  const side = settings.style?.position === 'left' ? 'left-side' : 'right-side';

  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
  document.head.appendChild(font);

  const style = document.createElement('style');
  style.textContent = `
    .chat-assist-widget {
      font-family: 'Poppins', sans-serif;
    }
    .chat-window {
      position: fixed;
      bottom: 90px;
      z-index: 1000;
      width: 380px;
      height: 580px;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 10px 15px rgba(0,0,0,0.1);
      border: 1px solid #d1fae5;
      overflow: hidden;
      display: none;
      flex-direction: column;
      transition: all 0.3s ease;
    }
    .chat-window.right-side { right: 20px; }
    .chat-window.left-side { left: 20px; }
    .chat-window.visible { display: flex; }
    .chat-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }
    .chat-header-logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: contain;
      background: white;
      padding: 4px;
    }
    .chat-header-title {
      font-size: 16px;
      font-weight: 600;
    }
    .chat-close-btn {
      margin-left: auto;
      background: transparent;
      border: none;
      font-size: 20px;
      color: white;
      cursor: pointer;
    }
    .chat-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f9fafb;
    }
    .chat-bubble {
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 10px;
      max-width: 80%;
      word-wrap: break-word;
      font-size: 14px;
    }
    .chat-bubble.user-bubble {
      background: #10b981;
      color: white;
      align-self: flex-end;
    }
    .chat-bubble.bot-bubble {
      background: white;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      align-self: flex-start;
    }
    .chat-controls {
      display: flex;
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
    }
    .chat-textarea {
      flex: 1;
      resize: none;
      padding: 10px;
      font-family: inherit;
      font-size: 14px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }
    .chat-submit {
      background: #10b981;
      color: white;
      border: none;
      border-radius: 9999px;
      width: 44px;
      height: 44px;
      margin-left: 8px;
      cursor: pointer;
    }
    .chat-launcher {
      position: fixed;
      bottom: 20px;
      width: 56px;
      height: 56px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      cursor: pointer;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    .chat-launcher:hover {
      transform: scale(1.05);
    }
    .chat-launcher.left-side { left: 20px; }
    .chat-launcher.right-side { right: 20px; }
  `;
  document.head.appendChild(style);

  const widgetRoot = document.createElement('div');
  widgetRoot.className = 'chat-assist-widget';

  const chatWindow = document.createElement('div');
  chatWindow.className = 'chat-window ' + side;
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
  launcher.className = 'chat-launcher ' + side;
  launcher.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5A8.38 8.38 0 0 1 9 19l-6 2 2-6A8.38 8.38 0 0 1 3 11.5 
        8.5 8.5 0 0 1 11.5 3a8.5 8.5 0 0 1 9 8.5Z"/>
    </svg>
  `;

  widgetRoot.appendChild(chatWindow);
  widgetRoot.appendChild(launcher);
  document.body.appendChild(widgetRoot);

  const closeBtn = chatWindow.querySelector('.chat-close-btn');
  const chatBody = chatWindow.querySelector('.chat-body');
  const messages = chatWindow.querySelector('.chat-messages');
  const textarea = chatWindow.querySelector('.chat-textarea');
  const sendBtn = chatWindow.querySelector('.chat-submit');

  launcher.addEventListener('click', () => {
    chatWindow.classList.toggle('visible');
    chatBody.classList.add('active');
    if (!window.__ChatWidgetSessionId) {
      window.__ChatWidgetSessionId = crypto?.randomUUID?.() || 'chat-' + Date.now();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('visible');
  });

  sendBtn.addEventListener('click', () => {
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
      sendBtn.click();
    }
  });
})();
