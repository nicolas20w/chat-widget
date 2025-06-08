
// Minimal Chat Launcher for n8n
(function() {
  if (window.N8nChatWidgetLoaded) return;
  if (!window.ChatWidgetConfig) return;
  window.N8nChatWidgetLoaded = true;

  const settings = window.ChatWidgetConfig;
  const position = settings.style?.position === 'left' ? 'left-side' : 'right-side';

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  const styles = document.createElement('style');
  styles.textContent = \`
    .chat-assist-widget {
      font-family: 'Poppins', sans-serif;
    }

    .chat-launcher {
      position: fixed;
      bottom: 20px;
      width: 56px;
      height: 56px;
      border-radius: 9999px;
      background: linear-gradient(135deg, var(--chat-widget-primary, #10b981), var(--chat-widget-secondary, #059669));
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .chat-launcher:hover {
      transform: scale(1.05);
    }

    .chat-launcher.left-side {
      left: 20px;
    }

    .chat-launcher.right-side {
      right: 20px;
    }
  \`;
  document.head.appendChild(styles);

  const widgetRoot = document.createElement('div');
  widgetRoot.className = 'chat-assist-widget';

  const launcher = document.createElement('button');
  launcher.className = \`chat-launcher \${position}\`;
  launcher.innerHTML = \`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5A8.38 8.38 0 0 1 9 19l-6 2 2-6A8.38 8.38 0 0 1 3 11.5 
        8.5 8.5 0 0 1 11.5 3a8.5 8.5 0 0 1 9 8.5Z"/>
    </svg>
  \`;

  launcher.addEventListener('click', () => {
    alert('Escribe tu mensaje aquí...'); // Message in Spanish
  });

  widgetRoot.appendChild(launcher);
  document.body.appendChild(widgetRoot);
})();
