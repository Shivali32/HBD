/* ==========================================================================
   PRANAV'S LEGO BIRTHDAY ADVENTURE - APPLICATION JAVASCRIPT
   Enhanced for Mobile, Touch & Desktop Interaction
   ========================================================================== */

// Sound Engine using Web Audio API (Zero external assets required!)
class LegoAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Snappy Lego brick snap click
  click() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Playful boing/whoosh for the runaway "NO" button
  boing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  // Success sparkle chime
  chime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + (idx * 0.08);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    });
  }

  // Celebratory birthday fanfare
  fanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const melody = [
      { f: 392.00, d: 0.2 },
      { f: 392.00, d: 0.2 },
      { f: 440.00, d: 0.35 },
      { f: 392.00, d: 0.35 },
      { f: 523.25, d: 0.4 },
      { f: 493.88, d: 0.6 }
    ];

    let t = this.ctx.currentTime + 0.05;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.02);
      t += note.d + 0.04;
    });
  }
}

const sfx = new LegoAudio();

// Sound toggle handler
const soundToggle = document.getElementById('sound-toggle');
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    const label = soundToggle.querySelector('.sound-label');
    const icon = soundToggle.querySelector('.sound-icon');
    if (sfx.enabled) {
      if (label) label.textContent = 'Audio ON';
      if (icon) icon.textContent = '🔊';
      sfx.chime();
    } else {
      if (label) label.textContent = 'Muted';
      if (icon) icon.textContent = '🔇';
    }
  });
}


// ==========================================================================
// PAGE ROUTING & NAVIGATION
// ==========================================================================
const pages = {
  home: { section: document.getElementById('page-home'), theme: 'theme-home', color: '#64b5f6' },
  story: { section: document.getElementById('page-story'), theme: 'theme-story', color: '#b0bec5' },
  travels: { section: document.getElementById('page-travels'), theme: 'theme-travels', color: '#66bb6a' },
  quiz: { section: document.getElementById('page-quiz'), theme: 'theme-quiz', color: '#f48fb1' },
  surprise: { section: document.getElementById('page-surprise'), theme: 'theme-surprise', color: '#ffd54f' }
};

const metaThemeColor = document.getElementById('theme-color-meta');

function switchPage(pageKey) {
  if (!pages[pageKey]) return;

  sfx.click();

  // Update Navigation Active State
  document.querySelectorAll('.nav-brick').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageKey);
  });

  // Switch Active Page Element
  Object.keys(pages).forEach(key => {
    const isCurrent = (key === pageKey);
    pages[key].section.classList.toggle('active', isCurrent);
  });

  // Update Body Baseplate Color Theme
  document.body.className = pages[pageKey].theme;

  // Update mobile status bar theme color
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', pages[pageKey].color);
  }

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Nav Click Listeners
document.querySelectorAll('.nav-brick').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetPage = btn.dataset.page;
    if (targetPage) switchPage(targetPage);
  });
});

// Inline Target Buttons Listeners
document.querySelectorAll('[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetPage = btn.dataset.target;
    if (targetPage) switchPage(targetPage);
  });
});


// ==========================================================================
// TIMELINE MEMORY REVEAL LOGIC
// ==========================================================================
function revealMemory(id) {
  sfx.chime();
  if (navigator.vibrate) navigator.vibrate(30);
  const box = document.getElementById(`mem-reveal-${id}`);
  if (box) {
    box.classList.remove('hidden');
  }
}

function nudgeMemory(id) {
  sfx.click();
  const box = document.getElementById(`mem-reveal-${id}`);
  if (box) {
    box.classList.remove('hidden');
  }
}


// ==========================================================================
// TRAVEL MAP VIEW TOGGLE & 9 TRIPS DATA
// ==========================================================================
const travelData = {
  pune: {
    image: 'assets/polaroid-pune.jpg',
    tag: 'Pune, India',
    title: 'Pune — 2022',
    text: '"Where it all began during our MBA days! Late hours in the library, presentation prep, sharing cutting chai, and building the foundation of our bond."',
    date: '2022 • The Beginning & MBA Days'
  },
  london: {
    image: 'assets/polaroid-london.jpg',
    tag: 'London, United Kingdom',
    title: 'London — 2023',
    text: '"Red double-decker buses, Big Ben, and traversing 5,000 miles of distance. Every chilly London morning was warmed by our endless phone calls."',
    date: '2023 • Across The Continents'
  },
  shrivardhan: {
    image: 'assets/polaroid-shrivardhan.jpg',
    tag: 'Shrivardhan, Maharashtra',
    title: 'Shrivardhan — 2023',
    text: '"Golden sunset strolls along pristine Konkan beaches, rhythmic ocean waves, and serene coastal tranquility with just the two of us."',
    date: '2023 • Coastal Serenity'
  },
  mumbai: {
    image: 'assets/polaroid-mumbai.jpg',
    tag: 'Mumbai, India',
    title: 'Mumbai — 2025',
    text: '"Reunited in the maximum city! Marine Drive sea breeze, bright city lights, celebrating sister’s MBA in Mumbai, and happily sharing the same timezone permanently."',
    date: '2025 • Reunited & Thriving'
  },
  goa: {
    image: 'assets/polaroid-goa.jpg',
    tag: 'Goa, India',
    title: 'Goa — 2025',
    text: '"Golden sand, coconut palms, sea breezes, and non-stop laughter! Unwinding by beach shacks, listening to waves, and soaking in sunny happiness."',
    date: '2025 • Tropical Sunshine'
  },
  nashik: {
    image: 'assets/polaroid-nashik.jpg',
    tag: 'Nashik, Maharashtra',
    title: 'Nashik — 2026',
    text: '"Rolling vineyard hills, barrel tastings, gorgeous sunset vistas, and raising a toast to how sweetly our love has aged through every chapter."',
    date: '2026 • Wine Country Romance'
  },
  chicago: {
    image: 'assets/polaroid-chicago.jpg',
    tag: 'Chicago, United States',
    title: 'Chicago — 2027',
    text: '"Taking iconic skyline selfies at The Bean, cruising along the Chicago River, and embracing the brisk Windy City breeze hand-in-hand."',
    date: '2027 • The Windy City Adventure'
  },
  paris: {
    image: 'assets/polaroid-paris.jpg',
    tag: 'Paris, France',
    title: 'Paris — 2028',
    text: '"The City of Lights! Warm buttery croissants at charming sidewalk cafés, glittering Eiffel Tower views at night, and strolling the banks of the Seine."',
    date: '2028 • The City of Love'
  },
  switzerland: {
    image: 'assets/polaroid-switzerland.jpg',
    tag: 'Swiss Alps, Switzerland',
    title: 'Switzerland — 2029',
    text: '"Panoramic alpine trains, snow-dusted Alpine peaks, cozy hot chocolates, and standing together atop the highest mountain wonders."',
    date: '2029 • Wonderland in the Alps'
  }
};

const polaroidModal = document.getElementById('polaroid-modal');

function setMapView(view) {
  sfx.click();
  const worldView = document.getElementById('world-map-view');
  const indiaView = document.getElementById('india-map-view');
  const btnWorld = document.getElementById('btn-view-world');
  const btnIndia = document.getElementById('btn-view-india');
  const hint = document.getElementById('map-zoom-hint');

  if (view === 'india') {
    if (worldView) worldView.classList.add('hidden');
    if (indiaView) indiaView.classList.remove('hidden');
    if (btnWorld) btnWorld.classList.remove('active');
    if (btnIndia) btnIndia.classList.add('active');
    if (hint) hint.innerHTML = '🔍 <strong>Zoomed into India!</strong> Exploring Pune, Mumbai, Nashik, Shrivardhan & Goa without clutter.';
  } else {
    if (indiaView) indiaView.classList.add('hidden');
    if (worldView) worldView.classList.remove('hidden');
    if (btnIndia) btnIndia.classList.remove('active');
    if (btnWorld) btnWorld.classList.add('active');
    if (hint) hint.innerHTML = '💡 Many trips are in India! <strong>Zoom in</strong> to explore Pune, Mumbai, Nashik, Shrivardhan & Goa without clutter!';
  }
}

function openPolaroid(dest) {
  sfx.chime();
  if (navigator.vibrate) navigator.vibrate(30);

  const data = travelData[dest];
  if (!data) return;

  const imgEl = document.getElementById('polaroid-img');
  const tagEl = document.getElementById('polaroid-tag');
  const titleEl = document.getElementById('polaroid-title');
  const textEl = document.getElementById('polaroid-text');
  const dateEl = document.getElementById('polaroid-date');

  if (imgEl && data.image) {
    imgEl.src = data.image;
    imgEl.alt = data.title;
  }
  if (tagEl) tagEl.textContent = data.tag;
  if (titleEl) titleEl.textContent = data.title;
  if (textEl) textEl.textContent = data.text;
  if (dateEl) dateEl.textContent = data.date;

  if (polaroidModal) {
    polaroidModal.classList.remove('hidden');
  }
}

function closePolaroid() {
  sfx.click();
  if (polaroidModal) {
    polaroidModal.classList.add('hidden');
  }
}

// Close polaroid when clicking outside
document.addEventListener('click', (e) => {
  if (polaroidModal && 
      !polaroidModal.classList.contains('hidden') && 
      !polaroidModal.contains(e.target) && 
      !e.target.closest('.map-pin') && 
      !e.target.closest('.brick-chip') &&
      !e.target.closest('.map-toggle-btn') &&
      !e.target.closest('.back-to-world-btn')) {
    polaroidModal.classList.add('hidden');
  }
});


// ==========================================================================
// THE RELATIONSHIP QUIZ - THE RUNAWAY "NO" BUTTON
// ==========================================================================
const btnNo = document.getElementById('btn-quiz-no');
const btnYes = document.getElementById('btn-quiz-yes');
const noLabel = document.getElementById('no-btn-label');
const dialogueBubble = document.getElementById('quiz-dialogue-bubble');
const bubbleMessage = document.getElementById('bubble-message');
const quizArena = document.getElementById('quiz-arena');
const quizSuccessPanel = document.getElementById('quiz-success-panel');

let dodgeCount = 0;
let yesScale = 1.0;

const wittyPhrases = [
  "Nice try, Pranav! 😂",
  "Nope! That button doesn't work! 😜",
  "Are you sure? Try again! 😉",
  "Oops, missed it! 🏃‍♂️💨",
  "Error 404: 'NO' not found! ⚠️",
  "You know it made us stronger! 💕",
  "Almost had it... NOT! 😆",
  "Just click YES already! 💖"
];

function dodgeNoButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  dodgeCount++;
  sfx.boing();
  if (navigator.vibrate) navigator.vibrate([40, 20]);

  // Grow the YES button bigger on every dodge!
  yesScale += 0.12;
  btnYes.style.transform = `scale(${Math.min(yesScale, 1.7)})`;

  // Safely bound the random coordinates inside the quiz arena
  const arenaWidth = quizArena.clientWidth;
  const arenaHeight = quizArena.clientHeight;
  const btnWidth = btnNo.offsetWidth || 110;
  const btnHeight = btnNo.offsetHeight || 50;

  // Maximum allowed translation from the center
  const maxX = Math.max(10, (arenaWidth / 2) - (btnWidth / 2) - 15);
  const maxY = Math.max(10, (arenaHeight / 2) - (btnHeight / 2) - 25);

  const randomX = (Math.random() - 0.5) * 2 * maxX;
  const randomY = (Math.random() - 0.5) * 2 * maxY;

  btnNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.92)`;

  // Update button label & dialogue bubble
  const randomPhrase = wittyPhrases[dodgeCount % wittyPhrases.length];
  bubbleMessage.textContent = randomPhrase;
  dialogueBubble.classList.remove('hidden');

  if (dodgeCount >= 3) {
    noLabel.textContent = "YES? 🥺";
  }
}

// Dodge on hover, touch, pointer events
btnNo.addEventListener('mouseenter', dodgeNoButton);
btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
btnNo.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'touch' || e.pointerType === 'pen') {
    dodgeNoButton(e);
  }
});
btnNo.addEventListener('click', dodgeNoButton);

// YES Button Click Handler
btnYes.addEventListener('click', () => {
  sfx.fanfare();
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  launchConfetti(40);
  quizSuccessPanel.classList.remove('hidden');
});


// ==========================================================================
// PAGE 5: BIRTHDAY SURPRISE REVEAL & CONFETTI CANNON
// ==========================================================================
const btnRedeem = document.getElementById('btn-redeem-trip');
const unredeemedDock = document.getElementById('unredeemed-dock');
const ticketContainer = document.getElementById('revealed-ticket-container');

if (btnRedeem) {
  btnRedeem.addEventListener('click', () => {
    sfx.fanfare();
    if (navigator.vibrate) navigator.vibrate([120, 80, 200]);
    unredeemedDock.classList.add('hidden');
    ticketContainer.classList.remove('hidden');

    // Trigger grand celebration confetti
    launchConfetti(120);
    setTimeout(() => launchConfetti(80), 500);
    setTimeout(() => launchConfetti(60), 1200);

    // Scroll smoothly to the revealed ticket
    ticketContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}


// ==========================================================================
// CUSTOM CANVAS LEGO CONFETTI ENGINE
// ==========================================================================
const canvas = document.getElementById('confetti-canvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let animId = null;

function resizeCanvas() {
  if (!canvas || !canvas.parentElement) return;
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const brickColors = ['#e63946', '#ffb703', '#3a86ff', '#2a9d8f', '#ad1457', '#ffffff'];

class LegoParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = canvas.width / 2 + (Math.random() - 0.5) * Math.min(canvas.width * 0.6, 120);
    this.y = canvas.height * 0.65;
    this.vx = (Math.random() - 0.5) * 16;
    this.vy = -Math.random() * 18 - 8;
    this.color = brickColors[Math.floor(Math.random() * brickColors.length)];
    this.width = Math.random() * 10 + 8;
    this.height = Math.random() * 7 + 5;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.2;
    this.gravity = 0.55;
    this.opacity = 1;
    this.isStud = Math.random() > 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.vRot;
    if (this.y > canvas.height * 0.6) {
      this.opacity -= 0.018;
    }
  }

  draw(c) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
    c.globalAlpha = Math.max(0, this.opacity);
    c.fillStyle = this.color;
    c.strokeStyle = '#000';
    c.lineWidth = 1.2;

    if (this.isStud) {
      c.beginPath();
      c.arc(0, 0, this.width / 2, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    } else {
      c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      c.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    c.restore();
  }
}

function launchConfetti(count = 60) {
  resizeCanvas();
  if (!ctx) return;

  for (let i = 0; i < count; i++) {
    particles.push(new LegoParticle());
  }

  if (!animId) {
    renderConfetti();
  }
}

function renderConfetti() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx);

    if (p.opacity <= 0 || p.y > canvas.height + 50) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 0) {
    animId = requestAnimationFrame(renderConfetti);
  } else {
    animId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
