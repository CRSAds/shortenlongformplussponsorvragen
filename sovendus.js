// public/sovendus.js

console.log("Sovendus script geladen");

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("sovendus-section");
  if (!section) return;

  const urlParams = new URLSearchParams(window.location.search);
  const transactionId =
    urlParams.get("t_id") || localStorage.getItem("t_id") || "demo-fallback-id";

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.sovendus.com/gutschein/iframe/?transaction=${transactionId}`;
  iframe.width = "100%";
  iframe.height = "600";
  iframe.style.border = "none";
  iframe.style.display = "block";
  iframe.loading = "lazy";
  iframe.setAttribute("aria-label", "Sovendus aanbieding");

  section.innerHTML = ""; // wis evt. placeholder-content
  section.appendChild(iframe);
});
