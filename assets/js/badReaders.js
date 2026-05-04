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

export function renderBadReaders(data) {
  const now = new Date();
  const currentDay = now.getDay();

  const lastSunday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - currentDay - 7,
  ).getTime();
  const lastSaturday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - currentDay,
  ).getTime();

  const allDates = Object.values(data).map((r) => r.date);
  const firstRecordDate = Math.min(...allDates);
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

  const nameElements = document.querySelectorAll(".nameBad");
  const pageElements = document.querySelectorAll(".toatlPage");

  if (now.getTime() - firstRecordDate < oneWeekInMs) {
    nameElements.forEach((el) => (el.innerText = "بانتظار نهاية الأسبوع..."));
    pageElements.forEach((el) => (el.innerText = "-"));
    return;
  }

  let lastWeekTotals = {};

  Object.values(data).forEach((record) => {
    if (record.date >= lastSunday && record.date < lastSaturday) {
      const sName = normalizeName(record.name);
      if (!lastWeekTotals[sName]) lastWeekTotals[sName] = { pages: 0 };
      lastWeekTotals[sName].pages += record.pages;
    }
  });

  const sortedBad = Object.entries(lastWeekTotals)
    .map(([name, details]) => ({ name, pages: details.pages }))
    .sort((a, b) => a.pages - b.pages);

  for (let i = 0; i < 3; i++) {
    if (sortedBad[i]) {
      if (nameElements[i]) nameElements[i].innerText = sortedBad[i].name;
      if (pageElements[i]) pageElements[i].innerText = sortedBad[i].pages;
    } else {
      if (nameElements[i]) nameElements[i].innerText = "---";
      if (pageElements[i]) pageElements[i].innerText = "0";
    }
  }
}

onValue(ref(db, "all_records"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    renderBadReaders(data);
  }
});
