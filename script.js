let currentSlide = 0;
let maxSlides = document.getElementsByClassName("slide").length;

document.getElementById("current-page-num").innerHTML = currentSlide + 1;
document.getElementById("max-page-num").innerHTML = maxSlides;

function hideAllSlides() {
  document.querySelector(".active-slide").classList.remove("active-slide");
}

function showSlide(i) {
  document.getElementById("content").children[i].classList.add("active-slide");
  document.getElementById("progress").style.setProperty(
    "--progress",
    Math.round(i / (maxSlides - 1) * 100) + "%",
  );
  document.getElementById("current-page-num").innerHTML = currentSlide + 1;
}

function nextSlide() {
  if (currentSlide === maxSlides - 1) {
    return;
  }
  hideAllSlides();
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  if (currentSlide === 0) {
    return;
  }
  hideAllSlides();
  currentSlide--;
  showSlide(currentSlide);
}

document.addEventListener(
  "keydown",
  (event) => {
    console.log(event.key);
    const keyName = event.key;
    if (keyName === "ArrowLeft" || keyName === "a") {
      event.preventDefault();
      prevSlide();
    }
    if (keyName === "ArrowRight" || keyName === " " || keyName === "d") {
      event.preventDefault();
      nextSlide();
    }
  }
)

showSlide(currentSlide);
