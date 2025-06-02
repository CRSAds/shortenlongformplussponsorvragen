document.addEventListener('DOMContentLoaded', function () {
  const shortForm = document.getElementById('lead-form');
  const longFormSection = document.getElementById('long-form-section');
  const longFormBtn = document.getElementById('submit-long-form');

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

      document.querySelectorAll('.sponsor-optin').forEach(btn => btn.disabled = false);
      shortForm.style.display = 'none';
      document.getElementById('sponsor-questions')?.style.display = 'block';
    });
  }

  document.querySelectorAll('.sponsor-optin').forEach(button => {
    button.addEventListener('click', function () {
      button.disabled = true;
      const campaignId = button.id;
      if (!campaigns[campaignId]) return;

      selectedCampaigns.push(campaignId);
      if (campaigns[campaignId].requiresLongForm) {
        longFormCampaigns.push(campaignId);
      }

      if (document.querySelectorAll('.sponsor-optin:disabled').length === document.querySelectorAll('.sponsor-optin').length) {
        if (longFormCampaigns.length > 0) {
          longFormSection.style.display = 'block';
        } else {
          submitToCampaigns(selectedCampaigns);
        }
      }
    });
  });

  if (longFormBtn) {
    longFormBtn.addEventListener('click', async function () {
      const extraData = {
        postcode: document.getElementById('postcode').value.trim(),
        straat: document.getElementById('straat').value.trim(),
        huisnummer: document.getElementById('huisnummer').value.trim(),
        woonplaats: document.getElementById('woonplaats').value.trim(),
        telefoon: document.getElementById('telefoon').value.trim()
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
