import { reloadImages } from './imageFix.js';

const campaigns = {
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

const longFormCampaigns = [];
window.longFormCampaigns = longFormCampaigns;

function storeFormDataFromStep(step) {
  const form = step.querySelector('form');
  if (!form) return;

  requestAnimationFrame(() => {
    const gender = form.querySelector('input[name="gender"]:checked')?.value;
    const firstname = form.querySelector('#firstname')?.value.trim();
    const lastname = form.querySelector('#lastname')?.value.trim();
    const dob_day = form.querySelector('#dob_day')?.value;
    const dob_month = form.querySelector('#dob_month')?.value;
    const dob_year = form.querySelector('#dob_year')?.value;
    const email = form.querySelector('#email')?.value.trim();
    const t_id = crypto.randomUUID();

    if (gender && firstname && lastname && dob_day && dob_month && dob_year && email) {
      localStorage.setItem('gender', gender);
      localStorage.setItem('firstname', firstname);
      localStorage.setItem('lastname', lastname);
      localStorage.setItem('dob_day', dob_day);
      localStorage.setItem('dob_month', dob_month);
      localStorage.setItem('dob_year', dob_year);
      localStorage.setItem('email', email);
      localStorage.setItem('t_id', t_id);
    }
  });
}

export default function initFlow() {
  const longFormSection = document.getElementById('long-form-section');
  const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
  const lastCoregIndex = steps.map(s => s.classList.contains('coreg-section')).lastIndexOf(true);

  if (!window.location.hostname.includes("swipepages.com")) {
    steps.forEach((el, i) => el.style.display = i === 0 ? 'block' : 'none');
    document.querySelectorAll('.hide-on-live, #long-form-section').forEach(el => {
      el.style.display = 'none';
    });
  }

  steps.forEach((step, index) => {
    step.querySelectorAll('.flow-next').forEach(btn => {
      btn.addEventListener('click', () => {
        storeFormDataFromStep(step);

        step.style.display = 'none';
        const next = steps[index + 1];
        if (index === lastCoregIndex && longFormCampaigns.length > 0 && longFormSection) {
          longFormSection.style.display = 'block';
          reloadImages(longFormSection);
        } else if (next) {
          next.style.display = 'block';
          reloadImages(next);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    step.querySelectorAll('.sponsor-optin').forEach(button => {
      button.addEventListener('click', () => {
        storeFormDataFromStep(step);

        const campaignId = button.id;
        if (campaignId && campaigns[campaignId]) {
          const campaign = campaigns[campaignId];
          if (campaign.requiresLongForm) {
            longFormCampaigns.push(campaignId);
          } else {
            const payload = window.buildPayload(campaign);
            window.fetchLead(payload);
          }
        }

        step.style.display = 'none';
        const next = steps[index + 1];
        if (index === lastCoregIndex && longFormCampaigns.length > 0 && longFormSection) {
          longFormSection.style.display = 'block';
          reloadImages(longFormSection);
        } else if (next) {
          next.style.display = 'block';
          reloadImages(next);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  });
}
