// pull doms
const cardsContainer = document.getElementById("cards-container");
const clearBtn = document.getElementById("clear");
const addBtn = document.getElementById("add");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const currentEl = document.getElementById("current");
const addContainer = document.getElementById("add-container");
const hideBtn = document.getElementById("hide");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const addCardBtn = document.getElementById("add-card");
// consts
let qas = [];
let cur = 0;
let cardsEl = [];

// functions
const loadQAs = () => {
  const qasLocal = JSON.parse(localStorage.getItem("qas"));
  qas = qasLocal ? qasLocal : [];
  qas.forEach((qa) => {
    addCardToDOM(qa.question, qa.answer);
  });
  setCurrent(cur);
};
const setCurrent = (isLeft = false, pre) => {
  if (isLeft) {
    if (pre != null) {
      cardsEl[pre].className = "card right";
    }
    cardsEl[cur].className = "card active";
  } else {
    if (pre != null) {
      cardsEl[pre].className = "card left";
    }
    cardsEl[cur].className = "card active";
  }
  const elseCards = isLeft ? "card left" : "card";
  cardsEl.forEach((card, i) => {
    if ([cur, pre].indexOf(i) == -1) {
      card.className = elseCards;
    }
  });
  refreshStatus();
};
const addCardToDOM = (q, a) => {
  const dom = document.createElement("div");
  dom.classList.add("card");
  dom.innerHTML = `
    <div class="inner-card">
        <div class="inner-card-front">
            <p>${q}</p>
        </div>
        <div class="inner-card-back">
            <p>${a}</p>
        </div>
    </div>
    `;
  cardsContainer.appendChild(dom);
  cardsEl.push(dom);
  refreshStatus();
};
const refreshStatus = () => {
  currentEl.innerText = `${cur + 1}/${qas.length}`;
};

// event listeners
cardsContainer.addEventListener("click", (e) => {
  cardsContainer.querySelector(".card.active").classList.toggle("show-answer");
});
addBtn.addEventListener("click", () => {
  addContainer.classList.add("show");
});
hideBtn.addEventListener("click", () => {
  addContainer.classList.remove("show");
});
addCardBtn.addEventListener("click", () => {
  const q = questionEl.value;
  const a = answerEl.value;
  if (!q.trim() || !a.trim()) {
    console.log("Input not complete");
  } else {
    qas.push({ question: q, answer: a });
    localStorage.setItem("qas", JSON.stringify(qas));
    addCardToDOM(q.trim(), a.trim());
    cur = qas.length - 1;
    setCurrent();
    questionEl.value = "";
    answerEl.value = "";
    addContainer.classList.remove("show");
  }
});
nextBtn.addEventListener("click", () => {
  if (qas.length < 2) {
    return;
  }
  const pre = cur;
  cur = cur + 1 < qas.length ? cur + 1 : 0;
  setCurrent(false, pre);
});
prevBtn.addEventListener("click", () => {
  if (qas.length < 2) {
    return;
  }
  const pre = cur;
  cur = cur == 0 ? qas.length - 1 : cur - 1;
  setCurrent(true, pre);
});
clearBtn.addEventListener("click", () => {
  qas = [];
  cardsEl = [];
  localStorage.setItem("qas", JSON.stringify(qas));
  cardsContainer.innerHTML = "";
  currentEl.innerText = `0/0`;
});
// init
loadQAs();
