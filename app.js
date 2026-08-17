// app.js — Amal Neko Glow Ultra-Cute Todo App Logic 🐾

// State Management
let tasks = JSON.parse(localStorage.getItem('amal_neko_todos_v1') || '[]');
let currentFilter = 'all';
let currentSort = 'created-desc';
let searchQuery = '';

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
const sortSelect = document.getElementById('sort-select');

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

// Default sample cat goals if first time
if (tasks.length === 0) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  tasks = [
    {
      id: 1,
      text: '🐾 Design cute Amal Neko Glow theme',
      completed: true,
      priority: 'urgent',
      category: 'personal',
      dueDate: today,
      createdAt: Date.now() - 3600000
    },
    {
      id: 2,
      text: '🐟 Deploy Amal Neko Glow 24/7 web app',
      completed: false,
      priority: 'high',
      category: 'work',
      dueDate: tomorrow,
      createdAt: Date.now()
    },
    {
      id: 3,
      text: '🧶 Play with yarn & take cozy cat nap',
      completed: false,
      priority: 'medium',
      category: 'health',
      dueDate: tomorrow,
      createdAt: Date.now()
    }
  ];
  saveTasks();
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem('amal_neko_todos_v1', JSON.stringify(tasks));
}

// Helpers
function isOverdue(dueDateStr, completed) {
  if (!dueDateStr || completed) return false;
  const due = new Date(dueDateStr + 'T23:59:59');
  return due < new Date();
}

const categoryIcons = {
  work: '🐟 Fish & Treats',
  personal: '🐾 Paws & Care',
  health: '🧶 Yarn & Play',
  finance: '💤 Naps & Chores'
};

const priorityLabels = {
  low: '🟢 Soft Nap',
  medium: '🟡 Cat Play',
  high: '🔴 Big Pounce',
  urgent: '⚡ Zoomies!'
};

const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

// Interactive Cat Mascot Petting Logic
const purrPhrases = [
  "Purrrrr... ✨",
  "Meow! 🐾",
  "Nyaa~ 😻",
  "Cat Nap Time! 💤",
  "Treats Please! 🐟",
  "Stay Paw-sitive! 🐾"
];

if (catMascot && purrSpeech) {
  catMascot.addEventListener('click', () => {
    const randomPhrase = purrPhrases[Math.floor(Math.random() * purrPhrases.length)];
    purrSpeech.textContent = randomPhrase;
    purrSpeech.classList.remove('hidden');
    
    // Animate mascot
    catMascot.style.transform = "scale(1.3) rotate(10deg)";
    setTimeout(() => {
      catMascot.style.transform = "";
    }, 300);

    setTimeout(() => {
      purrSpeech.classList.add('hidden');
    }, 2500);
  });
}

// Render Engine
function render() {
  // Filter Tasks
  let filtered = tasks.filter(t => {
    if (searchQuery && !t.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    if (currentFilter === 'overdue') return isOverdue(t.dueDate, t.completed);
    return true;
  });

  // Sort Tasks
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

  // Render Stats
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

  // Render List
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
          <button class="custom-checkbox" data-id="${task.id}" aria-label="Toggle task">
            ${task.completed ? '🐾' : ''}
          </button>
          <div class="task-content">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-meta">
              <span class="category-tag">${categoryIcons[task.category] || task.category}</span>
              <span class="priority-tag priority-${task.priority}">${priorityLabels[task.priority] || task.priority}</span>
              ${task.dueDate ? `<span class="due-tag ${overdue ? 'overdue' : ''}">${overdue ? '🙀 Overdue: ' : '📅 '} ${task.dueDate}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="action-btn edit" data-id="${task.id}" title="Edit Goal">
            ✏️
          </button>
          <button class="action-btn delete" data-id="${task.id}" title="Delete Goal">
            🗑️
          </button>
        </div>
      `;

      todoList.appendChild(li);
    });
  }
}

// Utility: Escape HTML
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
    priority: prioritySelect.value,
    category: categorySelect.value,
    dueDate: dueDateInput.value || '',
    createdAt: Date.now()
  };

  tasks.unshift(newTask);
  saveTasks();
  taskInput.value = '';
  dueDateInput.value = '';
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

// Purr Pop Animation on Task Completion
function spawnPurrPop(x, y) {
  const emojis = ['😻', '🐾', '✨', '🐟', '🧶'];
  const el = document.createElement('div');
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.position = 'fixed';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = '1.8rem';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '9999';
  el.style.transition = 'all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = `translate(${(Math.random() - 0.5) * 80}px, -90px) scale(1.4)`;
    el.style.opacity = '0';
  }, 20);

  setTimeout(() => {
    el.remove();
  }, 850);
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

// Filters & Search
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

sortSelect.addEventListener('change', e => {
  currentSort = e.target.value;
  render();
});

// Clear Completed
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
  render();
  initParticleCanvas();
});
