(function () {
    class ChatWidget {
      constructor(config) {
        this.config = {
          color: '#569CCE',
          title: 'AI Assistant',
          welcomeMessage: 'Hi! How can I help you today? 👋',
          buttonAlign: 'right',
          buttonText: 'Chat with AI',
          darkMode: false,
          fontSize: '14px',
          height: '500px',
          width: '350px',
          ...config
        };
        this.isOpen = false;
        this.messages = [{ role: 'assistant', content: this.config.welcomeMessage }];
        this.init();
      }
  
      createStyles() {
        const styles = `
          .docsbot-widget * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: ${this.config.fontSize};
          }
          
          .docsbot-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border: none;
            border-radius: 100px;
            cursor: pointer;
            transition: transform 0.2s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .docsbot-button:hover {
            transform: scale(1.05);
          }
          
          .docsbot-chat {
            display: flex;
            flex-direction: column;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
          }
          
          .docsbot-chat.open {
            opacity: 1;
            transform: translateY(0);
          }
          
          .docsbot-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            color: white;
          }
          
          .docsbot-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
          }
          
          .docsbot-close:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .docsbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: ${this.config.darkMode ? '#1a1a1a' : '#f8f9fa'};
            height: calc(100% - 130px);
            margin-bottom: 60px;
          }
          
          .docsbot-message {
            max-width: 85%;
            margin: 8px 0;
            padding: 12px 16px;
            border-radius: 16px;
            line-height: 1.5;
            animation: messageSlide 0.3s ease;
          }
          
          .docsbot-message.user {
            margin-left: auto;
            background-color: ${this.config.color};
            color: white;
            border-top-right-radius: 4px;
          }
          
          .docsbot-message.assistant {
            background-color: ${this.config.darkMode ? '#2d2d2d' : 'white'};
            color: ${this.config.darkMode ? '#fff' : '#1a1a1a'};
            border-top-left-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          
          .docsbot-input-area {
            padding: 16px;
            background-color: ${this.config.darkMode ? '#2d2d2d' : 'white'};
            border-top: 1px solid ${this.config.darkMode ? '#404040' : '#eee'};
            border-bottom-left-radius: 16px;
            border-bottom-right-radius: 16px;
          }
          
          .docsbot-input-container {
            display: flex;
            gap: 8px;
          }
          
          .docsbot-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid ${this.config.darkMode ? '#404040' : '#ddd'};
            border-radius: 100px;
            outline: none;
            transition: border-color 0.2s;
            background-color: ${this.config.darkMode ? '#1a1a1a' : 'white'};
            color: ${this.config.darkMode ? '#fff' : '#1a1a1a'};
          }
          
          .docsbot-input:focus {
            border-color: ${this.config.color};
          }
          
          .docsbot-send {
            padding: 8px;
            border: none;
            border-radius: 50%;
            background-color: ${this.config.color};
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
          }
          
          .docsbot-send:hover {
            transform: scale(1.1);
          }
          
          @keyframes messageSlide {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .docsbot-typing {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background-color: ${this.config.darkMode ? '#2d2d2d' : 'white'};
            border-radius: 16px;
            width: fit-content;
          }
          
          .docsbot-typing-dot {
            width: 8px;
            height: 8px;
            background-color: #888;
            border-radius: 50%;
            animation: typing 1.4s infinite;
          }
          
          .docsbot-typing-dot:nth-child(2) { animation-delay: 0.2s; }
          .docsbot-typing-dot:nth-child(3) { animation-delay: 0.4s; }
          
          @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
      }
  
      init() {
        this.createStyles();
        this.createButton();
        this.createChatBox();
      }
  
      createButton() {
        const button = document.createElement('button');
        button.className = 'docsbot-button';
        button.style.position = 'fixed';
        button.style[this.config.buttonAlign] = '20px';
        button.style.bottom = '20px';
        button.style.backgroundColor = this.config.color;
        
        // Add icon and text
        button.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          ${this.config.buttonText ? `<span>${this.config.buttonText}</span>` : ''}
        `;
        
        button.onclick = () => this.toggleChat();
        document.body.appendChild(button);
        this.button = button;
      }
  
      createChatBox() {
        const chatBox = document.createElement('div');
        chatBox.className = 'docsbot-chat';
        chatBox.style.position = 'fixed';
        chatBox.style[this.config.buttonAlign] = '20px';
        chatBox.style.bottom = '80px';
        chatBox.style.width = this.config.width;
        chatBox.style.height = this.config.height;
        chatBox.style.display = 'none';
        
        chatBox.innerHTML = `
          <div class="docsbot-header" style="background-color: ${this.config.color}">
            <div class="docsbot-header-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>${this.config.title}</span>
            </div>
            <button class="docsbot-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="docsbot-messages" id="chatMessages"></div>
        `;

        // Add fixed input area at bottom
        const inputArea = document.createElement('div');
        inputArea.className = 'docsbot-input-area';
        inputArea.style.position = 'absolute';
        inputArea.style.bottom = '0';
        inputArea.style.left = '0';
        inputArea.style.right = '0';
        inputArea.innerHTML = `
          <div class="docsbot-input-container">
            <input 
              type="text" 
              class="docsbot-input"
              placeholder="Type your message..."
              id="chatInput"
            />
            <button class="docsbot-send" id="chatSend">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        `;

        chatBox.appendChild(inputArea);
        document.body.appendChild(chatBox);
        this.chatBox = chatBox;

        // Add welcome message
        this.addMessage('assistant', this.config.welcomeMessage);

        // Add event listeners
        chatBox.querySelector('.docsbot-close').onclick = () => this.toggleChat();
        chatBox.querySelector('#chatSend').onclick = () => this.sendMessage();
        chatBox.querySelector('#chatInput').onkeypress = (e) => {
          if (e.key === 'Enter') this.sendMessage();
        };
      }
  
      toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatBox.classList.toggle('open');
        this.chatBox.style.display = this.isOpen ? 'flex' : 'none';
      }
  
      addMessage(role, content) {
        const messagesDiv = this.chatBox.querySelector('#chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `docsbot-message ${role}`;
        messageDiv.textContent = content;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
  
      async sendMessage() {
        const input = this.chatBox.querySelector('#chatInput');
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        this.addMessage('user', message);

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'docsbot-typing';
        typingDiv.innerHTML = `
          <div class="docsbot-typing-dot"></div>
          <div class="docsbot-typing-dot"></div>
          <div class="docsbot-typing-dot"></div>
        `;
        this.chatBox.querySelector('#chatMessages').appendChild(typingDiv);

        try {
          const response = await fetch(`${this.config.apiUrl}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': this.config.botId
            },
            body: JSON.stringify({ 
              question: message 
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          typingDiv.remove();
          this.addMessage('assistant', data.answer || 'Sorry, I didn\'t get that.');
        } catch (error) {
          console.error('Error:', error);
          typingDiv.remove();
          this.addMessage('assistant', 'Error: Could not reach the server.');
        }
      }
    }
  
    window.DocsBotAI = {
      init: (config) => new ChatWidget(config),
    };
  })();
  