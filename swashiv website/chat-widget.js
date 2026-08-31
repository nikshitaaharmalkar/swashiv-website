// chat-widget.js — floating AI chat assistant, included on every page

function injectChatWidget(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button class="chat-bubble" id="chatBubble" aria-label="Chat with us">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
    <div class="chat-panel" id="chatPanel">
      <div class="chat-header">
        <div><h4>Swashiv Assistant</h4><span>Usually replies in seconds</span></div>
        <span class="chat-close" id="chatClose">✕</span>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg bot">Hi! 👋 I can help with sizing, delivery, or finding the right co-ord set. What are you looking for?</div>
      </div>
      <div class="chat-typing" id="chatTyping" style="display:none;">Typing...</div>
      <div class="chat-input-row">
        <input type="text" id="chatInput" placeholder="Ask something...">
        <button id="chatSend" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  const bubble = document.getElementById('chatBubble');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const messagesEl = document.getElementById('chatMessages');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const typingEl = document.getElementById('chatTyping');

  let history = [];

  bubble.addEventListener('click', ()=> panel.classList.toggle('open'));
  closeBtn.addEventListener('click', ()=> panel.classList.remove('open'));

  function addMessage(text, sender){
    const div = document.createElement('div');
    div.className = 'chat-msg ' + sender;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(){
    const text = inputEl.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    history.push({ role: 'user', content: text });
    inputEl.value = '';
    typingEl.style.display = 'block';

    try{
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      typingEl.style.display = 'none';

      if(data.error){
        addMessage("Sorry, I'm not set up yet — please message us directly on Instagram @swashiv_05!", 'bot');
        return;
      }
      addMessage(data.reply, 'bot');
      history.push({ role: 'assistant', content: data.reply });
    }catch(err){
      typingEl.style.display = 'none';
      addMessage("Something went wrong — try messaging us on Instagram @swashiv_05 instead.", 'bot');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') sendMessage(); });
}

document.addEventListener('DOMContentLoaded', injectChatWidget);
