// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add scroll effect to navbar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu functionality
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

mobileMenuToggle.addEventListener("click", () => {
  const isExpanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";

  // Toggle aria-expanded
  mobileMenuToggle.setAttribute("aria-expanded", !isExpanded);

  // Toggle mobile nav visibility
  mobileNav.setAttribute("aria-hidden", isExpanded);
  mobileNav.classList.toggle("active");

  // Prevent body scroll when menu is open
  document.body.style.overflow = !isExpanded ? "hidden" : "";
});

// Close mobile menu when clicking on links
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNav.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNav.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Close mobile menu on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileNav.classList.contains("active")) {
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNav.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Scroll Effects
const scrollProgress = document.getElementById("scroll-progress");
const scrollIndicators = document.querySelectorAll(".scroll-indicator");
const scrollIndicatorsContainer = document.querySelector(".scroll-indicators");
const sections = document.querySelectorAll("section");
const navbar = document.querySelector(".navbar");

// Update scroll progress bar
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + "%";
}

// Update active scroll indicator
function updateActiveIndicator() {
  const scrollTop = window.pageYOffset;
  const windowHeight = window.innerHeight;

  // Show scroll indicators after scrolling past the first section
  if (scrollTop > windowHeight * 0.6) {
    scrollIndicatorsContainer.classList.add("visible");
  } else {
    scrollIndicatorsContainer.classList.remove("visible");
  }

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
      scrollIndicators.forEach((indicator) =>
        indicator.classList.remove("active")
      );
      if (scrollIndicators[index]) {
        scrollIndicators[index].classList.add("active");
      }
    }
  });
}

// Navbar scroll effect
function updateNavbar() {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// Scroll to section when indicator is clicked
scrollIndicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    const targetSection = sections[index];
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated");
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll(".animate-on-scroll").forEach((el) => {
  observer.observe(el);
});

// Throttled scroll event listener
let ticking = false;
function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateActiveIndicator();
      updateNavbar();
      ticking = false;
    });
    ticking = true;
  }
}

// Add scroll event listener
window.addEventListener("scroll", handleScroll);

// Initialize on load
updateScrollProgress();
updateActiveIndicator();
updateNavbar();
