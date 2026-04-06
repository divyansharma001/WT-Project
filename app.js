// ============================================================
// DATA & CONSTANTS
// ============================================================

const BASE_SAFETY_INSTRUCTION = `
Guidelines:
- Be warm, empathetic, and non-judgmental.
- Use active listening techniques (reflect feelings, validate emotions).
- Ask open-ended questions to help users explore their thoughts.
- Suggest evidence-based coping strategies when appropriate (deep breathing, journaling, reframing thoughts).
- Recognize your limitations - you're not a therapist and cannot diagnose or treat.
- If someone mentions self-harm, suicide, or crisis: immediately provide crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line: text HOME to 741741).
- Encourage professional help for serious concerns.
- Maintain appropriate boundaries - be supportive but professional.
- Remember context from the conversation to provide personalized support.
- Keep responses conversational (2-4 paragraphs typically).
- End responses with a thoughtful question to continue the dialogue.

Never:
- Diagnose mental health conditions.
- Prescribe medication or treatments.
- Make promises about outcomes.
- Share personal information about yourself.
- Engage in topics unrelated to mental health support.
`;

function getSystemInstruction(mentor) {
  return `
You are a compassionate AI mental health support companion.
Your Name: ${mentor.name}
Your Role: ${mentor.role}
Your Personality/Style: ${mentor.personality}

${BASE_SAFETY_INSTRUCTION}
`;
}

const MENTORS = [
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'Compassionate Listener',
    description: 'A warm and gentle presence for when you just need to be heard and understood.',
    avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Sarah&backgroundColor=e0f2fe',
    personality: 'Warm, patient, gentle, focusing on validation and emotional support.',
    greeting: "Hi, I'm Sarah. I'm here to listen without judgment. How are you feeling today?"
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Coping Strategist',
    description: 'Focused on practical tools and cognitive techniques to help manage stress and anxiety.',
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Marcus&backgroundColor=ffedd5',
    personality: 'Calm, grounded, solution-oriented but empathetic. Uses CBT concepts gently.',
    greeting: "Hello. I'm Marcus. Dealing with life's challenges can be tough, but we can work through them together. What's on your mind?"
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Mindfulness Coach',
    description: 'Helps you find center and calm through breathing, grounding, and present-moment awareness.',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Luna&backgroundColor=f3e8ff',
    personality: 'Serene, slow-paced, metaphorical. Focuses on breathing and grounding.',
    greeting: "Welcome. I'm Luna. Let's take a deep breath together. What brings you here today?"
  },
  {
    id: 'kai',
    name: 'Kai',
    role: 'Motivation & Growth',
    description: 'An encouraging guide to help you find your strength and navigate personal growth.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Kai&backgroundColor=dcfce7',
    personality: 'Optimistic, energetic (but not overwhelming), encouraging, focuses on strengths.',
    greeting: "Hey there, I'm Kai. I believe you have the strength to get through this. What are you facing right now?"
  },
  {
    id: 'elena',
    name: 'Elena',
    role: 'Relationship Guide',
    description: 'Helps navigate complex emotions in relationships, loneliness, and social connection.',
    avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Elena&backgroundColor=fce7f3',
    personality: 'Insightful, gentle but direct about boundaries, focuses on communication and self-worth in context of others.',
    greeting: "Hello, I'm Elena. Relationships can be complicated. I'm here to help you navigate your connections with others and yourself."
  },
  {
    id: 'david',
    name: 'David',
    role: 'Burnout & Stress',
    description: 'A supportive voice for managing work stress, finding balance, and overcoming overwhelm.',
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=David&backgroundColor=e0e7ff',
    personality: 'Structured yet understanding, focuses on setting limits, prioritizing rest, and separating worth from productivity.',
    greeting: "Hi, I'm David. It's easy to carry the weight of the world on your shoulders. Let's see if we can lighten that load a bit."
  },
  {
    id: 'sofia',
    name: 'Sofia',
    role: 'Self-Compassion',
    description: 'Teaches you to be kind to yourself and silence the harsh inner critic.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia&backgroundColor=fff7ed',
    personality: 'Nurturing, focuses on rephrasing negative self-talk, finding softness, and radical self-acceptance.',
    greeting: "Welcome, I'm Sofia. We're often our own harshest critics. I'm here to help you find a gentler way to speak to yourself."
  },
  {
    id: 'oliver',
    name: 'Oliver',
    role: 'Sleep & Serenity',
    description: 'Helping you unwind, detach from the day, and find a state of rest.',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Oliver&backgroundColor=e2e8f0',
    personality: 'Very calm, slow-paced, soothing tone. Focuses on letting go of the day and relaxation techniques.',
    greeting: "Hello. I'm Oliver. Take a moment to unclench your jaw and drop your shoulders. I'm here to help you find some peace."
  }
];

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '\u{1F60A}', color: 'bg-orange-50' },
  { id: 'calm', label: 'Calm', emoji: '\u{1F60C}', color: 'bg-green-50' },
  { id: 'anxious', label: 'Anxious', emoji: '\u{1F630}', color: 'bg-yellow-50' },
  { id: 'sad', label: 'Sad', emoji: '\u{1F622}', color: 'bg-blue-50' },
  { id: 'angry', label: 'Angry', emoji: '\u{1F620}', color: 'bg-red-50' },
  { id: 'tired', label: 'Tired', emoji: '\u{1F634}', color: 'bg-slate-50' },
];

const MOOD_MENTOR_MAP = {
  happy: 'kai',
  calm: 'luna',
  anxious: 'marcus',
  sad: 'sarah',
  angry: 'marcus',
  tired: 'oliver',
};

// ============================================================
// SVG ICONS (replacing lucide-react)
// ============================================================

const ICONS = {
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
};

const LOGO_SVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="haven logo">
  <path d="M50 20C50 20 70 45 70 65C70 80 60 90 50 90C40 90 30 80 30 65C30 45 50 20 50 20Z" fill="#0ea5e9"/>
  <path d="M50 90C50 90 20 80 15 55C12 45 25 35 35 50C40 58 50 75 50 90Z" fill="#38bdf8" opacity="0.9"/>
  <path d="M50 90C50 90 80 80 85 55C88 45 75 35 65 50C60 58 50 75 50 90Z" fill="#38bdf8" opacity="0.9"/>
  <path d="M50 90C50 90 35 88 25 75" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round"/>
  <path d="M50 90C50 90 65 88 75 75" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round"/>
  <circle cx="50" cy="12" r="4" fill="#7dd3fc"/>
</svg>`;

// ============================================================
// GEMINI SERVICE
// ============================================================

let chatHistory = [];
let currentSystemInstruction = '';

async function initializeChat(systemInstruction) {
  chatHistory = [];
  currentSystemInstruction = systemInstruction;
}

async function sendMessageToAI(text) {
  chatHistory.push({ role: 'user', parts: [{ text }] });

  const apiKey = getApiKey();
  if (!apiKey) {
    return "Please set your Gemini API key to use this feature. Click the key icon in the header.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: currentSystemInstruction }] },
          contents: chatHistory,
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm listening, but I had trouble processing that. Could you say it again?";

    chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
    return aiText;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    return "I'm having a little technical trouble connecting right now. Please know I want to be here for you. Can we try again in a moment?";
  }
}

// ============================================================
// API KEY MANAGEMENT
// ============================================================

function getApiKey() {
  return localStorage.getItem('haven_gemini_api_key') || '';
}

function setApiKey(key) {
  localStorage.setItem('haven_gemini_api_key', key);
}

// ============================================================
// STATE
// ============================================================

const state = {
  selectedMood: null,
  selectedMentorId: null,
  currentMentor: null,
  messages: [],
  inputText: '',
  isTyping: false,
  disclaimerAccepted: localStorage.getItem('haven_disclaimer_accepted') === 'true',
  showApiKeyModal: false,
};

// ============================================================
// RENDERING
// ============================================================

const root = document.getElementById('root');

function render() {
  if (!state.disclaimerAccepted) {
    root.innerHTML = renderDisclaimer();
    bindDisclaimerEvents();
    return;
  }

  if (state.showApiKeyModal) {
    // Render behind + modal overlay
    root.innerHTML = renderApp() + renderApiKeyModal();
    bindApiKeyModalEvents();
    return;
  }

  root.innerHTML = renderApp();
  bindAppEvents();
}

function renderApp() {
  return `
    <div class="relative w-full min-h-dvh bg-slate-50 flex flex-col font-sans overflow-hidden">
      <main class="flex-1 flex flex-col w-full overflow-hidden">
        ${state.selectedMentorId && state.currentMentor
          ? renderChatInterface()
          : renderMentorSelector()}
      </main>
    </div>
  `;
}

// ============================================================
// DISCLAIMER MODAL
// ============================================================

function renderDisclaimer() {
  return `
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6">
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 sm:p-6 animate-slide-up">
        <div class="flex justify-center mb-5 sm:mb-6">
          <div class="bg-serene-50 p-3 sm:p-4 rounded-full">
            <div class="w-8 sm:w-10 h-8 sm:h-10">${LOGO_SVG}</div>
          </div>
        </div>
        <h2 class="text-xl sm:text-2xl font-semibold text-center text-slate-800 mb-2">Welcome to haven</h2>
        <p class="text-slate-500 text-center mb-5 sm:mb-6 text-sm">A supportive space for your mental well-being.</p>

        <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
          <div class="flex gap-3">
            <span class="text-amber-600 flex-shrink-0 mt-0.5">${ICONS.alertCircle}</span>
            <div class="text-sm text-slate-700">
              <p class="font-semibold text-amber-800 mb-1">Important Disclaimer</p>
              <p class="text-xs sm:text-sm">I am an AI assistant, not a licensed professional. I cannot diagnose medical conditions or prescribe treatment.</p>
              <p class="mt-2 text-xs sm:text-sm">This service is for emotional support and self-help strategies. It is <strong>not</strong> a replacement for professional therapy.</p>
            </div>
          </div>
        </div>

        <button id="btn-accept-disclaimer" class="w-full bg-serene-600 hover:bg-serene-700 text-white font-medium py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-serene-200 text-sm sm:text-base">
          I Understand & Agree
        </button>
        <p class="text-[11px] sm:text-xs text-slate-400 text-center mt-3 sm:mt-4">
          Your conversations are private but stored in temporary memory for this session only.
        </p>
      </div>
    </div>
  `;
}

function bindDisclaimerEvents() {
  document.getElementById('btn-accept-disclaimer')?.addEventListener('click', () => {
    state.disclaimerAccepted = true;
    localStorage.setItem('haven_disclaimer_accepted', 'true');
    render();
  });
}

// ============================================================
// API KEY MODAL
// ============================================================

function renderApiKeyModal() {
  const currentKey = getApiKey();
  return `
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6">
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 sm:p-6 animate-slide-up">
        <h2 class="text-lg font-semibold text-slate-800 mb-2">Gemini API Key</h2>
        <p class="text-sm text-slate-500 mb-4">Enter your Google Gemini API key to enable AI responses. Your key is stored locally in your browser.</p>
        <input id="api-key-input" type="password" value="${currentKey}" placeholder="AIza..." class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-serene-200 focus:border-serene-400 outline-none mb-4" />
        <div class="flex gap-3">
          <button id="btn-cancel-apikey" class="flex-1 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
          <button id="btn-save-apikey" class="flex-1 px-4 py-2.5 text-sm text-white bg-serene-600 hover:bg-serene-700 rounded-xl transition-colors shadow-md shadow-serene-200">Save</button>
        </div>
      </div>
    </div>
  `;
}

function bindApiKeyModalEvents() {
  // Also bind the underlying app events
  bindAppEvents();

  document.getElementById('btn-cancel-apikey')?.addEventListener('click', () => {
    state.showApiKeyModal = false;
    render();
  });
  document.getElementById('btn-save-apikey')?.addEventListener('click', () => {
    const input = document.getElementById('api-key-input');
    if (input) {
      setApiKey(input.value.trim());
    }
    state.showApiKeyModal = false;
    render();
  });
}

// ============================================================
// MENTOR SELECTOR VIEW
// ============================================================

function renderMentorSelector() {
  return `
    <div class="flex flex-col w-full h-full bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100/50 overflow-y-auto pb-8 sm:pb-10">
      <div class="flex-1 flex flex-col px-4 py-8 sm:px-6 md:px-8 max-w-4xl mx-auto w-full animate-fade-in">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6 sm:mb-8">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-serene-100 to-serene-50 shadow-sm border border-serene-100">
                <div class="w-6 h-6">${LOGO_SVG}</div>
              </div>
            </div>
            <div class="flex flex-col justify-center">
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900">haven</h1>
              <p class="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide leading-none">Your Mental Health Companion</p>
            </div>
          </div>
          <button id="btn-apikey" class="p-2 text-slate-400 hover:text-serene-600 hover:bg-serene-50 rounded-full transition-colors" title="Set API Key">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
          </button>
        </div>

        ${!state.selectedMood ? renderMoodPicker() : renderSelectedMoodDisplay()}

        ${state.selectedMood ? `<h2 class="text-base sm:text-lg text-slate-700 mb-6 font-medium">Choose your mentor</h2>` : ''}

        <!-- Mentor Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-8">
          ${MENTORS.map((mentor, i) => renderMentorCard(mentor, i)).join('')}
        </div>

        ${renderFooterNote()}
      </div>
    </div>
  `;
}

function renderMoodPicker() {
  return `
    <div class="mb-8 sm:mb-10">
      <h2 class="text-base sm:text-lg text-slate-700 mb-4 font-medium">How are you feeling today?</h2>
      <div class="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        ${MOODS.map((mood, i) => `
          <button data-mood="${mood.id}" class="group relative bg-white border border-slate-100 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg hover:border-serene-200 transition-all duration-300 flex flex-col items-center justify-center gap-2 active:bg-slate-50 sm:active:bg-white" style="animation-delay: ${i * 50}ms">
            <span class="font-semibold text-sm sm:text-base text-slate-800 group-hover:text-serene-600 text-center leading-tight">${mood.label}</span>
          </button>
        `).join('')}
      </div>
      <div class="p-3 sm:p-4 bg-serene-50 border border-serene-100 rounded-2xl">
        <p class="text-xs sm:text-sm text-serene-800 leading-relaxed">
          <span class="font-semibold">Tip:</span> Select your mood and we'll automatically recommend the best mentor for you. But don't worry, you can still chat with any other mentor manually!
        </p>
      </div>
    </div>
  `;
}

function renderSelectedMoodDisplay() {
  const mood = state.selectedMood;
  const mentorName = state.currentMentor?.name || 'a mentor';
  return `
    <div class="mb-8 sm:mb-10">
      <div class="flex items-center gap-3 p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm mb-5">
        <div class="flex-1">
          <p class="text-xs sm:text-sm text-slate-500">You're feeling</p>
          <p class="font-semibold text-slate-800 text-sm sm:text-base">${mood.label}</p>
        </div>
        <button id="btn-change-mood" class="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">Change</button>
      </div>
      <div class="p-3 sm:p-4 bg-serene-50 border border-serene-100 rounded-2xl mb-6">
        <p class="text-xs sm:text-sm text-serene-800 leading-relaxed">
          <span class="font-semibold">\u2728 Perfect!</span> We've recommended <span class="font-semibold">${mentorName}</span> based on your mood. You can also explore and chat with other mentors below if you'd like a different perspective.
        </p>
      </div>
    </div>
  `;
}

function renderMentorCard(mentor, index) {
  return `
    <button data-mentor="${mentor.id}" class="group relative bg-white border border-slate-100 p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-serene-200 transition-all duration-300 text-left flex flex-col sm:flex-row items-center sm:items-start gap-4 active:bg-slate-50 sm:active:bg-white" style="animation-delay: ${index * 100}ms">
      <div class="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-300">
        <img src="${mentor.avatar}" alt="${mentor.name}" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 text-center sm:text-left">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
          <h3 class="font-bold text-base sm:text-lg text-slate-800 group-hover:text-serene-600 transition-colors">${mentor.name}</h3>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-full group-hover:bg-serene-50 group-hover:text-serene-600 transition-colors w-fit mx-auto sm:mx-0">Select</span>
        </div>
        <p class="text-xs sm:text-sm font-medium text-serene-600 mb-2">${mentor.role}</p>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">${mentor.description}</p>
      </div>
    </button>
  `;
}

function renderFooterNote() {
  return `
    <div class="w-full px-3 sm:px-4 py-1">
      <div class="mx-auto max-w-4xl text-center">
        <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] leading-tight text-serene-700 bg-serene-50 border border-serene-100">
          We don't store your chats. Your conversations are safe.
        </span>
      </div>
    </div>
  `;
}

// ============================================================
// CHAT INTERFACE VIEW
// ============================================================

function renderChatInterface() {
  const mentor = state.currentMentor;
  return `
    <div class="flex flex-col w-full h-dvh bg-slate-50 relative">
      <!-- Header -->
      <header class="bg-white px-3 sm:px-4 py-2 sm:py-3 shadow-sm flex items-center justify-between z-10 flex-shrink-0">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <button id="btn-back" class="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex-shrink-0" aria-label="Back">
            ${ICONS.arrowLeft}
          </button>
          <div class="relative flex-shrink-0">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 overflow-hidden shadow-sm border border-slate-100">
              <img src="${mentor.avatar}" alt="${mentor.name}" class="w-full h-full object-cover" />
            </div>
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div class="min-w-0">
            <h1 class="font-semibold text-slate-800 text-sm sm:text-base truncate">${mentor.name}</h1>
            <p class="text-[11px] sm:text-xs text-serene-600 font-medium truncate">${mentor.role}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <button id="btn-download" title="Download Transcript" class="p-2 text-slate-400 hover:text-serene-600 hover:bg-serene-50 rounded-full transition-colors" aria-label="Download transcript">
            ${ICONS.download}
          </button>
        </div>
      </header>

      <!-- Chat Area -->
      <div id="chat-messages" class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 pb-2 scrollbar-hide">
        ${state.messages.map(msg => renderMessage(msg, mentor)).join('')}
        ${state.isTyping ? renderTypingIndicator(mentor) : ''}
        ${renderFooterNote()}
      </div>

      <!-- Input Area -->
      <div class="flex-shrink-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20 px-3 sm:px-4 py-2 sm:py-3">
        <div class="max-w-4xl mx-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-2.5 sm:px-3 py-1.5 focus-within:ring-2 focus-within:ring-serene-100 focus-within:border-serene-300 transition-all">
          <input
            id="chat-input"
            type="text"
            value="${escapeHtml(state.inputText)}"
            placeholder="Message ${mentor.name}..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400 px-2 sm:px-3 py-1 outline-none"
            ${state.isTyping ? 'disabled' : ''}
          />
          <button
            id="btn-send"
            ${!state.inputText.trim() || state.isTyping ? 'disabled' : ''}
            class="p-2 sm:p-2.5 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
              !state.inputText.trim() || state.isTyping
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-serene-600 text-white shadow-md shadow-serene-200 hover:bg-serene-700 active:scale-95'
            }"
            aria-label="Send message"
          >
            ${ICONS.send}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMessage(msg, mentor) {
  const isUser = msg.role === 'user';
  const timeStr = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `
    <div class="flex w-full ${isUser ? 'justify-end' : 'justify-start'}">
      <div class="flex max-w-[90%] sm:max-w-[75%] md:max-w-[65%] gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}">
        ${!isUser ? `
          <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm">
            <img src="${mentor.avatar}" alt="${mentor.name}" class="w-full h-full object-cover" />
          </div>
        ` : ''}
        <div class="px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-serene-600 text-white rounded-tr-none'
            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
        }">
          ${escapeHtml(msg.text)}
          <div class="text-[9px] mt-1 opacity-60 text-right ${isUser ? 'text-blue-100' : 'text-slate-400'}">
            ${timeStr}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTypingIndicator(mentor) {
  return `
    <div class="flex justify-start w-full animate-fade-in">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
          <img src="${mentor.avatar}" alt="${mentor.name}" class="w-full h-full object-cover" />
        </div>
        <div class="bg-white border border-slate-100 px-3 sm:px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
          <div class="w-2 h-2 bg-serene-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-serene-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-serene-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// EVENT BINDING
// ============================================================

function bindAppEvents() {
  // API Key button
  document.getElementById('btn-apikey')?.addEventListener('click', () => {
    state.showApiKeyModal = true;
    render();
  });

  // Mood selection
  document.querySelectorAll('[data-mood]').forEach(btn => {
    btn.addEventListener('click', () => {
      const moodId = btn.dataset.mood;
      const mood = MOODS.find(m => m.id === moodId);
      if (mood) {
        state.selectedMood = mood;
        // Auto-select mentor
        const mentorId = MOOD_MENTOR_MAP[mood.id] || 'sarah';
        state.currentMentor = MENTORS.find(m => m.id === mentorId) || null;
        render();
      }
    });
  });

  // Change mood
  document.getElementById('btn-change-mood')?.addEventListener('click', () => {
    state.selectedMood = null;
    state.currentMentor = null;
    state.selectedMentorId = null;
    render();
  });

  // Mentor selection
  document.querySelectorAll('[data-mentor]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mentorId = btn.dataset.mentor;
      const mentor = MENTORS.find(m => m.id === mentorId);
      if (mentor) {
        selectMentor(mentor);
      }
    });
  });

  // Chat: Back button
  document.getElementById('btn-back')?.addEventListener('click', handleReset);

  // Chat: Download
  document.getElementById('btn-download')?.addEventListener('click', downloadTranscript);

  // Chat: Input
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('input', (e) => {
      state.inputText = e.target.value;
      updateSendButton();
    });
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    // Restore focus
    chatInput.focus();
    // Move cursor to end
    chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
  }

  // Chat: Send button
  document.getElementById('btn-send')?.addEventListener('click', handleSend);

  // Auto-scroll chat
  scrollChatToBottom();
}

function updateSendButton() {
  const btn = document.getElementById('btn-send');
  if (!btn) return;
  const hasText = state.inputText.trim().length > 0;
  btn.disabled = !hasText || state.isTyping;
  if (!hasText || state.isTyping) {
    btn.className = 'p-2 sm:p-2.5 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 bg-slate-200 text-slate-400 cursor-not-allowed';
  } else {
    btn.className = 'p-2 sm:p-2.5 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 bg-serene-600 text-white shadow-md shadow-serene-200 hover:bg-serene-700 active:scale-95';
  }
}

function scrollChatToBottom() {
  const chatMessages = document.getElementById('chat-messages');
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// ============================================================
// ACTIONS
// ============================================================

async function selectMentor(mentor) {
  state.currentMentor = mentor;
  state.selectedMentorId = mentor.id;
  state.messages = [];
  state.inputText = '';
  state.isTyping = true;

  render();

  // Initialize chat
  const systemInstruction = getSystemInstruction(mentor);
  await initializeChat(systemInstruction);

  // Show greeting after a short delay
  setTimeout(() => {
    state.messages = [
      {
        id: 'init-1',
        role: 'model',
        text: mentor.greeting,
        timestamp: new Date(),
      },
    ];
    state.isTyping = false;
    render();
  }, 800);
}

function handleReset() {
  state.selectedMood = null;
  state.selectedMentorId = null;
  state.currentMentor = null;
  state.messages = [];
  state.inputText = '';
  state.isTyping = false;
  render();
}

async function handleSend() {
  if (!state.inputText.trim() || state.isTyping) return;

  const userMsgText = state.inputText.trim();
  state.inputText = '';

  const userMsg = {
    id: Date.now().toString(),
    role: 'user',
    text: userMsgText,
    timestamp: new Date(),
  };

  state.messages.push(userMsg);
  state.isTyping = true;
  render();

  try {
    const responseText = await sendMessageToAI(userMsgText);
    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date(),
    };
    state.messages.push(aiMsg);
  } catch (error) {
    console.error(error);
  } finally {
    state.isTyping = false;
    render();
  }
}

function downloadTranscript() {
  const mentor = state.currentMentor;
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
// UTILITY
// ============================================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================
// INIT
// ============================================================

render();
