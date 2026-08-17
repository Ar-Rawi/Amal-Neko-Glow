// components/TaskCard.js
// Renders a glass‑morphism task card with priority badge and delete button
export function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card glass-card';
  card.setAttribute('role', 'listitem');
  card.dataset.id = task.id;

  // Title / text
  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.text;
  if (task.completed) title.classList.add('completed');
  card.appendChild(title);

  // Priority badge
  const badge = document.createElement('span');
  badge.className = `priority-badge priority-${task.priority}`;
  badge.textContent = task.priority;
  card.appendChild(badge);

  // Due date indicator
  if (task.dueDate) {
    const due = document.createElement('span');
    due.className = 'task-due';
    const date = new Date(task.dueDate);
    due.textContent = date.toLocaleDateString();
    if (new Date(task.dueDate) < new Date() && !task.completed) {
      due.classList.add('overdue');
    }
    card.appendChild(due);
  }

  // Delete button (styled as ×)
  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.dataset.id = task.id;
  delBtn.setAttribute('aria-label', 'Delete task');
  delBtn.textContent = '✖';
  card.appendChild(delBtn);

  return card;
}
