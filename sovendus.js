// sovendus.js

document.addEventListener("DOMContentLoaded", function () {
  const sovendusSection = document.getElementById("sovendus-section");
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = document.getElementById("sovendus-target");
        if (target && !target.dataset.loaded) {
          const tId = localStorage.getItem("t_id") || "no-id";
          target.innerHTML = `
            <iframe 
              src="https://tracking.sovendus.com/ts?tid=${encodeURIComponent(tId)}"
              width="100%" height="700" frameborder="0" scrolling="auto" style="max-width:100%;">
            </iframe>`;
          target.dataset.loaded = "true";
        }
        observer.disconnect(); // iframe eenmaal geladen, observer uitschakelen
      }
    });
  }, { threshold: 0.3 });

  if (sovendusSection) {
    observer.observe(sovendusSection);
  }
});
