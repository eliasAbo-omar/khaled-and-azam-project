import { db } from "./firebase-config.js";
import {
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

function normalizeName(name) {
  if (!name) return "";
  return name.trim().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه");
}

export function addNewReader() {
  const name = document.getElementById("userName").value.trim();
  const book = document.getElementById("userBook").value.trim();
  const pagesStr = document.getElementById("userPages").value.trim();
  const pages = parseInt(pagesStr);

  if (name && book && !isNaN(pages)) {
    push(ref(db, "all_readers"), {
      name: name,
      book: book,
      pages: pages,
      date: Date.now(),
    });
    document.getElementById("userName").value = "";
    document.getElementById("userBook").value = "";
    document.getElementById("userPages").value = "";
  } else {
    alert("يرجى اكمال جميع البيانات بشكل صحيح");
  }
}

window.addNewReader = addNewReader;

onValue(ref(db, "all_readers"), (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    document.getElementById("container-week").innerHTML =
      "<p>لا توجد بيانات حاليا</p>";
    document.getElementById("container-month").innerHTML =
      "<p>لا توجد بيانات حاليا</p>";
    return;
  }

  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay(),
  ).getTime();

  let monthTotals = {};
  let weekTotals = {};

  Object.values(data).forEach((record) => {
    const sName = normalizeName(record.name);

    if (record.date >= startMonth) {
      if (!monthTotals[sName]) monthTotals[sName] = { pages: 0, book: "" };
      monthTotals[sName].pages += record.pages;
      monthTotals[sName].book = record.book;
    }

    if (record.date >= startWeek) {
      if (!weekTotals[sName]) weekTotals[sName] = { pages: 0, book: "" };
      weekTotals[sName].pages += record.pages;
      weekTotals[sName].book = record.book;
    }
  });

  randerBox(weekTotals, "container-week");
  randerBox(monthTotals, "container-month");
});

function randerBox(totalsObj, containerId) {
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
      let specialClass = index === 0 ? "first" : "";
      let rankText = index === 0 ? "المركز الأول" : `المركز ${index + 1}`;

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
