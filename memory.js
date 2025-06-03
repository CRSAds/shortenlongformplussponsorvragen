console.log("memory.js geladen!");

const icons = [
  'grape.png', 'grape.png',
  'cherries.png', 'cherries.png',
  'watermelon.png', 'watermelon.png',
  'pineapple.png', 'pineapple.png',
  'bananas.png', 'bananas.png',
  'strawberry.png', 'strawberry.png'
];

const shuffle = arr => arr.sort(() => Math.random() - 0.5);
const board = document.getElementById('game-board');
const overlay = document.getElementById('win-overlay');
let flipped = [];
let matched = 0;
let timerInterval;
let timeLimit = 90;
let timeLeft = timeLimit;

function createCard(src) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="front">
      <img src="https://shortenlongformplussponsorvragen.vercel.app/assets/card-icon.png" alt="">
    </div>
    <div class="back">
      <img src="https://shortenlongformplussponsorvragen.vercel.app/assets/${src}" alt="">
    </div>
  `;
  card.addEventListener('click', () => flipCard(card, src));
  return card;
}

function flipCard(card, src) {
  if (card.classList.contains('flip') || flipped.length === 2) return;
  card.classList.add('flip');
  flipped.push({ card, src });

  if (flipped.length === 2) {
    const [a, b] = flipped;
    if (a.src === b.src) {
      matched++;
      flipped = [];
      if (matched === 6) handleWin();
    } else {
      setTimeout(() => {
        a.card.classList.remove('flip');
        b.card.classList.remove('flip');
        flipped = [];
      }, 900);
    }
  }
}

function handleWin() {
  clearInterval(timerInterval);
  overlay.classList.add('show');
  triggerConfetti();

  const nextButton = document.getElementById('to-form-button');
  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
      const currentIndex = steps.findIndex(step => step.contains(document.getElementById('game-board')));
      const next = steps[currentIndex + 1];
      if (next) {
        steps[currentIndex].style.display = 'none';
        next.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

function startGame() {
  board.innerHTML = '';
  matched = 0;
  flipped = [];
  timeLeft = timeLimit;
  updateProgress();
  overlay.classList.remove('show');

  const cards = shuffle([...icons]);
  cards.forEach(icon => board.appendChild(createCard(icon)));

  timerInterval = setInterval(() => {
    timeLeft--;
    updateProgress();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('Tijd is om!');
    }
  }, 1000);
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const percentage = (timeLeft / timeLimit) * 100;
  fill.style.width = `${percentage}%`;
}

if (board && overlay) {
  startGame();
}

function triggerConfetti() {
  const container = document.getElementById('confetti-container');
  const origin = document.querySelector('.overlay-content');
  const centerX = origin.offsetLeft + origin.offsetWidth / 2;
  const centerY = origin.offsetTop + origin.offsetHeight / 2;

  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti');
    el.style.setProperty('--hue', Math.floor(Math.random() * 360));

    const angle = Math.random() * 2 * Math.PI;
    const radius = 150 + Math.random() * 200;
    const x = Math.cos(angle) * radius + 'px';
    const y = Math.sin(angle) * radius + 'px';

    el.style.setProperty('--x', x);
    el.style.setProperty('--y', y);
    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;

    container.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}
