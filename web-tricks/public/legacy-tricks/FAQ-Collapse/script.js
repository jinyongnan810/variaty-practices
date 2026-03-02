const boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  const buttons = box.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      box.classList.toggle("active");
    });
  });
});
