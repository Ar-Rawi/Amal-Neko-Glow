// custom-calendar.js (Injected into app.js later)
function initCustomCalendar() {
  const modal = document.getElementById('calendar-modal');
  const monthYear = document.getElementById('calendar-month-year');
  const grid = document.getElementById('calendar-grid-days');
  const prevBtn = document.getElementById('calendar-prev-btn');
  const nextBtn = document.getElementById('calendar-next-btn');
  const cancelBtn = document.getElementById('calendar-cancel-btn');
  const clearBtn = document.getElementById('calendar-clear-btn');
  const todayBtn = document.getElementById('calendar-today-btn');

  let currentDate = new Date();
  let targetInput = null;

  function renderCalendar() {
    grid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      grid.appendChild(empty);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement('div');
      day.textContent = i;
      day.style.padding = '8px';
      day.style.cursor = 'pointer';
      day.style.borderRadius = '8px';
      day.style.color = '#fff';
      
      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
        day.style.background = 'rgba(255,117,195,0.3)';
        day.style.border = '1px solid var(--primary-glow)';
      }
      
      day.addEventListener('click', () => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(i).padStart(2, '0');
        if (targetInput) {
          targetInput.value = `${year}-${m}-${d}`;
          targetInput.dispatchEvent(new Event('change'));
        }
        modal.classList.add('hidden');
        modal.style.display = 'none';
      });
      
      day.addEventListener('mouseover', () => day.style.background = 'rgba(255,255,255,0.1)');
      day.addEventListener('mouseout', () => {
        if (!(year === today.getFullYear() && month === today.getMonth() && i === today.getDate())) {
          day.style.background = 'transparent';
        } else {
          day.style.background = 'rgba(255,117,195,0.3)';
        }
      });
      
      grid.appendChild(day);
    }
  }

  prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
  nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };
  cancelBtn.onclick = () => { modal.classList.add('hidden'); modal.style.display = 'none'; };
  clearBtn.onclick = () => { if(targetInput) targetInput.value = ''; modal.classList.add('hidden'); modal.style.display = 'none'; };
  todayBtn.onclick = () => { currentDate = new Date(); renderCalendar(); };

  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.addEventListener('click', (e) => {
      e.preventDefault();
      targetInput = input;
      if (input.value) {
        currentDate = new Date(input.value);
      } else {
        currentDate = new Date();
      }
      renderCalendar();
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
    });
  });
}
window.initCustomCalendar = initCustomCalendar;
