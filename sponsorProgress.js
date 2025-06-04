document.addEventListener("DOMContentLoaded", () => {
  const sponsorSteps = Array.from(document.querySelectorAll('.sponsor-step'));
  if (!sponsorSteps.length) return;

  const total = sponsorSteps.length;
  const progressWrapper = document.createElement('div');
  progressWrapper.id = 'sponsor-progress-wrapper';
  progressWrapper.innerHTML = `
    <div id="sponsor-progress-text">Bijna klaar, nog enkele vragen</div>
    <div id="sponsor-progress-container">
      <div id="sponsor-progress-fill"></div>
    </div>
  `;
  document.body.appendChild(progressWrapper);

  const fill = document.getElementById('sponsor-progress-fill');
  const label = document.getElementById('sponsor-progress-text');

  function updateProgress(index) {
    const percent = Math.round(((index + 1) / total) * 100);
    fill.style.width = `${percent}%`;
    label.textContent = `Bijna klaar, nog enkele vragen ${index + 1}/${total}`;
  }

  const observer = new MutationObserver(() => {
    const visible = sponsorSteps.find(s => s.offsetParent !== null);
    if (visible) {
      progressWrapper.style.display = 'block';
      const currentIndex = sponsorSteps.indexOf(visible);
      updateProgress(currentIndex);
    } else {
      progressWrapper.style.display = 'none';
    }
  });

  observer.observe(document.body, { attributes: true, childList: true, subtree: true });

  // init
  const visible = sponsorSteps.find(s => s.offsetParent !== null);
  if (visible) {
    progressWrapper.style.display = 'block';
    updateProgress(sponsorSteps.indexOf(visible));
  }
});
