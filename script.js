/* =========================================================
   KETHAM HARIKA PORTFOLIO - JavaScript ES6+
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector("#themeToggle");
  const themeIcon = themeToggle?.querySelector("i");
  const navLinks = document.querySelectorAll(".nav-link");
  const typingText = document.querySelector("#typingText");
  const scrollProgress = document.querySelector("#scrollProgress");
  const contactForm = document.querySelector("#contactForm");
  const formMessage = document.querySelector("#formMessage");

  // ---------------------------------------------------------
  // 1. Theme switching using localStorage
  // ---------------------------------------------------------
  const savedTheme = localStorage.getItem("portfolio-theme") || "light";
  body.dataset.theme = savedTheme;

  const updateThemeIcon = () => {
    const dark = body.dataset.theme === "dark";
    themeIcon.className = dark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };

  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
    body.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    updateThemeIcon();
  });

  // ---------------------------------------------------------
  // 2. Typing animation - array + conditions + loop
  // ---------------------------------------------------------
  const roles = [
    "web applications",
    "machine learning solutions",
    "AI-powered projects",
    "reliable software"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeRole = () => {
    if (!typingText) return;

    const currentRole = roles[roleIndex];

    if (!deleting) {
      typingText.textContent = currentRole.slice(0, charIndex + 1);
      charIndex += 1;

      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeRole, 1200);
        return;
      }
    } else {
      typingText.textContent = currentRole.slice(0, charIndex - 1);
      charIndex -= 1;

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeRole, deleting ? 45 : 80);
  };

  typeRole();

  // ---------------------------------------------------------
  // 3. Skill filtering - DOM manipulation + event handling
  // ---------------------------------------------------------
  const skillButtons = document.querySelectorAll("[data-skill-filter]");
  const skillItems = document.querySelectorAll(".skill-item");

  skillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      skillButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.skillFilter;

      skillItems.forEach((item) => {
        const show = filter === "all" || item.dataset.skill === filter;
        item.classList.toggle("d-none", !show);
      });
    });
  });

  // ---------------------------------------------------------
  // 4. Project filtering - second major interactive feature
  // ---------------------------------------------------------
  const projectButtons = document.querySelectorAll("[data-project-filter]");
  const projectItems = document.querySelectorAll(".project-item");
  const projectEmpty = document.querySelector("#projectEmpty");

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      projectButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.projectFilter;
      let visibleCount = 0;

      projectItems.forEach((item) => {
        const show = filter === "all" || item.dataset.project === filter;
        item.classList.toggle("d-none", !show);
        if (show) visibleCount += 1;
      });

      projectEmpty.hidden = visibleCount !== 0;
    });
  });

  // ---------------------------------------------------------
  // 5. Scroll progress
  // ---------------------------------------------------------
  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${percentage}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---------------------------------------------------------
  // 6. Scroll reveal using IntersectionObserver
  // ---------------------------------------------------------
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // ---------------------------------------------------------
  // 7. Active navigation based on visible section
  // ---------------------------------------------------------
  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        activeLink?.classList.add("active");
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));

  // Close Bootstrap mobile menu after clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.querySelector("#portfolioNav");
      if (nav?.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  // ---------------------------------------------------------
  // 8. Client-side form validation + dynamic messages
  // ---------------------------------------------------------
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      event.stopPropagation();
      contactForm.classList.add("was-validated");

      formMessage.className = "alert alert-danger";
      formMessage.textContent = "Please correct the highlighted fields and try again.";
      return;
    }

    contactForm.classList.remove("was-validated");
    formMessage.className = "alert alert-success";
    formMessage.textContent = "Message validated successfully! In this demo, no message is sent to a server.";
    contactForm.reset();
  });
});
