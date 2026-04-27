let inputs = document.querySelectorAll("input");
const sub = document.getElementById("send");
let textArea = document.querySelectorAll("textarea");

textArea.forEach((e) => {
  const placeHolder = e.placeholder;
  let timeClear = [];

  const clearAllTime = () => {
    timeClear.forEach((t) => {
      clearTimeout(t);
      timeClear = [];
    });
  };

  e.addEventListener("focus", () => {
    clearAllTime();
    e.placeholder = "";
    const letter = placeHolder.split("");

    letter.forEach((l, i) => {
      const p = setTimeout(() => {
        e.placeholder += l;
      }, 100 * i);
      timeClear.push(p);
    });
  });

  e.addEventListener("blur", () => {
    e.placeholder = placeHolder;
    clearAllTime();
  });
});

inputs.forEach((e) => {
  const placeHolder = e.placeholder;
  let timeClear = [];

  const clearAllTime = () => {
    timeClear.forEach((t) => {
      clearTimeout(t);
      timeClear = [];
    });
  };

  e.addEventListener("focus", () => {
    clearAllTime();
    e.placeholder = "";
    const letter = placeHolder.split("");

    letter.forEach((l, i) => {
      const p = setTimeout(() => {
        e.placeholder += l;
      }, i * 100);
      timeClear.push(p);
    });
  });

  e.addEventListener("blur", () => {
    e.placeholder = placeHolder;
    clearAllTime();
  });

  e.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sub.click();
    }
  });
});
