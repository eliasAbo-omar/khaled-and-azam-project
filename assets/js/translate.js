let translations = {};
let currentLang = localStorage.getItem("selectedLang") || "ar";

export async function fetchTranslations() {
  try {
    const response = await fetch("assets/json/translate.json");
    translations = await response.json();

    applyLanguage(currentLang);

    startObserver();
  } catch (error) {
    console.error("خطأ في جلب ملف اللغات:", error);
  }
}

function translateElement(el) {
  const key = el.getAttribute("data-key");
  const translation = translations[currentLang]?.[key];

  if (translation) {
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = translation;
    } else {
      el.innerText = translation;
    }
  }
}

export function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = translations[lang]?.dir || "rtl";
  localStorage.setItem("selectedLang", lang);

  const elements = document.querySelectorAll("[data-key]");
  elements.forEach((el) => translateElement(el));

  const toggleBtn = document.getElementById("toggleLang");
  if (toggleBtn) {
    toggleBtn.innerText = lang === "ar" ? "English" : "العربية";
  }
}

function startObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.hasAttribute("data-key")) translateElement(node);

          node
            .querySelectorAll("[data-key]")
            .forEach((el) => translateElement(el));
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

document.getElementById("toggleLang")?.addEventListener("click", () => {
  const newLang = currentLang === "ar" ? "en" : "ar";
  applyLanguage(newLang);
});

fetchTranslations();
