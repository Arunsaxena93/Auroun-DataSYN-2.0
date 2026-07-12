/* ==========================================================
   AUROUN DATASYN 2.0
   Main JavaScript
   Author : Arun Kumar Saxena
========================================================== */

"use strict";

/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();

    initializeHamburger();

    initializeReveal();

    initializeCounters();

    initializeFAQ();

    initializeScrollTop();

    initializeSmoothScroll();

    initializeChart();

});

/* ==========================================================
   STICKY NAVBAR
========================================================== */

function initializeNavbar() {

    const header = document.querySelector(".header");

    if (!header) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 60) {

            header.classList.add("sticky");

        } else {

            header.classList.remove("sticky");

        }

    });

}

/* ==========================================================
   MOBILE MENU
========================================================== */

function initializeHamburger() {

    const hamburger = document.querySelector(".hamburger");

    const mobileMenu = document.querySelector(".mobile-menu");

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {

        hamburger.classList.toggle("active");

        mobileMenu.classList.toggle("active");

    });

    document.querySelectorAll(".mobile-menu a").forEach(link => {

        link.addEventListener("click", () => {

            hamburger.classList.remove("active");

            mobileMenu.classList.remove("active");

        });

    });

}

/* ==========================================================
   SCROLL REVEAL
========================================================== */

function initializeReveal() {

    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

            }

        });

    }, {

        threshold: 0.15

    });

    revealElements.forEach(item => observer.observe(item));

}
/* ==========================================================
   ANIMATED COUNTERS
========================================================== */

function initializeCounters() {

    const counters = document.querySelectorAll(
        "#projects-count, #clients-count, #contacts-count, #applications-count"
    );

    counters.forEach(counter => {

        const target = parseInt(counter.innerText);

        if (isNaN(target)) return;

        let value = 0;

        const speed = Math.max(20, Math.floor(1500 / target));

        counter.innerText = "0";

        const updateCounter = () => {

            if (value < target) {

                value++;

                counter.innerText = value;

                setTimeout(updateCounter, speed);

            } else {

                counter.innerText = target;

            }

        };

        updateCounter();

    });

}

/* ==========================================================
   FAQ ACCORDION
========================================================== */

function initializeFAQ() {

    const questions = document.querySelectorAll(".faq-question");

    if (!questions.length) return;

    questions.forEach(question => {

        question.addEventListener("click", () => {

            const answer = question.nextElementSibling;

            question.classList.toggle("active");

            if (!answer) return;

            if (answer.style.maxHeight) {

                answer.style.maxHeight = null;

            } else {

                answer.style.maxHeight = answer.scrollHeight + "px";

            }

        });

    });

}

/* ==========================================================
   SMOOTH SCROLL
========================================================== */

function initializeSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function(e) {

            const target = document.querySelector(
                this.getAttribute("href")
            );

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });

}

/* ==========================================================
   SCROLL TO TOP BUTTON
========================================================== */

function initializeScrollTop() {

    const button = document.createElement("button");

    button.className = "scroll-top";

    button.innerHTML = "↑";

    document.body.appendChild(button);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

(function () {

    const current = window.location.pathname;

    document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === current) {

            link.classList.add("active");

        }

    });

})();
/* ==========================================================
   CHART.JS INITIALIZATION
========================================================== */

function initializeChart() {

    const chartCanvas = document.getElementById("growthChart");

    if (!chartCanvas || typeof Chart === "undefined") return;

    new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: [

                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"

            ],

            datasets: [{

                label: "Business Growth",

                data: [

                    10,
                    18,
                    25,
                    38,
                    55,
                    72

                ],

                tension: 0.4,

                borderWidth: 3,

                fill: true

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: true

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}

/* ==========================================================
   CONTACT & APPLY FORM VALIDATION
========================================================== */

document.querySelectorAll("form").forEach(form => {

    form.addEventListener("submit", function (e) {

        const requiredFields = this.querySelectorAll("[required]");

        let valid = true;

        requiredFields.forEach(field => {

            if (!field.value.trim()) {

                field.style.border = "2px solid red";

                valid = false;

            } else {

                field.style.border = "";

            }

        });

        if (!valid) {

            e.preventDefault();

            alert("Please fill all required fields.");

        }

    });

});

/* ==========================================================
   PAGE LOADER
========================================================== */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (!loader) return;

    loader.style.opacity = "0";
    loader.style.visibility = "hidden";

    setTimeout(() => {
        loader.remove();
    }, 500);

});

/* ==========================================================
   SMALL UTILITIES
========================================================== */

function formatDate() {

    const today = new Date();

    return today.toLocaleDateString();

}

function currentYear() {

    return new Date().getFullYear();

}

/* ==========================================================
   CONSOLE MESSAGE
========================================================== */

console.log(`
==========================================
AUROUN DATASYN 2.0
AI Business Platform
Chief Managing Director:
Arun Kumar Saxena
==========================================
`);
/* ==========================================================
   AUROUN AI CHATBOT
========================================================== */

function addMessage(message, sender) {

    const chatBox = document.getElementById("chatBox");
    if (!chatBox) return;

    const div = document.createElement("div");

    div.className = sender === "user"
        ? "user-message"
        : "bot-message";

    div.innerHTML = message;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function askAI() {

    const input = document.getElementById("question");
    if (!input) return;

    const question = input.value.trim();

    if (question === "") return;

    addMessage(question, "user");

    input.value = "";

    setTimeout(() => {

        let reply = "";

        const q = question.toLowerCase();

if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {

    reply = "👋 Hello! Welcome to Auroun DataSYN 2.0. How can I help you?";

} else if (q.includes("row")) {

    reply = "📄 Your dataset contains " + datasetInfo.rows + " rows.";

} else if (q.includes("column")) {

    reply = "📋 Your dataset contains " + datasetInfo.columns + " columns.";

} else if (q.includes("missing")) {

    reply = "⚠ Missing Values: " + datasetInfo.missing_values;

} else if (q.includes("duplicate")) {

    reply = "📑 Duplicate Rows: " + datasetInfo.duplicate_rows;

} else if (q.includes("numeric")) {

    reply = "🔢 Numeric Columns: " + datasetInfo.numeric_columns;

} else if (q.includes("dataset") || q.includes("file") || q.includes("name")) {

    reply = "📁 Dataset Name: " + datasetInfo.filename;

} else if (q.includes("summary")) {

    reply = "📊 Dataset Summary: " +
            datasetInfo.rows + " rows, " +
            datasetInfo.columns + " columns, " +
            datasetInfo.numeric_columns + " numeric columns.";

} else {

    reply = "🤖 I can answer questions about your dataset, rows, columns, missing values, duplicate rows, numeric columns and file name.";
}

        addMessage(reply, "bot");

    }, 500);
}

document.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        const input = document.getElementById("question");

        if(document.activeElement === input){

            askAI();

        }

    }

});
/* ==========================================
   PREMIUM 3D PARALLAX
========================================== */

document.querySelectorAll(".glass-card").forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = (x / rect.width - 0.5) * 18;
        const rotateX = (0.5 - y / rect.height) * 18;

        card.style.transform =
        `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.04)
        `;
    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});
