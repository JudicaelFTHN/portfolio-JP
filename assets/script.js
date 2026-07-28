/* ==========================================================
   Portfolio — Pierre Judicaël Fitahiana
   Vanilla JS, no dependencies. Sections:
   1. Mobile navigation
   2. Nav scroll shadow + active link highlight
   3. Hero name type-in + rotating role typewriter
   4. Ambient particles (hero background)
   5. Animated stat counters
   6. Skill bar fill on scroll
   7. Laravel projects modal
   8. Back-to-top button
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------------------------------------------
     1. Mobile navigation
     ------------------------------------------------------ */
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
      );
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ------------------------------------------------------
     2. Nav scroll shadow + active section highlight
     ------------------------------------------------------ */
  const nav = document.querySelector("nav");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  const onScroll = () => {
    if (nav) nav.classList.toggle("nav-scrolled", window.scrollY > 30);

    let currentId = "";
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active-link",
        link.getAttribute("href") === `#${currentId}`
      );
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------
     3. Hero name type-in + rotating role typewriter
     ------------------------------------------------------ */
  const nameEl = document.querySelector(".hero-name .typing-effect");
  if (nameEl) {
    const fullName = nameEl.textContent.trim();
    if (prefersReducedMotion) {
      nameEl.textContent = fullName;
    } else {
      nameEl.textContent = "";
      let i = 0;
      const typeName = () => {
        nameEl.textContent = fullName.slice(0, i);
        i++;
        if (i <= fullName.length) requestAnimationFrame(() => setTimeout(typeName, 38));
      };
      typeName();
    }
  }

  const roleEl = document.querySelector(".role-text");
  if (roleEl) {
    const roles = ["Développeur Laravel", "Intégrateur WordPress", "Développeur Web Junior"];

    if (prefersReducedMotion) {
      roleEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1600);
            return;
          }
        } else {
          charIndex--;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 35 : 65);
      };

      setTimeout(tick, fullNameTypeDuration());
    }
  }

  function fullNameTypeDuration() {
    const name = document.querySelector(".hero-name .typing-effect");
    if (!name) return 300;
    return Math.min(name.textContent.trim().length * 38, 400) + 300;
  }

  /* ------------------------------------------------------
     4. Ambient particles in the hero background
     ------------------------------------------------------ */
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer && !prefersReducedMotion) {
    const PARTICLE_COUNT = 26;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      const size = Math.random() * 3 + 1.5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = `-10px`;
      particle.style.animationDuration = `${Math.random() * 10 + 9}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      if (Math.random() > 0.7) particle.style.background = "var(--amber)";
      particlesContainer.appendChild(particle);
    }
  }

  /* ------------------------------------------------------
     5. Animated stat counters
     ------------------------------------------------------ */
  const counters = document.querySelectorAll(".counter[data-target]");
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ------------------------------------------------------
     6. Skill bar fill on scroll + percent label
     ------------------------------------------------------ */
  const skillBars = document.querySelectorAll(".skill-bar[data-level]");
  if (skillBars.length) {
    skillBars.forEach((bar) => {
      const level = bar.getAttribute("data-level");
      const percentLabel = document.createElement("span");
      percentLabel.className = "skill-percent";
      percentLabel.textContent = `${level}%`;
      bar.closest(".skill-card").appendChild(percentLabel);
    });

    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = `${bar.getAttribute("data-level")}%`;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach((bar) => skillObserver.observe(bar));
  }

  /* ------------------------------------------------------
     7. Laravel projects modal
     ------------------------------------------------------ */
  const modalTriggers = document.querySelectorAll("[data-modal-open]");
  let lastFocusedTrigger = null;

  const openModal = (modal, trigger) => {
    lastFocusedTrigger = trigger;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const firstFocusable = modal.querySelector(
      ".modal-close, .modal-choice, a, button"
    );
    if (firstFocusable) firstFocusable.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.getAttribute("data-modal-open"));
      if (modal) openModal(modal, trigger);
    });
  });

  document.querySelectorAll(".modal-overlay").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
    modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const openModalEl = document.querySelector(".modal-overlay.active");
    if (openModalEl) closeModal(openModalEl);
  });

  /* ------------------------------------------------------
     8. Back-to-top button
     ------------------------------------------------------ */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => backToTop.classList.toggle("visible", window.scrollY > 500),
      { passive: true }
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }
});
