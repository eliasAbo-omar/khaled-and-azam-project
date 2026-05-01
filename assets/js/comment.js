import { db } from "./firebase-config.js";
import {
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

import Swiper from "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs";
import { Pagination, Autoplay, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";

let swiperInstance = null;

// add comment server
export function addCm() {
  const nameCm = document.getElementById("nameCm").value.trim();
  const bookCm = document.getElementById("bookCm").value.trim();
  const commentCm = document.getElementById("commentCm").value;

  if (nameCm && bookCm && commentCm) {
    push(ref(db, "all_comments"), {
      nameCm: nameCm,
      bookCm: bookCm,
      commentCm: commentCm,
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

function handelSwiper(count) {
  const container = document.getElementById("comment-box");

  if (count >= 6) {
    container.classList.add("swiper-wrapper");
    container.classList.remove("row");

    if (!swiperInstance) {
      swiperInstance = new Swiper(".mySwiper", {
        modules: [Pagination, Autoplay, Grid],
        grabCursor: true,
        slidesPerView: 3,
        grid: {
          rows: 2,
          fill: "row",
        },
        spaceBetween: 20,
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
          320: { slidesPerView: 1, grid: { rows: 2 } },
          768: { slidesPerView: 2, grid: { rows: 2 } },
          1024: { slidesPerView: 3, grid: { rows: 2 } },
        },
      });
    } else {
      swiperInstance.update();
    }
  } else {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
      container.classList.remove("swiper-wrapper");
      container.classList.add("row");
    }
  }
}

// Watch Live On Server
onValue(ref(db, "all_comments"), (snapshot) => {
  const data = snapshot.val();
  const container = document.getElementById("comment-box");
  if (!data) {
    container.innerHTML = `لا يوجد اي إقتباسات في الصفحة`;
    return;
  }

  const commentsArray = Object.entries(data);
  const totalCount = commentsArray.length;
  container.innerHTML = "";

  renderComment(data, totalCount);

  handelSwiper(totalCount);
});

function renderComment(data, count) {
  const container = document.getElementById("comment-box");

  Object.keys(data).forEach((e) => {
    const comment = data[e];

    const slideClass =
      count >= 6 ? "swiper-slide" : "col-md-4 col-sm-6 col-lg-3";

    container.innerHTML += `
            <div class=" ${slideClass} commentBox">
              <h3 class="nameCom"> ${comment.nameCm} </h3>
              <span class="bookCom"> ${comment.bookCm} </span>
              <p class="comment">
                ${comment.commentCm}
              </p>
            </div>
          `;
  });
}
