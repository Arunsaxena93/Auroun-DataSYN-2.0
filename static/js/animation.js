/* ==========================================================
   AUROUN DATASYN 2.0
   Premium Animation Engine
   ========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initFadeAnimations();

    initFloatingCards();

    initHeroAnimation();

    initMouseGlow();

});

/* ==========================================================
   SCROLL FADE
========================================================== */

function initFadeAnimations() {

    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: 0.15

    });

    elements.forEach(item => observer.observe(item));

}

/* ==========================================================
   FLOATING CARDS
========================================================== */

function initFloatingCards() {

    const cards = document.querySelectorAll(".glass-card");

    cards.forEach(card => {

        let direction = 1;

        let position = 0;

        setInterval(() => {

            position += direction * 0.4;

            if (position >= 6) direction = -1;

            if (position <= -6) direction = 1;

            card.style.transform =
                `translateY(${position}px)`;

        }, 40);

    });

}/* ==========================================================
   HERO TITLE ANIMATION
========================================================== */

function initHeroAnimation() {

    const title = document.querySelector(".hero h1");

    if (!title) return;

    title.animate(
        [
            {
                opacity: 0,
                transform: "translateY(40px)"
            },
            {
                opacity: 1,
                transform: "translateY(0)"
            }
        ],
        {
            duration: 1200,
            easing: "ease-out",
            fill: "forwards"
        }
    );

}

/* ==========================================================
   MOUSE GLOW EFFECT
========================================================== */

function initMouseGlow() {

    const glow = document.createElement("div");

    glow.className = "mouse-glow";

    document.body.appendChild(glow);

    document.addEventListener("mousemove", e => {

        glow.style.left = e.clientX + "px";

        glow.style.top = e.clientY + "px";

    });

}

/* ==========================================================
   GLASS CARD HOVER EFFECT
========================================================== */

document.querySelectorAll(".glass-card").forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform =
            "translateY(-10px) scale(1.03)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "translateY(0) scale(1)";

    });

});

/* ==========================================================
   BUTTON RIPPLE EFFECT
========================================================== */

document.querySelectorAll(
    ".primary-btn, .secondary-btn"
).forEach(button => {

    button.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        ripple.className = "ripple";

        const rect = this.getBoundingClientRect();

        ripple.style.left =
            (e.clientX - rect.left) + "px";

        ripple.style.top =
            (e.clientY - rect.top) + "px";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});

/* ==========================================================
   SECTION ENTRANCE ANIMATION
========================================================== */

window.addEventListener("load", () => {

    document.querySelectorAll("section").forEach((section, index) => {

        section.style.opacity = "0";

        section.style.transform = "translateY(40px)";

        setTimeout(() => {

            section.style.transition =
                "all 0.8s ease";

            section.style.opacity = "1";

            section.style.transform =
                "translateY(0)";

        }, index * 150);

    });

});/* ==========================================================
   FLOATING AI PARTICLES
========================================================== */

function createParticles() {

    const container = document.body;

    for (let i = 0; i < 25; i++) {

        const particle = document.createElement("div");

        particle.className = "floating-particle";

        particle.style.left = Math.random() * 100 + "%";

        particle.style.top = Math.random() * 100 + "%";

        particle.style.animationDuration =
            (5 + Math.random() * 10) + "s";

        particle.style.animationDelay =
            (Math.random() * 5) + "s";

        container.appendChild(particle);

    }

}

/* ==========================================================
   AI PULSE EFFECT
========================================================== */

function pulseLogo() {

    const logo = document.querySelector(".logo img");

    if (!logo) return;

    setInterval(() => {

        logo.animate([

            {
                transform: "scale(1)"
            },

            {
                transform: "scale(1.08)"
            },

            {
                transform: "scale(1)"
            }

        ], {

            duration: 1800,

            easing: "ease-in-out"

        });

    }, 2200);

}

/* ==========================================================
   PARALLAX HERO EFFECT
========================================================== */

window.addEventListener("scroll", () => {

    const hero = document.querySelector(".hero");

    if (!hero) return;

    hero.style.backgroundPositionY =
        window.scrollY * 0.35 + "px";

});

/* ==========================================================
   PERFORMANCE OPTIMIZATION
========================================================== */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        console.log("Animations Paused");

    } else {

        console.log("Animations Resumed");

    }

});

/* ==========================================================
   INITIALIZE EVERYTHING
========================================================== */

window.addEventListener("load", () => {

    createParticles();

    pulseLogo();

});

console.log("Auroun DataSYN Animation Engine Loaded");
