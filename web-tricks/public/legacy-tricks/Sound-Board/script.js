const audios = document.querySelectorAll("audio");
const buttonsContainer = document.getElementById("buttons");
audios.forEach(
  (e) => (buttonsContainer.innerHTML += `<button>${e.id}</button>`),
);
const buttons = document.querySelectorAll("button");
buttons.forEach((e) => {
  e.addEventListener("click", () => {
    const id = e.innerText;
    audios.forEach((a) => {
      if (a.id == id) {
        a.play();
        return;
      }
      if (a.paused) {
        return;
      }
      a.pause();
    });
  });
});
