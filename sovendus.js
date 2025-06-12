function Sovendus() {
  console.log("Sovendus() gestart → pushing tracking info");

  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const timestampSovendus = d.getFullYear() +
    (month < 10 ? '0' : '') + month +
    (day < 10 ? '0' : '') + day +
    (hour < 10 ? '0' : '') + hour +
    (minutes < 10 ? '0' : '') + minutes +
    (seconds < 10 ? '0' : '') + seconds;

  window.sovIframes = window.sovIframes || [];
  window.sovIframes.push({
    trafficSourceNumber: '5592',
    trafficMediumNumber: '1',
    sessionId: localStorage.getItem('t_id'),
    timestamp: timestampSovendus,
    orderId: window.location.origin + window.location.pathname,
    orderValue: '',
    orderCurrency: '',
    usedCouponCode: '',
    iframeContainerId: 'sovendus-container-1'
  });

  window.sovConsumer = {
    consumerSalutation: localStorage.getItem('f_2_title'),
    consumerFirstName: localStorage.getItem('f_3_firstname'),
    consumerLastName: localStorage.getItem('f_4_lastname'),
    consumerEmail: localStorage.getItem('f_1_email')
  };

  console.log("Sovendus tracking info set → loading flexibleIframe.js");

  // Laad flexibleIframe.js → dit laadt de iframe/button in de container:
  const script = document.createElement('script');
  script.src = 'https://api.sovendus.com/sovabo/common/js/flexibleIframe.js';
  document.head.appendChild(script);
}

function waitForSovendusSectionAndInit() {
  let sovendusShown = false;

  const checkInterval = setInterval(() => {
    const sovendusSection = document.getElementById("sovendus");
    if (!sovendusSection) return;

    const style = window.getComputedStyle(sovendusSection);
    const isVisible = style && style.display !== "none" && style.opacity !== "0" && sovendusSection.offsetHeight > 0;

    if (isVisible && !sovendusShown) {
      sovendusShown = true;
      clearInterval(checkInterval);
      console.log("Sovendus section visible → calling Sovendus()");
      Sovendus();
    }
  }, 200);
}

// Start na DOM ready:
document.addEventListener("DOMContentLoaded", waitForSovendusSectionAndInit);
