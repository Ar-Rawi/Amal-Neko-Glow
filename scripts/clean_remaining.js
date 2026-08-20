const fs = require('fs');
const path = require('path');
const dir = 'C:\\Users\\kp\\OneDrive - BISSELL\\VS Code\\Agency Farm\\todo-app';

let js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

// Clean category fallback
js = js.replace(/return found \? `\${found\.icon} \${found\.name}` : `📝 \${key}`;/g, 'return found ? `${found.icon} ${found.name}` : key;');

// Clean notification icons
js = js.replace(/<text y='\.9em' font-size='80' x='10'>🐱<\/text>/g, "<circle cx='50' cy='50' r='40' fill='%23ff75c3'/>");
js = js.replace(/<text y='\.9em' font-size='80'>🐾<\/text>/g, "<circle cx='50' cy='50' r='40' fill='%23ff75c3'/>");

// Clean spawnPurrPop particle emojis
js = js.replace(/const emojis = \['😻', '', '✨', '📚', '🌟', '🎉'\];/g, "const colors = ['var(--primary-glow)', 'var(--primary-accent)', 'var(--accent-cyan)', 'var(--accent-purple)'];");
js = js.replace(/pop\.textContent = emojis\[Math\.floor\(Math\.random\(\) \* emojis\.length\)\];/g, "pop.style.width = '10px'; pop.style.height = '10px'; pop.style.borderRadius = '50%'; pop.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];");

// Clean comments
js = js.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1FA00}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu, (m, offset, str) => {
  // if inside emoji-picker, leave it, else remove
  return '';
});

fs.writeFileSync(path.join(dir, 'app.js'), js);

// Also clean index.html apple-touch-icon
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
html = html.replace(/<text y='\.9em' font-size='80' x='10'>🐱<\/text>/g, "<circle cx='50' cy='50' r='40' fill='%23ff75c3'/>");
fs.writeFileSync(path.join(dir, 'index.html'), html);

console.log('Cleaned fallback and particle emojis');
