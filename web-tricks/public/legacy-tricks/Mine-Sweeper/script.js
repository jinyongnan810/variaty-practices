const grid = document.getElementById("grid");
const bombsCountEl = document.getElementById("bombsCount");
const flagsCountEl = document.getElementById("flagsCount");
let width = 10;
let bombsCount = 20;
let flags = 0;
let correctFlags = 0;
let squares = [];
let gameOver = false;

// get bombs and width
const parseQueryString = () => {
  let str = window.location.search;
  let objURL = {};
  str.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function ($0, $1, $2, $3) {
      objURL[$1] = $3;
    },
  );
  return objURL;
};
const params = parseQueryString();
width = params["width"] ? Number(params["width"]) : width;
bombsCount = params["bombs"] ? Number(params["bombs"]) : bombsCount;
grid.style.width = `${40 * width}px`;

// prevent right click menu
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// create board
const createBoard = () => {
  const total = width * width;
  // create random bombs
  const bombsArray = Array(bombsCount).fill("bomb");
  const emptyArray = Array(total - bombsCount).fill("valid");
  const gameArray = emptyArray.concat(bombsArray);
  const shuffledArray = gameArray
    .map((item) => {
      return { sort: Math.random(), value: item };
    })
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.value);
  // const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

  // create board

  for (let i = 0; i < total; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.className = shuffledArray[i];
    // count nearing bombs
    if (shuffledArray[i] != "bomb") {
      let count = 0;
      // check position
      const left = i % width != 0;
      const right = i % width != width - 1;
      const top = Math.floor(i / width) != 0;
      const bottom = Math.floor(i / width) != width - 1;
      if (left) {
        count += shuffledArray[i - 1] == "bomb" ? 1 : 0;
      }
      if (top) {
        count += shuffledArray[i - width] == "bomb" ? 1 : 0;
      }
      if (bottom) {
        count += shuffledArray[i + width] == "bomb" ? 1 : 0;
      }
      if (right) {
        count += shuffledArray[i + 1] == "bomb" ? 1 : 0;
      }
      if (top && left) {
        count += shuffledArray[i - width - 1] == "bomb" ? 1 : 0;
      }
      if (top && right) {
        count += shuffledArray[i - width + 1] == "bomb" ? 1 : 0;
      }
      if (bottom && left) {
        count += shuffledArray[i + width - 1] == "bomb" ? 1 : 0;
      }
      if (bottom && right) {
        count += shuffledArray[i + width + 1] == "bomb" ? 1 : 0;
      }
      square.setAttribute("data-count", count);
    }
    // events
    square.addEventListener("mousedown", (e) => {
      e.preventDefault();
      let rightclick = false;
      if (e.which) rightclick = e.which == 3;
      else if (e.button) rightclick = e.button == 2;
      if (rightclick) {
        rightClick(square);
      } else {
        click(square);
      }
      return false;
    });
    // save square
    grid.appendChild(square);
    squares.push(square);
  }
};
// click event
const click = (square) => {
  if (gameOver || square.classList.contains("checked")) return;
  if (square.className == "bomb") {
    squares.forEach((s) => {
      if (s.classList.contains("bomb")) {
        s.innerText = "💣";
        s.classList.add("checked");
      }
    });
    gameOver = true;
    alert("You lose!");
  } else {
    const count = square.getAttribute("data-count");
    if (count == 0) {
      checkSelf(square);
    } else {
      square.classList.add("checked");
      square.innerText = count;
    }
  }
};
// right click event
const rightClick = (square) => {
  if (gameOver) return;
  const isBomb = square.classList.contains("bomb");
  if (square.classList.contains("flag")) {
    square.classList.remove("flag");
    square.classList.remove("checked");
    square.innerText = "";
    if (isBomb) {
      correctFlags--;
    }
    flags--;
  } else if (!square.classList.contains("checked")) {
    square.classList.add("flag");
    square.classList.add("checked");
    square.innerText = " 🚩";
    if (isBomb) {
      correctFlags++;
    }
    flags++;
  }
  showStatus();
  if (correctFlags == bombsCount) {
    gameOver = true;
    alert("You win!");
  }
};
// check checkSelf
const checkSelf = (square) => {
  if (gameOver || square.classList.contains("checked")) return;
  const count = square.getAttribute("data-count");
  if (count == 0) {
    square.classList.add("checked");
    // check position
    const i = parseInt(square.id);
    const left = i % width != 0;
    const right = i % width != width - 1;
    const top = Math.floor(i / width) != 0;
    const bottom = Math.floor(i / width) != width - 1;
    if (left) {
      setTimeout(() => checkSelf(squares[i - 1]), 30);
    }
    if (top) {
      setTimeout(() => checkSelf(squares[i - width]), 30);
    }
    if (bottom) {
      setTimeout(() => checkSelf(squares[i + width]), 30);
    }
    if (right) {
      setTimeout(() => checkSelf(squares[i + 1]), 30);
    }
    if (top && left) {
      setTimeout(() => checkSelf(squares[i - width - 1]), 30);
    }
    if (top && right) {
      setTimeout(() => checkSelf(squares[i - width + 1]), 30);
    }
    if (bottom && left) {
      setTimeout(() => checkSelf(squares[i + width - 1]), 30);
    }
    if (bottom && right) {
      setTimeout(() => checkSelf(squares[i + width + 1]), 30);
    }
  } else {
    square.classList.add("checked");
    square.innerText = count;
  }
};
// show status
const showStatus = () => {
  bombsCountEl.innerText = bombsCount;
  flagsCountEl.innerText = flags;
};

// init
showStatus();
createBoard();
