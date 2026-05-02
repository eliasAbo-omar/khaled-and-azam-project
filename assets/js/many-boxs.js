// import { db } from "./firebase-config.js";
// import { ref, push, onValue } from "firebase/database";
import { db } from "./firebase-config.js";
import {
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

import { sanitizeInput } from "./security.js";

function normalizeName(name) {
  if (!name) return "";
  return name.trim().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه");
}

export function addNewReader() {
  const name = document.getElementById("userName").value.trim();
  const book = document.getElementById("userBook").value.trim();
  const pagesStr = document.getElementById("userPages").value.trim();
  const pages = parseInt(pagesStr);

  // for security
  const safeName = sanitizeInput(name);
  const safeBook = sanitizeInput(book);

  if (safeName && safeBook && !isNaN(pages)) {
    push(ref(db, "all_records"), {
      name: safeName,
      book: safeBook,
      pages: pages,
      date: Date.now(),
    });

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
    document.getElementById("container-week").innerHTML =
      "<p>لا توجد بيانات حالياً</p>";
    document.getElementById("container-month").innerHTML =
      "<p>لا توجد بيانات حالياً</p>";
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
      container.innerHTML += `
        <div class="col-md-4">
          <div class="box ${specialClass}">
            <div class="number-card">${rankText}</div>
            <div class="logo">
              <img src="assets/image/logo.png" class="month-img" alt="logo" />
            </div>
            <div class="name"><span>${item.name}</span></div>
            <div class="book-name"><span>${item.book || "قرآن"}</span></div>
            <div class="number-page">${item.pages}</div>
          </div>
        </div>`;
    }
  });
}
