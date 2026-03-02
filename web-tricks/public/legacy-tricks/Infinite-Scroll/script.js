// pull doms
const filterEl = document.getElementById("filter");
const postContainer = document.getElementById("post-container");
const loader = document.getElementById("loader");

let currentPage = 1;
let postsPerPage = 5;
let loading = false;

// functions
function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

const fetchPosts = () => {
  loader.classList.add("show");
  loading = true;
  fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${postsPerPage}&_page=${currentPage}`,
  )
    .then((res) => res.json())
    .then((posts) => {
      posts.forEach((post, index) => {
        const newPost = htmlToElement(`
        <div class="post">
          <div class="number">${
            (currentPage - 1) * postsPerPage + 1 + index
          }</div>
          <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-body">
              ${post.body}
            </p>
          </div>
        </div>
          
          `);
        postContainer.insertBefore(newPost, loader);
      });
      loader.classList.remove("show");
      loading = false;
    });
};

// event listeners
document.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 5 &&
    !loading &&
    !filterEl.value
  ) {
    currentPage++;
    fetchPosts();
  }
});
filterEl.addEventListener("keydown", (e) => {
  const term = e.target.value.toLowerCase(0);
  document.querySelectorAll(".post").forEach((post) => {
    const title = post.querySelector(".post-title").innerText.toLowerCase();
    const body = post.querySelector(".post-body").innerText.toLowerCase();
    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  });
});
// init
fetchPosts();
