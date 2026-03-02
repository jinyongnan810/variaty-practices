// pull doms
const addUser = document.getElementById("add-user");
const double = document.getElementById("double");
const showMillionaires = document.getElementById("show-millionaires");
const sortBtn = document.getElementById("sort");
const calculateWealth = document.getElementById("calculate-wealth");
const main = document.getElementById("main");

// data
let users = [];
let showingMillonaires = false;
let sorting = [0, 1, 2];
let totaling = false;

// functions
const fetchUser = async () => {
  const res = await fetch("https://randomuser.me/api/");
  const data = await res.json();
  user = data.results[0];
  users.push({
    name: `${user["name"]["first"]} ${user["name"]["last"]}`,
    money: Math.floor(Math.random() * 1000000),
  });
  displayUsers();
};
const displayUsers = (data = users) => {
  //   const usersOld = main.querySelectorAll('h3');
  //   usersOld.forEach((user) => {
  //     user.remove();
  //   });
  main.innerHTML = "<h2><strong>Person</strong> Wealth</h2>";
  data.forEach((user) => {
    const newUser = document.createElement("div");
    newUser.classList.add("person");
    newUser.innerHTML = `<strong>${user.name}</strong> ${formatMoney(
      user.money,
    )}`;
    main.appendChild(newUser);
  });
};
const formatMoney = (money) => {
  return "$" + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

// event listeners
addUser.addEventListener("click", () => {
  fetchUser();
});
double.addEventListener("click", () => {
  users = users.map((user) => {
    user.money = user.money * 2;
    return user;
  });
  displayUsers();
});
showMillionaires.addEventListener("click", () => {
  showingMillonaires = !showingMillonaires;
  const showing = showingMillonaires
    ? users.filter((user) => user.money >= 1000000)
    : users;
  showMillionaires.innerText = showingMillonaires
    ? "Show All 💵"
    : "Show Only Millionaires 💵";
  displayUsers(showing);
});
sortBtn.addEventListener("click", () => {
  // shift and push
  let temp = sorting.shift();
  sorting.push(temp);

  let showing;
  switch (sorting[0]) {
    case 0:
      showing = users;
      sortBtn.innerText = "Sorting by Original Order";
      break;
    case 1:
      showing = users.slice().sort((a, b) => a.money - b.money);
      sortBtn.innerText = "Sorting by Money ↑";
      break;
    case 2:
      showing = users.slice().sort((a, b) => b.money - a.money);
      sortBtn.innerText = "Sorting by Money ↓";
      break;
    default:
      showing = users;
      break;
  }
  displayUsers(showing);
});
calculateWealth.addEventListener("click", () => {
  totaling = !totaling;
  if (totaling) {
    const total = users.reduce((acc, user) => (acc += user.money), 0);
    displayUsers([{ name: "Total", money: total }]);
    calculateWealth.innerText = "Back";
  } else {
    displayUsers();
    calculateWealth.innerText = "Calculate entire Wealth 🧮";
  }
});

fetchUser();
fetchUser();
fetchUser();
