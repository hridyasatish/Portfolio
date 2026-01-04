// static/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* FOOTER YEAR */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* THEME TOGGLE */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector("i");

  const applyTheme = (mode) => {
    const isLight = mode === "light";
    body.classList.toggle("light-mode", isLight);

    if (themeIcon) {
      themeIcon.classList.toggle("fa-moon", !isLight);
      themeIcon.classList.toggle("fa-sun", isLight);
    }
  };

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const newTheme = body.classList.contains("light-mode") ? "dark" : "light";
      applyTheme(newTheme);
      window.localStorage.setItem("theme", newTheme);
    });
  }

  /* MOBILE NAV */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      siteNav.classList.toggle("open");
    });

    siteNav.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => siteNav.classList.remove("open"));
    });
  }

  /* SMOOTH SCROLL */
  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* HERO TYPEWRITER (NO DELETING)
     - types phrase
     - holds
     - clears instantly
     - types next phrase
  */
  const typedEl = document.getElementById("typedText");

  if (typedEl) {
    const phrases = [
      "embedded systems firmware and device drivers.",
      "PCB design bring up and hardware validation.",
      "hardware software integration for sensor driven systems.",
    ];

    let phraseIndex = 0;
    let charIndex = 0;

    const typeSpeed = 38; // typing speed
    const holdTime = 1100; // pause at end of phrase
    const betweenTime = 180; // pause before next phrase

    const typeTick = () => {
      const current = phrases[phraseIndex];

      // Type forward only
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex < current.length) {
        setTimeout(typeTick, typeSpeed);
        return;
      }

      // Done typing: hold, then clear instantly, then next phrase
      setTimeout(() => {
        typedEl.textContent = "";
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        setTimeout(typeTick, betweenTime);
      }, holdTime);
    };

    // Start only when hero is visible (prevents running offscreen)
    const hero = document.querySelector(".hero");
    if (hero) {
      const heroObs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            typeTick();
            heroObs.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      heroObs.observe(hero);
    } else {
      typeTick();
    }
  }

  /* REVEAL ANIMATIONS */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));

  /* PROJECT FILTERS (your original) */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  const applyProjectFilter = (filter) => {
    projectCards.forEach((card) => {
      const categories = (card.getAttribute("data-category") || "")
        .split(/\s+/)
        .filter(Boolean);

      const show = filter === "all" || categories.includes(filter);
      card.style.display = show ? "" : "none";
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      applyProjectFilter(filter);
    });
  });

  // Default filter on load
  applyProjectFilter("all");

  /* PROJECT "SHOW DETAILS" TOGGLE */
  const projectsRoot = document.getElementById("projects") || document;

  function setToggleLabel(btn, isOpen) {
    const more = btn.getAttribute("data-more") || "Show details";
    const less = btn.getAttribute("data-less") || "Hide details";
    const next = isOpen ? less : more;

    // Update only the first text node (keeps <i> icon intact)
    let updated = false;
    btn.childNodes.forEach((n) => {
      if (!updated && n.nodeType === Node.TEXT_NODE) {
        n.textContent = next + " ";
        updated = true;
      }
    });

    // Fallback if no text node exists
    if (!updated) {
      btn.insertBefore(document.createTextNode(next + " "), btn.firstChild);
    }
  }

  projectsRoot.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-project-toggle]");
    if (!toggle) return;

    const card = toggle.closest(".project-card");
    if (!card) return;

    const details = card.querySelector(".project-details");
    if (!details) return;

    const isOpen = card.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    details.setAttribute("aria-hidden", String(!isOpen));
    setToggleLabel(toggle, isOpen);
  });
  /* PROJECTS: middle "Show more projects" reveal */
const projectsMore = document.getElementById("projectsMore");
const projectsMoreBtn = document.getElementById("projectsMoreBtn");

if (projectsMore && projectsMoreBtn) {
  // start locked preview
  projectsMore.classList.add("is-locked");
  projectsMore.setAttribute("aria-hidden", "true");
  projectsMoreBtn.setAttribute("aria-expanded", "false");

  projectsMoreBtn.addEventListener("click", () => {
    const isOpen = projectsMore.classList.toggle("is-open");

    if (isOpen) {
      projectsMore.classList.remove("is-locked");
      projectsMore.setAttribute("aria-hidden", "false");
      projectsMoreBtn.setAttribute("aria-expanded", "true");
      projectsMoreBtn.innerHTML = `Hide extra projects <i class="fa-solid fa-chevron-up"></i>`;
    } else {
      projectsMore.classList.add("is-locked");
      projectsMore.setAttribute("aria-hidden", "true");
      projectsMoreBtn.setAttribute("aria-expanded", "false");
      projectsMoreBtn.innerHTML = `Show more projects <i class="fa-solid fa-chevron-down"></i>`;

      // optional: scroll back to CTA so it feels clean
      projectsMoreBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}


  /* COLLAPSIBLES (EXPERIENCE) - your old one kept as-is */
  document.querySelectorAll("[data-toggle-collapsible]").forEach((button) => {
    const container = button.closest(".collapsible");
    if (!container) return;

    const moreLabel = button.dataset.more || "Show more";
    const lessLabel = button.dataset.less || "Show less";

    const updateLabel = () => {
      const collapsed = container.getAttribute("data-collapsed") !== "false";
      button.textContent = collapsed ? moreLabel : lessLabel;
    };

    updateLabel();

    button.addEventListener("click", () => {
      const isCollapsed = container.getAttribute("data-collapsed") !== "false";
      container.setAttribute("data-collapsed", isCollapsed ? "false" : "true");
      updateLabel();
    });
  });

  /* EXPERIENCE: toggle bullets/results per experience card */
  document.querySelectorAll("[data-exp-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".exp-card");
      if (!card) return;

      const details = card.querySelector(".exp-details");
      if (!details) return;

      const isOpen = card.classList.toggle("is-open");

      btn.setAttribute("aria-expanded", String(isOpen));
      details.setAttribute("aria-hidden", String(!isOpen));

      const more = btn.getAttribute("data-more") || "Show details";
      const less = btn.getAttribute("data-less") || "Hide details";
      btn.innerHTML = `${isOpen ? less : more} <i class="fa-solid fa-chevron-down"></i>`;
    });
  });

  /* RESUME MODAL */
  const resumeModal = document.getElementById("resumeModal");
  const resumeBackdrop = document.getElementById("resumeBackdrop");
  const resumeClose = document.getElementById("resumeClose");
  const resumeTabs = document.querySelectorAll(".resume-tab");
  const resumeTriggers = document.querySelectorAll("[data-resume-trigger]");
  const resumeFrame = document.getElementById("resumeFrame");
  const resumeDownloadBtn = document.getElementById("resumeDownloadBtn");
  const resumeFallbackLink = document.getElementById("resumeFallbackLink");
  const resumeTitle = document.getElementById("resumeModalTitle");
  const resumeDesc = document.getElementById("resumeModalDesc");

  const resumeConfig = {
    resume: {
      title: "Resume",
      desc: "Embedded • Hardware • Validation",
      url: "assets/resume/Hridya_Satish_Pisharady.pdf",
    },
  };

  const openResumeModal = (type) => {
    const config = resumeConfig[type] || resumeConfig.resume;
    if (!resumeModal || !resumeFrame) return;

    if (resumeTitle) resumeTitle.textContent = config.title;
    if (resumeDesc) resumeDesc.textContent = config.desc;

    resumeFrame.src = config.url;
    if (resumeDownloadBtn) resumeDownloadBtn.href = config.url;
    if (resumeFallbackLink) resumeFallbackLink.href = config.url;

    resumeTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-resume") === type);
    });

    resumeModal.classList.add("open");
    resumeModal.setAttribute("aria-hidden", "false");
  };

  const closeResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove("open");
    resumeModal.setAttribute("aria-hidden", "true");
    if (resumeFrame) resumeFrame.src = "";
  };

  resumeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openResumeModal(trigger.getAttribute("data-resume-trigger") || "resume");
    });
  });

  resumeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const type = tab.getAttribute("data-resume");
      if (type) openResumeModal(type);
    });
  });

  if (resumeBackdrop) resumeBackdrop.addEventListener("click", closeResumeModal);
  if (resumeClose) resumeClose.addEventListener("click", closeResumeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resumeModal?.classList.contains("open")) closeResumeModal();
  });
});
