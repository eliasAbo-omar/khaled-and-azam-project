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

export async function getReport() {
  const inputField = document.querySelector(".inputBox input");
  const container = document.getElementById("main-report-wrapper");
  const totalDiv = document.getElementById("total");

  // إخفاء العناصر في بداية كل بحث جديد لضمان نظافة الواجهة
  container.style.display = "none";
  if (totalDiv) totalDiv.style.display = "none";

  const searchName = normalizeName(sanitizeInput(inputField.value));

  if (!searchName) {
    alert("يرجى كتابة الاسم");
    return;
  }

  try {
    const recordsRef = ref(db, "all_records");
    const snapshot = await get(recordsRef);

    if (snapshot.exists()) {
      const allData = snapshot.val();
      const userRecords = Object.values(allData).filter(
        (r) => normalizeName(r.name) === searchName,
      );

      if (userRecords.length > 0) {
        let totalSum = 0;

        const booksLis = userRecords
          .map((r) => `<li>${r.book || "كتاب بدون عنوان"}</li>`)
          .join("");
        const pagesLis = userRecords
          .map((r) => {
            const p = Number(r.pages) || 0;
            totalSum += p;
            return `<li>${p.toLocaleString()}</li>`;
          })
          .join("");

        // حقن التقرير والمجموع
        container.innerHTML = `
                    <div class="report-container">
                        <div class="name-container">
                            <h1>مرحبا بك يا ${userRecords[0].name}</h1>
                        </div>
                        <span class="line"></span>
                        <div class="report">
                            <ul class="reportb" id="report-book">
                                <li><h1>الكتب (${userRecords.length})</h1></li>
                                ${booksLis}
                            </ul>
                            <ul class="reportb" id="report-page">
                                <li><h1>عدد الصفحات</h1></li>
                                ${pagesLis}
                            </ul>
                        </div>
                    </div>`;

        if (totalDiv) {
          totalDiv.innerHTML = `
                        <h3>المجموع الكلي للصفحات</h3>
                        <p class="totalNumbers">${totalSum.toLocaleString()}</p>`;
        }

        // --- الإظهار (Show) ---
        container.style.display = "block";
        if (totalDiv) totalDiv.style.display = "block";
      } else {
        alert("الاسم غير موجود");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

window.getReport = getReport;
