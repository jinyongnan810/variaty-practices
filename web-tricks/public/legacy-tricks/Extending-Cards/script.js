const panels = document.querySelectorAll(".panel");
panels.forEach((panel) => {
  panel.addEventListener("click", () => {
    console.log("hello");
    if (panel.classList.contains("active")) {
      return;
    }
    panels.forEach((p) => {
      p.classList.remove("active");
    });
    panel.classList.add("active");
  });
});
