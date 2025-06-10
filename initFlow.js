import { reloadImages } from './imageFix.js';
import { fetchLead, buildPayload } from './formSubmit.js';
import sponsorCampaigns from './sponsorCampaigns.js'; // nieuwe centrale campaigns lijst

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
  // ✅ AANGEPASTE flow-next handler:
  step.querySelectorAll('.flow-next').forEach(btn => {
    btn.addEventListener('click', () => {
      // Als je in een coreg-section zit én de knop heeft géén sponsor-next → STOP → laat bestaande flow-next niets doen
      if (step.classList.contains('coreg-section') && !btn.classList.contains('sponsor-next')) {
        console.log(`Flow-next clicked in coreg-section without sponsor-next → stopping flow`);
        return;
      }

      // Normale flow handling:
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
      const upcomingCoregs = steps.slice(index + 1).filter(s => s.classList.contains('coreg-section'));

      // Laat long form zien indien nodig, anders gewoon door
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

  // ✅ sponsor-optin block blijft PRECIES zoals je hem nu hebt:
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

  // Automatisch coreg flow init voor sponsors met hasCoregFlow
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

        // Als de button GEEN sponsor-next heeft → gewoon default flow-next (geen extra handling)
        if (!button.classList.contains('sponsor-next')) {
          console.log(`[${sponsorId}] Flow-next zonder sponsor-next → standaard flow-next`);
          return; // Exit → laat je bestaande .flow-next handler gewoon zijn werk doen
        }

        // Als de button WEL sponsor-next heeft → dan multi-step flow handling uitvoeren
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

  // Automatisch de .flow-next button van de huidige coreg-section klikken → flow gaat verder
  const currentCoregSection = document.querySelector(`.coreg-section[style*="display: block"]`);
  const flowNextBtn = currentCoregSection?.querySelector('.flow-next');
  flowNextBtn?.click();
}
