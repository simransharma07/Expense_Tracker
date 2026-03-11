// Dark Mode - shared across all pages
(function () {
  const STORAGE_KEY = 'spendwise-dark-mode';

  function isDarkMode() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    // Default: dark mode on
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
    // Update all toggle icons on the page
    document.querySelectorAll('.dark-mode-toggle i').forEach(function (icon) {
      icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  }

  function toggle() {
    var dark = !document.body.classList.contains('dark-mode');
    localStorage.setItem(STORAGE_KEY, String(dark));
    applyMode(dark);
  }

  // Apply immediately (before DOMContentLoaded to avoid flash)
  applyMode(isDarkMode());

  document.addEventListener('DOMContentLoaded', function () {
    // Re-apply in case body classes were reset
    applyMode(isDarkMode());

    // Bind all toggle buttons
    document.querySelectorAll('.dark-mode-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });
  });
})();
