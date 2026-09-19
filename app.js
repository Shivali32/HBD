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

  // Switch Active Page Element with fresh transition trigger
  Object.keys(pages).forEach(key => {
    const isCurrent = (key === pageKey);
    const sec = pages[key].section;
    if (isCurrent) {
      // Retrigger CSS entrance transition animation reliably
      sec.style.animation = 'none';
      void sec.offsetHeight; // trigger reflow
      sec.style.animation = '';
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  // Update Body Baseplate Color Theme
  document.body.className = pages[pageKey].theme;

  // Update mobile status bar theme color
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', pages[pageKey].color);
  }

  // Instant scroll to top so page entrance transition begins from the top
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (pageKey === 'quiz' && typeof resetQuizState === 'function') {
    resetQuizState();
  }
}

// Nav Click Listeners
document.querySelectorAll('.nav-brick').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetPage = btn.dataset.page;
    if (targetPage) switchPage(targetPage);
  });
});

// Inline Target Buttons Listeners with tactile button transition animation
document.querySelectorAll('[data-target]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPage = btn.dataset.target;
    if (!targetPage) return;

    // Trigger tactile button click transition animation
    btn.classList.add('btn-transitioning');
    sfx.click();
    if (navigator.vibrate) navigator.vibrate(35);

    // Brief delay to display button transition before smooth page entry
    setTimeout(() => {
      btn.classList.remove('btn-transitioning');
      switchPage(targetPage);
    }, 120);
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
// TRAVEL MAP LOGIC & FIXED-SIZE RECTANGULAR POPUP CARDS
// ==========================================================================
const travelData = {
  pune: {
    image: 'assets/polaroid-pune.jpg',
    tag: '📍 Pune, India',
    year: '2022',
    title: 'Pune - 2022',
    text: '"Where it all began during our MBA days! Late hours in the library, presentation prep, sharing cutting chai, and building the foundation of our bond."',
    date: '2022 • The MBA Days'
  },
  london: {
    image: 'assets/polaroid-london.jpg',
    tag: '📍 London, UK',
    year: '2023',
    title: 'London - 2023',
    text: '"Red double-decker buses, Big Ben, and traversing 5,000 miles of distance. Every chilly morning was warmed by our daily video calls."',
    date: '2023 • Across The Continents'
  },
  shrivardhan: {
    image: 'assets/polaroid-shrivardhan.jpg',
    tag: '📍 Shrivardhan, MH',
    year: '2023',
    title: 'Shrivardhan - 2023',
    text: '"Golden sunset strolls along pristine Konkan beaches, rhythmic ocean waves, and serene coastal tranquility with just the two of us."',
    date: '2023 • Coastal Serenity'
  },
  lonavla: {
    image: 'assets/polaroid-lonavla.jpg',
    tag: '📍 Lonavla, MH',
    year: '2024',
    title: 'Lonavla - 2024',
    text: '"Scenic Western Ghats getaways, misty mountain hills, cascading waterfalls, hot cutting chai in the monsoon drizzle, and cozy drives hand-in-hand."',
    date: '2024 • Monsoon Hills & Chai'
  },
  mumbai: {
    image: 'assets/polaroid-mumbai.jpg',
    tag: '📍 Mumbai, India',
    year: '2025',
    title: 'Mumbai - 2025',
    text: '"Reunited in the maximum city! Marine Drive sea breeze, bright city lights, celebrating sister’s MBA in Mumbai, and happily sharing the same timezone."',
    date: '2025 • Reunited & Thriving'
  },
  goa: {
    image: 'assets/polaroid-goa.jpg',
    tag: '📍 Goa, India',
    year: '2025',
    title: 'Goa - 2025',
    text: '"Golden sand, coconut palms, sea breezes, and non-stop laughter! Unwinding by beach shacks, dancing to waves, and sunny carefree joy."',
    date: '2025 • Tropical Sunshine'
  },
  nashik: {
    image: 'assets/polaroid-nashik.jpg',
    tag: '📍 Nashik, MH',
    year: '2026',
    title: 'Nashik - 2026',
    text: '"Rolling vineyard hills, barrel tastings, gorgeous sunset vistas, and raising a toast to how sweetly our love has aged through every chapter."',
    date: '2026 • Wine Country Romance'
  },
  chicago: {
    image: 'assets/polaroid-chicago.jpg',
    tag: '📍 Chicago, USA',
    year: '2027',
    title: 'Chicago - 2027',
    text: '"Taking iconic skyline selfies at The Bean, cruising along the Chicago River, and embracing the brisk Windy City breeze hand-in-hand."',
    date: '2027 • The Windy City Adventure'
  },
  paris: {
    image: 'assets/polaroid-paris.jpg',
    tag: '📍 Paris, France',
    year: '2028',
    title: 'Paris - 2028',
    text: '"The City of Lights! Warm buttery croissants at charming sidewalk cafés, glittering Eiffel Tower views at night, and strolling the banks of the Seine."',
    date: '2028 • The City of Love'
  },
  switzerland: {
    image: 'assets/polaroid-switzerland.jpg',
    tag: '📍 Swiss Alps',
    year: '2029',
    title: 'Switzerland - 2029',
    text: '"Panoramic alpine trains, snow-dusted Alpine peaks, cozy hot chocolates, and standing together atop the highest mountain wonders."',
    date: '2029 • Wonderland in the Alps'
  }
};

const indiaTrips = ['pune', 'shrivardhan', 'lonavla', 'mumbai', 'goa', 'nashik'];

function openIndiaMap(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  sfx.click();
  const worldView = document.getElementById('world-map-view');
  const indiaView = document.getElementById('india-map-view');
  if (worldView) worldView.classList.add('hidden');
  if (indiaView) indiaView.classList.remove('hidden');
  closeTripCard();
}

function openWorldMap(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  sfx.click();
  const worldView = document.getElementById('world-map-view');
  const indiaView = document.getElementById('india-map-view');
  if (indiaView) indiaView.classList.add('hidden');
  if (worldView) worldView.classList.remove('hidden');
  closeTripCard();
}

function openTripCard(dest, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  sfx.chime();
  if (navigator.vibrate) navigator.vibrate(30);

  const data = travelData[dest];
  if (!data) return;

  // If opening an India trip while currently in world view, automatically switch to India map
  if (indiaTrips.includes(dest)) {
    const worldView = document.getElementById('world-map-view');
    const indiaView = document.getElementById('india-map-view');
    if (worldView) worldView.classList.add('hidden');
    if (indiaView) indiaView.classList.remove('hidden');
  }

  const modal = document.getElementById('city-popup-modal') || document.getElementById('polaroid-modal');
  const imgEl = document.getElementById('city-card-img') || document.getElementById('polaroid-img');
  const tagEl = document.getElementById('city-card-tag') || document.getElementById('polaroid-tag');
  const yearEl = document.getElementById('city-card-year');
  const titleEl = document.getElementById('city-card-title') || document.getElementById('polaroid-title');
  const textEl = document.getElementById('city-card-text') || document.getElementById('polaroid-text');
  const dateEl = document.getElementById('city-card-date') || document.getElementById('polaroid-date');

  if (imgEl && data.image) {
    imgEl.src = data.image;
    imgEl.alt = data.title;
  }
  if (tagEl) tagEl.textContent = data.tag;
  if (yearEl) yearEl.textContent = data.year;
  if (titleEl) titleEl.textContent = data.title;
  if (textEl) textEl.textContent = data.text;
  if (dateEl) dateEl.textContent = data.date;

  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeTripCard(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  sfx.click();
  const modal = document.getElementById('city-popup-modal') || document.getElementById('polaroid-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Backward-compatibility aliases
const openPolaroid = openTripCard;
const closePolaroid = closeTripCard;
const setMapView = (view) => (view === 'india' ? openIndiaMap() : openWorldMap());

// Attach explicit click handlers to all destination buttons & pins
function initTripButtons() {
  document.querySelectorAll('[data-dest]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dest = btn.getAttribute('data-dest');
      if (dest) openTripCard(dest, e);
    });
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTripButtons);
} else {
  initTripButtons();
}

// Close city card on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeTripCard();
});


// ==========================================================================
// THE ULTIMATE QUESTION: THE RUNAWAY "NO" BUTTON THAT BECOMES "YES"
// ==========================================================================
const btnNo = document.getElementById('btn-quiz-no');
const btnYes = document.getElementById('btn-quiz-yes');
const noLabel = document.getElementById('no-btn-label');
const dialogueBubble = document.getElementById('quiz-dialogue-bubble');
const bubbleMessage = document.getElementById('bubble-message');
const quizArena = document.getElementById('quiz-arena');
const quizSuccessPanel = document.getElementById('quiz-success-panel');
const quizSuccessTitle = document.getElementById('quiz-success-title');
const quizSuccessDesc = document.getElementById('quiz-success-desc');

let dodgeCount = 0;
let yesScale = 1.0;
let isTransformed = false;
let lastDodgeTime = 0;
let transformTime = 0;
const MAX_DODGES = 4; // After 4 dodges, NO transforms into YES!

const wittyPhrases = [
  "Nice try, Pranav! 😂",
  "Nope! You can't live without me! 😜",
  "Error 404: 'NO' button not found! ⚠️",
  "Best friends forever, no escape! 💕",
  "Oops, missed it! 🏃‍♂️💨",
  "Almost had it... NOT! 😆"
];

function resetQuizState() {
  dodgeCount = 0;
  isTransformed = false;
  yesScale = 1.0;
  lastDodgeTime = 0;
  transformTime = 0;
  if (btnYes) {
    btnYes.style.transform = 'scale(1)';
  }
  if (btnNo) {
    btnNo.style.transform = 'translate(0px, 0px) scale(1)';
    btnNo.classList.remove('lego-btn-green');
    btnNo.classList.add('lego-btn-red');
  }
  if (noLabel) {
    noLabel.textContent = 'NO 🙅‍♂️';
  }
  if (dialogueBubble) {
    dialogueBubble.classList.add('hidden');
  }
  if (quizSuccessPanel) {
    quizSuccessPanel.classList.add('hidden');
  }
}

function revealQuizSuccess() {
  sfx.fanfare();
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  launchConfetti(70);

  if (quizSuccessTitle) {
    quizSuccessTitle.textContent = "FINAL ANSWER: YES!";
  }

  if (quizSuccessDesc) {
    quizSuccessDesc.innerHTML = "Because she is so much more than just a best friend now! 🥰<br><br>Every call, every road trip, and every chapter proved that we belong together. Now it's time for your birthday reward!";
  }

  if (quizSuccessPanel) {
    quizSuccessPanel.classList.remove('hidden');
  }
}

function dodgeNoButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // If already transformed into YES, clicking triggers success (respecting transform cooldown)
  if (isTransformed) {
    if (Date.now() - transformTime < 450) return;
    revealQuizSuccess();
    return;
  }

  // Throttle rapid consecutive events (e.g. pointerdown + click)
  const now = Date.now();
  if (now - lastDodgeTime < 180) return;
  lastDodgeTime = now;

  dodgeCount++;
  sfx.boing();
  if (navigator.vibrate) navigator.vibrate([40, 20]);

  const isMobile = (quizArena ? quizArena.clientWidth : 360) < 600;

  // Grow the YES button on every dodge with balanced scaling
  yesScale += isMobile ? 0.05 : 0.08;
  const maxYesScale = isMobile ? 1.15 : 1.35;
  if (btnYes) {
    btnYes.style.transform = `scale(${Math.min(yesScale, maxYesScale)})`;
  }

  // Check if threshold reached to transform into YES!
  if (dodgeCount >= MAX_DODGES) {
    isTransformed = true;
    transformTime = Date.now();
    btnNo.style.transform = 'translate(0px, 0px) scale(1)';
    if (btnYes) {
      btnYes.style.transform = 'scale(1.06)';
    }
    btnNo.classList.remove('lego-btn-red');
    btnNo.classList.add('lego-btn-green');
    if (noLabel) {
      noLabel.textContent = "YES! 🥰";
    }
    if (bubbleMessage) {
      bubbleMessage.textContent = "Okay fine, now you HAVE to click YES! 🥰";
    }
    if (dialogueBubble) {
      dialogueBubble.classList.remove('hidden');
    }
    return;
  }

  // Derive precise boundaries within quizArena
  const dock = quizArena ? quizArena.querySelector('.quiz-answers-dock') : null;
  const subtext = quizArena ? quizArena.querySelector('.quiz-subtext') : null;

  const arenaWidth = quizArena ? quizArena.clientWidth : 320;
  const arenaHeight = quizArena ? quizArena.clientHeight : 340;
  const btnWidth = btnNo ? (btnNo.offsetWidth || 130) : 130;
  const btnHeight = btnNo ? (btnNo.offsetHeight || 55) : 55;

  // Natural untransformed position of btnNo inside quizArena
  const dockLeft = dock ? dock.offsetLeft : 0;
  const dockTop = dock ? dock.offsetTop : 200;
  const naturalLeft = btnNo ? (btnNo.offsetLeft + dockLeft) : (arenaWidth / 2);
  const naturalTop = btnNo ? (btnNo.offsetTop + dockTop) : (arenaHeight * 0.65);

  // Safe inner bounds inside quizArena (with 16px padding inside the whiteboard borders)
  const minSafeLeft = 16;
  const maxSafeLeft = Math.max(minSafeLeft, arenaWidth - btnWidth - 16);

  // Top bound: stay safely below the question subtext
  const subtextBottom = subtext ? (subtext.offsetTop + subtext.offsetHeight + 10) : 110;
  const minSafeTop = Math.max(16, subtextBottom);

  // Bottom bound: stay safely above the bottom of the arena and dialogue bubble
  const maxSafeTop = Math.max(minSafeTop, arenaHeight - btnHeight - 40);

  // Allowable translation ranges relative to natural origin
  const minTx = minSafeLeft - naturalLeft;
  const maxTx = maxSafeLeft - naturalLeft;
  const minTy = minSafeTop - naturalTop;
  const maxTy = maxSafeTop - naturalTop;

  // Scripted high-drama dodges for stages 1 to 3 that guarantee 100% visibility:
  let targetTx = 0;
  let targetTy = 0;

  if (dodgeCount === 1) {
    // Stage 1: Jump up on right side (clear of YES button)
    targetTx = isMobile ? 0 : (minTx * 0.68);
    targetTy = minTy * 0.85;
  } else if (dodgeCount === 2) {
    // Stage 2: Jump down and slightly left on right side (clear of YES button)
    targetTx = isMobile ? Math.max(minTx * 0.2, -30) : (maxTx > 45 ? maxTx * 0.8 : minTx * 0.4);
    targetTy = isMobile ? (maxTy * 0.75) : (minTy * 0.55);
  } else {
    // Stage 3: Feint high up
    targetTx = isMobile ? Math.max(minTx * 0.15, -20) : (minTx * 0.85);
    targetTy = minTy * 0.95;
  }

  // Strictly clamp target translation to stay completely inside the white block
  targetTx = Math.max(minTx, Math.min(maxTx, targetTx));
  targetTy = Math.max(minTy, Math.min(maxTy, targetTy));

  btnNo.style.transform = `translate(${targetTx}px, ${targetTy}px) scale(0.95)`;

  // Update witty dialogue message
  const phrase = wittyPhrases[(dodgeCount - 1) % wittyPhrases.length];
  if (bubbleMessage) {
    bubbleMessage.textContent = phrase;
  }
  if (dialogueBubble) {
    dialogueBubble.classList.remove('hidden');
  }
}

// Attach dodging listeners to NO button
if (btnNo) {
  // Desktop hover
  btnNo.addEventListener('mouseenter', (e) => {
    if (!isTransformed) dodgeNoButton(e);
  });

  // Mobile touch event
  btnNo.addEventListener('touchstart', (e) => {
    if (!isTransformed) {
      if (e.cancelable) e.preventDefault();
      dodgeNoButton(e);
    } else {
      // Cooldown check prevents the transforming tap from immediately triggering YES
      if (Date.now() - transformTime < 450) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      if (e.cancelable) e.preventDefault();
      revealQuizSuccess();
    }
  }, { passive: false });

  btnNo.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      if (!isTransformed) {
        dodgeNoButton(e);
      }
    }
  });

  // Click handler (desktop clicks and non-canceled clicks)
  btnNo.addEventListener('click', (e) => {
    if (!isTransformed) {
      dodgeNoButton(e);
    } else {
      // Debounce synthetic click from the touch that just transformed the button
      if (Date.now() - transformTime < 450) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      if (e) e.preventDefault();
      revealQuizSuccess();
    }
  });
}

// YES Button Click Handler
if (btnYes) {
  btnYes.addEventListener('click', (e) => {
    e.preventDefault();
    revealQuizSuccess();
  });
}


// ==========================================================================
// PAGE 5: BIRTHDAY SURPRISE REVEAL & SEALED ENVELOPE PASSCODE MODAL
// ==========================================================================
const btnRedeem = document.getElementById('btn-redeem-trip');
const unredeemedDock = document.getElementById('unredeemed-dock');
const ticketContainer = document.getElementById('revealed-ticket-container');
const letterLockModal = document.getElementById('letter-lock-modal');
const sealedEnvelopeCard = document.getElementById('sealed-envelope-card');
const btnCloseEnvelope = document.getElementById('btn-close-envelope');
const envelopeModalBackdrop = document.getElementById('envelope-modal-backdrop');
const envelopePasscodeForm = document.getElementById('envelope-passcode-form');
const letterPasscodeInput = document.getElementById('letter-passcode-input');
const passcodeInputBox = document.getElementById('passcode-input-box');
const passcodeErrorMsg = document.getElementById('passcode-error-msg');
const passcodeErrorText = document.getElementById('passcode-error-text');

// Witty puns when password is wrong (strictly NO hints)
const wrongPasscodePuns = [
  "Wrong tune! That note fell completely flat, maestro! 🎶😜",
  "Access denied! Did your memory brick fall off? Try again, bro! 🧱😂",
  "Nice try, Sherlock! Even the Lego detective couldn't crack that melody! 🕵️‍♂️✨",
  "Wrong lyrics! This secret vault is locked tighter than two stuck 2x4 Lego bricks! 🔐😆",
  "Nope! You can't just build your way in with random guesses! 🚫🧱",
  "Error 403: Heartfelt letter is password-protected for Pranav's eyes only! 🙈❤️",
  "Off-key guess! Listen to your heart and hum it out! 🎵😂"
];

let punIndex = 0;

function openEnvelopeModal() {
  sfx.click();
  if (letterLockModal) {
    letterLockModal.classList.remove('hidden');
  }
  if (sealedEnvelopeCard) {
    sealedEnvelopeCard.classList.remove('unsealing');
  }
  if (passcodeErrorMsg) {
    passcodeErrorMsg.classList.add('hidden');
  }
  if (letterPasscodeInput) {
    letterPasscodeInput.value = '';
    setTimeout(() => letterPasscodeInput.focus(), 150);
  }
}

function closeEnvelopeModal() {
  sfx.click();
  if (letterLockModal) {
    letterLockModal.classList.add('hidden');
  }
  if (passcodeErrorMsg) {
    passcodeErrorMsg.classList.add('hidden');
  }
}

function handlePasscodeSubmit(e) {
  if (e) e.preventDefault();
  if (!letterPasscodeInput) return;

  const rawEntered = (letterPasscodeInput.value || '').trim().toLowerCase();
  const normalized = rawEntered.replace(/\s+/g, ' ');
  const stripped = rawEntered.replace(/[^a-z0-9]/gi, '');

  // Validate passcode "abhi na jao chod kar" (case-insensitive)
  // Supports minor phonetic variants or extra spaces seamlessly
  const isCorrect = (
    normalized === 'abhi na jao chod kar' ||
    normalized === 'abhi na jao chhod kar' ||
    stripped === 'abhinajaochodkar' ||
    stripped === 'abhinajaochhodkar'
  );

  if (isCorrect) {
    // CORRECT PASSCODE!
    sfx.fanfare();
    if (navigator.vibrate) navigator.vibrate([120, 80, 200]);

    if (passcodeErrorMsg) {
      passcodeErrorMsg.classList.add('hidden');
    }

    // Play sealed envelope unsealing / breaking animation
    if (sealedEnvelopeCard) {
      sealedEnvelopeCard.classList.add('unsealing');
    }

    setTimeout(() => {
      // Hide modal and unredeemed dock
      if (letterLockModal) {
        letterLockModal.classList.add('hidden');
      }
      if (sealedEnvelopeCard) {
        sealedEnvelopeCard.classList.remove('unsealing');
      }
      if (unredeemedDock) {
        unredeemedDock.classList.add('hidden');
      }
      if (ticketContainer) {
        ticketContainer.classList.remove('hidden');
      }

      // Trigger smooth 3D unfolding animation on the letter card
      const letterCard = ticketContainer ? ticketContainer.querySelector('.birthday-letter-card') : null;
      if (letterCard) {
        letterCard.classList.remove('unfolding');
        void letterCard.offsetWidth; // Force DOM reflow to restart animation reliably
        letterCard.classList.add('unfolding');
      }

      // Trigger grand celebration confetti
      launchConfetti(140);
      setTimeout(() => launchConfetti(90), 500);
      setTimeout(() => launchConfetti(60), 1200);
    }, 600);

  } else {
    // INCORRECT PASSCODE: Play boing, shake input, and display a witty pun (no hint)
    sfx.boing();
    if (navigator.vibrate) navigator.vibrate([80, 50, 80]);

    if (passcodeInputBox) {
      passcodeInputBox.classList.remove('shake');
      void passcodeInputBox.offsetWidth; // force reflow
      passcodeInputBox.classList.add('shake');
    }

    const pun = wrongPasscodePuns[punIndex % wrongPasscodePuns.length];
    punIndex++;

    if (passcodeErrorText) {
      passcodeErrorText.textContent = pun;
    }
    if (passcodeErrorMsg) {
      passcodeErrorMsg.classList.remove('hidden');
    }

    letterPasscodeInput.select();
  }
}

// Attach event listeners for sealed envelope modal
if (btnRedeem) {
  btnRedeem.addEventListener('click', openEnvelopeModal);
}
if (btnCloseEnvelope) {
  btnCloseEnvelope.addEventListener('click', closeEnvelopeModal);
}
if (envelopeModalBackdrop) {
  envelopeModalBackdrop.addEventListener('click', closeEnvelopeModal);
}
if (envelopePasscodeForm) {
  envelopePasscodeForm.addEventListener('submit', handlePasscodeSubmit);
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

// ==========================================================================
// INTERACTIVE MEMORY POLAROID CARDS (FLIP BETWEEN ORIGINAL & LEGO)
// ==========================================================================
document.querySelectorAll('.home-memory-card').forEach((card) => {
  function toggleMemoryMode(e) {
    if (e && e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (e) e.preventDefault();

    const isLegoNow = card.classList.toggle('is-lego');

    if (isLegoNow) {
      sfx.chime();
      card.setAttribute('title', 'Click to see original photo!');
    } else {
      sfx.click();
      card.setAttribute('title', 'Click to see cute Lego version!');
    }

    if (navigator.vibrate) navigator.vibrate(35);
  }

  card.addEventListener('click', toggleMemoryMode);
  card.addEventListener('keydown', toggleMemoryMode);
});

