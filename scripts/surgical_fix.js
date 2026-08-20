const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\kp\\OneDrive - BISSELL\\VS Code\\Agency Farm\\todo-app';

// ==========================================
// 1. FIX styles.css
// ==========================================
let css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8');

// Fix broken animation syntax at lines 150-155
css = css.replace(
  /@keyframes ambientFloat\s*\{[\s\S]*?100%\s*\{\s*transform:\s*translate\(50px,\s*70px\)\s*scale\(1\.15\);\s*\}\s*\}/,
  `@keyframes ambientFloat {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(40px, 60px, 0) scale(1.1); }
}`
);

// Clean any other stray keyframe or syntax issues
css = css.replace(/\/\* styles\.css — Amal Neko.*?\*\//, '/* styles.css — Amal Neko Design System */');

fs.writeFileSync(path.join(dir, 'styles.css'), css);
console.log('[1/4] Fixed styles.css');


// ==========================================
// 2. FIX app.js
// ==========================================
let js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

// SVG icons for action buttons
const editIconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const deleteIconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
const clipboardIconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`;
const calendarIconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

// Replace priorityLabels
js = js.replace(/low:\s*'🟢\s*Low'/g, "low: 'Low'");
js = js.replace(/medium:\s*'🟡\s*Medium'/g, "medium: 'Medium'");
js = js.replace(/high:\s*'🔴\s*High'/g, "high: 'High'");
js = js.replace(/urgent:\s*'⚡\s*Urgent'/g, "urgent: 'Urgent'");

// Replace action buttons ✏️ and 🗑️ in render()
js = js.replace(
  /<button class="action-btn edit ripple-btn" data-id="\${task\.id}" title="Edit Task">\s*✏️\s*<\/button>/g,
  `<button class="action-btn edit ripple-btn" data-id="\${task.id}" title="Edit Task">${editIconSvg}</button>`
);
js = js.replace(
  /<button class="action-btn delete ripple-btn" data-id="\${task\.id}" title="Delete Task">\s*🗑️\s*<\/button>/g,
  `<button class="action-btn delete ripple-btn" data-id="\${task.id}" title="Delete Task">${deleteIconSvg}</button>`
);

// Replace subtask notepad emoji
js = js.replace(
  /📋\s*\${subDone}\/\${subtasks\.length}\s*Sub-tasks/g,
  `${clipboardIconSvg} \${subDone}/\${subtasks.length} Sub-tasks`
);

// Replace subtask header & input emojis
js = js.replace(/📝\s*Sub-tasks\s*\/\s*Steps/g, 'Sub-tasks / Steps');
js = js.replace(/➕\s*Add sub-step\.\.\./g, 'Add sub-step...');

// Replace due tag emojis
js = js.replace(/\${overdue \? '🙀 Overdue: ' : '📅 '} \${task\.dueDate}/g, `\${overdue ? 'Overdue: ' : '${calendarIconSvg} '} \${task.dueDate}`);

// Replace datepicker text strings
js = js.replace(/dateDisplayText\.textContent = `📅 \${cellDateStr}`;/g, 'dateDisplayText.textContent = cellDateStr;');
js = js.replace(/dateDisplayText\.textContent = `📅 \${todayStr}`;/g, 'dateDisplayText.textContent = todayStr;');
js = js.replace(/dateDisplayText\.textContent = `📅 Select Date`;/g, "dateDisplayText.textContent = 'Select Date';");
js = js.replace(/dateDisplayText\.textContent = '📅 Select Date';/g, "dateDisplayText.textContent = 'Select Date';");

// Replace notification icon text content with SVGs
js = js.replace(/notifIcon\.textContent = Notification\.permission === 'granted' \? '🔔' : '🔕';/g, `
  notifIcon.innerHTML = Notification.permission === 'granted'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
`);

// Replace sound icon text content with SVGs
js = js.replace(/soundIcon\.textContent = soundEnabled \? '🔊' : '🔇';/g, `
  soundIcon.innerHTML = soundEnabled
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
`);

// Replace mascot phrases and quotes
js = js.replace(/const catQuotes = \[[\s\S]*?\];/g, `const catQuotes = [
  'Meow!',
  'Purrrrr...',
  'A+ for you!',
  'Study hard, take cozy breaks!',
  'You got this!',
  'Keep up the great work!'
];`);

js = js.replace(/const purrPhrases = \[[\s\S]*?\];/g, `const purrPhrases = [
  "Purrrrr...",
  "Meow!",
  "Study hard!",
  "A+ for you!",
  "Stay focused!",
  "Take a cozy break!",
  "You're doing amazing!"
];`);

// Replace toast mascot icon
js = js.replace(/<span style="font-size: 1\.5rem;">🐾<\/span>/g, `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-glow)" stroke-width="2"><path d="M12 5c-3 0-5 2-6 4-2-2-4-1-4 2 0 4 3 8 10 8s10-4 10-8c0-3-2-4-4-2-1-2-3-4-6-4z"/></svg>`);

// Clean any remaining notification titles/messages with emojis
js = js.replace(/Task Completed! 😻/g, 'Task Completed!');
js = js.replace(/Purrrrr! Great job! 😻/g, 'Purrrrr! Great job!');

fs.writeFileSync(path.join(dir, 'app.js'), js);
console.log('[2/4] Fixed app.js');


// ==========================================
// 3. FIX index.html
// ==========================================
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Update asset query version strings to bypass stale browser cache
html = html.replace(/styles\.css\?v=[^"']+/g, 'styles.css?v=3.1.0');
html = html.replace(/app\.js\?v=[^"']+/g, 'app.js?v=3.1.0');

fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('[3/4] Fixed index.html cache-busting versions');


// ==========================================
// 4. FIX sw.js (BUMP CACHE)
// ==========================================
let sw = fs.readFileSync(path.join(dir, 'sw.js'), 'utf8');
sw = sw.replace(/const CACHE_NAME = '[^']+';/, "const CACHE_NAME = 'neko-glow-v3-1';");
fs.writeFileSync(path.join(dir, 'sw.js'), sw);
console.log('[4/4] Bumped Service Worker to neko-glow-v3-1');

console.log('\nALL 4 FILES UPDATED WITHOUT ERROR');
