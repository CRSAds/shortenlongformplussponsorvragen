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

  // Verberg alles behalve eerste flow-sectie
  if (window.location.hostname !== "app.swipepages.com") {
    document.querySelectorAll('.coreg-section, .hide-on-live, #long-form-section').forEach(el => {
      el.style.display = 'none';
    });

    flowSections.forEach((el, i) => {
      el.style.display = i === 0 ? 'block' : 'none';
    });
  }

  // Stap 1: Short form afhandeling
  const shortForm = document.getElementById('lead-form');
  if (shortForm) {
    shortForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = {
        gender: shortForm.gender.value,
        firstname: shortForm.firstname.value.trim(),
        lastname: shortForm.lastname.value.trim(),
        dob_day: shortForm.dob_day.value,
        dob_month: shortForm.dob_month.value,
        dob_year: shortForm.dob_year.value,
        email: shortForm.email.value.trim(),
        t_id: crypto.randomUUID()
      };

      for (const [key, value] of Object.entries(formData)) {
        localStorage.setItem(key, value);
      }

      // Verberg de eerste flow-sectie, toon eerste coreg-sectie
      if (flowSections.length > 0) flowSections[0].style.display = 'none';
      if (coregSections.length > 0) coregSections[0].style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Stap 2: Sponsorvragen doorklikken
  coregSections.forEach((section, index) => {
    section.querySelectorAll('.sponsor-optin').forEach(button => {
      button.addEventListener('click', function () {
        const campaignId = button.id;
        if (!campaigns[campaignId]) return;

        selectedCampaigns.push(campaignId);
        if (campaigns[campaignId].requiresLongForm) {
          longFormCampaigns.push(campaignId);
        }

        // Verberg huidige sectie
        section.style.display = 'none';

        // Toon volgende sectie of long form
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

  // Stap 3: Long form indienen
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

  // Stap 4: Verzenden naar alle geselecteerde campagnes
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
