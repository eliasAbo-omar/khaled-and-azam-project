import { db } from "./firebase-config.js";
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

let swiperInstance = null;

onValue(ref(db, "all_comments"), (snapshot) => {
  const dataCm = snapshot.val();

  if (dataCm) {
    const countData = Object.entries(dataCm);
    dataNumberComment(countData.length);
  } else {
    dataNumberComment(0);
  }
});

function dataNumberComment(count) {
  const commentBox = document.getElementById("comment-box");
  const swiprMain = document.getElementById("swiperMain");
  if (!commentBox) return;

  if (count >= 6) {
    commentBox.classList.remove("normal-grid");
    commentBox.classList.add("swiper-wrapper");
    swiprMain.classList.add("swiper", "mySwiper");

    if (!swiperInstance) {
      initMySwiper();
    } else {
      swiperInstance.update();
    }
  } else {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
    commentBox.classList.remove("swiper-wrapper");
    swiprMain.classList.remove("swiper", "mySwiper");
    commentBox.classList.add("normal-grid");
  }
}

function initMySwiper() {
  swiperInstance = new Swiper(".mySwiper", {
    grid: {
      rows: 2,
      fill: "row",
    },
    slidesPerView: 3,
    spaceBetween: 20,
    grabCursor: true,

    observer: true,
    observeParents: true,
    observeSlideChildren: true,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1, grid: { rows: 2 } },
      768: { slidesPerView: 2, grid: { rows: 2 } },
      1024: { slidesPerView: 3, grid: { rows: 2 } },
    },
  });
}
