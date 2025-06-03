import { reloadImages } from './imageFix.js';

export default function setupFormSubmit() {
  const btn = document.getElementById('submit-long-form');
  const section = document.getElementById('long-form-section');
  if (!btn || !section) return;

  btn.addEventListener('click', () => {
    const extraData = {
      postcode: document.getElementById('postcode')?.value.trim(),
      straat: document.getElementById('straat')?.value.trim(),
      huisnummer: document.getElementById('huisnummer')?.value.trim(),
      woonplaats: document.getElementById('woonplaats')?.value.trim(),
      telefoon: document.getElementById('telefoon')?.value.trim()
    };

    for (const [key, value] of Object.entries(extraData)) {
      localStorage.setItem(key, value);
    }

    window.longFormCampaigns.forEach(campaignId => {
      const payload = {
        ...extraData,
        cid: null,
        sid: 34,
        gender: localStorage.getItem('gender'),
        firstname: localStorage.getItem('firstname'),
        lastname: localStorage.getItem('lastname'),
        dob_day: localStorage.getItem('dob_day'),
        dob_month: localStorage.getItem('dob_month'),
        dob_year: localStorage.getItem('dob_year'),
        email: localStorage.getItem('email'),
        t_id: localStorage.getItem('t_id'),
        campaignId
      };

      fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => {
        console.log('Verzonden via proxy');
      });
    });

    section.style.display = 'none';
    const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
    const idx = steps.findIndex(s => s.id === 'long-form-section');
    const next = steps[idx + 1];

    if (next) {
      next.classList.remove('hide-on-live');
      next.style.removeProperty('display');
      reloadImages(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
