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

    const url = `https://tracking.sovendus.com/ts?trafficSourceNumber=5592&trafficMediumNumber=1&sessionId=${t_id}&timestamp=${timestamp}&consumerSalutation=${encodeURIComponent(consumerSalutation)}&consumerFirstName=${encodeURIComponent(consumerFirstName)}&consumerLastName=${encodeURIComponent(consumerLastName)}&consumerEmail=${encodeURIComponent(consumerEmail)}`;

    // Tracking pixel sturen (onzichtbaar img)
    const img = new Image();
    img.src = url;
    console.log('Sovendus tracking URL:', url);

    // Sovendus landingspagina openen → voorbeeld URL → jouw echte URL krijg je van Sovendus
    const sovendusLandingUrl = 'https://shop.sovendus.com/dein-angebot?sessionId=' + t_id;

    // Open in nieuw tabblad
    window.open(sovendusLandingUrl, '_blank');
  });
}
