import { countryConfig } from './countryConfig.js';
import { reloadImages } from './imageFix.js';
import { fetchLead, buildPayload } from './formSubmit.js';
import sponsorCampaigns from './sponsorCampaigns.js';

const longFormCampaigns = [];
window.longFormCampaigns = longFormCampaigns;

const country = window.country || 'NL';
const config = countryConfig[country];

// ✅ VALIDATE FORM FUNCTIE
function validateForm(form) {
  let valid = true;
  let messages = [];

  // SHORT FORM → lead-form
if (form.id === 'lead-form') {
  const gender = form.querySelector('input[name="gender"]:checked');
  const firstname = form.querySelector(`#${config.firstnameField}`)?.value.trim();
  const lastname = form.querySelector(`#${config.lastnameField}`)?.value.trim();
  const dob_day = form.querySelector(`#${config.dobDayField}`)?.value.trim();
  const dob_month = form.querySelector(`#${config.dobMonthField}`)?.value.trim();
  const dob_year = form.querySelector(`#${config.dobYearField}`)?.value.trim();
  const email = form.querySelector(`#${config.emailField}`)?.value.trim();

  if (!gender) { valid = false; messages.push('Please select gender'); }
  if (!firstname) { valid = false; messages.push('Please enter first name'); }
  if (!lastname) { valid = false; messages.push('Please enter last name'); }
  if (!dob_day || !dob_month || !dob_year) { valid = false; messages.push('Please enter date of birth'); }
  if (!email || !email.includes('@') || !email.includes('.')) {
    valid = false; messages.push('Please enter valid email address');
  }
}

if (form.id === 'long-form') {
  const postcode = form.querySelector(`#${config.postcodeField}`)?.value.trim();
  const straat = config.streetField ? form.querySelector(`#${config.streetField}`)?.value.trim() : '';
  const huisnummer = config.houseNumberField ? form.querySelector(`#${config.houseNumberField}`)?.value.trim() : '';
  const woonplaats = form.querySelector(`#${config.cityField}`)?.value.trim();
  const telefoon = form.querySelector(`#${config.phoneField}`)?.value.trim();

  if (!postcode) { valid = false; messages.push('Please enter postcode'); }
  if (config.streetField && !straat) { valid = false; messages.push('Please enter address/street'); }
  if (config.houseNumberField && !huisnummer) { valid = false; messages.push('Please enter house number'); }
  if (!woonplaats) { valid = false; messages.push('Please enter town/city'); }
  if (!telefoon) { valid = false; messages.push('Please enter phone number'); }
  else if (telefoon.length > 11) {
    valid = false; messages.push('Phone number max 11 digits');
  }
}

  if (!valid) {
    alert('Vul aub alle velden correct in:\n' + messages.join('\n'));
  }

  return valid;
}

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
        const skipNext = btn.classList.contains('skip-next-section');

        // ✅ Haal campaign op → nodig voor coregAnswer logging bij sponsor-next
        const campaignId = step.id?.startsWith('campaign-') ? step.id : null;
        const campaign = sponsorCampaigns[campaignId];

        // ✅ Als sponsor-next → log coregAnswer alvast:
        if (campaign && campaign.coregAnswerKey && btn.classList.contains('sponsor-next')) {
          localStorage.setItem(campaign.coregAnswerKey, btn.innerText.trim());
          console.log(`Flow-next sponsor-next: set ${campaign.coregAnswerKey} → ${btn.innerText.trim()}`);
        }

        // ✅ EXTRA FIX → als dit de voorwaarden-section is + flow-next button ZONDER id → sponsor_optin wissen!
        if (step.id === 'voorwaarden-section' && !btn.id) {
          localStorage.removeItem('sponsor_optin');
          console.log('Flow-next zonder accept → sponsor_optin verwijderd');
        }

        const form = step.querySelector('form');
        const isShortForm = form?.id === 'lead-form';

        // ✅ FORM VALIDATIE → STOP als niet geldig
        if (form && !validateForm(form)) {
          return;
        }

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
            // Als dit "Nee" bij voorwaarden is → GEEN sponsors meesturen
            const includeSponsors = !(step.id === 'voorwaarden-section' && !btn.id);
            const payload = buildPayload(sponsorCampaigns["campaign-leadsnl"], { includeSponsors });
            fetchLead(payload);
          }
        }

        step.style.display = 'none';
const next = skipNext ? steps[index + 2] : steps[index + 1];

if (next) {
  next.style.display = 'block';

  // → extra: als het de Sovendus sectie is, extra logje
  if (next.id === 'sovendus') {
    console.log('👉 Sovendus sectie zichtbaar gemaakt!');
  }

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

        // ✅ Hier coregAnswer ALTIJD loggen:
        if (campaign.coregAnswerKey) {
          localStorage.setItem(campaign.coregAnswerKey, button.innerText.trim());
          console.log(`Sponsor-optin: set ${campaign.coregAnswerKey} → ${button.innerText.trim()}`);
        }

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
