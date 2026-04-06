// =======================
// NAVBAR TOGGLE
// =======================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(n =>
        n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        })
    );
}

// =======================
// NAVBAR SCROLL EFFECT
// =======================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (!header) return;
    header.style.background = window.scrollY > 100
        ? 'rgba(255,255,255,0.98)'
        : 'rgba(255,255,255,0.95)';
});

// =======================
// SMOOTH SCROLLING
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const el = document.querySelector(targetId);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// =======================
// HERO SLIDER (SINGLE, CLEAN)
// =======================
const heroSlides = document.querySelectorAll('.hero-slider .slide');
let heroIndex = 0;

function showHeroSlide(i) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroSlides[i].classList.add('active');
}

if (heroSlides.length > 0) {
    showHeroSlide(heroIndex); // ensure first is active

    setInterval(() => {
        heroIndex = (heroIndex + 1) % heroSlides.length;
        showHeroSlide(heroIndex);
    }, 6000); // 6 seconds per slide
}

// =======================
// GALLERY MODAL
// =======================
function openModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    if (!modal || !modalImg) return;
    modal.style.display = 'block';
    modalImg.src = img.src;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    modal.style.display = 'none';
}

window.addEventListener('click', event => {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// expose to inline onclick="openModal(this)"
window.openModal = openModal;
window.closeModal = closeModal;

// =======================
// NEWSLETTER FORM
// =======================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]')?.value;
        if (email) {
            alert('Thanks for subscribing! 🎉 You\'ll hear from us soon.');
            this.reset();
        }
    });
}

// =======================
// WORKSHOP SLIDER
// =======================
let workshopCurrent = 0;
const workshopSlides = document.querySelectorAll('.workshop-slide');
const workshopDots = document.querySelectorAll('.dot');

function showWorkshopSlide(index) {
    if (!workshopSlides.length) return;
    workshopSlides.forEach(slide => slide.classList.remove('active'));
    workshopDots.forEach(dot => dot.classList.remove('active'));
    workshopSlides[index].classList.add('active');
    if (workshopDots[index]) {
        workshopDots[index].classList.add('active');
    }
}

function moveSlide(direction) {
    if (!workshopSlides.length) return;
    workshopCurrent = (workshopCurrent + direction + workshopSlides.length) % workshopSlides.length;
    showWorkshopSlide(workshopCurrent);
}

function goToWorkshopSlide(index) {
    workshopCurrent = index;
    showWorkshopSlide(workshopCurrent);
}

// attach to dots if they exist
workshopDots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToWorkshopSlide(i));
});

// auto slide workshops
if (workshopSlides.length > 0) {
    showWorkshopSlide(0);
    setInterval(() => moveSlide(1), 5000);
}

// expose if needed for buttons: onclick="moveSlide(1)"
window.moveSlide = moveSlide;
window.goToWorkshopSlide = goToWorkshopSlide;

// =======================
// SCROLL ANIMATIONS (OLD WORKSHOP CARDS)
// =======================
const cardsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardsObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.workshop-card, .workshop-card-horizontal').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s, transform 0.6s';
    cardsObserver.observe(card);
});

// =======================
// BOOKING FORM (ONE HANDLER ONLY)
// =======================
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('Booking request sent! We will contact you soon.');
        bookingForm.reset();
    });
}

// =======================
// DROPDOWN TOGGLE (HOME 1 / HOME 2, MOBILE + DESKTOP CLICK)
// =======================
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const parent = toggle.closest('.dropdown');
        parent?.classList.toggle('active');
    });
});

// close dropdown if click outside
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(dd => dd.classList.remove('active'));
});

// =======================
// FAQ ACCORDION
// =======================
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        item?.classList.toggle('open');
    });
});

// =======================
// SCROLL REVEAL FOR .reveal ELEMENTS (TERRABLOOM SECTION ETC.)
// =======================
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealEls.forEach(el => revealObserver.observe(el));
}







// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');

        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
}


const cards = document.querySelectorAll('.product-card');

window.addEventListener('scroll', () => {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }
  });
});

// initial state
cards.forEach(card => {
  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "all 0.6s ease";
});

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".hamburger");
  const menu = document.querySelector(".nav-menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  }
});


function scrollCollection(direction) {
    const container = document.getElementById('collectionGrid');
    const scrollAmount = 300;

    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}



// HERO SLIDER
let slides = document.querySelectorAll(".hero-slide");
let index = 0;

setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}, 4000);


// DARK MODE
document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("dark");
};


// RTL MODE
document.getElementById("rtlToggle").onclick = () => {
    let html = document.getElementById("htmlTag");
    html.dir = html.dir === "rtl" ? "ltr" : "rtl";
};



function scrollKits(direction) {
    const container = document.getElementById("kitGrid");

    container.scrollBy({
        left: direction * 320,
        behavior: "smooth"
    });
}



  document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.hotspot-trigger');
    const cards = document.querySelectorAll('.hotspot-card');

    function hideAllCards() {
      cards.forEach(card => card.classList.remove('is-active'));
    }

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = trigger.getAttribute('data-target');
        const targetCard = document.getElementById(targetId);

        const isActive = targetCard.classList.contains('is-active');
        hideAllCards();
        if (!isActive) {
          targetCard.classList.add('is-active');
        }
      });
    });

    document.addEventListener('click', () => {
      hideAllCards();
    });
  });


  function goToLogin() {
    window.location.href = "login.html";
}



// DARK MODE
const darkToggle = document.getElementById("darkToggle");

darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// RTL MODE
const rtlToggle = document.getElementById("rtlToggle");

rtlToggle.addEventListener("click", () => {
    document.body.classList.toggle("rtl");
});