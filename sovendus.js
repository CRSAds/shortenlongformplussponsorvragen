// sovendus.js
export default function setupSovendus() {
  const sovendusClickBtn = document.getElementById('sovendus-click');

  if (!sovendusClickBtn) {
    console.log('Sovendus button niet gevonden → skip setup');
    return;
  }

  sovendusClickBtn.addEventListener('click', function() {
    console.log('Sovendus click → start');

    const t_id = localStorage.getItem('t_id') || '';
    const consumerSalutation = localStorage.getItem('f_2_title') || '';
    const consumerFirstName = localStorage.getItem('f_3_firstname') || '';
    const consumerLastName = localStorage.getItem('f_4_lastname') || '';
    const consumerEmail = localStorage.getItem('f_1_email') || '';

    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);

    // Sovendus tracking pixel sturen (optioneel, goed om te houden)
    const trackingUrl = `https://tracking.sovendus.com/ts?trafficSourceNumber=5592&trafficMediumNumber=1&sessionId=${t_id}&timestamp=${timestamp}&consumerSalutation=${encodeURIComponent(consumerSalutation)}&consumerFirstName=${encodeURIComponent(consumerFirstName)}&consumerLastName=${encodeURIComponent(consumerLastName)}&consumerEmail=${encodeURIComponent(consumerEmail)}`;

    const img = new Image();
    img.src = trackingUrl;
    console.log('Sovendus tracking URL:', trackingUrl);

    // Sovendus landingspagina → zelfde als iframe URL → DIT is de juiste om in nieuw tabblad te openen:
    const iframeLandingUrl = `https://www.sovendus-connect.com/banner/api/banner?trafficSourceNumber=5592&trafficMediumNumber=1&sessionId=${t_id}&timestamp=${timestamp}&consumerSalutation=${encodeURIComponent(consumerSalutation)}&consumerFirstName=${encodeURIComponent(consumerFirstName)}&consumerLastName=${encodeURIComponent(consumerLastName)}&consumerEmail=${encodeURIComponent(consumerEmail)}&consumerCountry=NL`;

    console.log('Sovendus iframe LANDING URL:', iframeLandingUrl);

    // Open in nieuw tabblad
    window.open(iframeLandingUrl, '_blank');

    // Optioneel: flow-next triggeren na click:
    // document.querySelector('.flow-next')?.click(); 
  });
}
