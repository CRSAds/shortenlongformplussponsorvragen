document.addEventListener('DOMContentLoaded', function () {
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
  };

  const longFormCampaigns = [];
  window.longFormCampaigns = longFormCampaigns;;
  const longFormSection = document.getElementById('long-form-section');

  
  const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
  const lastCoregIndex = steps.map(s => s.classList.contains('coreg-section')).lastIndexOf(true);

  // Verberg alle stappen behalve de eerste
  if (window.location.hostname !== "app.swipepages.com") {
    steps.forEach((el, i) => el.style.display = i === 0 ? 'block' : 'none');
    document.querySelectorAll('.hide-on-live, #long-form-section').forEach(el => {
      el.style.display = 'none';
    });
  }

  if (window.location.hostname !== "app.swipepages.com") {
    steps.forEach((el, i) => el.style.display = i === 0 ? 'block' : 'none');
    document.querySelectorAll('.hide-on-live, #long-form-section').forEach(el => {
      el.style.display = 'none';
    });
  }

  steps.forEach((step, index) => {
    const flowBtn = step.querySelector('.flow-next');
    if (flowBtn) {
      flowBtn.addEventListener('click', () => {
        const form = step.querySelector('form');
        if (form) {
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
        }

        step.style.display = 'none';
        const next = steps[index + 1];
        if (index === lastCoregIndex && longFormCampaigns.length > 0 && longFormSection) {
          longFormSection.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (next) {
          next.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    step.querySelectorAll('.sponsor-optin').forEach(button => {
      button.addEventListener('click', () => {
        const campaignId = button.id;
        if (campaignId && campaigns[campaignId]) {
          const campaign = campaigns[campaignId];
          if (campaign.requiresLongForm) {
            longFormCampaigns.push(campaignId);
          } else {
            const payload = buildPayload(campaign);
            fetchLead(payload);
          }
        }

        step.style.display = 'none';
        const next = steps[index + 1];
        if (index === lastCoregIndex && longFormCampaigns.length > 0 && longFormSection) {
          longFormSection.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (next) {
          next.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  });

  const longFormBtn = document.getElementById('submit-long-form');
  if (longFormBtn) {
    longFormBtn.addEventListener('click', function () {
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

      longFormCampaigns.forEach(campaignId => {
        const campaign = campaigns[campaignId];
        const payload = buildPayload(campaign);
        fetchLead(payload);
      });

      
      
      
      
      longFormSection.style.display = 'none';
      const allSections = Array.from(document.querySelectorAll('section'));
      const longFormPos = allSections.findIndex(s => s.id === 'long-form-section');
      const next = allSections.slice(longFormPos + 1).find(s =>
        s.classList.contains('flow-section') || s.classList.contains('coreg-section')
      );

      if (next) {
        next.style.display = 'block';
        next.classList.remove('hide-on-live');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }



    });
  }

  function buildPayload(campaign) {
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
      t_id: localStorage.getItem('t_id'),
      postcode: localStorage.getItem('postcode') || '',
      straat: localStorage.getItem('straat') || '',
      huisnummer: localStorage.getItem('huisnummer') || '',
      woonplaats: localStorage.getItem('woonplaats') || '',
      telefoon: localStorage.getItem('telefoon') || ''
    };
  }

  function fetchLead(payload) {
    fetch('https://crsadvertising.databowl.com/api/v1/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => console.log('Lead verzonden:', payload.cid))
    .catch(err => console.error('Verzendfout:', err));
  }
});
