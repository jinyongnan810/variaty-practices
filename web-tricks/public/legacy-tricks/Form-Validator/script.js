// pulling doms
const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("confirm-password");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // memo: first set all success,then check with reverse orders.
  setAllSuccess([username, email, password, passwordConfirm]);
  checkSame(password, passwordConfirm);
  checkEmail(email); // memo:type=email check some of it but not all.
  checkLength(username, 3, 15);
  checkLength(password, 6, 20);
  checkRequired([username, email, password, passwordConfirm]);
});

// set all success
const setAllSuccess = (inputs) => {
  inputs.forEach((input) => {
    // get parent
    const formControl = input.parentElement;
    // add class
    formControl.className = "form-control success";
  });
};
// show error message
const showAlert = (input, msg) => {
  // get parent
  const formControl = input.parentElement;
  // add class
  formControl.className = "form-control error";
  // set error message
  const small = formControl.querySelector("small");
  small.innerText = msg;
};
// show success input
const showSuccess = (input) => {
  // get parent
  const formControl = input.parentElement;
  // add class
  formControl.className = "form-control success";
};
// check required
const checkRequired = (inputs) => {
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      showAlert(input, `Please enter the ${input.id}.`);
    }
  });
};
// check length
const checkLength = (input, min, max) => {
  if (input.value.length < min) {
    showAlert(input, `${input.id} must be at least ${min} characters.`);
  } else if (input.value.length > max) {
    showAlert(input, `${input.id} must be at most ${max} characters.`);
  }
  console.log(input.value.length);
};
// check email
const checkEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email.value).toLowerCase()))
    showAlert(email, "Please enter a valid email.");
};
// check same
const checkSame = (input1, input2) => {
  if (input1.value !== input2.value) {
    showAlert(input1, `${input1.id} is not same with ${input2.id}`);
    showAlert(input2, `${input2.id} is not same with ${input1.id}`);
  }
};
