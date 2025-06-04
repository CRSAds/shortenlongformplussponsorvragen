console.log('Sponsor Progressbar geladen');

document.addEventListener("DOMContentLoaded", () => {
  const sponsorSteps = Array.from(document.querySelectorAll('.sponsor-step'));
  const total = sponsorSteps.length;

  // Progressbar container
  const wrapper = document.createElement('div');
  wrapper.id = 'sponsor-progress-wrapper';
  wrapper.innerHTML = `
    <div id="sponsor-progress-text"></div>
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

  // Voeg click listeners toe
  sponsorSteps.forEach((step, index) => {
    const buttons = step.querySelectorAll('.sponsor-optin, .flow-next');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const next = sponsorSteps[index + 1];
        if (next) {
          updateProgress(index + 1);
        } else {
          wrapper.style.display = 'none';
        }
      });
    });
  });

  // Detecteer zichtbare sponsorvraag en toon/hide progress
  const observer = new MutationObserver(() => {
    const visibleStep = sponsorSteps.find(step => step.offsetParent !== null);
    if (visibleStep) {
      wrapper.style.display = 'block';
      const currentIndex = sponsorSteps.indexOf(visibleStep);
      updateProgress(currentIndex);
    } else {
      wrapper.style.display = 'none';
    }
  });

  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
});
