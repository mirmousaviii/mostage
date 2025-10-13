// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 70; // Account for navbar height

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      });
    }
  });
});

// Handle footer scrolling - prevent snap back
let isScrollingToFooter = false;
const footer = document.querySelector(".footer");

if (footer) {
  // Detect when user scrolls to footer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isScrollingToFooter = true;
          // Temporarily disable scroll snap
          document.documentElement.style.scrollSnapType = "none";
        } else {
          isScrollingToFooter = false;
          // Re-enable scroll snap
          document.documentElement.style.scrollSnapType = "y proximity";
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(footer);
}

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

// Navbar scroll effect
const navbar = document.querySelector(".navbar");

function updateNavbar() {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// Add scroll event listener for navbar
window.addEventListener("scroll", updateNavbar);

// Initialize navbar on load
updateNavbar();
