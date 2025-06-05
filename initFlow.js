import { reloadImages } from './imageFix.js';
import { fetchLead, buildPayload } from './formSubmit.js';

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
  "campaign-tuinmanieren": { cid: 4852, sid: 34, requiresLongForm: false },
  "campaign-leadsnl": { cid: 925, sid: 34, requiresLongForm: false }
};

const longFormCampaigns = [];
window.longFormCampaigns = longFormCampaigns;

export default function initFlow() {
  const longFormSection = document.getElementById('long-form-section');
  const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));

  if (!window.location.hostname.includes("swipepages.com")) {
    steps.forEach((el, i) => el.style.display = i === 0 ? 'block' : 'none');
    document.querySelectorAll('.hide-on-live, #long-form-section').forEach(el => {
      el.style.display = 'none';
    });
  }

  steps.forEach((step, index) => {
    step.querySelectorAll('.flow-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const form = step.querySelector('form');
        const isShortForm = form?.id === 'lead-form';

        if (form) {
          const gender = form.querySelector('input[name="gender"]:checked')?.value || '';
          const firstname = form.querySelector('#firstname')?.value.trim() || '';
          const lastname = form.querySelector('#lastname')?.value.trim() || '';
          const dob_day = form.querySelector('#dob-day')?.value || '';
          const dob_month = form.querySelector('#dob-month')?.value || '';
          const dob_year = form.querySelector('#dob-year')?.value || '';
          const email = form.querySelector('#email')?.value.trim() || '';
          const urlParams = new URLSearchParams(window.location.search);
          const t_id = urlParams.get('t_id') || crypto.randomUUID();

          localStorage.setItem('gender', gender);
          localStorage.setItem('firstname', firstname);
          localStorage.setItem('lastname', lastname);
          localStorage.setItem('dob_day', dob_day);
          localStorage.setItem('dob_month', dob_month);
          localStorage.setItem('dob_year', dob_year);
          localStorage.setItem('email', email);
          localStorage.setItem('t_id', t_id);

          if (isShortForm) {
            const payload = buildPayload(campaigns["campaign-leadsnl"]);
            fetchLead(payload);
          }
        }

        step.style.display = 'none';
        const next = steps[index + 1];
        const upcomingCoregs = steps.slice(index + 1).filter(s => s.classList.contains('coreg-section'));

        if (upcomingCoregs.length === 0 && longFormCampaigns.length > 0 && longFormSection) {
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
        const campaignId = button.id;
        const campaign = campaigns[campaignId];
        if (!campaign) return;

        if (campaign.requiresLongForm) {
          longFormCampaigns.push(campaign);
        } else {
          const payload = buildPayload(campaign);
          fetchLead(payload);
        }

        step.style.display = 'none';
        const next = steps[index + 1];
        const upcomingCoregs = steps.slice(index + 1).filter(s => s.classList.contains('coreg-section'));

        if (upcomingCoregs.length === 0 && longFormCampaigns.length > 0 && longFormSection) {
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
