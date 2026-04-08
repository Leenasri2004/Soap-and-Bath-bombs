(function () {
  const storageKey = 'foamy-dark';
  const html = document.documentElement;
  const body = document.body;

  if (!html || !body) return;
  if (document.getElementById('phDarkToggle')) return;

  const buttons = Array.from(
    document.querySelectorAll('#darkToggle, #darkToggleMobile, .page-theme-toggle')
  );

  function updateButtons(isDark) {
    buttons.forEach((button) => {
      const icon = button.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
    });
  }

  function applyTheme(isDark) {
    html.classList.toggle('dark-mode', isDark);
    body.classList.toggle('dark-mode', isDark);
    updateButtons(isDark);
  }

  applyTheme(localStorage.getItem(storageKey) === '1');

  buttons.forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      const nextTheme = !body.classList.contains('dark-mode');
      applyTheme(nextTheme);
      localStorage.setItem(storageKey, nextTheme ? '1' : '0');
    };
  });
})();
