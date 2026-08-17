// src/ui.js
// UI rendering and interaction logic for the enhanced Todo app
import { getVisibleTasks, addTask, toggleTask, deleteTask, setFilter, setSort, loadUISettings } from './store.js';
import { createTaskCard } from '../components/TaskCard.js';
import { openTaskModal } from '../components/TaskModal.js';

const listEl = document.getElementById('todo-list');
const inputEl = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const themeToggle = document.getElementById('theme-toggle');

function render() {
  listEl.innerHTML = '';
  const tasks = getVisibleTasks();
  tasks.forEach(task => {
    const card = createTaskCard(task);
    // Open modal on card click (ignore delete button)
    card.addEventListener('click', e => {
      if (e.target.closest('.delete-btn')) return;
      openTaskModal(task);
    });
    listEl.appendChild(card);
  });
}

function initEventHandlers() {
  addBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (!text) return;
    addTask(text);
    inputEl.value = '';
    render();
  });

  inputEl.addEventListener('keypress', e => {
    if (e.key === 'Enter') addBtn.click();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  sortSelect.addEventListener('change', () => {
    setSort(sortSelect.value);
    render();
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? 'Neon‑Glass' : 'Light Mode';
  });

  // Delegated delete handling
  listEl.addEventListener('click', e => {
    const delBtn = e.target.closest('.delete-btn');
    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      deleteTask(id);
      render();
      e.stopPropagation();
    }
  });

  initParticles();
}

function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const count = 80;
  const w = canvas.width = window.innerWidth;
  const h = canvas.height = window.innerHeight;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
    });
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

export function initApp() {
  loadUISettings();
  render();
  initEventHandlers();
}
