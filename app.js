// app.js — Amal Neko Ultra-Cute Study & Task App Logic

// State Management
let tasks = JSON.parse(localStorage.getItem('amal_study_todos_v3') || '[]');
let currentFilter = 'all';
let currentSort = 'created-desc';
let searchQuery = '';
let soundEnabled = localStorage.getItem('amal_sound_enabled') !== 'false';
let notifPermission = ('Notification' in window) ? Notification.permission : 'default';

// Curated Modern Vector SVG Graphics (No OS Emojis) with Harmonious Vibrant Palettes
const CATEGORY_GRAPHICS = {
  book: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  exam: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  lab: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M10 2v7.31L4.1 19.6A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.7-2.4L14 9.31V2z"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
  code: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  target: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  briefcase: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  palette: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d946ef" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.01 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.52-4.48-9.5-10-9.5z"/></svg>`,
  idea: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>`,
  flame: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  coffee: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  paw: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff75c3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M12 5c-3 0-5 2-6 4-2-2-4-1-4 2 0 4 3 8 10 8s10-4 10-8c0-3-2-4-4-2-1-2-3-4-6-4z"/><circle cx="9" cy="11" r="1.2" fill="#ff75c3"/><circle cx="15" cy="11" r="1.2" fill="#ff75c3"/></svg>`,
  star: `<svg class="cat-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const defaultCategories = [
  { key: 'assignment', name: 'Assignment', icon: CATEGORY_GRAPHICS.book },
  { key: 'project', name: 'Project', icon: CATEGORY_GRAPHICS.briefcase },
  { key: 'study', name: 'Study & Exam', icon: CATEGORY_GRAPHICS.exam },
  { key: 'home', name: 'Home & Personal', icon: CATEGORY_GRAPHICS.coffee }
];

let rawCustomCats = JSON.parse(localStorage.getItem('amal_custom_categories') || '[]');
let customCategories = rawCustomCats.map(c => {
  let icon = '';
  if (c.graphic && CATEGORY_GRAPHICS[c.graphic]) {
    icon = CATEGORY_GRAPHICS[c.graphic];
  } else if (c.icon && c.icon.startsWith('<svg')) {
    icon = c.icon;
  }
  return {
    key: c.key,
    name: c.name,
    graphic: c.graphic || '',
    icon: icon
  };
});

let allCategories = [...defaultCategories, ...customCategories];

function saveCustomCategories() {
  localStorage.setItem('amal_custom_categories', JSON.stringify(customCategories));
  allCategories = [...defaultCategories, ...customCategories];
  renderCategoryDropdowns();
}

// Initial Sample Study Tasks with Sub-tasks
if (!localStorage.getItem('amal_neko_initialized')) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  tasks = [
    {
      id: 1,
      text: 'Calculus & Linear Algebra Assignment',
      completed: false,
      priority: 'urgent',
      category: 'assignment',
      dueDate: today,
      createdAt: Date.now() - 3600000,
      subtasks: [
        { id: 101, text: 'Solve Problem Set 4 (Matrix Transformations)', completed: true },
        { id: 102, text: 'Review Calculus Derivative Proofs', completed: false },
        { id: 103, text: 'Submit PDF to Student Portal', completed: false }
      ]
    },
    {
      id: 2,
      text: 'Physics Lab Prototype & Presentation',
      completed: false,
      priority: 'high',
      category: 'project',
      dueDate: tomorrow,
      createdAt: Date.now(),
      subtasks: [
        { id: 201, text: 'Record sensor data readings', completed: true },
        { id: 202, text: 'Draft conclusion slide', completed: false }
      ]
    },
    {
      id: 3,
      text: 'Midterm Exam Chapter 4 & 5 Review',
      completed: true,
      priority: 'medium',
      category: 'study',
      dueDate: tomorrow,
      createdAt: Date.now() - 7200000,
      subtasks: []
    }
  ];
  saveTasks();
  localStorage.setItem('amal_neko_initialized', 'true');
}

function saveTasks() {
  localStorage.setItem('amal_study_todos_v3', JSON.stringify(tasks));
}

// ===================================================
// ===================================================
//  PROCEDURAL WEB AUDIO SYNTHESIZER (Meow & Purr)
// ===================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Cute Kitten "Mee-oww" Synthesizer 
function playMeowSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // Main vocal oscillator (Triangle for warm vocal tone)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Formant Filter for realistic cat vocal tract
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, t);
    filter.Q.setValueAtTime(2.5, t);

    osc.type = 'triangle';
    // Pitch curve: 480Hz -> 760Hz ("Meee") -> 400Hz ("Owww")
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(760, t + 0.16);
    osc.frequency.exponentialRampToValueAtTime(390, t + 0.45);

    // Volume Envelope
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.46);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.46);
  } catch (e) {
    console.error('Meow audio error:', e);
  }
}

// Cute Purr Motor Sound Effect
function playPurrSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const gain = ctx.createGain();
    const modGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.6);

    mod.type = 'sawtooth';
    mod.frequency.setValueAtTime(26, t); // 26Hz vibration
    modGain.gain.setValueAtTime(55, t);

    mod.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    mod.start(t);
    osc.start(t);
    mod.stop(t + 0.6);
    osc.stop(t + 0.6);
  } catch (e) {
    console.error('Purr audio error:', e);
  }
}

// Crystal Chime for Task Completion & Notifications
function playChimeSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.45);
    });
  } catch (e) {}
}

// Pop sound for buttons/checkboxes
function playPopSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

// ===================================================
//  CAT MASCOT INTERACTION (Tap for Meow / Purr Speech)
// ===================================================
const catMascotEl = document.getElementById('cat-mascot');
const purrSpeechEl = document.getElementById('purr-speech');
let purrSpeechTimeout = null;
let meowToggle = false;

const catQuotes = [
  'Meow!',
  'Purrrrr...',
  'Nyaa~ A+ for you! 😻',
  'Study hard, take cozy breaks! 📚',
  'You got this! 💖',
  'Mew mew!✨'
];

function showCatSpeech(text) {
  if (!purrSpeechEl) return;
  purrSpeechEl.textContent = text;
  purrSpeechEl.classList.remove('hidden');

  if (purrSpeechTimeout) clearTimeout(purrSpeechTimeout);
  purrSpeechTimeout = setTimeout(() => {
    purrSpeechEl.classList.add('hidden');
  }, 2600);
}

function triggerCatMascotSound(customText = null) {
  getAudioContext(); // Unlock audio on iOS/Android

  if (meowToggle) {
    playMeowSound();
  } else {
    playPurrSound();
  }
  meowToggle = !meowToggle;

  const quote = customText || catQuotes[Math.floor(Math.random() * catQuotes.length)];
  showCatSpeech(quote);

  // Cute micro bounce on click
  if (catMascotEl) {
    catMascotEl.style.transform = 'scale(1.18)';
    setTimeout(() => {
      catMascotEl.style.transform = '';
    }, 200);
  }
}

if (catMascotEl) {
  catMascotEl.addEventListener('click', () => triggerCatMascotSound());
  catMascotEl.addEventListener('touchstart', (e) => {
    e.preventDefault();
    triggerCatMascotSound();
  }, { passive: false });
}

// Initial welcoming purr speech on load
setTimeout(() => {
  showCatSpeech('Purrrrr... Ready to study!');
}, 900);



// ===================================================
//  PWA & NOTIFICATIONS API (Lock-Screen & Toast)
// ===================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=' + Date.now()).then(reg => {
      // Force checking for updates from GitHub Pages immediately
      reg.update();
    }).catch(() => {});

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

function showNotification(title, body) {
  playChimeSound();

  // In-App Toast
  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    const toast = document.createElement('div');
    toast.className = 'cat-toast';
    toast.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-glow)" stroke-width="2"><path d="M12 5c-3 0-5 2-6 4-2-2-4-1-4 2 0 4 3 8 10 8s10-4 10-8c0-3-2-4-4-2-1-2-3-4-6-4z"/></svg>
      <div>
        <strong style="display: block; color: var(--primary-glow); font-size: 0.95rem;">${title}</strong>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${body}</span>
      </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // System & Mobile Lock-Screen Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body: body,
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%231c152c'/><circle cx='50' cy='50' r='40' fill='%23ff75c3'/></svg>",
          badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23ff75c3'/></svg>",
          vibrate: [200, 100, 200],
          tag: 'neko-glow-alert'
        });
      });
    } else {
      new Notification(title, { body: body });
    }
  }
}

// Notification Bell Setup
const notifToggleBtn = document.getElementById('notif-toggle-btn');
const notifIcon = document.getElementById('notif-icon');

function updateNotifIcon() {
  if (notifIcon) {
    
  notifIcon.innerHTML = Notification.permission === 'granted'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  }
}
updateNotifIcon();

if (notifToggleBtn) {
  notifToggleBtn.addEventListener('click', async () => {
    playPopSound();
    if (!('Notification' in window)) {
      showNotification("Notifications Not Supported", "Your browser doesn't support system push notifications.");
      return;
    }

    if (Notification.permission === 'granted') {
      showNotification('Notifications Active', 'Lock-screen and mobile notifications are fully enabled!');
    } else {
      const permission = await Notification.requestPermission();
      updateNotifIcon();
      if (permission === 'granted') {
        showNotification('Amal Neko', 'Purrrrr! Mobile & Lock-Screen Notifications are now active!');
      }
    }
  });
}

// Sound Mute Toggle
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');

function updateSoundIcon() {
  if (soundIcon) {
    
  soundIcon.innerHTML = soundEnabled
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

  }
}
updateSoundIcon();

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('amal_sound_enabled', soundEnabled);
    updateSoundIcon();
    if (soundEnabled) playPopSound();
  });
}

// DOM Elements
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const categorySelect = document.getElementById('category-select');
const dueDateInput = document.getElementById('due-date-input');

const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterTabs = document.querySelectorAll('.tab-btn');

const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statCompleted = document.getElementById('stat-completed');
const statOverdue = document.getElementById('stat-overdue');

const clearCompletedBtn = document.getElementById('clear-completed-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const catMascot = document.getElementById('cat-mascot');
const purrSpeech = document.getElementById('purr-speech');

// Category Modal Elements
const categoryModal = document.getElementById('category-modal');
const categoryForm = document.getElementById('category-form');
const newCatName = document.getElementById('new-cat-name');
const newCatGraphic = document.getElementById('new-cat-graphic');
const openAddCatBtn = document.getElementById('open-add-cat-btn');
const closeCategoryModalBtn = document.getElementById('close-category-modal-btn');
const cancelCategoryModalBtn = document.getElementById('cancel-category-modal-btn');
const graphicChoiceBtns = document.querySelectorAll('.graphic-choice-btn');

// Edit Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editTaskId = document.getElementById('edit-task-id');
const editTaskText = document.getElementById('edit-task-text');
const editPriority = document.getElementById('edit-priority');
const editCategory = document.getElementById('edit-category');
const editDueDate = document.getElementById('edit-due-date');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');

function isOverdue(dueDateStr, completed) {
  if (!dueDateStr || completed) return false;
  const due = new Date(dueDateStr + 'T23:59:59');
  return due < new Date();
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

function getCategoryInfo(key) {
  const found = allCategories.find(c => c.key === key);
  if (!found) return escapeHtml(key);
  return found.icon ? `${found.icon} ${escapeHtml(found.name)}` : escapeHtml(found.name);
}

// ===================================================
//  INTERACTIVE MASCOT PETTING LOGIC (Purr & Meow!)
// ===================================================
const purrPhrases = [
  "Purrrrr...",
  "Meow!",
  "Study hard! 📚",
  "Nyaa~ A+ for you! 😻",
  "Stay Paw-sitive!",
  "Take a cozy break! ☕",
  "You're doing amazing! 🌟"
];

function triggerCatSpeech() {
  playPurrSound();
  if (purrSpeech && catMascot) {
    const randomPhrase = purrPhrases[Math.floor(Math.random() * purrPhrases.length)];
    purrSpeech.textContent = randomPhrase;
    purrSpeech.classList.remove('hidden');

    catMascot.style.transform = "scale(1.25) rotate(8deg)";
    setTimeout(() => {
      catMascot.style.transform = "";
    }, 280);

    setTimeout(() => {
      purrSpeech.classList.add('hidden');
    }, 2400);
  }
}

if (catMascot) {
  catMascot.addEventListener('click', e => {
    e.stopPropagation();
    triggerCatSpeech();
  });
  catMascot.addEventListener('touchstart', e => {
    e.stopPropagation();
    triggerCatSpeech();
  }, { passive: true });
}

// ===================================================
//  THEMED CUSTOM DROPDOWN ENGINE
// ===================================================
function setupDropdown(dropdownId, triggerId, menuId, displayId, hiddenInputId, onSelect) {
  const dropdown = document.getElementById(dropdownId);
  const trigger = document.getElementById(triggerId);
  const menu = document.getElementById(menuId);
  const display = document.getElementById(displayId);
  const input = document.getElementById(hiddenInputId);

  if (!dropdown || !trigger || !menu) return;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    playPopSound();
    closeAllPopupsExcept(menu);
    menu.classList.toggle('hidden');
    trigger.classList.toggle('open');
  });

  menu.addEventListener('click', e => {
    const opt = e.target.closest('.dropdown-option');
    if (!opt || opt.id === 'open-add-cat-btn') return;

    playPopSound();
    const val = opt.dataset.value;
    input.value = val;
    display.textContent = opt.textContent.trim();

    menu.querySelectorAll('.dropdown-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');

    menu.classList.add('hidden');
    trigger.classList.remove('open');

    if (onSelect) onSelect(val);
  });
}

setupDropdown('dropdown-priority', 'priority-trigger', 'priority-menu', 'priority-display', 'priority-select');
setupDropdown('dropdown-edit-priority', 'edit-priority-trigger', 'edit-priority-menu', 'edit-priority-display', 'edit-priority');
setupDropdown('dropdown-sort', 'sort-trigger', 'sort-menu', 'sort-display', 'sort-select', val => {
  currentSort = val;
  render();
});

function deleteCustomCategory(key) {
  playPopSound();
  const targetCat = customCategories.find(c => c.key === key);
  const catName = targetCat ? targetCat.name : 'Category';

  customCategories = customCategories.filter(c => c.key !== key);
  saveCustomCategories();

  const catInput = document.getElementById('category-select');
  if (catInput && catInput.value === key) {
    catInput.value = defaultCategories[0].key;
    const catDisplay = document.getElementById('category-display');
    if (catDisplay) {
      catDisplay.innerHTML = `${defaultCategories[0].icon ? defaultCategories[0].icon + ' ' : ''}<span>${escapeHtml(defaultCategories[0].name)}</span>`;
    }
  }

  showNotification('Category Deleted', `Removed "${catName}" category 🐾`);
  render();
}

function renderCategoryDropdowns() {
  const catListContainer = document.getElementById('category-options-list');
  const catDisplay = document.getElementById('category-display');
  const catInput = document.getElementById('category-select');

  const editCatListContainer = document.getElementById('edit-category-options-list');
  const editCatDisplay = document.getElementById('edit-category-display');
  const editCatInput = document.getElementById('edit-category');

  const selectedCat = allCategories.find(c => c.key === (catInput ? catInput.value : '')) || allCategories[0];
  if (catDisplay && selectedCat) {
    catDisplay.innerHTML = `${selectedCat.icon ? selectedCat.icon + ' ' : ''}<span>${escapeHtml(selectedCat.name)}</span>`;
  }

  const selectedEditCat = allCategories.find(c => c.key === (editCatInput ? editCatInput.value : '')) || allCategories[0];
  if (editCatDisplay && selectedEditCat) {
    editCatDisplay.innerHTML = `${selectedEditCat.icon ? selectedEditCat.icon + ' ' : ''}<span>${escapeHtml(selectedEditCat.name)}</span>`;
  }

  // Populate creator dropdown
  if (catListContainer) {
    catListContainer.innerHTML = '';
    allCategories.forEach(cat => {
      const isCustom = customCategories.some(c => c.key === cat.key);
      const opt = document.createElement('div');
      opt.className = `dropdown-option ${catInput && catInput.value === cat.key ? 'selected' : ''}`;
      opt.dataset.value = cat.key;
      
      const labelSpan = document.createElement('span');
      labelSpan.className = 'cat-option-label';
      labelSpan.innerHTML = `${cat.icon ? cat.icon + ' ' : ''}<span>${escapeHtml(cat.name)}</span>`;
      opt.appendChild(labelSpan);

      if (isCustom) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'delete-cat-btn ripple-btn';
        delBtn.title = `Delete "${cat.name}" category`;
        delBtn.setAttribute('aria-label', `Delete category ${cat.name}`);
        delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteCustomCategory(cat.key);
        });
        opt.appendChild(delBtn);
      }

      opt.addEventListener('click', () => {
        playPopSound();
        if (catInput) catInput.value = cat.key;
        if (catDisplay) {
          catDisplay.innerHTML = `${cat.icon ? cat.icon + ' ' : ''}<span>${escapeHtml(cat.name)}</span>`;
        }
        document.getElementById('category-menu').classList.add('hidden');
        document.getElementById('category-trigger').classList.remove('open');
        renderCategoryDropdowns();
      });
      catListContainer.appendChild(opt);
    });
  }

  // Populate Edit Modal custom category dropdown
  if (editCatListContainer) {
    editCatListContainer.innerHTML = '';
    allCategories.forEach(cat => {
      const opt = document.createElement('div');
      opt.className = `dropdown-option ${editCatInput && editCatInput.value === cat.key ? 'selected' : ''}`;
      opt.dataset.value = cat.key;

      const labelSpan = document.createElement('span');
      labelSpan.className = 'cat-option-label';
      labelSpan.innerHTML = `${cat.icon ? cat.icon + ' ' : ''}<span>${escapeHtml(cat.name)}</span>`;
      opt.appendChild(labelSpan);

      opt.addEventListener('click', () => {
        playPopSound();
        if (editCatInput) editCatInput.value = cat.key;
        if (editCatDisplay) {
          editCatDisplay.innerHTML = `${cat.icon ? cat.icon + ' ' : ''}<span>${escapeHtml(cat.name)}</span>`;
        }
        const editCatMenu = document.getElementById('edit-category-menu');
        const editCatTrigger = document.getElementById('edit-category-trigger');
        if (editCatMenu) editCatMenu.classList.add('hidden');
        if (editCatTrigger) editCatTrigger.classList.remove('open');
        renderCategoryDropdowns();
      });
      editCatListContainer.appendChild(opt);
    });
  }
}

// Edit category dropdown trigger toggle
const editCategoryTrigger = document.getElementById('edit-category-trigger');
const editCategoryMenu = document.getElementById('edit-category-menu');
if (editCategoryTrigger && editCategoryMenu) {
  editCategoryTrigger.addEventListener('click', e => {
    e.stopPropagation();
    playPopSound();
    closeAllPopupsExcept(editCategoryMenu);
    editCategoryMenu.classList.toggle('hidden');
    editCategoryTrigger.classList.toggle('open');
  });
}

const categoryTrigger = document.getElementById('category-trigger');
const categoryMenu = document.getElementById('category-menu');
if (categoryTrigger && categoryMenu) {
  categoryTrigger.addEventListener('click', e => {
    e.stopPropagation();
    playPopSound();
    closeAllPopupsExcept(categoryMenu);
    categoryMenu.classList.toggle('hidden');
    categoryTrigger.classList.toggle('open');
  });
}

if (openAddCatBtn) {
  openAddCatBtn.addEventListener('click', () => {
    playPopSound();
    categoryMenu.classList.add('hidden');
    categoryTrigger.classList.remove('open');
    newCatName.value = '';
    if (newCatGraphic) newCatGraphic.value = '';
    graphicChoiceBtns.forEach(b => b.classList.toggle('selected', b.dataset.graphic === ''));
    categoryModal.classList.remove('hidden');
  });
}

if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));
if (cancelCategoryModalBtn) cancelCategoryModalBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));

graphicChoiceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playPopSound();
    graphicChoiceBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (newCatGraphic) {
      newCatGraphic.value = btn.dataset.graphic || '';
    }
  });
});

categoryForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = newCatName.value.trim();
  if (!name) return;

  playChimeSound();
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36).slice(-4);
  const graphicKey = newCatGraphic ? newCatGraphic.value : '';
  const icon = graphicKey ? (CATEGORY_GRAPHICS[graphicKey] || '') : '';

  customCategories.push({ key, name, graphic: graphicKey, icon });
  saveCustomCategories();

  const catSelect = document.getElementById('category-select');
  if (catSelect) catSelect.value = key;
  const catDisplay = document.getElementById('category-display');
  if (catDisplay) {
    catDisplay.innerHTML = `${icon ? icon + ' ' : ''}<span>${escapeHtml(name)}</span>`;
  }

  categoryModal.classList.add('hidden');
  showNotification('Category Added', `Created "${name}" category! ✨`);
  renderCategoryDropdowns();
  render();
});

// ===================================================
//  THEMED BESPOKE CALENDAR ENGINE
// ===================================================
let calCurrentDate = new Date();
const dateTriggerBtn = document.getElementById('date-trigger-btn');
const dateDisplayText = document.getElementById('date-display-text');
const customCalendar = document.getElementById('custom-calendar');
const calMonthTitle = document.getElementById('cal-month-title');
const calDaysGrid = document.getElementById('cal-days-grid');
const calPrevMonth = document.getElementById('cal-prev-month');
const calNextMonth = document.getElementById('cal-next-month');
const calTodayBtn = document.getElementById('cal-today-btn');
const calClearBtn = document.getElementById('cal-clear-btn');

function renderCalendar() {
  const year = calCurrentDate.getFullYear();
  const month = calCurrentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  calMonthTitle.textContent = `${monthNames[month]} ${year}`;
  calDaysGrid.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDateStr = dueDateInput.value;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day-cell empty';
    calDaysGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell ripple-btn';
    cell.textContent = d;

    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (cellDateStr === todayStr) cell.classList.add('today');
    if (cellDateStr === selectedDateStr) cell.classList.add('selected');

    cell.addEventListener('click', () => {
      playPopSound();
      dueDateInput.value = cellDateStr;
      dateDisplayText.textContent = cellDateStr;
      customCalendar.classList.add('hidden');
      renderCalendar();
    });

    calDaysGrid.appendChild(cell);
  }
}

if (dateTriggerBtn && customCalendar) {
  dateTriggerBtn.addEventListener('click', e => {
    e.stopPropagation();
    playPopSound();
    closeAllPopupsExcept(customCalendar);
    customCalendar.classList.toggle('hidden');
    renderCalendar();
  });

  calPrevMonth.addEventListener('click', e => {
    e.stopPropagation();
    calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
    renderCalendar();
  });

  calNextMonth.addEventListener('click', e => {
    e.stopPropagation();
    calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
    renderCalendar();
  });

  calTodayBtn.addEventListener('click', e => {
    e.stopPropagation();
    playPopSound();
    const todayStr = new Date().toISOString().split('T')[0];
    dueDateInput.value = todayStr;
    dateDisplayText.textContent = todayStr;
    customCalendar.classList.add('hidden');
  });

  calClearBtn.addEventListener('click', e => {
    e.stopPropagation();
    playPopSound();
    dueDateInput.value = '';
    dateDisplayText.textContent = 'Select Date';
    customCalendar.classList.add('hidden');
    renderCalendar();
  });
}

function closeAllPopupsExcept(exception) {
  const popups = [
    document.getElementById('priority-menu'),
    document.getElementById('category-menu'),
    document.getElementById('sort-menu'),
    customCalendar
  ];

  popups.forEach(p => {
    if (p && p !== exception) p.classList.add('hidden');
  });

  document.querySelectorAll('.dropdown-trigger').forEach(t => t.classList.remove('open'));
}

document.addEventListener('click', e => {
  if (!e.target.closest('.custom-dropdown') && !e.target.closest('.custom-datepicker-wrap')) {
    closeAllPopupsExcept(null);
  }
});

// ===================================================
//  RENDER ENGINE WITH SUB-TASKS SUPPORT
// ===================================================
function render() {
  let filtered = tasks.filter(t => {
    if (searchQuery && !t.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    if (currentFilter === 'overdue') return isOverdue(t.dueDate, t.completed);
    return true;
  });

  filtered.sort((a, b) => {
    if (currentSort === 'created-desc') return b.createdAt - a.createdAt;
    if (currentSort === 'created-asc') return a.createdAt - b.createdAt;
    if (currentSort === 'priority-desc') return priorityOrder[b.priority] - priorityOrder[a.priority];
    if (currentSort === 'duedate-asc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;
  const overdueCount = tasks.filter(t => isOverdue(t.dueDate, t.completed)).length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  statTotal.textContent = totalCount;
  statActive.textContent = activeCount;
  statCompleted.textContent = completedCount;
  statOverdue.textContent = overdueCount;
  
  progressText.textContent = `${percent}% Completed`;
  progressFill.style.width = `${percent}%`;

  todoList.innerHTML = '';
  
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');

    filtered.forEach(task => {
      const li = document.createElement('li');
      const overdue = isOverdue(task.dueDate, task.completed);
      const subtasks = task.subtasks || [];
      const subDone = subtasks.filter(s => s.completed).length;
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;

      let subtasksHtml = '';
      let subtasksWrapperHtml = '';

      if (subtasks.length > 0) {
        subtasksHtml = subtasks.map(s => `
          <li class="subtask-item ${s.completed ? 'completed' : ''}">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="subtask-checkbox ripple-btn" data-task-id="${task.id}" data-sub-id="${s.id}">
                ${s.completed ? '' : ''}
              </button>
              <span>${escapeHtml(s.text)}</span>
            </div>
            <button class="subtask-del-btn ripple-btn" data-task-id="${task.id}" data-sub-id="${s.id}" title="Remove subtask"></button>
          </li>
        `).join('');

        subtasksWrapperHtml = `
          <!-- Subtasks Checklist Section -->
          <div class="subtasks-wrapper">
            <div class="subtasks-header">
              <span>Sub-tasks / Steps (${subDone}/${subtasks.length})</span>
            </div>
            <ul class="subtasks-list">
              ${subtasksHtml}
            </ul>
            <div class="subtask-add-row">
              <input type="text" class="subtask-input" placeholder="Add sub-step..." data-task-id="${task.id}" />
              <button type="button" class="subtask-add-btn ripple-btn" data-task-id="${task.id}">Add</button>
            </div>
          </div>
        `;
      } else {
        subtasksWrapperHtml = `
          <div class="subtask-add-row inline-subtask-form hidden" id="subtask-form-${task.id}" style="margin-top: 0.75rem;">
            <input type="text" class="subtask-input" placeholder="Add sub-step..." data-task-id="${task.id}" />
            <button type="button" class="subtask-add-btn ripple-btn" data-task-id="${task.id}">Add</button>
          </div>
        `;
      }

      li.innerHTML = `
        <div class="task-main-row">
          <div class="task-left">
            <button class="custom-checkbox ripple-btn" data-id="${task.id}" aria-label="Toggle task">
              ${task.completed ? '' : ''}
            </button>
            <div class="task-content">
              <span class="task-text">${escapeHtml(task.text)}</span>
              <div class="task-meta">
                <span class="category-tag">${getCategoryInfo(task.category)}</span>
                <span class="priority-tag priority-${task.priority}">${priorityLabels[task.priority] || task.priority}</span>
                ${task.dueDate ? `<span class="due-tag ${overdue ? 'overdue' : ''}">${overdue ? 'Overdue: ' : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2" style="vertical-align:middle;margin-right:3px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> '} ${task.dueDate}</span>` : ''}
                ${subtasks.length > 0 ? `<span class="category-tag" style="color: var(--cat-gold);"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.2" style="vertical-align:middle;margin-right:3px"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> ${subDone}/${subtasks.length} Sub-tasks</span>` : ''}
              </div>
            </div>
          </div>
          <div class="task-actions">
            ${subtasks.length === 0 ? `<button class="action-btn add-subtask-toggle ripple-btn" data-id="${task.id}" title="Add Sub-task"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" style="vertical-align:middle;margin-right:4px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Sub-task</button>` : ''}
            <button class="action-btn edit ripple-btn" data-id="${task.id}" title="Edit Task"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button class="action-btn delete ripple-btn" data-id="${task.id}" title="Delete Task"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </div>
        </div>
        ${subtasksWrapperHtml}
      `;

      todoList.appendChild(li);
    });
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Add Task Handler
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    priority: prioritySelect.value || 'medium',
    category: categorySelect.value || 'assignment',
    dueDate: dueDateInput.value || '',
    createdAt: Date.now(),
    subtasks: []
  };

  tasks.unshift(newTask);
  saveTasks();
  taskInput.value = '';
  dueDateInput.value = '';
  dateDisplayText.textContent = 'Select Date';

  showNotification("New Goal Added", `"${newTask.text}" is ready for study time!`);
  showCatSpeech('Added new goal! Mew!');
  render();
});

// Click Delegations (Checkbox, Subtasks, Edit, Delete)
todoList.addEventListener('click', e => {
  const toggleBtn = e.target.closest('.custom-checkbox');
  const editBtn = e.target.closest('.action-btn.edit');
  const deleteBtn = e.target.closest('.action-btn.delete');
  const subCheckbox = e.target.closest('.subtask-checkbox');
  const subDelBtn = e.target.closest('.subtask-del-btn');
  const subAddBtn = e.target.closest('.subtask-add-btn');
  const addSubtaskToggle = e.target.closest('.add-subtask-toggle');

  if (addSubtaskToggle) {
    playPopSound();
    const id = Number(addSubtaskToggle.dataset.id);
    const form = document.getElementById(`subtask-form-${id}`);
    if (form) {
      form.classList.toggle('hidden');
      if (!form.classList.contains('hidden')) {
        const input = form.querySelector('.subtask-input');
        if (input) input.focus();
      }
    }
  }

  // Main Task Toggle
  if (toggleBtn) {
    playPopSound();
    const id = Number(toggleBtn.dataset.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      render();
      if (task.completed) {
        spawnPurrPop(e.clientX, e.clientY);
        showNotification("Task Completed!", `Great job completing "${task.text}"!`);
        showCatSpeech('Purrrrr! Great job!');
      }
    }
  }

  // Subtask Toggle Checkbox
  if (subCheckbox) {
    playPopSound();
    const taskId = Number(subCheckbox.dataset.taskId);
    const subId = Number(subCheckbox.dataset.subId);
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const sub = task.subtasks.find(s => s.id === subId);
      if (sub) {
        sub.completed = !sub.completed;
        saveTasks();
        render();
      }
    }
  }

  // Subtask Delete
  if (subDelBtn) {
    playPopSound();
    const taskId = Number(subDelBtn.dataset.taskId);
    const subId = Number(subDelBtn.dataset.subId);
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      task.subtasks = task.subtasks.filter(s => s.id !== subId);
      saveTasks();
      render();
    }
  }

  // Subtask Add Button
  if (subAddBtn) {
    const taskId = Number(subAddBtn.dataset.taskId);
    const input = subAddBtn.parentElement.querySelector('.subtask-input');
    if (input && input.value.trim()) {
      playPopSound();
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push({
          id: Date.now(),
          text: input.value.trim(),
          completed: false
        });
        saveTasks();
        render();
      }
    }
  }

  if (editBtn) {
    playPopSound();
    const id = Number(editBtn.dataset.id);
    openEditModal(id);
  }

  if (deleteBtn) {
    playPopSound();
    const id = Number(deleteBtn.dataset.id);
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }
});

// Keypress Enter on Subtask Input
todoList.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('subtask-input')) {
    e.preventDefault();
    const input = e.target;
    const taskId = Number(input.dataset.taskId);
    if (input.value.trim()) {
      playPopSound();
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push({
          id: Date.now(),
          text: input.value.trim(),
          completed: false
        });
        saveTasks();
        render();
      }
    }
  }
});

function spawnPurrPop(x, y) {
  const emojis = ['😻', '', '✨', '📚', '🌟', '🎉'];
  const el = document.createElement('div');
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.position = 'fixed';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = '2rem';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '9999';
  el.style.transition = 'all 0.85s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = `translate(${(Math.random() - 0.5) * 80}px, -95px) scale(1.4)`;
    el.style.opacity = '0';
  }, 20);

  setTimeout(() => {
    el.remove();
  }, 900);
}

// Edit Modal Logic
function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editTaskId.value = task.id;
  editTaskText.value = task.text;
  
  // Set priority in custom dropdown
  editPriority.value = task.priority;
  const editPriorityDisplay = document.getElementById('edit-priority-display');
  if (editPriorityDisplay) {
    editPriorityDisplay.innerHTML = `<span class="priority-dot dot-${task.priority}"></span>${priorityLabels[task.priority] || task.priority}`;
  }
  const editPriorityMenu = document.getElementById('edit-priority-menu');
  if (editPriorityMenu) {
    editPriorityMenu.querySelectorAll('.dropdown-option').forEach(o => {
      o.classList.toggle('selected', o.dataset.value === task.priority);
    });
  }

  // Set category in custom dropdown
  editCategory.value = task.category;
  renderCategoryDropdowns();

  editDueDate.value = task.dueDate || '';
  editModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => editModal.classList.add('hidden'));
cancelModalBtn.addEventListener('click', () => editModal.classList.add('hidden'));

editForm.addEventListener('submit', e => {
  e.preventDefault();
  playPopSound();
  const id = Number(editTaskId.value);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.text = editTaskText.value.trim();
    task.priority = editPriority.value;
    task.category = editCategory.value;
    task.dueDate = editDueDate.value || '';
    saveTasks();
    render();
  }
  editModal.classList.add('hidden');
});

// Search & Filter Tabs
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    playPopSound();
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  playPopSound();
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
});

// Theme Toggle
const savedTheme = localStorage.getItem('amal_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    playPopSound();
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('amal_theme', next);
  });
}

// BACKGROUND CANVAS — REMOVED (GPU-composited CSS aurora replaces rAF loop)


// ===================================================
//  MOBILE WIDGETS MODAL & LIVE SYNC ENGINE
// ===================================================
const widgetsModal = document.getElementById('widgets-modal');
const widgetToggleBtn = document.getElementById('widget-toggle-btn');
const closeWidgetsModalBtn = document.getElementById('close-widgets-modal-btn');
const doneWidgetsModalBtn = document.getElementById('done-widgets-modal-btn');
const mTabBtns = document.querySelectorAll('.m-tab-btn');
const mw3x2 = document.getElementById('modal-w-3x2');
const mw3x3 = document.getElementById('modal-w-3x3');
const mw2x3 = document.getElementById('modal-w-2x3');

function switchModalWidget(size) {
  mTabBtns.forEach(b => b.classList.toggle('active', b.dataset.wsize === size));
  if (mw3x2) mw3x2.classList.toggle('hidden', size !== '3x2');
  if (mw3x3) mw3x3.classList.toggle('hidden', size !== '3x3');
  if (mw2x3) mw2x3.classList.toggle('hidden', size !== '2x3');
}

mTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playPopSound();
    switchModalWidget(btn.dataset.wsize);
  });
});

function renderModalWidgets() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  // 3x2
  const p3x2 = document.getElementById('mw-3x2-progress');
  const s3x2 = document.getElementById('mw-3x2-stats');
  if (p3x2) p3x2.textContent = `${pct}% Done`;
  if (s3x2) s3x2.textContent = `${active} Pending • ${completed} Done`;
  renderModalWidgetList('mw-3x2-tasks', tasks.slice(0, 2));

  // 3x3
  const p3x3 = document.getElementById('mw-3x3-progress');
  const s3x3 = document.getElementById('mw-3x3-stats');
  if (p3x3) p3x3.textContent = `${pct}% Done`;
  if (s3x3) s3x3.textContent = `${active} Pending • ${completed} Done`;
  renderModalWidgetList('mw-3x3-tasks', tasks.slice(0, 4));

  // 2x3
  const p2x3 = document.getElementById('mw-2x3-progress');
  if (p2x3) p2x3.textContent = `${pct}% Done (${completed}/${total})`;
  renderModalWidgetList('mw-2x3-tasks', tasks.slice(0, 4));
}

function renderModalWidgetList(elementId, taskSubset) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';

  if (taskSubset.length === 0) {
    el.innerHTML = '<li style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 0.8rem 0;">All caught up!</li>';
    return;
  }

  taskSubset.forEach(t => {
    const li = document.createElement('li');
    li.className = `w-task-item ${t.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <button class="w-checkbox ripple-btn" data-id="${t.id}">
        ${t.completed ? '' : ''}
      </button>
      <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(t.text)}</span>
    `;
    el.appendChild(li);
  });
}

if (widgetsModal) {
  widgetsModal.addEventListener('click', e => {
    const cb = e.target.closest('.w-checkbox');
    if (cb) {
      playPopSound();
      const id = Number(cb.dataset.id);
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
        renderModalWidgets();
      }
    }
  });
}

if (widgetToggleBtn && widgetsModal) {
  widgetToggleBtn.addEventListener('click', () => {
    playPopSound();
    renderModalWidgets();
    widgetsModal.classList.remove('hidden');
  });
}

if (closeWidgetsModalBtn) {
  closeWidgetsModalBtn.addEventListener('click', () => widgetsModal.classList.add('hidden'));
}

if (doneWidgetsModalBtn) {
  doneWidgetsModalBtn.addEventListener('click', () => widgetsModal.classList.add('hidden'));
}

// ===================================================
//  APP SETTINGS MODAL ENGINE (Dynamic & Bulletproof)
// ===================================================
function updateSettingsUI() {
  try {
    const isNotifGranted = 'Notification' in window && Notification.permission === 'granted';
    const settingsNotifIcon = document.getElementById('settings-notif-icon');
    const settingsNotifStatus = document.getElementById('settings-notif-status');
    const settingsNotifBtn = document.getElementById('settings-notif-btn');
    if (settingsNotifIcon) settingsNotifIcon.innerHTML = isNotifGranted ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    if (settingsNotifStatus) settingsNotifStatus.textContent = isNotifGranted ? 'Notifications Active (Granted)' : 'Tap to enable lock-screen alerts';
    if (settingsNotifBtn) {
      settingsNotifBtn.textContent = isNotifGranted ? 'Enabled' : 'Enable';
      settingsNotifBtn.className = isNotifGranted ? 'glow-btn ripple-btn small-btn' : 'btn-secondary ripple-btn small-btn';
    }

    const settingsSoundIcon = document.getElementById('settings-sound-icon');
    const settingsSoundStatus = document.getElementById('settings-sound-status');
    const settingsSoundBtn = document.getElementById('settings-sound-btn');
    if (settingsSoundIcon) settingsSoundIcon.innerHTML = soundEnabled ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    if (settingsSoundStatus) settingsSoundStatus.textContent = soundEnabled ? 'Sound Effects Enabled (Meows & Chimes)' : 'Sound Muted (Quiet Mode)';
    if (settingsSoundBtn) {
      settingsSoundBtn.textContent = soundEnabled ? 'Mute' : 'Enable';
      settingsSoundBtn.className = soundEnabled ? 'glow-btn ripple-btn small-btn' : 'btn-secondary ripple-btn small-btn';
    }

    const settingsThemeStatus = document.getElementById('settings-theme-status');
    const settingsThemeBtn = document.getElementById('settings-theme-btn');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (settingsThemeStatus) settingsThemeStatus.textContent = currentTheme === 'dark' ? 'Midnight Velvet (Dark Mode)' : 'Pastel Strawberry (Light Mode)';
    if (settingsThemeBtn) {
      settingsThemeBtn.textContent = currentTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
    }
  } catch (err) {
    console.error('Error updating settings UI:', err);
  }
}

let settingsModalLock = false;

function openSettingsModal(e) {
  if (e) {
    e.stopPropagation();
  }
  if (settingsModalLock) return;
  settingsModalLock = true;
  setTimeout(() => { settingsModalLock = false; }, 300);

  playPopSound();
  updateSettingsUI();
  const sm = document.getElementById('settings-modal');
  if (sm) {
    sm.classList.remove('hidden');
    sm.style.display = 'flex';
  }
}

function closeSettingsModal(e) {
  if (e) e.stopPropagation();
  const sm = document.getElementById('settings-modal');
  if (sm) {
    sm.classList.add('hidden');
    sm.style.display = 'none';
  }
}

function openWidgetsFromSettings(e) {
  if (e) e.stopPropagation();
  playPopSound();
  closeSettingsModal();
  const wm = document.getElementById('widgets-modal');
  if (wm) {
    renderModalWidgets();
    wm.classList.remove('hidden');
    wm.style.display = 'flex';
  }
}

let notifToggleLock = false;
async function toggleSettingsNotif(e) {
  if (e) e.stopPropagation();
  if (notifToggleLock) return;
  notifToggleLock = true;
  setTimeout(() => { notifToggleLock = false; }, 300);

  playPopSound();
  if (!('Notification' in window)) {
    showNotification("Notifications Not Supported", "Your browser doesn't support system push notifications.");
    return;
  }
  const permission = await Notification.requestPermission();
  updateSettingsUI();
  if (permission === 'granted') {
    showNotification('Amal Neko', 'Purrrrr! Lock-Screen Notifications are now active!');
  }
}

let soundDebounce = 0;
function toggleSettingsSound(e) {
  if (e) e.stopPropagation();
  const now = Date.now();
  if (now - soundDebounce < 250) return;
  soundDebounce = now;

  soundEnabled = !soundEnabled;
  localStorage.setItem('amal_sound_enabled', soundEnabled);
  updateSettingsUI();
  if (soundEnabled) {
    playPopSound();
  }
}

let themeDebounce = 0;
function toggleSettingsTheme(e) {
  if (e) e.stopPropagation();
  const now = Date.now();
  if (now - themeDebounce < 250) return;
  themeDebounce = now;

  playPopSound();
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('amal_theme', next);
  updateSettingsUI();
}

// Expose directly to window for foolproof HTML onclick fallback
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.openWidgetsFromSettings = openWidgetsFromSettings;
window.toggleSettingsNotif = toggleSettingsNotif;
window.toggleSettingsSound = toggleSettingsSound;
window.toggleSettingsTheme = toggleSettingsTheme;
window.updateSettingsUI = updateSettingsUI;

function initSettingsEngine() {
  const btn = document.getElementById('settings-toggle-btn');
  const closeBtn = document.getElementById('close-settings-modal-btn');
  const doneBtn = document.getElementById('done-settings-modal-btn');
  const openWidgetsBtn = document.getElementById('open-widgets-from-settings');
  const notifBtn = document.getElementById('settings-notif-btn');
  const soundBtn = document.getElementById('settings-sound-btn');
  const themeBtn = document.getElementById('settings-theme-btn');
  const sm = document.getElementById('settings-modal');

  if (btn) btn.onclick = openSettingsModal;
  if (sm) {
    sm.onclick = (e) => {
      if (e.target === sm) closeSettingsModal(e);
    };
  }
  if (closeBtn) closeBtn.onclick = closeSettingsModal;
  if (doneBtn) doneBtn.onclick = closeSettingsModal;
  if (openWidgetsBtn) openWidgetsBtn.onclick = openWidgetsFromSettings;
  if (notifBtn) notifBtn.onclick = toggleSettingsNotif;
  if (soundBtn) soundBtn.onclick = toggleSettingsSound;
  if (themeBtn) themeBtn.onclick = toggleSettingsTheme;
}

// ===================================================
// 🎨 COLOR THEME ENGINE & MOTION TOGGLE
// ===================================================
function applyThemeColor(color) {
  document.documentElement.setAttribute('data-color-theme', color);
  document.body.setAttribute('data-color-theme', color);
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach(s => {
    s.classList.toggle('active', s.dataset.color === color);
  });
  localStorage.setItem('amal_theme_color', color);
}

function applyMotion(type) {
  document.body.setAttribute('data-motion', type);
  document.documentElement.setAttribute('data-motion', type);
  const btns = document.querySelectorAll('.motion-btn');
  btns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.motionType === type);
  });
  localStorage.setItem('amal_motion', type);
}

function initColorThemeEngine() {
  // Apply saved color theme
  const savedColor = localStorage.getItem('amal_theme_color') || 'sakura';
  applyThemeColor(savedColor);

  // Apply saved motion
  const savedMotion = localStorage.getItem('amal_motion') || 'smooth';
  applyMotion(savedMotion);

  // Swatch click listeners
  document.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (swatch && swatch.dataset.color) {
      playPopSound();
      applyThemeColor(swatch.dataset.color);
    }

    const motionBtn = e.target.closest('.motion-btn');
    if (motionBtn && motionBtn.dataset.motionType) {
      playPopSound();
      applyMotion(motionBtn.dataset.motionType);
    }
  });
}

window.applyThemeColor = applyThemeColor;
window.applyMotion = applyMotion;

// Boot up logic (Immediate + DOMContentLoaded safe with try-catch isolation)
function bootstrapAmalNekoApp() {
  try {
    initColorThemeEngine();
  } catch (e) {
    console.error("Theme engine init error:", e);
  }

  try {
    renderCategoryDropdowns();
  } catch (e) {
    console.error("Category init error:", e);
  }

  try {
    render();
  } catch (e) {
    console.error("Render error:", e);
  }

  try {
    initSettingsEngine();
  } catch (e) {
    console.error("Settings engine init error:", e);
  }

  try {
    updateSettingsUI();
  } catch (e) {
    console.error("Settings UI update error:", e);
  }

  console.log("🐾 Amal Neko v3.2 Engine Ready & Verified!");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapAmalNekoApp);
} else {
  bootstrapAmalNekoApp();
}

