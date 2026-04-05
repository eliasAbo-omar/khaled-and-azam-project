let linkActive = document.querySelectorAll("li a");
let header = document.querySelector(".header");

// =========== Active Class ===========

linkActive.forEach((e) => {
  e.addEventListener("click", () => {
    linkActive.forEach((link) => {
      link.classList.remove("active");

      e.classList.add("active");
    });
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
