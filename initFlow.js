import { reloadImages } from './imageFix.js';
import { fetchLead, buildPayload } from './formSubmit.js';
import sponsorCampaigns from './sponsorCampaigns.js';

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
  // FLOW-NEXT HANDLER
  step.querySelectorAll('.flow-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCoregBtn = btn.id?.startsWith('campaign-') && !btn.classList.contains('sponsor-next');
      if (isCoregBtn) {
        console.log(`Coreg-button zonder sponsor-next geklikt → flow stopt hier → flow gaat verder naar volgende flow-section`);

        // Automatisch de flow door laten gaan zoals in handleGenericNextCoregSponsor
        const currentCoregSection = document.querySelector(`.coreg-section[style*="display: block"]`);
        const flowNextBtn = currentCoregSection?.querySelector('.flow-next');
        if (flowNextBtn && flowNextBtn !== btn) {
          flowNextBtn.click();
        }

        return;
      }

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
          const sponsorOptin = localStorage.getItem('sponsor_optin');
          if (sponsorOptin) {
            const payload = buildPayload(sponsorCampaigns["campaign-leadsnl"]);
            fetchLead(payload);
          }
        }
      }

      step.style.display = 'none';
      const next = steps[index + 1];

      if (next?.classList.contains('coreg-section') && !btn.classList.contains('sponsor-next')) {
        console.log(`Volgende stap is coreg-section, maar button had geen sponsor-next → stop`);
        return;
      }

      if (next) {
        next.style.display = 'block';
        reloadImages(next);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // SPONSOR-OPTIN HANDLER
  step.querySelectorAll('.sponsor-optin').forEach(button => {
    button.addEventListener('click', () => {
      const campaignId = button.id;
      const campaign = sponsorCampaigns[campaignId];
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

      if (upcomingCoregs.length === 0 && longFormSection) {
        if (longFormCampaigns.length > 0) {
          longFormSection.style.display = 'block';
          reloadImages(longFormSection);
        } else if (next) {
          next.style.display = 'block';
          reloadImages(next);
        }
      } else if (next) {
        next.style.display = 'block';
        reloadImages(next);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
  
  Object.entries(sponsorCampaigns).forEach(([campaignId, config]) => {
    if (config.hasCoregFlow && config.coregAnswerKey) {
      initGenericCoregSponsorFlow(campaignId, config.coregAnswerKey);
    }
  });
}

const coregAnswers = {};
window.coregAnswers = coregAnswers;

function initGenericCoregSponsorFlow(sponsorId, coregAnswerKey) {
  coregAnswers[sponsorId] = [];

  const allSections = document.querySelectorAll(`[id^="campaign-${sponsorId}"]`);
  allSections.forEach(section => {
    const buttons = section.querySelectorAll('.flow-next');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const answerText = button.innerText.trim();
        coregAnswers[sponsorId].push(answerText);

        if (!button.classList.contains('sponsor-next')) {
          console.log(`[${sponsorId}] Flow-next zonder sponsor-next → standaard flow-next`);
          return;
        }

        console.log(`[${sponsorId}] Sponsor-next detected → processing next step`);
        let nextStepId = '';

        button.classList.forEach(cls => {
          if (cls.startsWith('next-step-')) {
            nextStepId = cls.replace('next-step-', '');
          }
        });

        section.style.display = 'none';

        if (nextStepId) {
          const nextSection = document.getElementById(nextStepId);
          if (nextSection) {
            nextSection.style.display = 'block';
          } else {
            handleGenericNextCoregSponsor(sponsorId, coregAnswerKey);
          }
        } else {
          handleGenericNextCoregSponsor(sponsorId, coregAnswerKey);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  });
}

function handleGenericNextCoregSponsor(sponsorId, coregAnswerKey) {
  const combinedAnswer = coregAnswers[sponsorId].join(' - ');
  localStorage.setItem(coregAnswerKey, combinedAnswer);
  console.log(`Sponsor ${sponsorId} → coreg_answer = ${combinedAnswer}`);

  const currentCoregSection = document.querySelector(`.coreg-section[style*="display: block"]`);
  const flowNextBtn = currentCoregSection?.querySelector('.flow-next');
  flowNextBtn?.click();
}
