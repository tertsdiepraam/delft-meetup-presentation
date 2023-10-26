let currentSlide = parseInt(new URLSearchParams(window.location.search).get("slide") ?? 0);
const maxSlides = document.getElementsByClassName("slide").length;
const modal = document.getElementById("goto-modal");
const modalInput = document.getElementById("goto-modal-input");

document.getElementById("current-page-num").innerHTML = currentSlide + 1;
document.getElementById("max-page-num").innerHTML = maxSlides;

function hideAllSlides() {
  document.querySelector(".active-slide")?.classList.remove("active-slide");
}

function showSlide(i) {
  i = Math.max(0, Math.min(maxSlides - 1, i));
  hideAllSlides();
  currentSlide = i;
  document.getElementsByClassName("slide")[i].classList.add("active-slide");
  document.getElementById("progress").style.setProperty(
    "--progress",
    Math.round(i / (maxSlides - 1) * 100) + "%",
  );
  document.getElementById("current-page-num").innerHTML = currentSlide + 1;

  let url = new URL(document.location.href);
  url.searchParams.set("slide", i);
  history.replaceState(null, null, url);
}

function nextSlide() {
  if (currentSlide === maxSlides - 1) {
    return;
  }
  showSlide(currentSlide + 1);
}

function prevSlide() {
  if (currentSlide === 0) {
    return;
  }
  showSlide(currentSlide - 1);
}

document.addEventListener(
  "keydown",
  (event) => {
    console.log(event.key);
    if (event.key === "g") {
        event.preventDefault();
        if (modal.classList.contains("hidden")) {
          modal.classList.remove("hidden");
          modalInput.focus();
          modalInput.select();
        } else {
          modal.classList.add("hidden");
        }
    }
    if (!modal.classList.contains("hidden")) {
      return;
    }
    switch (event.key) {
      case "ArrowLeft":
      case "a":
      case "PageUp":
        event.preventDefault();
        prevSlide();
        break;
      case "ArrowRight":
      case "d":
      case " ":
      case "PageDown":
        event.preventDefault();
        nextSlide();
        break;
      case "Home":
        event.preventDefault();
        showSlide(0);
        break;
      case "End":
        event.preventDefault();
        showSlide(maxSlides - 1);
        break;
    }
  }
);

modalInput.addEventListener("change", (event) => {
  let slide = parseInt(modalInput.value);
  if (!slide) {
    return;
  }
  showSlide(slide - 1);
  modal.classList.add("hidden");
});

modalInput.addEventListener("focusout", (event) => {
  modal.classList.add("hidden");
});

showSlide(currentSlide);


// CONTROLLER STUFF

const controllers = {};
const lastButtons = {};

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  lastButtons[gamepad.index] = { 7: false, 8: false, 9: false, 10: false };
  controllers[gamepad.index] = gamepad;
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete lastButtons[gamepad.index];
  delete controllers[gamepad.index];
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

function updateStatus() {
  for (const controller of Object.values(controllers)) {
    const buttons = controller.buttons;
    const pressed = (n) => {
      return buttons[n].pressed && !lastButtons[controller.index][n];
    };

    if (pressed(7)) {
      document.querySelector(".active-slide .slide-content-container").scrollBy({
        top: -500,
        left: 0,
        behavior: "smooth"
      });
    } else if (pressed(8)) {
      document.querySelector(".active-slide .slide-content-container").scrollBy({
        top: 500,
        left: 0,
        behavior: "smooth"
      });
    } else if (pressed(9)) {
      prevSlide();
    } else if (pressed(10)) {
      nextSlide();
    }
  }
  for (const controller of Object.values(controllers)) {
    const buttons = controller.buttons;
    lastButtons[controller.index][7] = buttons[7].pressed;
    lastButtons[controller.index][8] = buttons[8].pressed;
    lastButtons[controller.index][9] = buttons[9].pressed;
    lastButtons[controller.index][10] = buttons[10].pressed;
  }
  requestAnimationFrame(updateStatus);
}

updateStatus();

