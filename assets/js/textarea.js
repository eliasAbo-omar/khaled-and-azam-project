const textarea = document.getElementById("commentCm");
const countDisplay = document.getElementById("char-count");

textarea.addEventListener("input", () => {
  const remaining = 300 - textarea.value.length;

  if (localStorage.getItem("selectedLang") === "en") {
    countDisplay.textContent = `${remaining} characters remaining`;

    countDisplay.style.color = remaining < 20 ? "red" : "black";
  } else {
    countDisplay.innerText = `${remaining} حرف متبقي`;

    countDisplay.style.color = remaining < 20 ? "red" : "black";
  }
});
