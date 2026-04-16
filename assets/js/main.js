let linkActive = document.querySelectorAll("li a");
let header = document.querySelector(".header");
const svg = document.getElementById("svg");
const navBar = document.getElementById("nav");

// =========== Active Class ===========

linkActive.forEach((e) => {
  e.addEventListener("click", () => {
    linkActive.forEach((link) => {
      link.classList.remove("active");

      e.classList.add("active");
    });
    navBar.classList.toggle("open-menu");
  });
});

// =========== Box Shadw ===========

window.addEventListener("scroll", () => {
  if (window.scrollY >= 80) {
    header.classList.add("shadow");
  } else {
    header.classList.remove("shadow");
  }
});

// =========== Book Open ===========

window.addEventListener("load", () => {
  const book = document.querySelector(".book");

  setTimeout(() => {
    book.classList.add("open");
  }, 500);
});

svg.addEventListener("click", () => {
  navBar.classList.toggle("open-menu");
});
