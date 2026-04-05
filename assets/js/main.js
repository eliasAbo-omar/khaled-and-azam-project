let linkActive = document.querySelectorAll("li a");

linkActive.forEach((e) => {
  e.addEventListener("click", () => {
    linkActive.forEach((link) => {
      link.classList.remove("active");

      e.classList.add("active");
    });
  });
});
