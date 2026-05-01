const textarea = document.getElementById("commentCm");
const countDisplay = document.getElementById("char-count");

textarea.addEventListener("input", () => {
  const remaining = 300 - textarea.value.length;
  countDisplay.innerText = `${remaining} حرف متبقي`;

  // تغيير اللون للتحذير إذا اقترب من النهاية
  countDisplay.style.color = remaining < 20 ? "red" : "black";
});
