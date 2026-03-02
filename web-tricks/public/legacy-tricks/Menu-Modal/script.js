const toggle = document.getElementById("toggle");
const closeBtn = document.getElementById("close");
const openBtn = document.getElementById("open");
const modal = document.getElementById("modal");
const submit = document.querySelector("input[type=submit]");

// event listeners
toggle.addEventListener("click", (e) => {
  document.body.classList.toggle("show-nav");
});
openBtn.addEventListener("click", (e) => {
  modal.classList.add("show-modal");
});
closeBtn.addEventListener("click", (e) => {
  modal.classList.remove("show-modal");
});
modal.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.id == "modal") {
    modal.classList.remove("show-modal");
  }
});
submit.addEventListener("click", (e) => {
  e.preventDefault();
});
