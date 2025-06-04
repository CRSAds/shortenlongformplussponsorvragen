document.addEventListener("DOMContentLoaded", () => {
  const sponsorSteps = Array.from(document.querySelectorAll('.sponsor-step'));
  if (!sponsorSteps.length) return;

  const total = sponsorSteps.length;
  const progressBar = document.createElement('div');
  progressBar.id = 'sponsor-progress-container';
  progressBar.innerHTML = `
    <div class="sponsor-progress-wrapper">
      <div id="sponsor-progress-label">Bijna klaar, nog enkele vragen</div>
      <div id="sponsor-progress-bar">
        <div id="sponsor-progress-fill">
          <img src="assets/sun.png" alt="zon" class="sun-icon" />
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(progressBar);

  const fill = document.getElementById('sponsor-progress-fill');
  const label = document.getElementById('sponsor-progress-label');

  function updateProgress(index) {
    const percent = Math.round(((index + 1) / total) * 100);
    fill.style.width = `${percent}%`;
    label.textContent = `Bijna klaar, nog enkele vragen ${index + 1}/${total}`;
  }

  sponsorSteps.forEach((step, index) => {
    const buttons = step.querySelectorAll('.sponsor-optin, .flow-next');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const next = sponsorSteps.find(s => s.offsetParent !== null);
          const nextIndex = sponsorSteps.indexOf(next);
          if (nextIndex !== -1) {
            updateProgress(nextIndex);
            progressBar.style.display = 'block';
          } else {
            progressBar.style.display = 'none';
          }
        }, 50); // kleine vertraging
      });
    });
  });

  // Initieel tonen als eerste stap zichtbaar is
  const visible = sponsorSteps.find(s => s.offsetParent !== null);
  if (visible) {
    progressBar.style.display = 'block';
    updateProgress(sponsorSteps.indexOf(visible));
  }

  // Observer voor dynamisch tonen/verbergen
  const observer = new MutationObserver(() => {
    const visible = sponsorSteps.find(s => s.offsetParent !== null);
    if (visible) {
      progressBar.style.display = 'block';
      updateProgress(sponsorSteps.indexOf(visible));
    } else {
      progressBar.style.display = 'none';
    }
  });

  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
});
