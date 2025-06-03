export function reloadImages(section) {
  const images = section.querySelectorAll('img');
  images.forEach(img => {
    const src = img.src;
    img.src = '';
    img.src = src;
  });
}

export default function setupImageReloading() {
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      const preload = new Image();
      preload.src = src;
    }
  });
}
