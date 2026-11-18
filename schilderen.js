const crepe = document.querySelector(".crepe-circle");
const ingredients = document.querySelectorAll(".ingredient[data-emoji]");
const instructions = document.querySelector(".painting-instructions");

if (crepe && instructions && ingredients.length > 0) {
  let selectedEmoji = "";
  let paintingPointerId = null;
  let lastStamp = null;

  ingredients.forEach((ingredient) => {
    ingredient.addEventListener("click", () => {
      selectedEmoji = ingredient.dataset.emoji;
      ingredients.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === ingredient));
      });
      instructions.textContent = ` ${ingredient.querySelector("img").alt}sleep over de crêpe om te schilderen.`;
    });
  });

  const stampAt = (event, force = false) => {
    const bounds = crepe.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    if (Math.hypot(x - centerX, y - centerY) > bounds.width / 2) {
      return;
    }

    if (!force && lastStamp && Math.hypot(x - lastStamp.x, y - lastStamp.y) < 22) {
      return;
    }

    const stamp = document.createElement("span");
    stamp.className = "emoji-stamp";
    stamp.setAttribute("aria-hidden", "true");
    stamp.textContent = selectedEmoji;
    stamp.style.left = `${(x / bounds.width) * 100}%`;
    stamp.style.top = `${(y / bounds.height) * 100}%`;
    crepe.append(stamp);
    lastStamp = { x, y };
  };

  crepe.addEventListener("pointerdown", (event) => {
    if (!selectedEmoji || event.button !== 0) {
      return;
    }

    event.preventDefault();
    paintingPointerId = event.pointerId;
    lastStamp = null;
    crepe.setPointerCapture(event.pointerId);
    stampAt(event, true);
  });

  crepe.addEventListener("pointermove", (event) => {
    if (event.pointerId === paintingPointerId) {
      stampAt(event);
    }
  });

  const stopPainting = (event) => {
    if (event.pointerId === paintingPointerId) {
      paintingPointerId = null;
      lastStamp = null;
    }
  };

  crepe.addEventListener("pointerup", stopPainting);
  crepe.addEventListener("pointercancel", stopPainting);
  crepe.addEventListener("lostpointercapture", stopPainting);
}
