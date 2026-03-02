const aboutEl = document.getElementById("about");
const contactEl = document.getElementById("contact");
const aboutContentEl = document.getElementById("about-content");
const contactContentEl = document.getElementById("contact-content");

aboutEl.addEventListener("click", () => {
  const aboutBox = new WinBox({
    title: "About",
    // background: "#00aa00",
    // modal:true,
    width: "400px",
    height: "400px",
    top: 50,
    left: 50,
    right: 50,
    bottom: 50,
    mount: aboutContentEl,
    onfocus: function () {
      this.setBackground("#00aa00");
    },
    onblur: function () {
      this.setBackground("#777");
    },
  });
});
contactEl.addEventListener("click", () => {
  const contactBox = new WinBox({
    title: "Contact",
    // background: "#00aa00",
    // modal:true,
    width: "400px",
    height: "400px",
    top: 150,
    left: 150,
    right: 50,
    bottom: 50,
    mount: contactContentEl,
    onfocus: function () {
      this.setBackground("#00aa00");
    },
    onblur: function () {
      this.setBackground("#777");
    },
  });
});
