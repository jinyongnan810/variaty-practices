const boxes = document.querySelectorAll(".box");
const checkBoxes = () => {
  const breakpoint = window.innerHeight * 0.8;
  boxes.forEach((box) => {
    const top = box.getBoundingClientRect().top;
    if (top < breakpoint) {
      box.classList.add("show");
    } else {
      box.classList.remove("show");
    }
  });
};
checkBoxes();

window.addEventListener("scroll", checkBoxes);
