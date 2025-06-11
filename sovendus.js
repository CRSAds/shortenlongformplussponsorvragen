function Sovendus() {
  console.log("Sovendus() gestart → pushing tracking info");

  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var hour = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();

  var timestampSovendus = d.getFullYear() + 
    (month<10 ? '0' : '') + month + 
    (day<10 ? '0' : '') + day + 
    (hour<10 ? '0' : '') + hour + 
    minutes + seconds;

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

  console.log("Sovendus tracking info set.");
}

function setupSovendusClick() {
  const clickBtn = document.getElementById("sovendus-click");
  if (!clickBtn) {
    console.warn("Sovendus click button niet gevonden!");
    return;
  }

  clickBtn.addEventListener("click", function() {
    console.log("Sovendus button clicked → opening Sovendus link");

    // Open Sovendus URL in nieuw tabblad
    window.open(
      'https://www.sovendus-connect.com/start?trafficSourceNumber=5592&sessionId=' + 
      encodeURIComponent(localStorage.getItem('t_id')),
      '_blank'
    );

    // Flow-next gaat daarna gewoon verder → je hoeft hier niets extra’s te doen
  });
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
      setupSovendusClick();
    }
  }, 200);
}

// Start automatisch als DOM ready is
document.addEventListener("DOMContentLoaded", waitForSovendusSectionAndInit);
