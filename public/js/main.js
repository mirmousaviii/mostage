/* ========================================
   MOSTAGE - Modern Presentation Framework
   Clean & Organized JavaScript
   ======================================== */

// ========================================
// SCROLL EFFECTS
// ========================================

function initScrollEffects() {
  const scrollProgress = document.getElementById("scroll-progress");
  const scrollIndicatorsContainer =
    document.getElementById("scroll-indicators");
  const scrollIndicators = document.querySelectorAll(".scroll-indicator");
  const sections = document.querySelectorAll("section");
  const navbar = document.querySelector(".navbar");
  const scrollHint = document.querySelector(".scroll-hint");
  const footer = document.querySelector(".footer");
  const isMobile = window.innerWidth <= 768;

  // Update scroll progress
  function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
    }
  }

  // Update active indicator
  function updateActiveIndicator() {
    const scrollTop = window.pageYOffset + 100;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        scrollIndicators.forEach((indicator) =>
          indicator.classList.remove("active")
        );
        if (scrollIndicators[index]) {
          scrollIndicators[index].classList.add("active");
        }
      }
    });

    // Update progress for each indicator
    scrollIndicators.forEach((indicator, index) => {
      const section = sections[index];
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        // Calculate progress within the section
        const sectionProgress = Math.max(
          0,
          Math.min(1, (scrollTop + viewportHeight - sectionTop) / sectionHeight)
        );

        // Update the progress bar inside the indicator
        const progressBar = indicator.querySelector(".progress-bar");
        if (progressBar) {
          progressBar.style.height = `${sectionProgress * 100}%`;
        }
      }
    });
  }

  // Update navbar on scroll
  function updateNavbar() {
    if (window.pageYOffset > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Manage footer accessibility on mobile
  function manageFooterAccess() {
    if (!isMobile || !footer) return;

    const footerTop = footer.offsetTop;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    const distanceToFooter = footerTop - scrollTop;

    // If user is close to footer (within 200px), temporarily disable scroll snap
    if (distanceToFooter < 200 && distanceToFooter > -100) {
      document.documentElement.style.scrollSnapType = "none";
    } else {
      document.documentElement.style.scrollSnapType = "y proximity";
    }
  }

  // Update active nav link
  function updateActiveNavLink() {
    const navLinks = document.querySelectorAll(".nav-link");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    const scrollTop = window.pageYOffset + 100;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.id;

      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach((link) => link.classList.remove("active"));
        mobileNavLinks.forEach((link) => link.classList.remove("active"));

        // Add active class to current section link
        const currentNavLink = document.querySelector(
          `.nav-link[href="#${sectionId}"]`
        );
        const currentMobileNavLink = document.querySelector(
          `.mobile-nav-link[href="#${sectionId}"]`
        );

        if (currentNavLink) currentNavLink.classList.add("active");
        if (currentMobileNavLink) currentMobileNavLink.classList.add("active");
      }
    });

    // Handle hero section (no ID)
    if (scrollTop < 100) {
      navLinks.forEach((link) => link.classList.remove("active"));
      mobileNavLinks.forEach((link) => link.classList.remove("active"));

      const heroNavLink = document.querySelector('.nav-link[href="#"]');
      const heroMobileNavLink = document.querySelector(
        '.mobile-nav-link[href="#"]'
      );

      if (heroNavLink) heroNavLink.classList.add("active");
      if (heroMobileNavLink) heroMobileNavLink.classList.add("active");
    }
  }

  // Scroll to section
  function scrollToSection(target) {
    const element = document.querySelector(target);
    if (element) {
      const navbarHeight = 70;
      const targetPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

  // Throttled scroll handler with mobile optimization
  let ticking = false;
  let lastScrollTime = 0;
  const scrollThrottle = isMobile ? 100 : 16; // Slower for mobile

  function handleScroll() {
    const now = Date.now();

    if (!ticking && now - lastScrollTime >= scrollThrottle) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateActiveIndicator();
        updateNavbar();
        updateActiveNavLink();
        manageFooterAccess();

        // Show scroll indicators after scrolling past first section
        if (scrollIndicatorsContainer) {
          const viewportTop = window.pageYOffset;

          // Show indicators when user scrolls more than 200px
          if (viewportTop > 200) {
            scrollIndicatorsContainer.classList.add("visible");
          } else {
            scrollIndicatorsContainer.classList.remove("visible");
          }
        }

        // Show scroll hint only when at the very top
        if (scrollHint) {
          const viewportTop = window.pageYOffset;

          // Show hint only when user is at the very top of the page
          if (viewportTop <= 10) {
            scrollHint.style.opacity = "1";
            scrollHint.style.transform = "translateX(-50%) translateY(0)";
            scrollHint.style.pointerEvents = "auto";
          } else {
            scrollHint.style.opacity = "0";
            scrollHint.style.transform = "translateX(-50%) translateY(20px)";
            scrollHint.style.pointerEvents = "none";
          }
        }

        ticking = false;
        lastScrollTime = now;
      });
      ticking = true;
    }
  }

  // Event listeners
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Show scroll hint after 2 seconds if at top
  setTimeout(() => {
    if (scrollHint && window.pageYOffset <= 10) {
      scrollHint.style.opacity = "1";
      scrollHint.style.transform = "translateX(-50%) translateY(0)";
      scrollHint.style.pointerEvents = "auto";
    }
  }, 2000);

  // Scroll hint click handler
  if (scrollHint) {
    scrollHint.addEventListener("click", () => {
      // Hide hint immediately when clicked
      scrollHint.style.opacity = "0";
      scrollHint.style.transform = "translateX(-50%) translateY(20px)";
      scrollHint.style.pointerEvents = "none";

      // Scroll to next section
      const nextSection = document.querySelector(".why-section");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Indicator click handlers
  scrollIndicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      const target = indicator.getAttribute("data-target");
      scrollToSection(target);
    });
  });

  // Initial calls
  updateScrollProgress();
  updateActiveIndicator();
  updateNavbar();
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScrolling() {
  const navigationLinks = document.querySelectorAll('a[href^="#"]');

  navigationLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navbarHeight = 70;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (!mobileMenuToggle || !mobileNav) return;

  // Toggle mobile menu
  mobileMenuToggle.addEventListener("click", () => {
    const isExpanded =
      mobileMenuToggle.getAttribute("aria-expanded") === "true";

    // Update aria attributes
    mobileMenuToggle.setAttribute("aria-expanded", !isExpanded);
    mobileNav.setAttribute("aria-hidden", isExpanded);

    // Toggle classes
    mobileNav.classList.toggle("active");

    // Prevent body scroll when menu is open
    document.body.style.overflow = !isExpanded ? "hidden" : "";
  });

  // Close menu when clicking on links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInsideNav = mobileNav.contains(event.target);
    const isClickOnToggle = mobileMenuToggle.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnToggle &&
      mobileNav.classList.contains("active")
    ) {
      closeMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNav.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

function initNavbarScrollEffect() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Throttle scroll events for better performance
  let ticking = false;

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Initialize on load
  updateNavbar();
}

// ========================================
// INITIALIZATION
// ========================================

function init() {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
    return;
  }

  // Initialize all features
  initScrollEffects();
  initScrollAnimations();
  initSmoothScrolling();
  initMobileMenu();
  initNavbarScrollEffect();
}

// Start the application
init();
