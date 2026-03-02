const topBar = document.querySelector("#top-bar");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const downPayment = document.querySelector("#down-payment");
const monthlyPayment = document.querySelector("#monthly-payment");

let exteriorColorSelected = "Stealth Grey";
let performanceWheelSelected = false;
let fullSelfDrivingSelected = false;
let performancePackageSelected = false;
let centerConsoleSelected = false;
let sunshadeSelected = false;
let allWeatherInteriorSelected = false;

// image mappings
const exteriorImages = {
  "Stealth Grey": "./images/model-y-stealth-grey.jpg",
  Quicksilver: "./images/model-y-quicksilver.jpg",
  "Deep Blue Metallic": "./images/model-y-deep-blue-metallic.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
};
const exteriorImagesWithPerformance = {
  "Stealth Grey": "./images/model-y-stealth-grey-performance.jpg",
  Quicksilver: "./images/model-y-quicksilver-performance.jpg",
  "Deep Blue Metallic": "./images/model-y-deep-blue-metallic-performance.jpg",
  "Ultra Red": "./images/model-y-ultra-red-performance.jpg",
  "Pearl White": "./images/model-y-pearl-white-performance.jpg",
  "Solid Black": "./images/model-y-solid-black-performance.jpg",
};
const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};

// topbar on scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

// requestAnimationFrame for better performance
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));

// update exterior image
const updateExteriorImage = () => {
  exteriorImage.src = performanceWheelSelected
    ? exteriorImagesWithPerformance[exteriorColorSelected]
    : exteriorImages[exteriorColorSelected];
};

// select exterior color
const exteriorButtons = document.querySelector("#exterior-buttons");
exteriorButtons.addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;
  exteriorButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("btn-selected", button === target);
  });
  const color = target.querySelector("img").alt;
  console.log(color);
  exteriorColorSelected = color;
  updateExteriorImage();
});

// select interior color
const interiorButtons = document.querySelector("#interior-buttons");
interiorButtons.addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;
  interiorButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("btn-selected", button === target);
  });
  const color = target.querySelector("img").alt;
  console.log(color);
  interiorImage.src = interiorImages[color];
});

// wheel performance
const wheelButtons = document.querySelector("#wheel-buttons");
wheelButtons.addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;
  wheelButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("bg-gray-700", button === target);
    button.classList.toggle("text-white", button === target);
    button.classList.toggle("bg-gray-200", button !== target);
    button.classList.toggle("hover:text-white", button !== target);
  });
  performanceWheelSelected = target.getAttribute("data-type") === "performance";
  updateExteriorImage();
  calculateTotalPrice();
});

// full self driving
const fullSelfDriving = document.querySelector("#full-self-driving-checkbox");
fullSelfDriving.addEventListener("click", (e) => {
  fullSelfDrivingSelected = !fullSelfDrivingSelected;
  calculateTotalPrice();
});

// performance package
const performancePackage = document.querySelector("#performance-package");
performancePackage.addEventListener("click", (e) => {
  performancePackageSelected = !performancePackageSelected;
  calculateTotalPrice();
  if (performancePackageSelected) {
    performancePackage.classList.remove("bg-gray-200", "hover:text-white");
    performancePackage.classList.add("bg-gray-700", "text-white");
  } else {
    performancePackage.classList.remove("bg-gray-700", "text-white");
    performancePackage.classList.add("bg-gray-200", "hover:text-white");
  }
});

// accessories
const centerConsoleTrays = document.querySelector("#center-console-trays");
centerConsoleTrays.addEventListener("click", (e) => {
  centerConsoleSelected = !centerConsoleSelected;
  calculateTotalPrice();
});
const sunshade = document.querySelector("#sunshade");
sunshade.addEventListener("click", (e) => {
  sunshadeSelected = !sunshadeSelected;
  calculateTotalPrice();
});
const allWeatherInterior = document.querySelector(
  "#all-weather-interior-liners",
);
allWeatherInterior.addEventListener("click", (e) => {
  allWeatherInteriorSelected = !allWeatherInteriorSelected;
  calculateTotalPrice();
});

// total price
const totalPrice = document.querySelector("#total-price");
const calculateTotalPrice = () => {
  let total = 52490;
  if (performanceWheelSelected) total += 2500;
  if (fullSelfDrivingSelected) total += 8500;
  if (performancePackageSelected) total += 5000;
  if (centerConsoleSelected) total += 35;
  if (sunshadeSelected) total += 105;
  if (allWeatherInteriorSelected) total += 225;
  totalPrice.textContent = `$${total.toLocaleString()}`;

  const down = total * 0.1;
  downPayment.textContent = `$${down.toLocaleString()}`;

  const loanTermMonths = 60;
  const interestRate = 0.03;
  const loanAmount = total - down;
  const monthlyInterestRate = interestRate / 12;
  const monthly =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
  console.log(monthly);
  monthlyPayment.textContent = `$${monthly.toFixed(2).toLocaleString()}`;
};
calculateTotalPrice();
