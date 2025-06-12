document.addEventListener('DOMContentLoaded', function() {
  // Sovendus tracking config
  var d = new Date();
  var timestampSovendus = d.getFullYear() +
    ('0' + (d.getMonth()+1)).slice(-2) +
    ('0' + d.getDate()).slice(-2) +
    ('0' + d.getHours()).slice(-2) +
    ('0' + d.getMinutes()).slice(-2) +
    ('0' + d.getSeconds()).slice(-2);

  window.sovIframes = window.sovIframes || [];
  window.sovIframes.push({
    trafficSourceNumber : '5592',
    trafficMediumNumber : '1',
    sessionId : localStorage.getItem('t_id'),
    timestamp : timestampSovendus,
    orderId : '',
    orderValue : '',
    orderCurrency : '',
    usedCouponCode : '',
    iframeContainerId : 'sovendus-container-1'
  });

  window.sovConsumer = {
    consumerSalutation : localStorage.getItem('f_2_title'),
    consumerFirstName : localStorage.getItem('f_3_firstname'),
    consumerLastName : localStorage.getItem('f_4_lastname'),
    consumerEmail : localStorage.getItem('f_1_email')
  };

  // Sovendus script injecteren
  var sovDomain = window.location.protocol + "//api.sovendus.com";
  var sovJsFile = sovDomain + "/sovabo/common/js/flexibleIframe.js";
  var script = document.createElement('script');
  script.src = sovJsFile;
  document.getElementsByTagName('head')[0].appendChild(script);

  // Jouw button click handler
  document.getElementById('sovendus-click').addEventListener('click', function() {
    // Sovendus URL openen → zelf in een var zetten
    var sovOfferUrl = "https://www.sovendus.nl/voordeelpagina"; // <- vul hier jouw Sovendus URL in

    // Open Sovendus in nieuwe tab
    window.open(sovOfferUrl, "_blank");

    // Trigger flow-next
    const flowNextBtn = document.querySelector('#sovendus .flow-next');
    if (flowNextBtn) {
      flowNextBtn.click();
    }
  });
});
