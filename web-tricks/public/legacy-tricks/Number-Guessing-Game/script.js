const msgEl = document.getElementById("msg");

let randomNum = Math.floor(Math.random() * 100) + 1;
console.log(randomNum);

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new window.SpeechRecognition();
recognition.lang = "en-US";
recognition.start();
const message = new SpeechSynthesisUtterance("No warning should arise");
let voices = [];
// functions
const init = () => {
  msgEl.innerHTML = "";
  randomNum = Math.floor(Math.random() * 100) + 1;
  console.log(randomNum);
};
const getVoices = () => {
  voices = speechSynthesis.getVoices();
  console.log(voices);
  voices.forEach((voice) => {
    if (voice.name == "Ting-Ting") {
      message.voice = voice;
    }
  });
};
const speakText = (text) => {
  message.text = text;
  speechSynthesis.speak(message);
};
// event listeners
recognition.addEventListener("result", (e) => {
  const res = e.results[0][0].transcript;
  const num = +res;
  let hint;
  let btn;
  if (Number.isNaN(num)) {
    hint = "Speak a number";
  } else if (num < 1 || num > 100) {
    hint = "Speak a number between 1~100";
  } else if (num > randomNum) {
    hint = "Guess lower!";
  } else if (num < randomNum) {
    hint = "Guess higher!";
  } else if (num == randomNum) {
    hint = "You have guessed the right number!";
    btn = '<button class="play-again" onclick="init()">Play Again!</button>';
  }
  msgEl.innerHTML = `
    <div>You said:</div>
    <span class="box">${res}</span>
    <div>${hint}</div>
    ${btn ? btn : ""}
    `;
  speakText(hint);
});

recognition.addEventListener("end", (e) => {
  recognition.start();
});

//init
speechSynthesis.addEventListener("voiceschanged", (e) => {
  getVoices();
});
