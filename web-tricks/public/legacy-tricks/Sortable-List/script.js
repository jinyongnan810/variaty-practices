const listEl = document.getElementById("sort-list");
const checkBtnEl = document.getElementById("check-btn");

const richestPeaple = [
  "Jeff Bezos",
  "Bill Gates",
  "Warren Buffett",
  "Bernard Arnault",
  "Carlos Slim Helu",
  "Amancio Ortega",
  "Larry Ellison",
  "Mark Zuckerberg",
  "Michael Bloomberg",
  "Larry Page",
];
const list = [];

let dragStartIndex;

// functions
const createList = () => {
  [...richestPeaple]
    .map((person) => ({ person: person, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((person) => person.person)
    .forEach((person, index) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("data-index", index);
      listItem.innerHTML = `
            <span class="number">${index + 1}</span>
            <div class="draggable" draggable="true">
                <p class="person-name">${person}</p>
                <i class="fas fa-grip-lines"></i>
            </div>
        `;
      listEl.appendChild(listItem);
      list.push(listItem);
    });
  addEventListeners();
};

const checkOrder = () => {
  list.forEach((item) => {
    const name = item.querySelector(".person-name").innerText;
    const indexExpected = richestPeaple.indexOf(name);
    const index = item.getAttribute("data-index");
    item.className = index == indexExpected ? "right" : "wrong";
  });
};
const swap = (start, end) => {
  const from = list[start].querySelector(".draggable");
  const to = list[end].querySelector(".draggable");
  list[start].appendChild(to);
  list[end].appendChild(from);
};

// event listeners
checkBtnEl.addEventListener("click", (e) => {
  checkOrder();
});
const addEventListeners = () => {
  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", (e) => {
      dragStartIndex = +e.target.closest("li").getAttribute("data-index");
      console.log(dragStartIndex);
    });
  });
  list.forEach((li) => {
    li.addEventListener("dragenter", (e) => {
      li.classList.add("over");
    });
    li.addEventListener("dragleave", (e) => {
      li.classList.remove("over");
    });
    li.addEventListener("dragover", (e) => {
      // set dragover to prevent default to enable drop event
      e.preventDefault();
    });
    li.addEventListener("drop", (e) => {
      const dragEndIndex = +e.target.closest("li").getAttribute("data-index");
      swap(dragStartIndex, dragEndIndex);
      li.classList.remove("over");
    });
  });
};

// init
createList();
