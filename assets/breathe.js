// Breathing exercise: phase-based scheduler driving DOM updates.

const TECHNIQUES = {
  box:      { name: 'Box Breathing',       phases: [['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Hold', 4]], description: 'Equal parts in, hold, out, hold. Used by Navy SEALs and ER doctors to stay calm under pressure. Best for focus and stress reset.' },
  '478':    { name: '4&middot;7&middot;8', phases: [['Inhale', 4], ['Hold', 7], ['Exhale', 8]],               description: 'Dr. Andrew Weil\u2019s technique. The long exhale and hold deeply relax the body. Best for unwinding before sleep.' },
  coherent: { name: 'Coherent Breathing',  phases: [['Inhale', 5], ['Exhale', 5]],                             description: 'Five seconds in, five seconds out. Syncs heart rate variability and calms the nervous system at a sustainable pace.' },
  extended: { name: 'Extended Exhale',     phases: [['Inhale', 4], ['Exhale', 6]],                             description: 'Longer exhale than inhale. The fastest way to tell your body the threat is over. Good for acute anxiety.' },
};

const circle     = document.getElementById('breathe-circle');
const phaseLabel = document.getElementById('breathe-phase');
const countLabel = document.getElementById('breathe-count');
const toggleBtn  = document.getElementById('btn-breathe-toggle');
const resetBtn   = document.getElementById('btn-breathe-reset');
const toggleLbl  = document.getElementById('btn-breathe-label');
const iconPlay   = document.getElementById('icon-play');
const iconPause  = document.getElementById('icon-pause');
const cycleEl    = document.getElementById('stat-cycles');
const timeEl     = document.getElementById('stat-time');
const descEl     = document.getElementById('breathe-description');
const techButtons = document.querySelectorAll('.tech-btn');

let current = 'box';
let running = false;
let phaseIdx = 0;
let secondsLeft = 0;
let cycles = 0;
let sessionSeconds = 0;
let tickInterval = null;

function selectTechnique(key) {
  if (current === key) return;
  current = key;
  techButtons.forEach(b => {
    const on = b.dataset.technique === key;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  const tech = TECHNIQUES[key];
  descEl.innerHTML = `<h3>${tech.name}</h3><p>${tech.description}</p>`;
  stop(true);
}

function phaseClass(name) {
  return name.toLowerCase();
}

function startPhase() {
  const tech = TECHNIQUES[current];
  const [name, seconds] = tech.phases[phaseIdx];
  secondsLeft = seconds;
  const lower = phaseClass(name);
  circle.dataset.phase = lower;
  if (lower === 'inhale') {
    circle.style.transitionDuration = seconds + 's';
    circle.style.transform = 'scale(1)';
  } else if (lower === 'exhale') {
    circle.style.transitionDuration = seconds + 's';
    circle.style.transform = 'scale(0.6)';
  }
  // 'hold' leaves the previous transform in place
  phaseLabel.textContent = name;
  countLabel.textContent = seconds;
}

function tick() {
  if (!running) return;
  sessionSeconds += 1;
  updateTime();

  secondsLeft -= 1;
  if (secondsLeft <= 0) {
    const tech = TECHNIQUES[current];
    phaseIdx = (phaseIdx + 1) % tech.phases.length;
    if (phaseIdx === 0) {
      cycles += 1;
      cycleEl.textContent = cycles;
    }
    startPhase();
  } else {
    countLabel.textContent = secondsLeft;
  }
}

function updateTime() {
  const m = Math.floor(sessionSeconds / 60);
  const s = sessionSeconds % 60;
  timeEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
}

function start() {
  if (running) return;
  running = true;
  phaseIdx = 0;
  startPhase();
  tickInterval = setInterval(tick, 1000);
  toggleLbl.textContent = 'Pause';
  iconPlay.style.display = 'none';
  iconPause.style.display = '';
}

function pause() {
  running = false;
  clearInterval(tickInterval);
  toggleLbl.textContent = 'Resume';
  iconPlay.style.display = '';
  iconPause.style.display = 'none';
}

function stop(resetVisual) {
  running = false;
  clearInterval(tickInterval);
  phaseIdx = 0;
  secondsLeft = 0;
  cycles = 0;
  sessionSeconds = 0;
  cycleEl.textContent = '0';
  timeEl.textContent = '0:00';
  phaseLabel.textContent = 'Ready';
  countLabel.textContent = '\u00b7';
  circle.dataset.phase = 'idle';
  circle.style.transitionDuration = '0.5s';
  circle.style.transform = 'scale(0.6)';
  toggleLbl.textContent = 'Start';
  iconPlay.style.display = '';
  iconPause.style.display = 'none';
}

toggleBtn.addEventListener('click', () => {
  if (running) pause();
  else start();
});

resetBtn.addEventListener('click', () => stop(true));

techButtons.forEach(btn => {
  btn.addEventListener('click', () => selectTechnique(btn.dataset.technique));
});
