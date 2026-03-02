// pull doms
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const play = document.getElementById("play");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const musicContainer = document.getElementById("music-container");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
// fetch wangyiyun
const userId = "320236160";
const myList = "445516427";
let musicIds = [];
let currentSong = 0;
let previousSong = 0;
let stopFlag = false;

// functions
// fetch wangyi yun music
const fetchMusic = async () => {
  try {
    const preStored = JSON.parse(localStorage.getItem("music"));
    if (preStored) {
      musicIds = preStored;
    } else {
      const res = await fetch(
        `https://api.imjad.cn/cloudmusic/?type=playlist&id=${myList}&userid=${userId}`,
      );
      const data = await res.json();
      data.playlist.trackIds.forEach((track) => {
        const id = track.id;
        musicIds.push(id);
        // const title = `${track.name} - ${track.ar[0].name}`;
        // music[id] = {};
        // music[id]['title'] = title;
        // music[id]['cover'] = track.al.picUrl;
      });
      localStorage.setItem("music", JSON.stringify(musicIds));
    }

    setCurrentSong();
  } catch (error) {
    console.log(error);
  }
};
// set current song
const setCurrentSong = async (id) => {
  if (!id) {
    id = musicIds[Math.floor(musicIds.length * Math.random())];
  }
  currentSong = id;
  const res1 = await fetch(
    `https://api.imjad.cn/cloudmusic/?type=detail&id=${id}&userid=${userId}`,
  );
  const data1 = await res1.json();
  const song = data1.songs[0];
  const titleTxt = `${song.name} - ${song.ar[0].name}`;
  const coverTxt = song.al.picUrl;
  title.innerText = titleTxt;
  cover.src = coverTxt;
  cover.alt = titleTxt;

  const res2 = await fetch(
    `https://api.imjad.cn/cloudmusic/?type=song&id=${id}&userid=${userId}`,
  );
  const data2 = await res2.json();
  audio.src = data2.data[0].url;

  audio.play();
  musicContainer.classList.add("play");
  stopFlag = false;
  setTimeout(() => {
    !stopFlag ? setCurrentSong() : false;
  }, 1000);
};

// event listeners
play.addEventListener("click", (e) => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});
next.addEventListener("click", (e) => {
  previousSong = currentSong;
  setCurrentSong();
});
prev.addEventListener("click", (e) => {
  if (previousSong && previousSong != currentSong) {
    setCurrentSong(previousSong);
  }
});
audio.addEventListener("pause", (e) => {
  play.innerHTML = '<i class="fa fa-play"></i>';
  musicContainer.classList.remove("play");
});
audio.addEventListener("ended", (e) => {
  setCurrentSong();
});
audio.addEventListener("canplaythrough", (e) => {
  console.log("canplaythrough");
  //   setCurrentSong();
  stopFlag = true;
});
audio.addEventListener("play", (e) => {
  play.innerHTML = '<i class="fa fa-pause"></i>';
  musicContainer.classList.add("play");
});
audio.addEventListener("timeupdate", (e) => {
  progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
});
progressContainer.addEventListener("click", (e) => {
  const clickX = e.offsetX;
  const totalX = progressContainer.clientWidth;
  audio.currentTime = Math.floor(audio.duration * (clickX / totalX));
});
// init
fetchMusic();
