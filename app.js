// LoveFlix — Application Logic & Cinematic Player

let currentPlayingEpisode = 5;
let audioCtx = null;
let isSoundEnabled = false;
let ambientAudioInterval = null;

// Base de datos de Episodios (Película: 5 Capítulos)
const EPISODES_DATA = {
  1: {
    num: 1,
    title: "Capítulo 1: El Inicio de la Magia",
    date: "30 de Mayo al 30 de Junio del 2026",
    synopsis: `Todo comenzó aquel 30 de Mayo del 2026. Los nervios eran evidentes, pero la conexión fue tan instantánea que parecía que nos conocíamos de toda la vida.\n\nEsa primera cita donde el tiempo pasó en un abrir y cerrar de ojos, las miradas tímidas y ese primer abrazo que me confirmó que algo extraordinario estaba empezando.\n\nCalificación del capítulo: ⭐⭐⭐⭐⭐ 10/10 • Estado: El mejor inicio posible.`
  },
  2: {
    num: 2,
    title: "Capítulo 2: Risas Sin Fin & Apodos",
    date: "30 de Junio al 30 de Julio del 2026",
    synopsis: `En el segundo capítulo la pena quedó completamente en el olvido. Empezaron las pláticas de 1 hora que se extendían hasta las tantas de la madrugada, los apodos tontos y los ataques de risa por tonterías que solo nosotros dos entendemos.\n\nAquí descubrimos que éramos mejores amigos además de novios.\n\nCalificación del capítulo: ⭐⭐⭐⭐⭐ 10/10 • Estado: Complicidad total desbloqueada.`
  },
  3: {
    num: 3,
    title: "Capítulo 3: Mi Lugar Seguro",
    date: "30 de Julio al 30 de Agosto del 2026",
    synopsis: `Dicen que el amor verdadero no te da mariposas de ansiedad, te da calma. Y en este tercer mes, tus brazos se convirtieron oficialmente en mi lugar favorito del mundo entero.\n\nSaber que en los días difíciles tengo a alguien que me escucha, que no me juzga y que me sostiene la mano es el regalo más grande de todos.\n\nCalificación del capítulo: ⭐⭐⭐⭐⭐ 10/10 • Estado: Confianza inquebrantable.`
  },
  4: {
    num: 4,
    title: "Capítulo 4: El Equipo Invencible",
    date: "30 de Agosto al 30 de Septiembre del 2026",
    synopsis: `En el cuarto capítulo demostramos que el amor se construye día con día. Cuando hubo retos o momentos pesados, los resolvimos platicando, con paciencia y con abrazos.\n\nNos dimos cuenta de que somos un equipo: dos personas que se eligen a diario y que tienen las mismas ganas de construir un futuro bonito juntos.\n\nCalificación del capítulo: ⭐⭐⭐⭐⭐ 10/10 • Estado: Vínculo indestructible.`
  },
  5: {
    num: 5,
    title: "Capítulo 5: Gran Celebración de 5 Meses",
    date: "30 de Septiembre al 30 de Octubre del 2026 (¡HOY!)",
    synopsis: `¡Llegamos al capítulo estelar de hoy! Cinco meses exactos desde aquel inolvidable 30 de Mayo.\n\nHoy quiero darte las gracias por ser el novio más atento, divertido y cariñoso. Por cada detalle, por cada beso en la frente y por hacerme sentir tan profundamente querida.\n\nEste no es el final de la película, es apenas la primera gran entrega de nuestra saga. ¡Te amo con todo mi corazón y estoy lista para todos los capítulos que nos faltan por vivir juntos! ❤️`
  }
};

// --- Web Audio: Netflix "Ta-Dum!" Sound & Ambient Notes ---
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// Recreación del icónico "Ta-Dum" de Netflix
function playTadumSound() {
  try {
    initAudio();
    const now = audioCtx.currentTime;

    // Primer golpe grave y profundo (D2)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(73.42, now); // D2
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Segundo acorde más brillante (Ta-DUM)
    setTimeout(() => {
      const t = audioCtx.currentTime;
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(146.83, t); // D3
      osc2.frequency.exponentialRampToValueAtTime(293.66, t + 0.5); // D4
      gain2.gain.setValueAtTime(0.2, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(t);
      osc2.stop(t + 1.8);
    }, 180);
  } catch(e) {}
}

function playCinemaChime() {
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const notes = [293.66, 369.99, 440.00, 587.33]; // D F# A D
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.12, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + (idx + 1) * 0.25);
    });
  } catch(e) {}
}

// Inicialización de Eventos
document.addEventListener("DOMContentLoaded", () => {
  setupNavbarScroll();
});

// Selección de Perfil
function selectProfile(profileType) {
  playTadumSound();
  const gate = document.getElementById('profileGate');
  if (gate) gate.classList.add('hidden');
}

// Navbar scroll styling
function setupNavbarScroll() {
  const nav = document.getElementById('netflixNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Navegación fluida por secciones
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 70;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reproductor de Episodios (Cinema Player)
function playEpisode(epNum) {
  currentPlayingEpisode = epNum;
  const data = EPISODES_DATA[epNum];
  if (!data) return;

  playCinemaChime();

  document.getElementById('playerBadge').textContent = `PELÍCULA OFICIAL • CAPÍTULO ${data.num}`;
  document.getElementById('playerTitle').textContent = data.title;
  document.getElementById('playerDate').textContent = data.date;
  document.getElementById('playerBody').textContent = data.synopsis;

  document.getElementById('cinemaModal').classList.add('active');
}

function closeEpisodePlayer() {
  document.getElementById('cinemaModal').classList.remove('active');
}

function nextEpisode() {
  const next = currentPlayingEpisode >= 5 ? 1 : currentPlayingEpisode + 1;
  playEpisode(next);
}

function prevEpisode() {
  const prev = currentPlayingEpisode <= 1 ? 5 : currentPlayingEpisode - 1;
  playEpisode(prev);
}

// Modal Más Información
function openSeriesInfoModal() {
  playCinemaChime();
  document.getElementById('infoModal').classList.add('active');
}

function closeSeriesInfoModal() {
  document.getElementById('infoModal').classList.remove('active');
}

// Like Botón Hero
function toggleLikeHero() {
  const btn = document.getElementById('likeBtn');
  btn.classList.toggle('liked');
  playCinemaChime();
  if (btn.classList.contains('liked')) {
    btn.textContent = '💖';
    alert("¡Agregado a 'Tus Favoritos de Toda la Vida'! ❤️");
  } else {
    btn.textContent = '❤️';
  }
}

// Toggle Sonido Ambiente
function toggleLoveflixSound() {
  initAudio();
  const btn = document.getElementById('soundBtn');
  if (isSoundEnabled) {
    isSoundEnabled = false;
    clearInterval(ambientAudioInterval);
    btn.textContent = '🔇 Silencio';
  } else {
    isSoundEnabled = true;
    btn.textContent = '🔊 Sonando';
    startAmbientChords();
  }
}

function startAmbientChords() {
  const chords = [
    [261.63, 329.63, 392.00], // C
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
    [196.00, 246.94, 293.66]  // G
  ];
  let chordIdx = 0;
  ambientAudioInterval = setInterval(() => {
    if (!isSoundEnabled) return;
    const current = chords[chordIdx];
    current.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    });
    chordIdx = (chordIdx + 1) % chords.length;
  }, 1600);
}
