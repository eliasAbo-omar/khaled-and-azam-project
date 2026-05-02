import { db } from "./firebase-config.js";
import {
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

import { sanitizeInput } from "./security.js";

// add comment server
export function addCm() {
  const nameCm = document.getElementById("nameCm").value.trim();
  const bookCm = document.getElementById("bookCm").value.trim();
  const commentCm = document.getElementById("commentCm").value;

  const safeName = sanitizeInput(nameCm);
  const safeBook = sanitizeInput(bookCm);
  const safeComment = sanitizeInput(commentCm);

  if (safeName && safeBook && safeComment) {
    push(ref(db, "all_comments"), {
      nameCm: safeName,
      bookCm: safeBook,
      commentCm: safeComment,
    });

    document.getElementById("nameCm").value = "";
    document.getElementById("bookCm").value = "";
    document.getElementById("commentCm").value = "";
    document.getElementById("char-count").innerText = "300 حرف متبقي";
  } else {
    alert("إملاء البيانات بشكل صحيح");
  }
}

window.addCm = addCm;

// Watch Live On Server
onValue(ref(db, "all_comments"), (snapshot) => {
  const data = snapshot.val();
  const container = document.getElementById("comment-box");
  if (!data) {
    container.innerHTML = `لا يوجد اي إقتباسات في الصفحة`;
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
