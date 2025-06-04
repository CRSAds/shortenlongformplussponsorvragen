// sponsorProgress.js

console.log('Sponsor Progressbar geladen');

document.addEventListener("DOMContentLoaded", () => {
  const sponsorSteps = Array.from(document.querySelectorAll('.sponsor-step'));
  const progressBar = document.createElement('div');
  progressBar.id = 'sponsor-progress-container';
  progressBar.innerHTML = `
    <div id="sponsor-progress-text">Bijna klaar – nog enkele vragen te gaan! <span id="sponsor-progress-count"></span></div>
    <div id="sponsor-progress-fill"></div>
  `;
  document.body.appendChild(progressBar);

  const fill = document.getElementById('sponsor-progress-fill');
  const count = document.getElementById('sponsor-progress-count');
  const total = sponsorSteps.length;

  function updateProgress(index) {
    const percent = Math.round(((index + 1) / total) * 100);
    fill.style.width = `${percent}%`;
    count.textContent = `${index + 1} / ${total}`;
  }

  sponsorSteps.forEach((step, index) => {
    const buttons = step.querySelectorAll('.sponsor-optin, .flow-next');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const next = sponsorSteps[index + 1];
        if (next) updateProgress(index + 1);
        else progressBar.style.display = 'none';
      });
    });
  });

  const observer = new MutationObserver(() => {
    const visibleStep = sponsorSteps.find(step => step.offsetParent !== null);
    if (visibleStep) {
      progressBar.style.display = 'block';
      const currentIndex = sponsorSteps.indexOf(visibleStep);
      updateProgress(currentIndex);
    } else {
      progressBar.style.display = 'none';
    }
  });

  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
});
