// pull doms
const form = document.getElementById("form");
const searchEl = document.getElementById("search");
const resultEl = document.getElementById("result");
const moreEl = document.getElementById("more");
const lyricEl = document.getElementById("lyric");
const lyricContainer = document.getElementById("lyric-container");

// functions
const searchSongs = async (term, url) => {
  const res = await fetch(
    url
      ? `https://cors-anywhere.herokuapp.com/${url}`
      : `https://api.lyrics.ovh/suggest/${term}`,
  );
  const data = await res.json();
  const songs = data.data;
  const total = data.total;
  const nextUrl = data.next;
  const prevUrl = data.prev;
  showData(songs, total, nextUrl, prevUrl);
};
const showData = (songs, total, nextUrl, prevUrl) => {
  const ulDom = document.createElement("ul");
  ulDom.className = "songs";
  ulDom.innerHTML = songs
    .map(
      (song) => `
        <li><span><strong>${song.artist.name}</strong> - ${song.title}</span><button class="btn" data-artist="${song.artist.name}" data-title="${song.title}">Show Lyrics</button></li>
    `,
    )
    .join("");
  resultEl.innerHTML = ulDom.outerHTML;
  if (nextUrl || prevUrl) {
    moreEl.innerHTML = `
        ${
          prevUrl
            ? `<button class="btn" onclick="searchSongs('','${prevUrl}')">Previous</button>`
            : ""
        }
        ${
          nextUrl
            ? `<button class="btn" onclick="searchSongs('','${nextUrl}')">Next</button>`
            : ""
        }
      `;
  } else {
    moreEl.innerHTML = "";
  }
};
const getLyrics = async (artist, title) => {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  lyricEl.innerHTML = `<h2><strong>${artist}</strong> - ${title}</h2>
    <span>${lyrics}</span>
  `;
  lyricContainer.style.display = "flex";
};

// event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = searchEl.value.trim();
  if (term) {
    searchSongs(term);
  }
});
resultEl.addEventListener("click", (e) => {
  const el = e.target;
  if (el.tagName === "BUTTON") {
    const artist = el.getAttribute("data-artist");
    const title = el.getAttribute("data-title");
    getLyrics(artist, title);
  }
});
lyricContainer.addEventListener("click", (e) => {
  if (e.target == lyricContainer) {
    lyricContainer.style.display = "none";
  }
});
