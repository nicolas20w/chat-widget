
(function() {
  if (window.N8nChatWidgetLoaded) return;
  window.N8nChatWidgetLoaded = true;

  const fontElement = document.createElement('link');
  fontElement.rel = 'stylesheet';
  fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontElement);

  const widgetStyles = document.createElement('style');
  widgetStyles.textContent = `
    .chat-launcher.left-side { left: 20px; right: auto; }
    .chat-launcher.right-side { right: 20px; left: auto; }
    .chat-window.left-side { left: 20px; right: auto; }
    .chat-window.right-side { right: 20px; left: auto; }
  `;
  document.head.appendChild(widgetStyles);

  const settings = window.ChatWidgetConfig || {};
  const side = settings.style?.position === 'left' ? 'left-side' : 'right-side';

  const widgetRoot = document.createElement('div');
  widgetRoot.className = 'chat-assist-widget';

  const chatWindow = document.createElement('div');
  chatWindow.className = 'chat-window';
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
  launcher.className = 'chat-launcher';
  launcher.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5A8.38 8.38 0 0 1 9 19l-6 2 2-6A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3a8.5 8.5 0 0 1 9 8.5Z"/></svg>';

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

  // Force launcher and chatWindow to correct side
  launcher.classList.remove('left-side', 'right-side');
  chatWindow.classList.remove('left-side', 'right-side');

  if (side === 'left-side') {
    launcher.classList.add('left-side');
    chatWindow.classList.add('left-side');
    launcher.style.left = '20px';
    launcher.style.right = 'auto';
  } else {
    launcher.classList.add('right-side');
    chatWindow.classList.add('right-side');
    launcher.style.right = '20px';
    launcher.style.left = 'auto';
  }
})();
