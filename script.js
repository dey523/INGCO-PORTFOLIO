// CURSOR
const cursorOrb = document.getElementById('cursor-orb');
let mx = -100, my = -100, cx = -100, cy = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursorOrb.style.left = cx + 'px';
  cursorOrb.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// FIREFLIES — yellow/gold/amber ONLY (hue 35–52)
const canvas = document.getElementById('firefly-canvas');
const ctx = canvas.getContext('2d');
let flies = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createFly() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.8,
    alpha: Math.random() * 0.45 + 0.1,
    alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.004,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    hue: 35 + Math.random() * 17,
    sat: 90 + Math.random() * 10,
    light: 60 + Math.random() * 20
  };
}

for (let i = 0; i < 65; i++) flies.push(createFly());

function drawFlies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flies.forEach(f => {
    f.x += f.vx; f.y += f.vy;
    f.alpha += f.alphaDir;
    if (f.alpha > 0.75 || f.alpha < 0.05) f.alphaDir *= -1;
    if (f.x < 0) f.x = canvas.width;
    if (f.x > canvas.width) f.x = 0;
    if (f.y < 0) f.y = canvas.height;
    if (f.y > canvas.height) f.y = 0;

    const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
    g.addColorStop(0,   `hsla(${f.hue},${f.sat}%,${f.light}%,${f.alpha})`);
    g.addColorStop(0.3, `hsla(${f.hue},${f.sat}%,${f.light - 8}%,${f.alpha * 0.6})`);
    g.addColorStop(1,   `hsla(${f.hue},80%,45%,0)`);

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  });
  requestAnimationFrame(drawFlies);
}
drawFlies();

// NAVBAR
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// MOBILE NAV
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

// MUSIC
const music = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');
const musicIcon = document.getElementById('music-icon');
const musicLabel = document.getElementById('music-label');
let musicPlaying = false;

musicControl.addEventListener('click', () => {
  if (musicPlaying) {
    music.pause();
    musicIcon.className = 'fas fa-volume-mute';
    musicLabel.textContent = 'Muted';
    musicPlaying = false;
  } else {
    music.play().catch(() => {});
    musicIcon.className = 'fas fa-music';
    musicLabel.textContent = 'Music';
    musicPlaying = true;
  }
});
window.addEventListener('click', () => {
  if (!musicPlaying) { music.play().then(() => { musicPlaying = true; }).catch(() => {}); }
}, { once: true });

// SCROLL REVEAL + SKILL BARS
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const fill = e.target.querySelector('.skill-fill');
      if (fill) setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 200);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// MODALS (generic)
function openModal(name) {
  const m = document.getElementById('modal-' + name);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModalBtn(name) {
  const m = document.getElementById('modal-' + name);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeModal(e, name) {
  if (e.target === document.getElementById('modal-' + name)) closeModalBtn(name);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open'); document.body.style.overflow = '';
    });
  }
});

// EDUCATION MODALS
function openEduModal(name) {
  openModal('edu-' + name);
}

// PROFILE CLICK — HIRE ME messages
const hirePhrases = ['Please hire me! 🙏', "I'll do anything!", 'Please! 😭'];
let hirePhraseIndex = 0;
const profileRing = document.getElementById('profile-ring');
const hireContainer = document.getElementById('hire-messages');

function triggerHireMe() {
  // bounce animation
  profileRing.classList.remove('clicked');
  void profileRing.offsetWidth; // reflow to restart
  profileRing.classList.add('clicked');
  setTimeout(() => profileRing.classList.remove('clicked'), 550);

  // floating message
  const msg = document.createElement('div');
  msg.className = 'hire-msg';
  msg.textContent = hirePhrases[hirePhraseIndex % hirePhrases.length];
  hirePhraseIndex++;

  // slight horizontal randomness so messages don't all stack
  const offset = (Math.random() - 0.5) * 60;
  msg.style.left = `calc(50% + ${offset}px)`;

  hireContainer.appendChild(msg);
  setTimeout(() => msg.remove(), 1700);
}

// HOBBY DATA
const hobbyData = {
  badminton: {
    title: 'Badminton',
    gif: 'badminton.gif',
    desc: 'One of my go-to sports! I love playing badminton with friends — great for reflexes and a ton of fun.'
  },
  basketball: {
    title: 'Basketball',
    gif: 'basketball.gif',
    desc: 'A classic. I enjoy shooting hoops and playing pickup games whenever I get the chance.'
  },
  fish: {
    title: 'Fish Keeping',
    gif: 'fish.gif',
    desc: 'I find fish tanks incredibly relaxing to watch and maintain. It teaches patience and care.'
  },
  hamster: {
    title: 'Hamster Keeping',
    gif: 'hamster.gif',
    desc: 'My little furry buddies! Keeping hamsters has taught me a lot about responsibility and love for animals.'
  },
  guitar: {
    title: 'Playing Guitar',
    gif: 'guitar.gif',
    desc: 'Music is my creative escape. I strum along whenever life gets stressful — nothing beats a good riff.'
  }
};

function openHobbyModal(key) {
  const data = hobbyData[key];
  if (!data) return;
  document.getElementById('hobby-modal-gif').src = data.gif;
  document.getElementById('hobby-modal-title').textContent = data.title;
  document.getElementById('hobby-modal-desc').textContent = data.desc;
  const m = document.getElementById('modal-hobby');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeHobbyModal(e) {
  if (e.target === document.getElementById('modal-hobby')) closeHobbyModalBtn();
}
function closeHobbyModalBtn() {
  const m = document.getElementById('modal-hobby');
  m.classList.remove('open');
  document.body.style.overflow = '';
}

// CONTACT FORM
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    document.getElementById('form-success').style.display = 'block';
    e.target.reset();
    setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 5000);
  }, 1500);
}
