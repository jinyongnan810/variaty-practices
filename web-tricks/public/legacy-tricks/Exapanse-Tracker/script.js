const balanceEl = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const textEl = document.getElementById("text");
const amountEl = document.getElementById("amount");

let transactions;

// functions
const addTranscationToDOM = (transaction) => {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(sign === "-" ? "minus" : "plus");
  item.innerHTML = `
        ${transaction.text} <span>${sign} $${Math.abs(
          transaction.amount,
        ).toFixed(2)}</span>
        <button class="delete-btn">x</button>
    `;
  item.setAttribute("data-id", transaction.id);
  list.appendChild(item);
};
const deleteTransaction = (target) => {
  const id = target.parentElement.getAttribute("data-id");
  target.parentElement.remove();
  transactions = transactions.filter((trans) => trans.id != id);
  updateBalance();
  localStorage.setItem("transactions", JSON.stringify(transactions));
};
const init = () => {
  const trans = localStorage.getItem("transactions");
  if (trans) {
    transactions = JSON.parse(trans);
  } else {
    transactions = [];
  }
  // set income expanse container
  updateBalance();
  // set list
  transactions.forEach((trans) => addTranscationToDOM(trans));
};
const updateBalance = () => {
  const income = transactions.reduce((acc, trans) => {
    return trans.amount > 0 ? acc + trans.amount : acc;
  }, 0);
  const expanse = transactions.reduce((acc, trans) => {
    return trans.amount < 0 ? acc + trans.amount : acc;
  }, 0);
  moneyPlus.innerText = `+ $${income.toFixed(2)}`;
  moneyMinus.innerText = `- $${Math.abs(expanse).toFixed(2)}`;
  // set balance
  const balance = income + expanse;
  balanceEl.innerText = `${
    balance > 0 ? `$${balance}` : `-$${Math.abs(balance)}`
  }`;
};

// event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (textEl.value.trim() && amountEl.value) {
    const id = Math.floor(Math.random() * 1000000);
    const newTrans = { id: id, text: textEl.value, amount: +amountEl.value };
    transactions.push(newTrans);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTranscationToDOM(newTrans);
    updateBalance();
  }
});
list.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("delete-btn")) {
    deleteTransaction(e.target);
  }
});
// init
init();
