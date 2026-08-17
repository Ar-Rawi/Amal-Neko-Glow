// app.js — Amal Neko Glow Ultra-Cute Study & Task App Logic 🐾

// State Management
let tasks = JSON.parse(localStorage.getItem('amal_study_todos_v3') || '[]');
let currentFilter = 'all';
let currentSort = 'created-desc';
let searchQuery = '';
let soundEnabled = localStorage.getItem('amal_sound_enabled') !== 'false';
let notifPermission = Notification.permission;

// Default Study Categories + Custom Categories from localStorage
const defaultCategories = [
  { key: 'assignment', name: 'Assignment', icon: '📚' },
  { key: 'project', name: 'Project', icon: '🔬' },
  { key: 'study', name: 'Study & Exam', icon: '📖' },
  { key: 'home', name: 'Home & Personal', icon: '🏠' }
];

let customCategories = JSON.parse(localStorage.getItem('amal_custom_categories') || '[]');
let allCategories = [...defaultCategories, ...customCategories];

function saveCustomCategories() {
  localStorage.setItem('amal_custom_categories', JSON.stringify(customCategories));
  allCategories = [...defaultCategories, ...customCategories];
  renderCategoryDropdowns();
}

// Initial Sample Study Tasks with Sub-tasks
if (tasks.length === 0) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  tasks = [
    {
      id: 1,
      text: '📚 Calculus & Linear Algebra Assignment',
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
      text: '🔬 Physics Lab Prototype & Presentation',
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
      text: '📖 Midterm Exam Chapter 4 & 5 Review',
      completed: true,
      priority: 'medium',
      category: 'study',
      dueDate: tomorrow,
      createdAt: Date.now() - 7200000,
      subtasks: []
    }
  ];
  saveTasks();
}

function saveTasks() {
  localStorage.setItem('amal_study_todos_v3', JSON.stringify(tasks));
}

// ===================================================
// ===================================================
// 🔊 PROCEDURAL WEB AUDIO SYNTHESIZER (Meow & Purr)
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

// Cute Kitten "Mee-oww" Synthesizer 🐱
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

// Cute Purr Motor Sound Effect 🐾
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
// 🐱 CAT MASCOT INTERACTION (Tap for Meow / Purr Speech)
// ===================================================
const catMascotEl = document.getElementById('cat-mascot');
const purrSpeechEl = document.getElementById('purr-speech');
let purrSpeechTimeout = null;
let meowToggle = false;

const catQuotes = [
  'Meow! 🐾',
  'Purrrrr... ✨',
  'Nyaa~ A+ for you! 😻',
  'Study hard, take cozy breaks! 📚',
  'You got this! 💖',
  'Mew mew! 🐾✨'
];

function triggerCatMascotSound() {
  getAudioContext(); // Unlock audio on iOS/Android

  if (meowToggle) {
    playMeowSound();
  } else {
    playPurrSound();
  }
  meowToggle = !meowToggle;

  if (purrSpeechEl) {
    const randomQuote = catQuotes[Math.floor(Math.random() * catQuotes.length)];
    purrSpeechEl.textContent = randomQuote;
    purrSpeechEl.classList.remove('hidden');

    if (purrSpeechTimeout) clearTimeout(purrSpeechTimeout);
    purrSpeechTimeout = setTimeout(() => {
      purrSpeechEl.classList.add('hidden');
    }, 2200);
  }

  // Cute micro bounce on click
  if (catMascotEl) {
    catMascotEl.style.transform = 'scale(1.22)';
    setTimeout(() => {
      catMascotEl.style.transform = '';
    }, 200);
  }
}

if (catMascotEl) {
  catMascotEl.addEventListener('click', triggerCatMascotSound);
  catMascotEl.addEventListener('touchstart', (e) => {
    // Prevent double fire on mobile
    e.preventDefault();
    triggerCatMascotSound();
  }, { passive: false });
}


// ===================================================
// 📱 PWA & NOTIFICATIONS API (Lock-Screen & Toast)
// ===================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
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
      <span style="font-size: 1.5rem;">🐾</span>
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
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%231c152c'/><text y='.9em' font-size='80' x='10'>🐱</text></svg>",
          badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='80'>🐾</text></svg>",
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
    notifIcon.textContent = Notification.permission === 'granted' ? '🔔' : '🔕';
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
      showNotification("Notifications Active 🐾", "Lock-screen and mobile notifications are fully enabled!");
    } else {
      const permission = await Notification.requestPermission();
      updateNotifIcon();
      if (permission === 'granted') {
        showNotification("Amal Neko Glow 🐾", "Purrrrr! Mobile & Lock-Screen Notifications are now active! ✨");
      }
    }
  });
}

// Sound Mute Toggle
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');

function updateSoundIcon() {
  if (soundIcon) {
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
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
const newCatIcon = document.getElementById('new-cat-icon');
const openAddCatBtn = document.getElementById('open-add-cat-btn');
const closeCategoryModalBtn = document.getElementById('close-category-modal-btn');
const cancelCategoryModalBtn = document.getElementById('cancel-category-modal-btn');
const emojiChoiceBtns = document.querySelectorAll('.emoji-choice-btn');

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
  low: '🟢 Low',
  medium: '🟡 Medium',
  high: '🔴 High',
  urgent: '⚡ Urgent'
};

const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

function getCategoryInfo(key) {
  const found = allCategories.find(c => c.key === key);
  return found ? `${found.icon} ${found.name}` : `📝 ${key}`;
}

// ===================================================
// 🌟 INTERACTIVE MASCOT PETTING LOGIC (Purr & Meow!)
// ===================================================
const purrPhrases = [
  "Purrrrr... ✨",
  "Meow! 🐾",
  "Study hard! 📚",
  "Nyaa~ A+ for you! 😻",
  "Stay Paw-sitive! 🐾",
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
// 🌟 THEMED CUSTOM DROPDOWN ENGINE
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
setupDropdown('dropdown-sort', 'sort-trigger', 'sort-menu', 'sort-display', 'sort-select', val => {
  currentSort = val;
  render();
});

function renderCategoryDropdowns() {
  const catListContainer = document.getElementById('category-options-list');
  const catDisplay = document.getElementById('category-display');
  const catInput = document.getElementById('category-select');
  const editCatSelect = document.getElementById('edit-category');

  if (catListContainer) {
    catListContainer.innerHTML = '';
    allCategories.forEach(cat => {
      const opt = document.createElement('div');
      opt.className = `dropdown-option ${catInput.value === cat.key ? 'selected' : ''}`;
      opt.dataset.value = cat.key;
      opt.innerHTML = `<span>${cat.icon} ${cat.name}</span>`;
      opt.addEventListener('click', () => {
        playPopSound();
        catInput.value = cat.key;
        catDisplay.textContent = `${cat.icon} ${cat.name}`;
        document.getElementById('category-menu').classList.add('hidden');
        document.getElementById('category-trigger').classList.remove('open');
        renderCategoryDropdowns();
      });
      catListContainer.appendChild(opt);
    });
  }

  if (editCatSelect) {
    editCatSelect.innerHTML = '';
    allCategories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.key;
      opt.textContent = `${cat.icon} ${cat.name}`;
      editCatSelect.appendChild(opt);
    });
  }
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
    categoryModal.classList.remove('hidden');
  });
}

closeCategoryModalBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));
cancelCategoryModalBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));

emojiChoiceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playPopSound();
    emojiChoiceBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    newCatIcon.value = btn.dataset.emoji;
  });
});

categoryForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = newCatName.value.trim();
  if (!name) return;

  playChimeSound();
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const icon = newCatIcon.value || '📝';

  if (!allCategories.some(c => c.key === key)) {
    customCategories.push({ key, name, icon });
    saveCustomCategories();
  }

  categorySelect.value = key;
  document.getElementById('category-display').textContent = `${icon} ${name}`;
  categoryModal.classList.add('hidden');
  renderCategoryDropdowns();
  render();
});

// ===================================================
// 📅 THEMED BESPOKE CALENDAR ENGINE
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
      dateDisplayText.textContent = `📅 ${cellDateStr}`;
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
    dateDisplayText.textContent = `📅 ${todayStr}`;
    customCalendar.classList.add('hidden');
  });

  calClearBtn.addEventListener('click', e => {
    e.stopPropagation();
    playPopSound();
    dueDateInput.value = '';
    dateDisplayText.textContent = `📅 Select Date`;
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
// 🚀 RENDER ENGINE WITH SUB-TASKS SUPPORT
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
  
  progressText.textContent = `${percent}% Completed 🐾`;
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
      if (subtasks.length > 0) {
        subtasksHtml = subtasks.map(s => `
          <li class="subtask-item ${s.completed ? 'completed' : ''}">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="subtask-checkbox ripple-btn" data-task-id="${task.id}" data-sub-id="${s.id}">
                ${s.completed ? '✓' : ''}
              </button>
              <span>${escapeHtml(s.text)}</span>
            </div>
            <button class="subtask-del-btn ripple-btn" data-task-id="${task.id}" data-sub-id="${s.id}" title="Remove subtask">✕</button>
          </li>
        `).join('');
      }

      li.innerHTML = `
        <div class="task-main-row">
          <div class="task-left">
            <button class="custom-checkbox ripple-btn" data-id="${task.id}" aria-label="Toggle task">
              ${task.completed ? '🐾' : ''}
            </button>
            <div class="task-content">
              <span class="task-text">${escapeHtml(task.text)}</span>
              <div class="task-meta">
                <span class="category-tag">${getCategoryInfo(task.category)}</span>
                <span class="priority-tag priority-${task.priority}">${priorityLabels[task.priority] || task.priority}</span>
                ${task.dueDate ? `<span class="due-tag ${overdue ? 'overdue' : ''}">${overdue ? '🙀 Overdue: ' : '📅 '} ${task.dueDate}</span>` : ''}
                ${subtasks.length > 0 ? `<span class="category-tag" style="color: var(--cat-gold);">📋 ${subDone}/${subtasks.length} Sub-tasks</span>` : ''}
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="action-btn edit ripple-btn" data-id="${task.id}" title="Edit Task">
              ✏️
            </button>
            <button class="action-btn delete ripple-btn" data-id="${task.id}" title="Delete Task">
              🗑️
            </button>
          </div>
        </div>

        <!-- Subtasks Checklist Section -->
        <div class="subtasks-wrapper">
          <div class="subtasks-header">
            <span>📝 Sub-tasks / Steps (${subDone}/${subtasks.length})</span>
          </div>
          <ul class="subtasks-list">
            ${subtasksHtml}
          </ul>
          <div class="subtask-add-row">
            <input type="text" class="subtask-input" placeholder="➕ Add sub-step..." data-task-id="${task.id}" />
            <button type="button" class="subtask-add-btn ripple-btn" data-task-id="${task.id}">Add</button>
          </div>
        </div>
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
  dateDisplayText.textContent = '📅 Select Date';

  showNotification("New Goal Added 🐾", `"${newTask.text}" is ready for study time!`);
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
        showNotification("Task Completed! 😻", `Great job completing "${task.text}"!`);
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
  const emojis = ['😻', '🐾', '✨', '📚', '🌟', '🎉'];
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
  editPriority.value = task.priority;
  editCategory.value = task.category;
  editDueDate.value = task.dueDate || '';

  renderCategoryDropdowns();
  editCategory.value = task.category;
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

themeToggleBtn.addEventListener('click', () => {
  playPopSound();
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('amal_theme', next);
});

// ===================================================
// 🐾 BACKGROUND CANVAS (Soft Floating Paws & Sparkles)
// ===================================================
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 10,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.35 + 0.2,
      isPaw: i % 2 === 0
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -30) p.y = height + 30;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#ff75c3';
      ctx.shadowColor = '#ff75c3';
      ctx.shadowBlur = 8;

      if (p.isPaw) {
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText('🐾', p.x, p.y);
      } else {
        ctx.font = `${p.size * 0.8}px sans-serif`;
        ctx.fillText('✨', p.x, p.y);
      }
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

// ===================================================
// 📱 MOBILE WIDGETS MODAL & LIVE SYNC ENGINE
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
    el.innerHTML = '<li style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 0.8rem 0;">All caught up! 🐾</li>';
    return;
  }

  taskSubset.forEach(t => {
    const li = document.createElement('li');
    li.className = `w-task-item ${t.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <button class="w-checkbox ripple-btn" data-id="${t.id}">
        ${t.completed ? '🐾' : ''}
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

// Boot up
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryDropdowns();
  render();
  initParticleCanvas();
});

