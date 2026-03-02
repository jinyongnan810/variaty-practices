const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById(
  "final-message-reveal-word",
);

const figureParts = document.querySelectorAll(".figure-part");

// select words
let words = [];
let selectedWord;
// word status
let correctLetters = [];
let wrongLetters = [];
// init
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
const init = () => {
  fetchWords();
  selectedWord = words[Math.floor(Math.random() * words.length)];
  correctLetters = [];
  wrongLetters = [];
  wrongLettersEl.innerHTML = "";
  figureParts.forEach((part, index) => {
    part.style.display = "none";
  });
  displayWord();
};
// display word
const displayWord = () => {
  wordEl.innerHTML = `
        ${selectedWord
          .split("")
          .map(
            (letter) => `
            <span class="letter">
                ${correctLetters.includes(letter) ? letter : ""}
            </span>
        `,
          )
          .join("")}
    `;
  // get word already guessed
  const innerWord = wordEl.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    popup.style.display = "flex";
  }
};
// display wrong letters
const displayWrongLetters = () => {
  wrongLettersEl.innerHTML = `
        <p>Wrong:</p>
        <span>${wrongLetters.join(",")}</span>
    `;
  const errorNum = wrongLetters.length;
  if (errorNum === figureParts.length) {
    finalMessage.innerText = `Unfortunately you lost. 😕\n(correct answer is '${selectedWord}')`;
    popup.style.display = "flex";
  }
  figureParts.forEach((part, index) => {
    if (index < errorNum) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });
};

// event listeners
window.addEventListener("keydown", (e) => {
  const key = e.keyCode;
  if (key >= 65 && key <= 90) {
    if ([...correctLetters, ...wrongLetters].includes(e.key)) {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 1000);
    } else if (selectedWord.indexOf(e.key) > -1) {
      //correct
      correctLetters.push(e.key);
      displayWord();
    } else {
      //incorrect
      wrongLetters.push(e.key);
      displayWrongLetters();
    }
  }
});
playAgainBtn.addEventListener("click", () => {
  init();
  popup.style.display = "none";
});

// init
init();
