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

  async function registerVisit() {
    const stored = localStorage.getItem("internalVisitId");
    if (stored) return stored;

    try {
      const res = await fetch("https://cdn.909support.com/NL/4.1/assets/php/register_visit.php", {
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

  const mobileBtn = document.getElementById("show-pin-btn-mobile");
  const desktopBtn = document.getElementById("show-pin-btn-desktop");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", async function () {
      mobileBtn.style.display = "none";
      document.getElementById("pin-container-mobile").style.display = "block";

      try {
        const internalVisitId = await visitPromise;
        const res = await fetch("https://cdn.909support.com/NL/4.1/stage/assets/php/request_pin.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            clickId: transaction_id,
            internalVisitId
          })
        });
        const data = await res.json();
        if (data.pincode) {
          animatePinRevealSpinner(data.pincode, "pin-code-spinner-mobile");
        }
      } catch (err) {
        console.error("Mobiele PIN-fout:", err);
      }
    });
  }

  if (desktopBtn) {
    desktopBtn.addEventListener("click", async function () {
      desktopBtn.style.display = "none";
      document.getElementById("pin-container-desktop").style.display = "block";

      try {
        const internalVisitId = await visitPromise;
        const res = await fetch("https://cdn.909support.com/NL/4.1/stage/assets/php/request_pin.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            clickId: transaction_id,
            internalVisitId
          })
        });
        const data = await res.json();
        if (data.pincode) {
          animatePinRevealSpinner(data.pincode, "pin-code-spinner-desktop");
        }
      } catch (err) {
        console.error("Desktop PIN-fout:", err);
      }
    });
  }
});
