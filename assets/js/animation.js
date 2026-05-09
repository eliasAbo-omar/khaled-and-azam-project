let inputs = document.querySelectorAll("input");
let textArea = document.querySelectorAll("textarea");
const sub = document.getElementById("send");

function setupTypewriterEffect(el) {
  let timeClear = [];
  let originalText = "";

  const clearAllTime = () => {
    timeClear.forEach((t) => clearTimeout(t));
    timeClear = [];
  };

  el.addEventListener("focus", () => {
    clearAllTime();

    originalText = el.placeholder;
    el.placeholder = "";

    const letters = originalText.split("");

    letters.forEach((l, i) => {
      const p = setTimeout(() => {
        el.placeholder += l;
      }, 100 * i);
      timeClear.push(p);
    });
  });

  el.addEventListener("blur", () => {
    clearAllTime();
    if (originalText) {
      el.placeholder = originalText;
    }
  });
}

textArea.forEach((e) => setupTypewriterEffect(e));
inputs.forEach((e) => {
  setupTypewriterEffect(e);

  e.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (sub) sub.click();
    }
  });
});
