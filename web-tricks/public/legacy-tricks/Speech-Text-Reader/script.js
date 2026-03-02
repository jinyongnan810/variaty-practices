const main = document.getElementById("main");
const toggleBtn = document.getElementById("toggle-btn");
const textBox = document.getElementById("text-box");
const closeBtn = document.getElementById("close");
const voicesEl = document.getElementById("voices");
const textEl = document.getElementById("text");
const readBtn = document.getElementById("read");

const data = [
  {
    image: "./img/drink.jpg",
    text: "I'm Thirsty",
  },
  {
    image: "./img/food.jpg",
    text: "I'm Hungry",
  },
  {
    image: "./img/tired.jpg",
    text: "I'm Tired",
  },
  {
    image: "./img/hurt.jpg",
    text: "I'm Hurt",
  },
  {
    image: "./img/happy.jpg",
    text: "I'm Happy",
  },
  {
    image: "./img/angry.jpg",
    text: "I'm Angry",
  },
  {
    image: "./img/sad.jpg",
    text: "I'm Sad",
  },
  {
    image: "./img/scared.jpg",
    text: "I'm Scared",
  },
  {
    image: "./img/outside.jpg",
    text: "I Want To Go Outside",
  },
  {
    image: "./img/home.jpg",
    text: "I Want To Go Home",
  },
  {
    image: "./img/school.jpg",
    text: "I Want To Go To School",
  },
  {
    image: "./img/grandma.jpg",
    text: "I Want To Go To Grandmas",
  },
];
const message = new SpeechSynthesisUtterance("No warning should arise");
let voices = [];
// functions

const createSpeechBox = ({ image, text }) => {
  const box = document.createElement("div");
  box.classList.add("box");
  box.innerHTML = `
        <img src="${image}" alt="${text}"/>
        <p class="info">${text}</p>

    `;
  box.addEventListener("click", (e) => {
    setTextMessage(text);
    speakText();
    box.classList.add("active");
    setTimeout(() => {
      box.classList.remove("active");
    }, 8000);
  });
  main.appendChild(box);
};

const getVoices = () => {
  voices = speechSynthesis.getVoices();
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.innerText = `${voice.name} - ${voice.lang}`;
    voicesEl.appendChild(option);
  });
};
const setTextMessage = (text) => {
  message.text = text;
};
const speakText = () => {
  speechSynthesis.speak(message);
};
// event listener
toggleBtn.addEventListener("click", () => textBox.classList.toggle("show"));
closeBtn.addEventListener("click", () => textBox.classList.remove("show"));
speechSynthesis.addEventListener("voiceschanged", (e) => {
  getVoices();
});
voicesEl.addEventListener("change", (e) => {
  message.voice = voices.find((voice) => voice.name === e.target.value);
});
readBtn.addEventListener("click", (e) => {
  setTextMessage(textEl.value);
  speakText();
});
// init
data.forEach(createSpeechBox);
getVoices();
