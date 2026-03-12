
(function () {
  const STORAGE_KEY = 'spendwise-dark-mode';

  function isDarkMode() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
   
    return true;
  }

  function applyMode(dark) {
    if (dark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }

    document.querySelectorAll('.dark-mode-toggle i').forEach(function (icon) {
      icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  }

  function toggle() {
    var dark = !document.body.classList.contains('dark-mode');
    localStorage.setItem(STORAGE_KEY, String(dark));
    applyMode(dark);
  }

  
  applyMode(isDarkMode());

  document.addEventListener('DOMContentLoaded', function () {
  
    applyMode(isDarkMode());


    document.querySelectorAll('.dark-mode-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });
  });
})();
