document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // Mobile Menu
    // =============================

    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");

    if (menuBtn && navbar) {

        menuBtn.addEventListener("click", () => {
            navbar.classList.toggle("show");
        });

    }

    document.querySelectorAll(".navbar a").forEach(link => {

        link.addEventListener("click", () => {
            navbar.classList.remove("show");
        });

    });

    // =============================
// Theme Toggle
// =============================

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light-theme");

    themeToggle.textContent = "☀️";

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    themeToggle.textContent = isLight ? "☀️" : "🌙";

    localStorage.setItem(

        "theme",

        isLight ? "light" : "dark"

    );

});


    // =============================
    // Explore Buttons
    // =============================

    document.querySelectorAll(".explore-btn").forEach(button => {

        button.addEventListener("click", () => {

            const category = button.dataset.category;

            showCollections(category);

        });

    });


// =============================
// Smooth Navigation
// =============================

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        navbar.classList.remove("show");

        const targetId = this.getAttribute("href");

        const targetSection = document.querySelector(targetId);

        if (targetSection) {

            targetSection.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});
});