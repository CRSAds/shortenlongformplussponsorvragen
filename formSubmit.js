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
  const btn = document.querySelector('.flow-next');
  const form = document.getElementById('lead-form');
  if (!btn || !form) return;

  btn.addEventListener('click', () => {
    const fields = ['gender', 'firstname', 'lastname', 'dob_day', 'dob_month', 'dob_year', 'email'];
    fields.forEach(id => {
      const el = form.querySelector(`[name="${id}"]`);
      if (el && el.value) {
        localStorage.setItem(id, el.value.trim());
      }
    });

    const payload = buildPayload({ cid: 925, sid: 34 }); // LeadsNL campagne
    fetchLead(payload);

    // Doorgaan naar volgende sectie
    const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
    const currentStep = steps.find(s => s.contains(form));
    const nextStep = steps[steps.indexOf(currentStep) + 1];
    if (nextStep) {
      currentStep.style.display = 'none';
      nextStep.style.removeProperty('display');
      reloadImages(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Autofocus geboortedatumvelden
  const day = document.getElementById("dob-day");
  const month = document.getElementById("dob-month");
  const year = document.getElementById("dob-year");

  if (day) {
    day.addEventListener("input", () => {
      const val = day.value;
      if (val.length === 2 || parseInt(val[0], 10) >= 4) {
        month.focus();
      }
    });
  }

  if (month) {
    month.addEventListener("input", () => {
      const val = month.value;
      if (val.length === 2 || parseInt(val[0], 10) >= 2) {
        year.focus();
      }
    });
  }
}
