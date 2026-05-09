// import { db } from "./firebase-config.js";
// import { ref, push, onValue } from "firebase/database";
import { db } from "./firebase-config.js";
import {
  ref,
  push,
  onValue,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

import { sanitizeInput } from "./security.js";

function normalizeName(name) {
  if (!name) return "";
  return name
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ");
}

export async function addNewReader() {
  const name = document.getElementById("userName").value.trim();
  const book = document.getElementById("userBook").value.trim();
  const pagesStr = document.getElementById("userPages").value.trim();
  const pages = parseInt(pagesStr);

  const safeName = sanitizeInput(name);
  const safeBook = sanitizeInput(book);

  if (safeName && safeBook && !isNaN(pages)) {
    const dbRef = ref(db, "all_records");
    const snapshot = await get(dbRef);
    let nextId = 1;

    if (snapshot.exists()) {
      const data = snapshot.val();

      const keys = Object.keys(data)
        .map(Number)
        .filter((n) => !isNaN(n));
      if (keys.length > 0) {
        nextId = Math.max(...keys) + 1;
      }
    }

    await set(ref(db, `all_records/${nextId}`), {
      name: safeName,
      book: safeBook,
      pages: pages,
      date: Date.now(),
      numericId: nextId,
    });
    // ---------------------------------

    document.getElementById("userName").value = "";
    document.getElementById("userBook").value = "";
    document.getElementById("userPages").value = "";
  } else {
    alert("يرجى إكمال كافة البيانات بشكل صحيح");
  }
}

window.addNewReader = addNewReader;

onValue(ref(db, "all_records"), (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    const isEn = localStorage.getItem("selectedLang") === "en";
    const noDataMsg = isEn
      ? "<p>No data available currently</p>"
      : "<p>لا توجد بيانات حالياً</p>";

    document.getElementById("container-week").innerHTML = noDataMsg;
    document.getElementById("container-month").innerHTML = noDataMsg;
    return;
  }

  const now = new Date();

  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const startWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay(),
  ).getTime();

  let weeklyTotals = {};
  let monthlyTotals = {};

  Object.values(data).forEach((record) => {
    const sName = normalizeName(record.name);

    if (record.date >= startMonth) {
      if (!monthlyTotals[sName]) monthlyTotals[sName] = { pages: 0, book: "" };
      monthlyTotals[sName].pages += record.pages;
      monthlyTotals[sName].book = record.book;
    }

    if (record.date >= startWeek) {
      if (!weeklyTotals[sName]) weeklyTotals[sName] = { pages: 0, book: "" };
      weeklyTotals[sName].pages += record.pages;
      weeklyTotals[sName].book = record.book;
    }
  });

  renderBoxes(weeklyTotals, "container-week");
  renderBoxes(monthlyTotals, "container-month");
});

function renderBoxes(totalsObj, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const sorted = Object.entries(totalsObj)
    .map(([name, data]) => ({
      name: name,
      pages: data.pages,
      book: data.book,
    }))
    .sort((a, b) => b.pages - a.pages);

  sorted.forEach((item, index) => {
    if (index < 3) {
      let specialClass = "";
      let rankText = "";

      if (index === 0) {
        specialClass = "first";
        rankText = "المركز الأول";
      } else if (index === 1) {
        specialClass = "";
        rankText = "المركز الثاني";
      } else if (index === 2) {
        specialClass = "";
        rankText = "المركز الثالث";
      }

      const rankKey = `rank_${index + 1}`;

      container.innerHTML += `
        <div class="col-md-4">
          <div class="box ${specialClass}">
            <div class="number-card">
            <span data-key="${rankKey}">${rankText}</span>
            </div>
            <div class="logo">
              <img src="assets/image/logo.png" class="month-img" alt="logo" />
            </div>
            <div class="name"><span>${item.name}</span></div>
            <div class="book-name"><span>${item.book}</span></div>
            <div class="number-page">${item.pages}</div>
          </div>
        </div>`;
    }
  });
}
