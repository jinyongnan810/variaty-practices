const keys = document.querySelectorAll("#insert > *:not(:last-child)");
const indicator = document.querySelector("#insert > *:last-child");
console.log(keys);
console.log(indicator);
document.addEventListener("keypress", function (event) {
  //   console.log(event);
  const key = event.key == " " ? "Space" : event.key;
  const code = event.code;
  const keyCode = event.keyCode;
  keys.forEach((e) => {
    e.classList.remove("hide");
  });
  keys[0].childNodes[0].nodeValue = key;
  keys[1].childNodes[0].nodeValue = keyCode;
  keys[2].childNodes[0].nodeValue = code;
  indicator.classList.add("hide");
});
