// pull dom
const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");

// seat event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    //when click seat
    e.target.classList.toggle("selected");
    calculate();
  }
});

// select ticket
movieSelect.addEventListener("change", (e) => {
  calculate();
  localStorage.setItem("ticket", e.target.selectedIndex);
});

// get count and total price
const calculate = () => {
  // change count
  const seatsSelected = document.querySelectorAll(".row .seat.selected");
  const countNumber = seatsSelected.length;
  count.innerText = countNumber;
  // change total
  const ticketPrice = +movieSelect.value;
  total.innerText = countNumber * ticketPrice;
  // save selected seats' indexes to localstroage
  const seatsAvailable = [...seats];
  const indexes = [...seatsSelected].map((seat) => {
    return [...seatsAvailable].indexOf(seat);
  });
  localStorage.setItem("seats", JSON.stringify(indexes));
};

// set seats when inited
const initSeats = () => {
  //init ticket
  const ticketData = localStorage.getItem("ticket");
  const movieIndex = ticketData ? +ticketData : 0;
  movieSelect.selectedIndex = movieIndex;
  // init seats
  const seatsData = localStorage.getItem("seats");
  const seatsSelected = seatsData ? JSON.parse(seatsData) : [];
  const seatsAvailable = [...seats];
  seatsAvailable.forEach((seat, index) => {
    if (seatsSelected.indexOf(index) > -1) {
      seat.classList.add("selected");
    }
  });
  // init price
  calculate();
};

initSeats();
