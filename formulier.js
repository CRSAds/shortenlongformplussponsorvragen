document.addEventListener('DOMContentLoaded', function () {
  const campaigns = {
    "campaign-mycollections": {
      cid: 1882,
      sid: 34,
      requiresLongForm: true
    },
    "campaign-hotelspecials": {
      cid: 4621,
      sid: 34,
      requiresLongForm: false
    }
  };

  const selectedCampaigns = [];
  const longFormCampaigns = [];

  const flowSections = Array.from(document.querySelectorAll('.flow-section'));
  const coregSections = Array.from(document.querySelectorAll('.coreg-section'));
  const longFormSection = document.getElementById('long-form-section');

  // Alleen op live URL verbergen
  if (window.location.hostname !== "app.swipepages.com") {
    document.querySelectorAll('.coreg-section, .hide-on-live, #long-form-section').forEach(el => {
      el.style.display = 'none';
    });
    flowSections.forEach((el, i) => {
      el.style.display = i === 0 ? 'block' : 'none';
    });
  }

  // Flow doorlopen via .flow-next buttons
  flowSections.forEach((section, index) => {
    const nextBtn = section.querySelector('.flow-next');
    if (!nextBtn) return;

    nextBtn.addEventListener('click', function () {
      // Als het formulier bevat, data opslaan
      const form = section.querySelector('form');
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

      // Toon volgende flow-section
      section.style.display = 'none';
      const next = flowSections[index + 1];
      if (next) {
        next.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (coregSections.length > 0) {
        coregSections[0].style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Coreg secties
  coregSections.forEach((section, index) => {
    section.querySelectorAll('.sponsor-optin').forEach(button => {
      button.addEventListener('click', function () {
        const campaignId = button.id;
        if (!campaigns[campaignId]) return;

        selectedCampaigns.push(campaignId);
        if (campaigns[campaignId].requiresLongForm) {
          longFormCampaigns.push(campaignId);
        }

        section.style.display = 'none';
        const nextIndex = index + 1;
        if (nextIndex < coregSections.length) {
          coregSections[nextIndex].style.display = 'block';
        } else if (longFormCampaigns.length > 0) {
          longFormSection.style.display = 'block';
        } else {
          submitToCampaigns(selectedCampaigns);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
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

      submitToCampaigns(selectedCampaigns);
    });
  }

  function submitToCampaigns(campaignIds) {
    const baseUrl = 'https://crsadvertising.databowl.com/api/v1/lead';

    const data = {
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

    campaignIds.forEach(async (id) => {
      const campaign = campaigns[id];
      const payload = { ...data, cid: campaign.cid, sid: campaign.sid };

      try {
        await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log(`Lead verzonden naar campagne ${id}`);
      } catch (err) {
        console.error(`Fout bij verzenden naar campagne ${id}:`, err);
      }
    });

    window.location.href = "/memoryspel/bedankt";
  }
});
