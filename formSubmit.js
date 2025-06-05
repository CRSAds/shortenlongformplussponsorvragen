// formSubmit.js
import { reloadImages } from './imageFix.js';

export const campaigns = {
  "campaign-mycollections": { cid: 1882, sid: 34, requiresLongForm: true },
  "campaign-unitedconsumers-man": { cid: 2905, sid: 34, requiresLongForm: true },
  "campaign-unitedconsumers-vrouw": { cid: 2906, sid: 34, requiresLongForm: true },
  "campaign-kiosk": { cid: 3499, sid: 34, requiresLongForm: false },
  "campaign-ad": { cid: 3532, sid: 34, requiresLongForm: false },
  "campaign-volkskrant": { cid: 3534, sid: 34, requiresLongForm: false },
  "campaign-parool": { cid: 4192, sid: 34, requiresLongForm: false },
  "campaign-trouw": { cid: 4193, sid: 34, requiresLongForm: false },
  "campaign-bndestem": { cid: 4200, sid: 34, requiresLongForm: false },
  "campaign-brabantsdagblad": { cid: 4198, sid: 34, requiresLongForm: false },
  "campaign-degelderlander": { cid: 4196, sid: 34, requiresLongForm: false },
  "campaign-destentor": { cid: 4199, sid: 34, requiresLongForm: false },
  "campaign-eindhovensdagblad": { cid: 4197, sid: 34, requiresLongForm: false },
  "campaign-pzc": { cid: 4194, sid: 34, requiresLongForm: false },
  "campaign-tubantia": { cid: 4195, sid: 34, requiresLongForm: false },
  "campaign-consubeheer": { cid: 4720, sid: 34, requiresLongForm: true },
  "campaign-generationzero": { cid: 4555, sid: 34, requiresLongForm: true },
  "campaign-hotelspecials": { cid: 4621, sid: 34, requiresLongForm: false },
  "campaign-raadselgids": { cid: 3697, sid: 34, requiresLongForm: true },
  "campaign-tuinmanieren": { cid: 4852, sid: 34, requiresLongForm: false }
};
window.campaigns = campaigns;

export function buildPayload(campaign) {
  const urlParams = new URLSearchParams(window.location.search);
  const t_id = urlParams.get("t_id") || crypto.randomUUID();

  return {
    cid: campaign.cid,
    sid: campaign.sid,
    gender: localStorage.getItem('gender'),
    firstname: localStorage.getItem('firstname'),
    lastname: localStorage.getItem('lastname'),
    dob_day: localStorage.getItem('dob_day'),
    dob_month: localStorage.getItem('dob_month'),
    dob_year: localStorage.getItem('dob_year'),
    email: localStorage.getItem('email'),
    t_id: t_id,
    postcode: localStorage.getItem('postcode') || '',
    straat: localStorage.getItem('straat') || '',
    huisnummer: localStorage.getItem('huisnummer') || '',
    woonplaats: localStorage.getItem('woonplaats') || '',
    telefoon: localStorage.getItem('telefoon') || ''
  };
}
window.buildPayload = buildPayload;

export function fetchLead(payload) {
  fetch('https://shortenlongformplussponsorvragen.vercel.app/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => console.log("Lead verzonden:", data))
    .catch(err => console.error("Verzendfout:", err));
}
window.fetchLead = fetchLead;

export default function setupFormSubmit() {
  const btn = document.getElementById('submit-long-form');
  const section = document.getElementById('long-form-section');
  if (btn && section) {
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

      if (Array.isArray(window.longFormCampaigns)) {
        window.longFormCampaigns.forEach(campaign => {
          const payload = buildPayload(campaign);
          fetchLead(payload);
        });
      }

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

  // ✅ Short Form fallback => LeadsNL campaign (cid 925)
  const shortFormBtn = document.querySelector('.flow-next');
  if (shortFormBtn) {
    shortFormBtn.addEventListener('click', () => {
      const gender = document.querySelector('input[name="gender"]:checked')?.value;
      const firstname = document.getElementById('firstname')?.value.trim();
      const lastname = document.getElementById('lastname')?.value.trim();
      const dob_day = document.getElementById('dob-day')?.value.trim();
      const dob_month = document.getElementById('dob-month')?.value.trim();
      const dob_year = document.getElementById('dob-year')?.value.trim();
      const email = document.getElementById('email')?.value.trim();

      localStorage.setItem('gender', gender);
      localStorage.setItem('firstname', firstname);
      localStorage.setItem('lastname', lastname);
      localStorage.setItem('dob_day', dob_day);
      localStorage.setItem('dob_month', dob_month);
      localStorage.setItem('dob_year', dob_year);
      localStorage.setItem('email', email);

      const urlParams = new URLSearchParams(window.location.search);
      const t_id = urlParams.get("t_id") || crypto.randomUUID();

      const payload = {
        cid: 925,
        sid: 34,
        gender,
        firstname,
        lastname,
        dob_day,
        dob_month,
        dob_year,
        email,
        t_id
      };

      fetchLead(payload);

      const current = shortFormBtn.closest('.flow-section');
      const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
      const index = steps.findIndex(s => s === current);
      const next = steps[index + 1];
      if (next) {
        current.style.display = 'none';
        next.style.removeProperty('display');
        reloadImages(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
