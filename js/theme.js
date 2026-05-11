const toggleBtn = document.getElementById("rtl-toggle");
const themeBtn = document.getElementById("theme-toggle");
const rtlIcon = document.getElementById("rtl-icon");
const mobileThemeButtons = document.querySelectorAll(".mobile-theme-toggle");
const mobileRtlButtons = document.querySelectorAll(".mobile-rtl-toggle");
const mobileRtlIcons = document.querySelectorAll(".mobile-rtl-icon");

function updateThemeLogos(isDark) {
  const themedLogos = document.querySelectorAll(".site-header .logo-img, .login-page .logo-img, .register-page .logo-img");

  themedLogos.forEach((logo) => {
    const lightSrc = logo.dataset.logoLight || logo.getAttribute("src") || "images/my-logo.png";
    const darkSrc = logo.dataset.logoDark || "images/my-logo.png";

    logo.dataset.logoLight = lightSrc;
    logo.dataset.logoDark = darkSrc;
    logo.dataset.themeLogo = "true";
    logo.setAttribute("src", isDark ? darkSrc : lightSrc);
  });
}

function setDirection(direction) {
  const isRtl = direction === "rtl";
  document.body.classList.toggle("rtl", isRtl);
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  if (rtlIcon) {
    rtlIcon.textContent = isRtl ? "RTL" : "LTR";
  }
  mobileRtlIcons.forEach((icon) => {
    icon.textContent = isRtl ? "RTL" : "LTR";
  });
  localStorage.setItem("layoutDirection", isRtl ? "rtl" : "ltr");
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark-mode", isDark);
  document.documentElement.classList.toggle("dark-mode", isDark);
  updateThemeLogos(isDark);

  if (isDark) {
    document.body.style.setProperty("background", "#0b1220", "important");
    document.body.style.setProperty("color", "#ffffff", "important");
  } else {
    document.body.style.removeProperty("background");
    document.body.style.removeProperty("color");
  }

  if (themeBtn) {
    themeBtn.textContent = isDark ? "\u2600" : "\u{1F319}";
  }
  mobileThemeButtons.forEach((button) => {
    button.textContent = isDark ? "\u2600" : "\u{1F319}";
  });
  localStorage.setItem("theme", isDark ? "dark" : "light");

  document.body.offsetHeight;
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const nextDirection = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    setDirection(nextDirection);
  });
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    setTheme(nextTheme);
  });
}

mobileThemeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    setTheme(nextTheme);
  });
});

mobileRtlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextDirection = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    setDirection(nextDirection);
  });
});

window.addEventListener("load", () => {
  setDirection(localStorage.getItem("layoutDirection") || "ltr");
  setTheme(localStorage.getItem("theme") || "light");
});

document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-question i");

    if (question && answer) {
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherIcon = otherItem.querySelector(".faq-question i");
            if (otherIcon) {
              otherIcon.classList.remove("fa-minus");
              otherIcon.classList.add("fa-plus");
            }
          }
        });

        if (isOpen) {
          item.classList.remove("active");
          if (icon) {
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
          }
        } else {
          item.classList.add("active");
          if (icon) {
            icon.classList.remove("fa-plus");
            icon.classList.add("fa-minus");
          }
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  const mobileDropdownToggle = document.querySelector(".mobile-dropdown-toggle");
  const mobileDropdown = document.querySelector(".mobile-dropdown");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const isOpen = !mobileNav.classList.contains("menu-open");
      hamburger.classList.toggle("active", isOpen);
      mobileNav.classList.toggle("active", isOpen);
      mobileNav.classList.toggle("open", isOpen);
      mobileNav.classList.toggle("menu-open", isOpen);
      mobileNav.setAttribute("aria-hidden", String(!isOpen));

      if (isOpen) {
        mobileNav.style.setProperty("display", "block", "important");
        mobileNav.style.setProperty("max-height", "calc(100vh - 70px)", "important");
        mobileNav.style.setProperty("min-height", "300px", "important");
        mobileNav.style.setProperty("overflow-y", "auto", "important");
        mobileNav.style.setProperty("opacity", "1", "important");
        mobileNav.style.setProperty("visibility", "visible", "important");
        mobileNav.querySelectorAll("ul, li, a, .mobile-dropdown-toggle").forEach((item) => {
          const displayValue = item.tagName === "UL" ? "flex" : item.tagName === "LI" ? "block" : "flex";
          item.style.setProperty("display", displayValue, "important");
          item.style.setProperty("opacity", "1", "important");
          item.style.setProperty("visibility", "visible", "important");
        });
        const topList = mobileNav.querySelector("ul");
        if (topList) {
          topList.style.setProperty("display", "flex", "important");
          topList.style.setProperty("flex-direction", "column", "important");
        }
      } else {
        mobileNav.style.setProperty("max-height", "0", "important");
        mobileNav.style.setProperty("min-height", "0", "important");
        mobileNav.style.setProperty("overflow", "hidden", "important");
      }
    });
  }

  if (mobileDropdownToggle && mobileDropdown) {
    mobileDropdownToggle.addEventListener("click", () => {
      const isOpen = mobileDropdown.classList.toggle("open");
      mobileDropdownToggle.classList.toggle("active", isOpen);
      mobileDropdownToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
});
