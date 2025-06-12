document.addEventListener('DOMContentLoaded', function() {
  const showBtn = document.getElementById('show-sovendus-btn');
  const sovendusContainer = document.getElementById('sovendus-container-1');

  if (showBtn && sovendusContainer) {
    showBtn.addEventListener('click', function() {
      sovendusContainer.style.display = 'block';
    });
  }
});
