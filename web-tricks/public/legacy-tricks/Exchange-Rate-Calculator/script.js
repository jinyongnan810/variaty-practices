// pull doms
const currencyOne = document.getElementById("currency-one");
const numberOne = document.getElementById("number-one");
const currencyTwo = document.getElementById("currency-two");
const numberTwo = document.getElementById("number-two");
const swapBtn = document.getElementById("swap");
const rate = document.getElementById("rate");

// function
const calculate = () => {
  fetch(`https://api.exchangeratesapi.io/latest?base=${currencyOne.value}`)
    .then((res) => res.json())
    .then((data) => {
      numberTwo.value = (
        data["rates"][currencyTwo.value] * +numberOne.value
      ).toFixed(2);
      rate.innerText = `1${currencyOne.value} = ${
        data["rates"][currencyTwo.value]
      }${currencyTwo.value}`;
    });
};
const swap = () => {
  const currency1 = currencyOne.value;
  currencyOne.value = currencyTwo.value;
  currencyTwo.value = currency1;
};

// events
currencyOne.addEventListener("change", (e) => {
  calculate();
});
currencyTwo.addEventListener("change", (e) => {
  calculate();
});
numberOne.addEventListener("change", (e) => {
  calculate();
});
numberTwo.addEventListener("change", (e) => {
  calculate();
});
swapBtn.addEventListener("click", () => {
  swap();
  calculate();
});
calculate();
