const closeButton = document.querySelector("#close");
const menuButton = document.querySelector("#menu");
const container = document.querySelector(".container");

closeButton.addEventListener("click", () => {
  container.classList.remove("show-nav");
});

menuButton.addEventListener("click", () => {
  container.classList.add("show-nav");
});
