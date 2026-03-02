const yearEl = document.getElementById("year");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const lodingEl = document.getElementById("loding");
const countdownEl = document.getElementById("countdown");

setTimeout(() => {
  countdownEl.style.display = "flex";
  lodingEl.remove();
}, 1000);

const setTime = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = new Date(`${currentYear + 1}/01/01`);
  let timeLeft = +(nextYear - new Date());
  timeLeft = timeLeft / 1000;
  let days = Math.floor(timeLeft / (3600 * 24));
  let hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  let minutes = Math.floor((timeLeft % 3600) / 60);
  let seconds = Math.floor(timeLeft % 60);
  yearEl.innerText = nextYear.getFullYear();
  daysEl.innerText = days;
  hoursEl.innerText = hours;
  minutesEl.innerText = minutes;
  secondsEl.innerText = seconds;
};
setInterval(() => {
  setTime();
}, 999);
