// sponsorProgress.js
console.log('Sponsor Progressbar geladen');

document.addEventListener("DOMContentLoaded", () => {
  const sponsorSteps = Array.from(document.querySelectorAll('.sponsor-step'));

  if (!sponsorSteps.length) return;

  const total = sponsorSteps.length;

  // Maak wrapper en onderdelen
  const wrapper = document.createElement('div');
  wrapper.id = 'sponsor-progress-wrapper';
  wrapper.innerHTML = `
    <div id="sponsor-progress-text">Bijna klaar, nog enkele vragen</div>
    <div id="sponsor-progress-container">
      <div id="sponsor-progress-fill"></div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const fill = document.getElementById('sponsor-progress-fill');
  const text = document.getElementById('sponsor-progress-text');

  function updateProgress(index) {
    const percent = Math.round(((index + 1) / total) * 100);
    fill.style.width = `${percent}%`;
    text.textContent = `Bijna klaar, nog enkele vragen ${index + 1}/${total}`;
  }

  // Voeg event listeners toe aan sponsor-step knoppen
  sponsorSteps.forEach((step, index) => {
    const buttons = step.querySelectorAll('.sponsor-optin, .flow-next');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const next = sponsorSteps[index + 1];
          if (next) {
            updateProgress(index + 1);
            wrapper.style.display = 'block';
          } else {
            wrapper.style.display = 'none';
          }
        }, 100); // kleine vertraging voorkomt race conditions
      });
    });
  });

  // Observer om zichtbare sectie te detecteren
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      const visibleStep = sponsorSteps.find(step => step.offsetParent !== null);
      if (visibleStep) {
        const currentIndex = sponsorSteps.indexOf(visibleStep);
        updateProgress(currentIndex);
        wrapper.style.display = 'block';
      } else {
        wrapper.style.display = 'none';
      }
    }, 100); // ook hier vertraging voor veilige DOM-read
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
