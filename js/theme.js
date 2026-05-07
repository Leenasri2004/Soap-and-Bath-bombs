const toggleBtn = document.getElementById("rtl-toggle");
const themeBtn = document.getElementById("theme-toggle");
const rtlIcon = document.getElementById("rtl-icon");

function setDirection(direction) {
  const isRtl = direction === "rtl";
  document.body.classList.toggle("rtl", isRtl);
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  if (rtlIcon) {
    rtlIcon.textContent = isRtl ? "RTL" : "LTR";
  }
  localStorage.setItem("layoutDirection", isRtl ? "rtl" : "ltr");
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark-mode", isDark);
  document.documentElement.classList.toggle("dark-mode", isDark);
  
  // Force update all elements
  if (isDark) {
    document.body.style.setProperty('background', '#0b1220', 'important');
    document.body.style.setProperty('color', '#ffffff', 'important');
  } else {
    document.body.style.removeProperty('background');
    document.body.style.removeProperty('color');
  }
  
  if (themeBtn) {
    themeBtn.textContent = isDark ? "☀️" : "🌙";
  }
  localStorage.setItem("theme", isDark ? "dark" : "light");
  
  // Trigger a repaint
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

window.addEventListener("load", () => {
  setDirection(localStorage.getItem("layoutDirection") || "ltr");
  setTheme(localStorage.getItem("theme") || "light");
});

// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-question i');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherIcon = otherItem.querySelector('.faq-question i');
            if (otherIcon) {
              otherIcon.classList.remove('fa-minus');
              otherIcon.classList.add('fa-plus');
            }
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          if (icon) {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
          }
        } else {
          item.classList.add('active');
          if (icon) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
          }
        }
      });
    }
  });
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
  }
});


