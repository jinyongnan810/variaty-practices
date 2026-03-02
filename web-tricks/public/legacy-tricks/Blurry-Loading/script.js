const loading = document.querySelector(".loading");
const bg = document.querySelector(".bg");
let load = 0;

const interval = setInterval(() => {
  blurring();
}, 30);

const blurring = () => {
  load++;
  if (load == 100) {
    clearInterval(interval);
  }
  loading.innerText = `${load}%`;
  loading.style.opacity = (100 - load) / 100;
  bg.style.filter = `blur(${(100 - load) * 0.3}px)`;
};
