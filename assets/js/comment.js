import { db } from "./firebase-config.js";
import {
  ref,
  push,
  onValue,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

import { sanitizeInput } from "./security.js";

export async function addCm() {
  const nameCm = document.getElementById("nameCm").value.trim();
  const bookCm = document.getElementById("bookCm").value.trim();
  const commentCm = document.getElementById("commentCm").value;

  const safeName = sanitizeInput(nameCm);
  const safeBook = sanitizeInput(bookCm);
  const safeComment = sanitizeInput(commentCm);

  if (safeName && safeBook && safeComment) {
    const dbRef = ref(db, "all_comments");
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

    await set(ref(db, `all_comments/${nextId}`), {
      nameCm: safeName,
      bookCm: safeBook,
      commentCm: safeComment,
      date: Date.now(),
    });
    // ---------------------------------------

    document.getElementById("nameCm").value = "";
    document.getElementById("bookCm").value = "";
    document.getElementById("commentCm").value = "";
    document.getElementById("char-count").innerText = "300 حرف متبقي";
  } else {
    if (localStorage.getItem("selectedLang") === "en") {
      alert("Please fill in all fields before submitting your comment.");
    } else {
      alert("يرجى إكمال كافة البيانات قبل إرسال تعليقك.");
    }
  }
}

window.addCm = addCm;

window.addCm = addCm;

onValue(ref(db, "all_comments"), (snapshot) => {
  const data = snapshot.val();
  const container = document.getElementById("comment-box");
  if (!data) {
    const isEn = localStorage.getItem("selectedLang") === "en";
    const noDataMsg = isEn
      ? "<p>No data available currently</p>"
      : "<p>لا توجد بيانات حالياً</p>";
    container.innerHTML = noDataMsg;
    return;
  }

  const comments = Object.entries(data);
  container.innerHTML = "";

  renderComment(data);
});

function renderComment(data) {
  const container = document.getElementById("comment-box");

  Object.keys(data).forEach((e) => {
    const comment = data[e];

    container.innerHTML += `
            <div class="commentBox swiper-slide">
              <h3 class="nameCom"> ${comment.nameCm} </h3>
              <span class="bookCom"> ${comment.bookCm} </span>
              <p class="comment">
                ${comment.commentCm}
              </p>
            </div>
          `;
  });
}
