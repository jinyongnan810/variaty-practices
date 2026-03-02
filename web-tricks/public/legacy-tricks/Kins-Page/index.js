const MarkdownIt = require("markdown-it");
var hljs = require("highlight.js");
// pull doms
const headerEl = document.getElementById("header");
const sidebarEl = document.getElementById("sidebar");
const contentEl = document.getElementById("content");
const siteTitleEl = document.getElementById("site-title");
const sidebarArrowEl = document.getElementById("sidebar-arrow");
const sidebarContainerEl = document.getElementById("sidebar-container");

const bodyEl = document.getElementById("body");

// consts
const memoProvider = `https://firestore.googleapis.com/v1/projects/mymemo-98f76/databases/(default)/documents/memos?orderBy=updatedAt desc`;

// vars
let memos = [];
let memoEls = [];

// init theme
const checkTheme = () => {
  const date = new Date();
  const hour = date.getHours();
  if (hour > 6 && hour < 18) {
    bodyEl.classList.add("light");
  } else {
    bodyEl.classList.add("dark");
  }
  setTimeout(() => {
    checkTheme();
  }, 60000);
};
checkTheme();

// get initial memo
const showFirst = +window.location.search.replace(/\?id=/, "");

let md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (e) {}
    }

    return ""; // use external default escaping
  },
});

// functions
// fetch data
const fetchData = async () => {
  try {
    const res = await fetch(`${memoProvider}`);
    const data = await res.json();
    const documents = data["documents"];
    const memosParsed = documents.map((doc) => {
      return {
        id: doc["name"].toString().split("/").pop(),
        userId: doc["fields"]["userId"]["stringValue"],
        title: doc["fields"]["title"]["stringValue"],
        content: doc["fields"]["content"]["stringValue"],
        createdAt: Number.parseInt(
          doc["fields"]["createdAt"]["integerValue"].toString(),
        ),
        updatedAt: Number.parseInt(
          doc["fields"]["updatedAt"]["integerValue"].toString(),
        ),
      };
    });
    memos = memosParsed.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
  } catch (error) {
    console.log(error);
  }
};
// init
const init = async () => {
  await fetchData();
  initRenderer();
  if (memos.length == 0) return;

  memos.forEach((memo, index) => {
    // create dom
    const newEl = document.createElement("div");
    newEl.className = "title";
    newEl.id = `title-${memo.id}`;
    newEl.setAttribute("data-index", index);
    newEl.innerText = memo.title;
    memoEls.push(newEl);
    sidebarEl.appendChild(newEl);
    newEl.addEventListener("click", (e) => {
      setCurrent(memos[+e.target.getAttribute("data-index")]);
    });
  });
  if (showFirst) {
    let index = 0;
    memos.forEach((m, i) => {
      if (m.id == showFirst) {
        index = i;
      }
    });
    setCurrent(memos[index]);
  } else {
    setCurrent(memos[0]);
  }
};
// set current
const setCurrent = (memo) => {
  headerEl.innerText = memo.title;
  contentEl.innerHTML = md.render(memo.content);
  const pre = document.querySelector(".current");
  if (pre) pre.classList.remove("current");
  const current = document.getElementById(`title-${memo.id}`);
  current.classList.add("current");
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};
// init renderer
const initRenderer = () => {
  var defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrPush(["target", "_blank"]);
    return defaultRender(tokens, idx, options, env, self);
  };
};

// event handlers
siteTitleEl.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});
sidebarArrowEl.addEventListener("click", () => {
  if (sidebarContainerEl.classList.contains("open")) {
    sidebarContainerEl.classList.remove("open");
  } else {
    sidebarContainerEl.classList.add("open");
  }
});

window.addEventListener("scroll", (e) => {
  const isMinimum = window.scrollY > 250;
  const height = isMinimum ? 50 : 300 - window.scrollY;
  headerEl.style.height = `${height}px`;
  headerEl.style.lineHeight = `${height}px`;
  if (window.scrollY > 175) {
    const tmp = (300 - window.scrollY) * 0.8;
    const size = tmp > 35 ? tmp : 35;
    headerEl.style.fontSize = `${size}px`;
  } else {
    headerEl.style.fontSize = `100px`;
  }
});

// init
init();
