/**
 * LUVORA WEDDINGS — Easy Site Configuration
 * Update your exact Facebook, Instagram, launch countdown, or build progress here.
 */
const LUVORA_CONFIG = {
  brandName: "Luvora Weddings",
  phoneDisplay: "+94 76 036 6989",
  whatsappNumber: "94760366989",
  address: "Colombo, Sri Lanka",
  googleMapsUrl: "https://maps.app.goo.gl/pjZyaeu16yjQZj519?g_st=ic",
  // Replace these URLs with your exact page handles if different:
  facebookUrl: "https://www.facebook.com/luvoraweddings",
  instagramUrl: "https://www.instagram.com/luvora.weddings?knvt=MXNtN2t0ODgwa24yNg=="
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfigLinks();
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initCopyButtons();
  initInquiryForm();
  initLightbox();
  initBokehCanvas();

  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});

/* Sync configurable social links across the page */
function applyConfigLinks() {
  document.querySelectorAll('[data-link="facebook"]').forEach((el) => {
    el.setAttribute("href", LUVORA_CONFIG.facebookUrl);
  });
  document.querySelectorAll('[data-link="instagram"]').forEach((el) => {
    el.setAttribute("href", LUVORA_CONFIG.instagramUrl);
  });
}

/* Sticky glassmorphic header on scroll */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Mobile navigation drawer toggle */
function initMobileNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    nav.setAttribute("aria-hidden", String(!open));
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) setOpen(false);
  });
}

/* Editorial scroll reveals */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

/* One-click copy phone number & location */
function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied: ${text}`);
      } catch {
        showToast(text);
      }
    });
  });
}

/* Interactive WhatsApp Wedding Inquiry Form */
function initInquiryForm() {
  const form = document.getElementById("inquiryForm");
  const copyBtn = document.getElementById("copyInquiryBtn");
  const dateInput = document.getElementById("eventDate");
  if (!form) return;

  // Open the calendar popup whenever the user clicks anywhere inside the date field
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    dateInput.addEventListener("click", () => {
      if (typeof dateInput.showPicker === "function") {
        try {
          dateInput.showPicker();
        } catch {
          // Fallback to native browser date control
        }
      }
    });
  }

  const buildInquiryText = () => {
    const couple = document.getElementById("coupleName")?.value.trim() || "a prospective couple";
    const rawDate = dateInput?.value || "";
    const date = rawDate
      ? new Date(`${rawDate}T00:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "Flexible / TBD";
    const coverage = document.getElementById("coverageType")?.value || "Wedding Photography & Videography";
    const venue = document.getElementById("eventVenue")?.value.trim() || "To be decided";
    const notes = document.getElementById("eventNotes")?.value.trim();

    const lines = [
      `Hello ${LUVORA_CONFIG.brandName}!`,
      ``,
      `We would love to check availability & packages:`,
      `• Couple / Name: ${couple}`,
      `• Event Date: ${date}`,
      `• Coverage: ${coverage}`,
      `• Venue / City: ${venue}`
    ];
    if (notes) lines.push(`• Notes: ${notes}`);
    return lines.join("\n");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = buildInquiryText();
    const waUrl = `https://wa.me/${LUVORA_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    showToast("Opening WhatsApp with your wedding inquiry...");
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const message = buildInquiryText();
      try {
        await navigator.clipboard.writeText(message);
        showToast("Inquiry message copied to clipboard!");
      } catch {
        showToast("Ready to send via WhatsApp!");
      }
    });
  }
}

/* Editorial Frame Lightbox Preview */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  if (!lightbox || !img || !caption || !closeBtn) return;

  const open = (src, text) => {
    img.src = src;
    caption.textContent = text;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox-src]").forEach((card) => {
    card.addEventListener("click", () => {
      open(
        card.getAttribute("data-lightbox-src") || "",
        card.getAttribute("data-lightbox-caption") || ""
      );
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) close();
  });
}

/* Subtle champagne-gold floating bokeh particles */
function initBokehCanvas() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.getElementById("bokehCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const particles = [];
  const COUNT = 34;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.7,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.28 + 0.08),
      alpha: Math.random() * 0.42 + 0.08,
      pulse: Math.random() * Math.PI * 2
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.015;

      if (p.y < -12) {
        p.y = height + 12;
        p.x = Math.random() * width;
      }
      if (p.x < -12) p.x = width + 12;
      if (p.x > width + 12) p.x = -12;

      const glowAlpha = p.alpha * (0.65 + 0.35 * Math.sin(p.pulse));
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      grad.addColorStop(0, `rgba(240, 215, 176, ${glowAlpha})`);
      grad.addColorStop(1, "rgba(240, 215, 176, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };

  draw();
}

/* Toast Helper */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
