// app.js — Amal Neko Glow Ultra-Cute Study & Task App Logic 🐾

// State Management
let tasks = JSON.parse(localStorage.getItem('amal_study_todos_v2') || '[]');
let currentFilter = 'all';
let currentSort = 'created-desc';
let searchQuery = '';

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

// Initial sample study tasks if first time
if (tasks.length === 0) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  tasks = [
    {
      id: 1,
      text: '📚 Complete Calculus & Linear Algebra Assignment',
      completed: true,
      priority: 'urgent',
      category: 'assignment',
      dueDate: today,
      createdAt: Date.now() - 3600000
    },
    {
      id: 2,
      text: '🔬 Prepare Physics Lab Prototype & Slides',
      completed: false,
      priority: 'high',
      category: 'project',
      dueDate: tomorrow,
      createdAt: Date.now()
    },
    {
      id: 3,
      text: '📖 Review Chapter 4 & 5 Study Notes for Midterms',
      completed: false,
      priority: 'medium',
      category: 'study',
      dueDate: tomorrow,
      createdAt: Date.now()
    }
  ];
  saveTasks();
}

function saveTasks() {
  localStorage.setItem('amal_study_todos_v2', JSON.stringify(tasks));
}

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
    closeAllPopupsExcept(menu);
    menu.classList.toggle('hidden');
    trigger.classList.toggle('open');
  });

  menu.addEventListener('click', e => {
    const opt = e.target.closest('.dropdown-option');
    if (!opt || opt.id === 'open-add-cat-btn') return;

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

// Setup Priority & Sort Dropdowns
setupDropdown('dropdown-priority', 'priority-trigger', 'priority-menu', 'priority-display', 'priority-select');
setupDropdown('dropdown-sort', 'sort-trigger', 'sort-menu', 'sort-display', 'sort-select', val => {
  currentSort = val;
  render();
});

// Render Category Options in Dropdown and Edit Modal
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
        catInput.value = cat.key;
        catDisplay.textContent = `${cat.icon} ${cat.name}`;
        document.getElementById('category-menu').classList.add('hidden');
        document.getElementById('category-trigger').classList.remove('open');
        renderCategoryDropdowns();
      });
      catListContainer.appendChild(opt);
    });
  }

  // Populate Edit Modal Category Select
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

// Setup Category Trigger
const categoryTrigger = document.getElementById('category-trigger');
const categoryMenu = document.getElementById('category-menu');
if (categoryTrigger && categoryMenu) {
  categoryTrigger.addEventListener('click', e => {
    e.stopPropagation();
    closeAllPopupsExcept(categoryMenu);
    categoryMenu.classList.toggle('hidden');
    categoryTrigger.classList.toggle('open');
  });
}

// Custom Category Modal Logic
if (openAddCatBtn) {
  openAddCatBtn.addEventListener('click', () => {
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
    emojiChoiceBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    newCatIcon.value = btn.dataset.emoji;
  });
});

categoryForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = newCatName.value.trim();
  if (!name) return;

  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const icon = newCatIcon.value || '📝';

  // Check if exists
  if (!allCategories.some(c => c.key === key)) {
    customCategories.push({ key, name, icon });
    saveCustomCategories();
  }

  // Auto-select new category
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

  // Empty padding cells
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day-cell empty';
    calDaysGrid.appendChild(empty);
  }

  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell ripple-btn';
    cell.textContent = d;

    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (cellDateStr === todayStr) cell.classList.add('today');
    if (cellDateStr === selectedDateStr) cell.classList.add('selected');

    cell.addEventListener('click', () => {
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
    const todayStr = new Date().toISOString().split('T')[0];
    dueDateInput.value = todayStr;
    dateDisplayText.textContent = `📅 ${todayStr}`;
    customCalendar.classList.add('hidden');
  });

  calClearBtn.addEventListener('click', e => {
    e.stopPropagation();
    dueDateInput.value = '';
    dateDisplayText.textContent = `📅 Select Date`;
    customCalendar.classList.add('hidden');
    renderCalendar();
  });
}

// Global Close for Popups when clicking outside
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

// Interactive Cat Mascot Petting Logic
const purrPhrases = [
  "Purrrrr... ✨",
  "Study hard! 🐾",
  "A+ on that Assignment! 📚",
  "Meow! Stay focused! 😻",
  "You got this! 🐾",
  "Time for a quick break! ☕"
];

if (catMascot && purrSpeech) {
  catMascot.addEventListener('click', () => {
    const randomPhrase = purrPhrases[Math.floor(Math.random() * purrPhrases.length)];
    purrSpeech.textContent = randomPhrase;
    purrSpeech.classList.remove('hidden');
    
    catMascot.style.transform = "scale(1.3) rotate(10deg)";
    setTimeout(() => {
      catMascot.style.transform = "";
    }, 300);

    setTimeout(() => {
      purrSpeech.classList.add('hidden');
    }, 2500);
  });
}

// ===================================================
// 🚀 RENDER ENGINE
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
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;

      li.innerHTML = `
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
    createdAt: Date.now()
  };

  tasks.unshift(newTask);
  saveTasks();
  taskInput.value = '';
  dueDateInput.value = '';
  dateDisplayText.textContent = '📅 Select Date';
  render();
});

// Click Delegations (Checkbox, Edit, Delete)
todoList.addEventListener('click', e => {
  const toggleBtn = e.target.closest('.custom-checkbox');
  const editBtn = e.target.closest('.action-btn.edit');
  const deleteBtn = e.target.closest('.action-btn.delete');

  if (toggleBtn) {
    const id = Number(toggleBtn.dataset.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      render();
      if (task.completed) spawnPurrPop(e.clientX, e.clientY);
    }
  }

  if (editBtn) {
    const id = Number(editBtn.dataset.id);
    openEditModal(id);
  }

  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.id);
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }
});

function spawnPurrPop(x, y) {
  const emojis = ['😻', '🐾', '✨', '📚', '🌟', '🎉'];
  const el = document.createElement('div');
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.position = 'fixed';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = '1.9rem';
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
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
});

// Theme Toggle
const savedTheme = localStorage.getItem('amal_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('amal_theme', next);
});

// Particle Background Animation Engine (Floating Glowing Paws 🐾 & Twinkles)
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 35;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 10,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.2,
      isPaw: i % 2 === 0
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -20) p.y = height + 20;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#ff75c3';
      ctx.shadowColor = '#ff75c3';
      ctx.shadowBlur = 10;

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

// Boot up
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryDropdowns();
  render();
  initParticleCanvas();
});
