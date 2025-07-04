// formSubmit.js
import { reloadImages } from './imageFix.js';
import sponsorCampaigns from './sponsorCampaigns.js';

window.sponsorCampaigns = sponsorCampaigns;

// Sponsoroptin registratie (optioneel)
const sponsorOptinText = `spaaractief_ja directdeals_ja qliqs_ja outspot_ja onlineacties_ja aownu_ja betervrouw_ja ipay_ja cashbackkorting_ja cashhier_ja myclics_ja seniorenvoordeelpas_ja favorieteacties_ja spaaronline_ja cashbackacties_ja woolsocks_ja centmail_ja`;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('accept-sponsors-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.setItem('sponsor_optin', sponsorOptinText);
    });
  }
});

export function buildPayload(campaign, options = { includeSponsors: true }) {
  const urlParams = new URLSearchParams(window.location.search);
  const t_id = urlParams.get("t_id") || crypto.randomUUID();

  const payload = {
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
    telefoon: localStorage.getItem('telefoon') || '',

    // campaignId meesturen (optioneel)
    campaignId: Object.keys(sponsorCampaigns).find(key => sponsorCampaigns[key].cid === campaign.cid)
  };

  // coreg_answer (indien relevant)
  if (campaign.coregAnswerKey) {
    payload.f_2014_coreg_answer = localStorage.getItem(campaign.coregAnswerKey) || '';
  }

  // f_1453_campagne_url
  payload.f_1453_campagne_url = window.location.origin + window.location.pathname;

  // EM_CO_sponsors → ALLEEN meesturen als expliciet toegestaan
  if (campaign.cid === 925 && options.includeSponsors) {
    const optin = localStorage.getItem('sponsor_optin');
    if (optin) {
      payload.f_2047_EM_CO_sponsors = optin;
    }
  }

  return payload;
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

  // Autofocus geboortedatum
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
