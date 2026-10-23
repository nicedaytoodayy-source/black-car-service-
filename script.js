/* =========================================================
   Luck Black Car Services: site interactions
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Scroll effects: glass header, progress bar, hero parallax ---------- */
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const heroMedia = document.querySelector(".hero__media");
let scrollTicking = false;

function updateOnScroll() {
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle("is-scrolled", y > 40);

    if (progressBar) {
        progressBar.style.setProperty("--progress", maxScroll > 0 ? (y / maxScroll).toFixed(4) : 0);
    }

    // Move the hero image slightly slower than the page while it is on screen
    if (heroMedia && !reduceMotion && y < window.innerHeight) {
        heroMedia.style.setProperty("--parallax", (y * 0.25).toFixed(1) + "px");
    }

    scrollTicking = false;
}

window.addEventListener("scroll", function () {
    if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateOnScroll);
    }
}, { passive: true });

window.addEventListener("resize", updateOnScroll);
updateOnScroll();

/* ---------- Mobile menu ---------- */
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setMenu(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
}

navToggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
});

nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        setMenu(false);
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        navToggle.focus();
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && nav.classList.contains("is-open")) {
        setMenu(false);
    }
});

/* ---------- Reveal-on-scroll animations ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(function (item) {
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach(function (item) {
        item.classList.add("is-visible");
    });
}

/* ---------- Experience timeline: draw the connecting line ---------- */
const steps = document.querySelector(".steps");

if (steps && "IntersectionObserver" in window) {
    const stepsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            steps.classList.add("is-drawn");
            stepsObserver.disconnect();
        }
    }, { threshold: 0.3 });

    stepsObserver.observe(steps);
} else if (steps) {
    steps.classList.add("is-drawn");
}

/* ---------- Glass panels: spotlight follows the cursor ---------- */
if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".glass").forEach(function (panel) {
        panel.addEventListener("pointermove", function (event) {
            const rect = panel.getBoundingClientRect();
            panel.style.setProperty("--mx", (event.clientX - rect.left) + "px");
            panel.style.setProperty("--my", (event.clientY - rect.top) + "px");
        });
    });
}

/* ---------- Highlight the current section in the nav ---------- */
const navLinks = document.querySelectorAll(".nav__link");
const trackedSections = Array.from(navLinks)
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            navLinks.forEach(function (link) {
                link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    trackedSections.forEach(function (section) {
        sectionObserver.observe(section);
    });
}

/* ---------- Footer year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
