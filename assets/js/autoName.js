const allNames = document.querySelectorAll(".list li");
const inputName = document.getElementById("userName");

allNames.forEach((e) => {
  e.addEventListener("click", () => {
    const elementValue = e.textContent;

    inputName.value = elementValue;

    if (inputName.value === elementValue) {
      inputName.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});
