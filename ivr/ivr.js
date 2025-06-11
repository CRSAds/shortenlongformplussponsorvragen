document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const affId = urlParams.get("aff_id") || "123";
  const offerId = urlParams.get("offer_id") || "234";
  const subId = urlParams.get("sub_id") || "345";

  function getTransactionId() {
    if (crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const transaction_id = urlParams.get("t_id") || getTransactionId();
  localStorage.setItem("t_id", transaction_id);
  localStorage.setItem("aff_id", affId);
  localStorage.setItem("offer_id", offerId);
  localStorage.setItem("sub_id", subId);

  const isMobile = window.innerWidth < 768;
  document.getElementById("ivr-mobile").style.display = isMobile ? "block" : "none";
  document.getElementById("ivr-desktop").style.display = isMobile ? "none" : "block";

  // 🌟 automatische switch stage / prod:
  const requestBaseUrl = window.location.hostname.includes('stage') || window.location.hostname.includes('vercel.app')
    ? 'https://cdn.909support.com/NL/4.1/stage/assets/php'
    : 'https://cdn.909support.com/NL/4.1/assets/php';

  async function registerVisit() {
    const stored = localStorage.getItem("internalVisitId");
    if (stored) {
      console.log("Visit → using cached internalVisitId", stored);
      return stored;
    }

    try {
      const res = await fetch(`${requestBaseUrl}/register_visit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          clickId: transaction_id,
          affId,
          offerId,
          subId,
          subId2: subId
        })
      });
      const data = await res.json();
      console.log("registerVisit response", data);
      if (data.internalVisitId) {
        localStorage.setItem("internalVisitId", data.internalVisitId);
        return data.internalVisitId;
      }
    } catch (err) {
      console.error("Visit registration failed", err);
    }
    return null;
  }

  const visitPromise = registerVisit();

  function animatePinRevealSpinner(pin, targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const digits = container.querySelectorAll('.digit-inner');
    const pinStr = pin.toString().padStart(3, '0');

    pinStr.split('').forEach((digit, index) => {
      const inner = digits[index];
      inner.innerHTML = '';
      for (let i = 0; i <= 9; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        inner.appendChild(span);
      }
      const targetOffset = parseInt(digit, 10) * 64;
      setTimeout(() => {
        inner.style.transform = `translateY(-${targetOffset}px)`;
      }, 100);
    });
  }

  async function showPinForTarget(pinContainerId, spinnerId) {
    document.getElementById(pinContainerId).style.display = "block";

    try {
      const internalVisitId = await visitPromise;
      console.log("PIN request → internalVisitId", internalVisitId, "transaction_id", transaction_id);

      const res = await fetch(`${requestBaseUrl}/request_pin.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          clickId: transaction_id,
          internalVisitId
        })
      });
      const data = await res.json();
      console.log("request_pin response", data);
      if (data.pincode) {
        animatePinRevealSpinner(data.pincode, spinnerId);
      } else {
        console.warn("No pincode returned!");
      }
    } catch (err) {
      console.error("PIN retrieval failed:", err);
    }
  }

  function waitForIVRAndInit() {
    const targetElement = isMobile ? document.getElementById("ivr-mobile") : document.getElementById("ivr-desktop");

    if (!targetElement) {
      console.log("IVR element not yet found → retrying...");
      setTimeout(waitForIVRAndInit, 200);
      return;
    }

    let ivrShown = false;

    const observer = new MutationObserver(() => {
      const style = window.getComputedStyle(targetElement);
      const isVisible = style && style.display !== "none" && style.opacity !== "0" && targetElement.offsetHeight > 0;

      if (isVisible && !ivrShown) {
        ivrShown = true;
        console.log("IVR section became visible → showing PIN...");
        if (isMobile) {
          showPinForTarget("pin-container-mobile", "pin-code-spinner-mobile");
        } else {
          showPinForTarget("pin-container-desktop", "pin-code-spinner-desktop");
        }
      }
    });

    observer.observe(targetElement, { attributes: true, attributeFilter: ["style"] });

    // Fallback
    setTimeout(() => {
      const style = window.getComputedStyle(targetElement);
      const isVisible = style && style.display !== "none" && style.opacity !== "0" && targetElement.offsetHeight > 0;

      if (isVisible && !ivrShown) {
        ivrShown = true;
        console.log("IVR fallback → showing PIN...");
        if (isMobile) {
          showPinForTarget("pin-container-mobile", "pin-code-spinner-mobile");
        } else {
          showPinForTarget("pin-container-desktop", "pin-code-spinner-desktop");
        }
      }
    }, 1500); // iets ruimer
  }

  // Start after DOM ready:
  waitForIVRAndInit();
});
