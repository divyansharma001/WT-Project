// ============================================================
// DATA
// ============================================================

const MENTORS = {
  sarah:  { name: 'Sarah',  role: 'Compassionate Listener',  avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Sarah&backgroundColor=e0f2fe',    personality: 'Warm, patient, gentle, focusing on validation and emotional support.',                                                          greeting: "Hi, I'm Sarah. I'm here to listen without judgment. How are you feeling today?" },
  marcus: { name: 'Marcus', role: 'Coping Strategist',       avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Marcus&backgroundColor=ffedd5',     personality: 'Calm, grounded, solution-oriented but empathetic. Uses CBT concepts gently.',                                                   greeting: "Hello. I'm Marcus. Dealing with life's challenges can be tough, but we can work through them together. What's on your mind?" },
  luna:   { name: 'Luna',   role: 'Mindfulness Coach',       avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Luna&backgroundColor=f3e8ff',  personality: 'Serene, slow-paced, metaphorical. Focuses on breathing and grounding.',                                                         greeting: "Welcome. I'm Luna. Let's take a deep breath together. What brings you here today?" },
  kai:    { name: 'Kai',    role: 'Motivation & Growth',     avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Kai&backgroundColor=dcfce7',   personality: 'Optimistic, energetic (but not overwhelming), encouraging, focuses on strengths.',                                              greeting: "Hey there, I'm Kai. I believe you have the strength to get through this. What are you facing right now?" },
  elena:  { name: 'Elena',  role: 'Relationship Guide',      avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Elena&backgroundColor=fce7f3',   personality: 'Insightful, gentle but direct about boundaries, focuses on communication and self-worth in context of others.',                 greeting: "Hello, I'm Elena. Relationships can be complicated. I'm here to help you navigate your connections with others and yourself." },
  david:  { name: 'David',  role: 'Burnout & Stress',        avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=David&backgroundColor=e0e7ff',     personality: 'Structured yet understanding, focuses on setting limits, prioritizing rest, and separating worth from productivity.',           greeting: "Hi, I'm David. It's easy to carry the weight of the world on your shoulders. Let's see if we can lighten that load a bit." },
  sofia:  { name: 'Sofia',  role: 'Self-Compassion',         avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia&backgroundColor=fff7ed', personality: 'Nurturing, focuses on rephrasing negative self-talk, finding softness, and radical self-acceptance.',                           greeting: "Welcome, I'm Sofia. We're often our own harshest critics. I'm here to help you find a gentler way to speak to yourself." },
  oliver: { name: 'Oliver', role: 'Sleep & Serenity',        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Oliver&backgroundColor=e2e8f0', personality: 'Very calm, slow-paced, soothing tone. Focuses on letting go of the day and relaxation techniques.',                             greeting: "Hello. I'm Oliver. Take a moment to unclench your jaw and drop your shoulders. I'm here to help you find some peace." },
};

const MOOD_LABELS = {
  happy: 'Happy', calm: 'Calm', anxious: 'Anxious',
  sad: 'Sad', angry: 'Angry', tired: 'Tired',
};

const MOOD_MENTOR_MAP = {
  happy: 'kai', calm: 'luna', anxious: 'marcus',
  sad: 'sarah', angry: 'marcus', tired: 'oliver',
};

const SAFETY = `
Guidelines:
- Be warm, empathetic, and non-judgmental.
- Use active listening techniques (reflect feelings, validate emotions).
- Ask open-ended questions to help users explore their thoughts.
- Suggest evidence-based coping strategies when appropriate (deep breathing, journaling, reframing thoughts).
- Recognize your limitations - you're not a therapist and cannot diagnose or treat.
- If someone mentions self-harm, suicide, or crisis: immediately provide crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line: text HOME to 741741).
- Encourage professional help for serious concerns.
- Keep responses conversational (2-4 paragraphs typically).
- End responses with a thoughtful question to continue the dialogue.

Never:
- Diagnose mental health conditions.
- Prescribe medication or treatments.
- Make promises about outcomes.
- Share personal information about yourself.
- Engage in topics unrelated to mental health support.
`;

// ============================================================
// STATE
// ============================================================

const state = {
  currentMentorId: null,
  messages: [],
  chatHistory: [],
  isTyping: false,
};

// ============================================================
// ELEMENT REFS
// ============================================================

const el = {
  disclaimerScreen: document.getElementById('disclaimer-screen'),
  selectorScreen:   document.getElementById('selector-screen'),
  chatScreen:       document.getElementById('chat-screen'),
  apiKeyModal:      document.getElementById('apikey-modal'),

  moodPicker:      document.getElementById('mood-picker'),
  moodDisplay:     document.getElementById('mood-display'),
  chooseHeading:   document.getElementById('choose-mentor-heading'),
  currentMoodLbl:  document.getElementById('current-mood-label'),
  recommendedName: document.getElementById('recommended-mentor-name'),

  chatAvatar: document.getElementById('chat-mentor-avatar'),
  chatName:   document.getElementById('chat-mentor-name'),
  chatRole:   document.getElementById('chat-mentor-role'),
  messages:   document.getElementById('chat-messages'),
  input:      document.getElementById('chat-input'),
  sendBtn:    document.getElementById('btn-send'),

  apiKeyInput: document.getElementById('api-key-input'),
};

// ============================================================
// SCREEN ROUTING
// ============================================================

function showScreen(which) {
  el.disclaimerScreen.classList.toggle('hidden', which !== 'disclaimer');
  el.selectorScreen.classList.toggle('hidden', which !== 'selector');
  el.chatScreen.classList.toggle('hidden', which !== 'chat');
}

// ============================================================
// API KEY — prefer .env, fall back to localStorage
// ============================================================

let envApiKey = '';

async function loadEnv() {
  try {
    const res = await fetch('.env', { cache: 'no-store' });
    if (!res.ok) return;
    const text = await res.text();
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key === 'GEMINI_API_KEY' && val) envApiKey = val;
    }
  } catch {
    // .env missing or unreachable (e.g. file:// protocol) — fall back silently
  }
}

const getApiKey = () => envApiKey || localStorage.getItem('haven_gemini_api_key') || '';
const setApiKey = (k) => localStorage.setItem('haven_gemini_api_key', k);

function openApiKeyModal() {
  el.apiKeyInput.value = getApiKey();
  el.apiKeyModal.classList.remove('hidden');
}
function closeApiKeyModal() { el.apiKeyModal.classList.add('hidden'); }

// ============================================================
// MOOD
// ============================================================

function selectMood(moodId) {
  const label = MOOD_LABELS[moodId];
  const mentorId = MOOD_MENTOR_MAP[moodId] || 'sarah';
  el.currentMoodLbl.textContent = label;
  el.recommendedName.textContent = MENTORS[mentorId].name;
  el.moodPicker.classList.add('hidden');
  el.moodDisplay.classList.remove('hidden');
  el.chooseHeading.classList.remove('hidden');
}

function clearMood() {
  el.moodPicker.classList.remove('hidden');
  el.moodDisplay.classList.add('hidden');
  el.chooseHeading.classList.add('hidden');
}

// ============================================================
// CHAT
// ============================================================

function openChat(mentorId) {
  const mentor = MENTORS[mentorId];
  if (!mentor) return;

  state.currentMentorId = mentorId;
  state.messages = [];
  state.chatHistory = [];
  state.isTyping = true;

  el.chatAvatar.src = mentor.avatar;
  el.chatAvatar.alt = mentor.name;
  el.chatName.textContent = mentor.name;
  el.chatRole.textContent = mentor.role;
  el.input.value = '';
  updateSendButton();

  showScreen('chat');
  renderMessages();

  setTimeout(() => {
    state.messages.push({ role: 'model', text: mentor.greeting, timestamp: new Date() });
    state.isTyping = false;
    renderMessages();
    el.input.focus();
  }, 800);
}

function leaveChat() {
  state.currentMentorId = null;
  state.messages = [];
  state.chatHistory = [];
  state.isTyping = false;
  clearMood();
  showScreen('selector');
}

async function sendMessage() {
  const text = el.input.value.trim();
  if (!text || state.isTyping) return;

  const mentor = MENTORS[state.currentMentorId];
  state.messages.push({ role: 'user', text, timestamp: new Date() });
  state.chatHistory.push({ role: 'user', parts: [{ text }] });
  state.isTyping = true;
  el.input.value = '';
  updateSendButton();
  renderMessages();

  const apiKey = getApiKey();
  let reply;
  if (!apiKey) {
    reply = "Please set your Gemini API key to use this feature. Click the key icon in the header.";
  } else {
    reply = await callGemini(apiKey, mentor);
  }

  state.messages.push({ role: 'model', text: reply, timestamp: new Date() });
  state.chatHistory.push({ role: 'model', parts: [{ text: reply }] });
  state.isTyping = false;
  renderMessages();
}

async function callGemini(apiKey, mentor) {
  const systemInstruction = `
You are a compassionate AI mental health support companion.
Your Name: ${mentor.name}
Your Role: ${mentor.role}
Your Personality/Style: ${mentor.personality}
${SAFETY}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: state.chatHistory,
          generationConfig: { temperature: 0.7 },
        }),
      }
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "I'm listening, but I had trouble processing that. Could you say it again?";
  } catch (err) {
    console.error('Gemini error:', err);
    return "I'm having a little technical trouble connecting right now. Can we try again in a moment?";
  }
}

// ============================================================
// MESSAGE RENDERING
// ============================================================

function renderMessages() {
  const mentor = MENTORS[state.currentMentorId];
  el.messages.innerHTML = '';

  for (const msg of state.messages) {
    el.messages.appendChild(buildMessage(msg, mentor));
  }
  if (state.isTyping) {
    el.messages.appendChild(buildTypingIndicator(mentor));
  }

  el.messages.scrollTop = el.messages.scrollHeight;
}

function buildMessage(msg, mentor) {
  const isUser = msg.role === 'user';
  const row = document.createElement('div');
  row.className = `message-row ${isUser ? 'user' : 'ai'}`;

  const group = document.createElement('div');
  group.className = 'message-group';

  if (!isUser && mentor) {
    const img = document.createElement('img');
    img.className = 'message-avatar';
    img.src = mentor.avatar;
    img.alt = mentor.name;
    group.appendChild(img);
  }

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = msg.text;

  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  bubble.appendChild(time);

  group.appendChild(bubble);
  row.appendChild(group);
  return row;
}

function buildTypingIndicator(mentor) {
  const row = document.createElement('div');
  row.className = 'typing-row';

  if (mentor) {
    const img = document.createElement('img');
    img.className = 'message-avatar';
    img.src = mentor.avatar;
    img.alt = mentor.name;
    row.appendChild(img);
  }

  const ind = document.createElement('div');
  ind.className = 'typing-indicator';
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div');
    d.className = 'typing-dot';
    ind.appendChild(d);
  }
  row.appendChild(ind);
  return row;
}

function updateSendButton() {
  el.sendBtn.disabled = !el.input.value.trim() || state.isTyping;
}

// ============================================================
// TRANSCRIPT DOWNLOAD
// ============================================================

function downloadTranscript() {
  const mentor = MENTORS[state.currentMentorId];
  if (!mentor) return;
  const text = state.messages
    .map(m => `[${m.timestamp.toLocaleTimeString()}] ${m.role === 'user' ? 'You' : mentor.name}: ${m.text}`)
    .join('\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${mentor.name.toLowerCase()}-chat-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// EVENT WIRING
// ============================================================

document.getElementById('btn-accept-disclaimer').addEventListener('click', () => {
  localStorage.setItem('haven_disclaimer_accepted', 'true');
  showScreen('selector');
});

document.getElementById('btn-apikey').addEventListener('click', openApiKeyModal);
document.getElementById('btn-cancel-apikey').addEventListener('click', closeApiKeyModal);
document.getElementById('btn-save-apikey').addEventListener('click', () => {
  setApiKey(el.apiKeyInput.value.trim());
  closeApiKeyModal();
});

document.querySelectorAll('[data-mood]').forEach(btn => {
  btn.addEventListener('click', () => selectMood(btn.dataset.mood));
});

document.getElementById('btn-change-mood').addEventListener('click', clearMood);

document.querySelectorAll('[data-mentor]').forEach(btn => {
  btn.addEventListener('click', () => openChat(btn.dataset.mentor));
});

document.getElementById('btn-back').addEventListener('click', leaveChat);
document.getElementById('btn-download').addEventListener('click', downloadTranscript);

el.input.addEventListener('input', updateSendButton);
el.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
el.sendBtn.addEventListener('click', sendMessage);

// ============================================================
// INIT
// ============================================================

loadEnv();

if (localStorage.getItem('haven_disclaimer_accepted') === 'true') {
  showScreen('selector');
} else {
  showScreen('disclaimer');
}
