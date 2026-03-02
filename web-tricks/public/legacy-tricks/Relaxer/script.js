const textEl = document.getElementById("text");

const total = 10000;
textEl.innerText = "Breath In~";
setInterval(() => {
  textEl.innerText = "Breath In~";
}, total);
setTimeout(() => {
  textEl.innerText = "Hold~";
  setInterval(() => {
    textEl.innerText = "Hold~";
  }, total);
}, total * 0.4);
setTimeout(() => {
  textEl.innerText = "Breath Out~";
  setInterval(() => {
    textEl.innerText = "Breath Out~";
  }, total);
}, total * 0.6);
