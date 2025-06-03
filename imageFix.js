export function setupImageFix() {
  // 1. Trigger lazyload door scroll event te simuleren
  window.dispatchEvent(new Event('scroll'));

  // 2. Forceer herladen van zichtbare afbeeldingen
  const images = section.querySelectorAll('img');
  images.forEach(img => {
    if (img.dataset.src && !img.src.includes(img.dataset.src)) {
      img.src = img.dataset.src;
    } else {
      const src = img.src;
      img.src = '';
      img.src = src;
    }

    // 3. Verwijder mogelijk opacity:0 styles die lazyload blokken
    img.style.opacity = '1';
    img.style.visibility = 'visible';
  });
}
