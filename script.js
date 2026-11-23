/**
 * LUVORA WEDDINGS — Easy Site Configuration
 * Update your exact Facebook, Instagram, launch countdown, or build progress here.
 */
const LUVORA_CONFIG = {
  brandName: "Luvora Weddings",
  phoneDisplay: "+94 76 036 6989",
  whatsappNumber: "94760366989",
  address: "55/1 Medhananda Mawatha, Piliyandala, Sri Lanka",
  googleMapsUrl: "https://maps.app.goo.gl/pjZyaeu16yjQZj519?g_st=ic",
  // Replace these URLs with your exact page handles if different:
  facebookUrl: "https://www.facebook.com/luvoraweddings",
  instagramUrl: "https://www.instagram.com/luvoraweddings",
  // Build progress percentage shown on the darkroom meter (0-100):
  buildProgressPercent: 78,
  // Days from today for the launch countdown (or set an ISO date string like "2027-01-15T00:00:00+05:30"):
  launchDaysFromNow: 24,
  fixedLaunchDate: null
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfigLinks();
  initHeaderScroll();
  initProgressMeter();
  initCountdown();
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

/* Animate darkroom development progress bar */
function initProgressMeter() {
  const bar = document.getElementById("progressBar");
  const label = document.getElementById("progressValue");
  if (!bar || !label) return;

  const target = Math.max(0, Math.min(100, LUVORA_CONFIG.buildProgressPercent));
  label.textContent = String(target);
  const track = bar.parentElement;
  if (track) track.setAttribute("aria-valuenow", String(target));

  requestAnimationFrame(() => {
    setTimeout(() => {
      bar.style.width = `${target}%`;
    }, 260);
  });
}

/* Live launch countdown timer */
function initCountdown() {
  const dEl = document.getElementById("cdDays");
  const hEl = document.getElementById("cdHours");
  const mEl = document.getElementById("cdMins");
  const sEl = document.getElementById("cdSecs");
  if (!dEl || !hEl || !mEl || !sEl) return;

  const targetDate = LUVORA_CONFIG.fixedLaunchDate
    ? new Date(LUVORA_CONFIG.fixedLaunchDate)
    : new Date(Date.now() + LUVORA_CONFIG.launchDaysFromNow * 24 * 60 * 60 * 1000);

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  const tick = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) {
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  };

  tick();
  setInterval(tick, 1000);
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

/* One-click copy phone number & studio address */
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
  if (!form) return;

  const buildInquiryText = () => {
    const couple = document.getElementById("coupleName")?.value.trim() || "a prospective couple";
    const date = document.getElementById("eventDate")?.value || "Flexible / TBD";
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
