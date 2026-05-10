let linkActive = document.querySelectorAll("li a");
let header = document.querySelector(".header");
const svg = document.getElementById("svg");
const navBar = document.getElementById("nav");
const navBarLi = document.querySelectorAll("#nav li a");
const allSectionId = document.querySelectorAll("section");

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

// =========== Active Bar On Same Page ===========

function activeClass() {
  let currentSectionId = "";

  allSectionId.forEach((section) => {
    const sectionToTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const scrollY = window.scrollY;
    const sectionTop = sectionToTop - 150;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.id;
    }
  });

  navBarLi.forEach((li) => {
    li.classList.remove("active");

    if (li.dataset.section === currentSectionId) {
      li.classList.add("active");
    }
  });
}

window.addEventListener("scroll", activeClass);
