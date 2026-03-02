const input = document.getElementById("input");
const choices = document.getElementById("choices");

input.addEventListener("input", () => {
  const text = input.value;
  choices.innerHTML = text
    .split(",")
    .map((choiceText) => {
      return `<div class="choice">${choiceText.trim()}</div>`;
    })
    .join("");
});

input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    // input.value = "";
    let times = 20;
    const choices = document.querySelectorAll(".choice");
    for (let i = 0; i < times; i++) {
      await new Promise((resolve) => {
        setTimeout(
          () => {
            resolve();
          },
          100 + i * 10,
        );
      });
      const randomChoice = Math.floor(Math.random() * choices.length);
      choices.forEach((choice, index) => {
        if (index === randomChoice) {
          choice.classList.add("highlighted");
        } else {
          choice.classList.remove("highlighted");
        }
      });
    }
    const finals = document.querySelectorAll(".choice.highlighted");
    finals.forEach((final) => {
      final.classList.add("checked");
    });
  }
});
