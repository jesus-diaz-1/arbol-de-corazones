// ============= CONFIG =============
// Fecha de inicio: 8 Nov 2025 a las 19:00 (7pm)
const START_DATE = new Date(2025, 10, 8, 19, 0, 0); // mes 10 = noviembre

// Mensaje final (después del árbol)
const MESSAGE_TEXT = "Si pudiera elegir un lugar seguro, sería a tu lado. Cada día contigo se siente como un regalo que no sabía que necesitaba. Amorcito, gracias por llegar a mi vida y hacerla más bonita sin siquiera intentarlo. Este detalle es solo una forma de mostrarte cuánto te pienso. ❤️";

const TYPE_SPEED = 55; // ms por carácter

// =====================================================
// ★★★ NUEVO: 50 FRASES + SHUFFLE SIN REPETIR ★★★
// =====================================================
let PHRASES = [
  // 30 originales
  "A tu lado todo se siente más bonito.",
  "Eres mi lugar favorito, sin duda alguna.",
  "No sabía que necesitaba a alguien como tú.",
  "Tus abrazos son mi lugar seguro.",
  "Si tú estás, todo vale la pena.",
  "Me encantas más cada día.",
  "Tu sonrisa es de mis cosas favoritas.",
  "Me haces feliz sin darte cuenta.",
  "A veces te pienso más de lo que debería.",
  "Te quiero cerquita, siempre.",
  "Eres mi casualidad más bonita.",
  "Me encanta cómo haces que todo sea mejor.",
  "No hay día que no piense en ti.",
  "Ojalá supieras lo mucho que significas.",
  "Gracias por existir justo donde yo existo.",
  "Cuando pienso en amor, pienso en ti.",
  "Tu voz siempre será uno de mis sonidos favoritos.",
  "Me haces sentir cosas que no sabía describir.",
  "Quiero que te quedes mucho tiempo en mi vida.",
  "No sé qué hiciste, pero me encantas demasiado.",
  "Tu presencia tiene algo que me calma.",
  "Hay personas bonitas, pero ninguna como tú.",
  "Te pienso y sonrío sin querer.",
  "Con poquito haces mucho en mí.",
  "Me haces querer ser mi mejor versión.",
  "Eres un antes y después en mi vida.",
  "No quiero perderte nunca.",
  "Me gustas, así de simple, así de fuerte.",
  "Gracias por volver mis días más ligeros.",
  "No sé cómo, pero contigo todo es mejor.",

  // ★ 20 nuevas
  "Eres mi historia favorita que quiero seguir escribiendo.",
  "Mi corazón late más bonito cuando estás tú.",
  "Lo mejor que me pasó fue coincidir contigo.",
  "Eres mi paz en días pesados.",
  "A tu lado todo tiene sentido.",
  "Mi mundo es más bonito desde que llegaste tú.",
  "Quisiera pausarte en mis momentos favoritos.",
  "Tu forma de querer me hizo creer de nuevo.",
  "Te pienso y el día se arregla.",
  "Qué suerte la mía de tenerte cerca.",
  "Eres la única persona que siempre quiero ver.",
  "Me encantas incluso cuando no lo intentas.",
  "Nunca había querido tanto a alguien.",
  "Eres lo primero bonito que pienso en el día.",
  "A veces me sorprende lo mucho que te quiero.",
  "Ojalá pudiera abrazarte siempre.",
  "Te miro y me siento en casa.",
  "Me haces sentir que todo va a estar bien.",
  "Cada día me enamoro un poquito más de ti.",
  "Eres mi sueño más despierto."
];

// ============= elementos DOM =============
const startScreen = document.getElementById('startScreen');
const clickHeart = document.getElementById('clickHeart');
const main = document.getElementById('main');
const svg = document.getElementById('treeSVG');
const messageEl = document.getElementById('message');
const messageWrap = document.getElementById('messageWrap');
const timerEl = document.getElementById('timer'); 
const music = document.getElementById('bgMusic');

let treeBuilt = false;
let fallingInterval = null;

// =====================================================
// ★★★ NUEVO: FRASES SHUFFLED + TYPEWRITER + FADE-IN ★★★
// =====================================================
let phraseIndex = 0;
let shuffled = [];

// Mezclar (Fisher–Yates)
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function typeWriterPhrase(text, el, speed = 35) {
  return new Promise(resolve => {
    el.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
        return;
      }
      el.textContent += text[i];
      i++;
    }, speed);
  });
}

// Loop de frases cada 5 segundos sin repetir
async function startPhraseLoop() {
  shuffled = shuffleArray(PHRASES);
  phraseIndex = 0;

  async function changePhrase() {
    if (phraseIndex >= shuffled.length) {
      shuffled = shuffleArray(PHRASES);
      phraseIndex = 0;
    }

    timerEl.style.opacity = 0;

    setTimeout(async () => {
      const phrase = shuffled[phraseIndex];
      phraseIndex++;

      timerEl.textContent = "";
      await typeWriterPhrase(phrase, timerEl, 35);

      timerEl.style.opacity = 1;
    }, 350);
  }

  changePhrase();
  setInterval(changePhrase, 5000);
}

// util SVG
function createSVG(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

// path corazón
function heartPathD(size = 10) {
  const s = size / 12;
  return `M 0 ${-6 * s} C ${6 * s} ${-12 * s}, ${18 * s} ${-4 * s}, 0 ${8 * s} C ${-18 * s} ${-4 * s}, ${-6 * s} ${-12 * s}, 0 ${-6 * s} Z`;
}

// *** TODO EL ÁRBOL (idéntico) ***
function buildTreeAnimation() {
  svg.style.opacity = 1;
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const W = 420, H = 420;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // ==== 1. Tronco y ramas ====
  const trunk = createSVG('path', {
    d: `M ${W / 2} ${H} L ${W / 2} ${H - 120}`,
    stroke: '#8B4513',
    'stroke-width': 24,
    'stroke-linecap': 'round',
    fill: 'none'
  });
  svg.appendChild(trunk);

  const branchPaths = [
    `M ${W / 2} ${H - 100} C ${W / 2 - 40} ${H - 120} ${W / 2 - 80} ${H - 150} ${W / 2 - 100} ${H - 180}`,
    `M ${W / 2 - 100} ${H - 180} C ${W / 2 - 120} ${H - 200} ${W / 2 - 140} ${H - 230} ${W / 2 - 130} ${H - 260}`,
    `M ${W / 2 - 100} ${H - 180} C ${W / 2 - 80} ${H - 200} ${W / 2 - 60} ${H - 230} ${W / 2 - 50} ${H - 260}`,
    `M ${W / 2} ${H - 100} C ${W / 2 + 40} ${H - 120} ${W / 2 + 80} ${H - 150} ${W / 2 + 100} ${H - 180}`,
    `M ${W / 2 + 100} ${H - 180} C ${W / 2 + 120} ${H - 200} ${W / 2 + 140} ${H - 230} ${W / 2 + 130} ${H - 260}`,
    `M ${W / 2 + 100} ${H - 180} C ${W / 2 + 80} ${H - 200} ${W / 2 + 60} ${H - 230} ${W / 2 + 50} ${H - 260}`,
    `M ${W / 2} ${H - 80} L ${W / 2} ${H - 200}`,
    `M ${W / 2} ${H - 140} C ${W / 2 - 30} ${H - 160} ${W / 2 - 50} ${H - 190} ${W / 2 - 40} ${H - 220}`,
    `M ${W / 2} ${H - 140} C ${W / 2 + 30} ${H - 160} ${W / 2 + 50} ${H - 190} ${W / 2 + 40} ${H - 220}`,
    `M ${W / 2} ${H - 170} C ${W / 2 - 20} ${H - 190} ${W / 2 - 30} ${H - 220} ${W / 2 - 10} ${H - 240}`,
    `M ${W / 2} ${H - 170} C ${W / 2 + 20} ${H - 190} ${W / 2 + 30} ${H - 220} ${W / 2 + 10} ${H - 240}`,
    `M ${W / 2 - 60} ${H - 160} C ${W / 2 - 70} ${H - 180} ${W / 2 - 90} ${H - 200} ${W / 2 - 85} ${H - 230}`,
    `M ${W / 2 + 60} ${H - 160} C ${W / 2 + 70} ${H - 180} ${W / 2 + 90} ${H - 200} ${W / 2 + 85} ${H - 230}`,
    `M ${W / 2 - 30} ${H - 200} C ${W / 2 - 40} ${H - 220} ${W / 2 - 60} ${H - 240} ${W / 2 - 50} ${H - 270}`,
    `M ${W / 2 + 30} ${H - 200} C ${W / 2 + 40} ${H - 220} ${W / 2 + 60} ${H - 240} ${W / 2 + 50} ${H - 270}`
  ];

  const branches = branchPaths.map(d => {
    const p = createSVG('path', {
      d: d,
      stroke: '#A0522D',
      'stroke-width': 6,
      'stroke-linecap': 'round',
      fill: 'none',
      opacity: 0
    });
    svg.appendChild(p);
    return p;
  });

  function animatePathDraw(el, duration = 700, delay = 0) {
    const len = el.getTotalLength();
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.getBoundingClientRect();
    el.style.transition = `stroke-dashoffset ${duration}ms linear ${delay}ms, opacity 200ms linear ${delay}ms`;
    el.style.strokeDashoffset = '0';
    el.style.opacity = 1;
  }

  setTimeout(() => animatePathDraw(trunk, 800, 0), 150);

  branches.forEach((b, i) => {
    setTimeout(() => animatePathDraw(b, 600, 0), 800 + i * 80);
  });

  // ==== 2. CORAZONES ====
  setTimeout(() => {
    const hearts = [];
    const centerX = W / 2;

    const crownCenterY = H - 250;
    const crownWidth = 180;
    const crownHeight = 160;

    for (let i = 0; i < 1200; i++) {
      let x, y;
      let inCrown = false;
      let attempts = 0;

      do {
        const angle = Math.random() * Math.PI * 2;
        const radiusX = Math.random() * crownWidth;
        const radiusY = Math.random() * crownHeight;

        x = centerX + Math.cos(angle) * radiusX;
        y = crownCenterY + Math.sin(angle) * radiusY;

        const distX = Math.abs(x - centerX);
        const distY = Math.abs(y - crownCenterY);

        inCrown = (Math.pow(distX / crownWidth, 2) + Math.pow(distY / crownHeight, 2)) <= 1;

        if (y > H - 120) inCrown = false;
        if (distX < 20 && y > H - 150) inCrown = false;

        attempts++;
        if (attempts > 30) {
          const t = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.8;
          x = centerX + Math.cos(t) * crownWidth * r;
          y = crownCenterY + Math.sin(t) * crownHeight * r;
          inCrown = true;
        }
      } while (!inCrown && attempts < 50);

      const size = 5 + Math.random() * 9;

      const hue = 330 + Math.random() * 30;
      const sat = 70 + Math.random() * 25;
      const light = 45 + Math.random() * 35;
      const fill = `hsl(${hue}, ${sat}%, ${light}%)`;

      const rotation = (Math.random() * 50 - 25);
      const scaleStart = 0.03 + Math.random() * 0.04;

      const h = createSVG('path', {
        d: heartPathD(size),
        fill: fill,
        transform: `translate(${x}, ${y}) rotate(${rotation}) scale(${scaleStart})`,
        opacity: 0,
        'stroke': `hsl(${hue}, ${sat}%, ${light - 15}%)`,
        'stroke-width': '0.4'
      });

      svg.appendChild(h);

      hearts.push({
        el: h,
        x: x,
        y: y,
        finalScale: 0.5 + Math.random() * 0.7,
        delay: Math.random() * 1200
      });
    }

    hearts.forEach((heart) => {
      setTimeout(() => {
        heart.el.style.transition = `transform 800ms cubic-bezier(.2,.9,.2,1.2), opacity 600ms ease`;
        heart.el.style.opacity = 0.85 + Math.random() * 0.15;

        const rot = heart.el.getAttribute('transform').match(/rotate\(([^)]+)\)/)[1];

        heart.el.setAttribute('transform',
          `translate(${heart.x}, ${heart.y}) rotate(${rot}) scale(${heart.finalScale})`
        );
      }, 2000 + heart.delay);
    });

    startFallingFromTree(svg, W, H);
  }, 800 + (branches.length * 80) + 500);
}

// *** Corazones cayendo ***
function startFallingFromTree(svgEl, W, H) {
  if (window._fallingStarted) return;
  window._fallingStarted = true;

  const rect = svgEl.getBoundingClientRect();
  const cx = rect.left + W / 2;
  const cy = rect.top + H - 200;

  fallingInterval = setInterval(() => {
    const heartCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < heartCount; i++) {
      const offsetX = (Math.random() * 180) - 90;
      const x = cx + offsetX;
      const y = cy + (Math.random() * 30 - 15);
      spawnFallingHeartAt(x, y, 8 + Math.random() * 10);
    }
  }, 250);
}

function spawnFallingHeartAt(pageX, pageY, size = 16) {
  const el = document.createElement('div');
  el.className = 'falling-heart';
  el.innerHTML = '❤️';
  el.style.left = (pageX + (Math.random() * 20 - 10)) + 'px';
  el.style.top = (pageY + (Math.random() * 10 - 5)) + 'px';
  el.style.fontSize = size + 'px';
  el.style.opacity = '0.9';
  el.style.color = `hsl(${330 + Math.random() * 30}, 85%, 65%)`;
  el.style.textShadow = '0 2px 8px rgba(255, 100, 150, 0.6)';
  el.style.transition = `transform ${2 + Math.random() * 1.5}s ease-out, opacity ${2 + Math.random() * 1.5}s ease-out`;
  el.style.zIndex = '9999';
  el.style.position = 'fixed';
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    const dx = (Math.random() * 100 - 50);
    const dy = window.innerHeight + 40;
    const rotation = (Math.random() * 360) - 180;
    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`;
    el.style.opacity = '0';
  });

  setTimeout(() => el.remove(), 3500);
}

// Mostrar mensaje principal
function finalizeAndShowMessage() {
  messageWrap.style.transform = 'translateX(40px)';
  typeWriter(MESSAGE_TEXT, messageEl, TYPE_SPEED);
}

// Máquina de escribir
function typeWriter(text, el, speed = 50) {
  el.textContent = '';
  const caret = document.createElement('span');
  caret.className = 'caret';
  el.appendChild(caret);
  let i = 0;

  const interval = setInterval(() => {
    if (i >= text.length) {
      clearInterval(interval);
      caret.remove();
      return;
    }

    const ch = text[i];
    if (ch === '\n') {
      el.insertBefore(document.createElement('br'), caret);
    } else {
      el.insertBefore(document.createTextNode(ch), caret);
    }
    i++;
  }, speed);
}

// STARTER
clickHeart.addEventListener('click', async () => {
  if (treeBuilt) return;
  treeBuilt = true;

  try { await music.play(); } catch (e) {}

  clickHeart.animate([
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(0.6)', opacity: 0 }
  ], { duration: 420, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'forwards' });

  setTimeout(() => {
    startScreen.style.display = 'none';
    main.classList.remove('hidden');
    buildTreeAnimation();

    setTimeout(() => finalizeAndShowMessage(), 3800);

    startPhraseLoop(); // <<<<<< NUEVO

    setInterval(() => {
      const heartCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < heartCount; i++) {
        const x = Math.random() * window.innerWidth;
        spawnFallingHeartAt(x, -20, 6 + Math.random() * 8);
      }
    }, 500);
  }, 450);
});

window.addEventListener('resize', () => {});

document.addEventListener('DOMContentLoaded', () => {
  svg.style.opacity = 0;
});
