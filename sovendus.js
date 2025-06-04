// sovendus.js

(function () {
  const containerId = 'sovendus-container-1';
  const trafficSourceNumber = 5592;
  const trafficMediumNumber = 1;

  // Data ophalen uit localStorage of genereren
  const t_id = localStorage.getItem('t_id') || crypto.randomUUID();
  const timestamp = Date.now().toString();
  const email = localStorage.getItem('email') || 'onbekend@example.com';
  const firstname = localStorage.getItem('firstname') || '';
  const lastname = localStorage.getItem('lastname') || '';
  const gender = localStorage.getItem('gender') || ''; // Man / Vrouw

  const salutation = gender.toLowerCase() === 'man' ? 'Dhr.' : 'Mevr.';

  // Voeg de div toe aan de sectie als die nog niet bestaat
  const container = document.getElementById(containerId);
  if (!container) {
    const newDiv = document.createElement('div');
    newDiv.id = containerId;
    const target = document.getElementById('sovendus-section') || document.body;
    target.appendChild(newDiv);
  }

  // Configureer Sovendus scriptvariabelen
  window.sovIframes = window.sovIframes || [];
  window.sovIframes.push({
    trafficSourceNumber,
    trafficMediumNumber,
    sessionId: t_id,
    timestamp,
    orderId: t_id,
    orderValue: '0.00',
    orderCurrency: 'EUR',
    usedCouponCode: '',
    iframeContainerId: containerId
  });

  window.sovConsumer = window.sovConsumer || {};
  window.sovConsumer = {
    consumerSalutation: salutation,
    consumerFirstName: firstname,
    consumerLastName: lastname,
    consumerEmail: email
  };

  // Laad het Sovendus-script
  const protocol = window.location.protocol;
  const src = `${protocol}//api.sovendus.com/sovabo/common/js/flexibleiframe.js`;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
})();
