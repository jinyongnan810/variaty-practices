const settingsBtn = document.getElementById("settings-btn");
const settingsEl = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultyEl = document.getElementById("difficulty");
const wordEl = document.getElementById("word");
const textEl = document.getElementById("text");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const endGameContainer = document.getElementById("end-game-container");

let score = 0;
let time = 10;
let words = [];
let wordsNum = 1000;
let currentWord = "";
let difficulty = "easy";
let timer;

// functions
// fetch random words
const fetchWords = async () => {
  const localData = JSON.parse(localStorage.getItem("words"));
  if (localData) {
    words = localData;
    return;
  }
  const res = await fetch(
    `https://random-word-api.herokuapp.com/word?number=${wordsNum}`,
  );
  const data = await res.json();
  words = data;
  localStorage.setItem("words", JSON.stringify(words));
};
const init = async () => {
  if (words.length == 0) {
    await fetchWords();
  }

  score = -1;
  time = 11;
  setTime();
  setScore();
  setCurrentWord();
  textEl.value = "";
  endGameContainer.style.display = "none";
  const diffi = localStorage.getItem("difficulty");
  difficulty = diffi ? diffi : "easy";
  difficultyEl.value = difficulty;
  timer = setInterval(() => {
    setTime();
  }, 1000);
};
const setCurrentWord = () => {
  currentWord = words[Math.floor(Math.random() * wordsNum)];
  wordEl.innerText = currentWord;
};
const setScore = () => {
  score++;
  scoreEl.innerText = `${score} words`;
};
const setTime = () => {
  time--;
  timeEl.innerText = `${time}s`;
  if (time == 0) {
    clearInterval(timer);
    let high = localStorage.getItem(`high-score-${difficulty}`);
    high = high ? high : 0;
    if (score > high) {
      localStorage.setItem(`high-score-${difficulty}`, score);
    }
    endGameContainer.innerHTML = `<p>Your score is ${score} words!\n(best score in ${difficulty} mode is ${high} words)</p><button id="play">Play again!</button>`;
    endGameContainer.style.display = "flex";
  }
};
const addTime = () => {
  switch (difficulty) {
    case "easy":
      time += 3;
      break;
    case "medium":
      time += 2;
      break;
    case "hard":
      time++;
      break;
    default:
      time += 3;
      break;
  }
  timeEl.innerText = `${time}s`;
};
// event listeners
textEl.addEventListener("keyup", (e) => {
  const term = textEl.value;
  if (term == currentWord) {
    addTime();
    setCurrentWord();
    setScore();
    textEl.value = "";
  }
});

endGameContainer.addEventListener("click", (e) => {
  if (e.target.id == "play") {
    init();
  }
});
difficultyEl.addEventListener("change", () => {
  difficulty = difficultyEl.value;
  localStorage.setItem("difficulty", difficulty);
});
settingsBtn.addEventListener("click", () => {
  settingsEl.classList.toggle("hide");
});
// init
init();
