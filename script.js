let currentSong = new Audio();
let songs;
let currentFolder;

async function getSong(folder) {
  currentFolder = folder;
  let a = await fetch(`http://github.com/Arif3141/${folder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`http://github.com/Arif3141/${folder}/`)[1]);
    }
  }
  //show al the songs in play list
  let songul = document
    .querySelector(".songList")
    .getElementsByTagName("ol")[0];
  songul.innerHTML = " ";
  for (const song of songs) {
    songul.innerHTML += `<li>
    <img id="mu" class="invert" src="./img/music2.svg" alt="">
                            <div class="info">
                            <div id="son">${song.replaceAll("%20", " ")}</div>
                            <div>arif</div>
                        </div>
                                <span class="playnow">
                                    <span>Play Now</span>
                                    <img src="./img/play.svg" class="invert" alt="">
                                </span></li>`;
  }
  //attach eventListener to eachsong

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs 
}

const playMusic = (track, pause = false) => {
  currentSong.src = `http://github.com/Arif3141/${currentFolder}/` + track;
  if (!pause) {
    play.src = "./img/pause.svg";
    currentSong.play();
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function secondsToMinSec(seconds) {
  // Ensure input is a positive integer
  seconds = Math.max(0, parseInt(seconds, 10));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Pad with leading zeros if less than 10
  const paddedMins = mins < 10 ? "0" + mins : "" + mins;
  const paddedSecs = secs < 10 ? "0" + secs : "" + secs;

  return paddedMins + ":" + paddedSecs;
}

// Example usage:
// console.log(secondsToMinSec(12)); // "00:12"
// console.log(secondsToMinSec(130)); // "02:10"
// console.log(secondsToMinSec(3600)); // "60:00"

async function displayAlbums() {
  let a = await fetch(`https://github.com/Arif3141/spotify/tree/main/songs`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector('.cardContainer')
  let array = Array.from(anchors)
  for(let index = 0 ; index< array.length ; index++){
    const e = array[index]
  
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0]
      //get the metadata of a folder
      let a = await fetch(`https://github.com/Arif3141/spotify/tree/main/songs/${folder}/info.json`)
      let response  = await a.json()
      console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <img class="playSymble" src="./img/play-button.png" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h1>
                            <p>${response.description}</p>
                    </div>`
    }
  }
    //click on card
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSong(`songs/${item.currentTarget.dataset.folder}`);
       playMusic(songs[0])
    });
  });
}
async function main() {
  //Get the list
  await getSong("songs/ncs");
  playMusic(songs[0], true);
  // console.log(songs);

  //display all the albums on the page
  displayAlbums();
  //attach an event Listener to play ,next and previous

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./img/play.svg";
    }
  });

  //listen for timeupdate event

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinSec(
      currentSong.currentTime
    )}/${secondsToMinSec(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  //add an event listener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  //add event on hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //add event on close svg

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //add event on previous

  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1].replaceAll("%20", " "));
    }
  });

  //add event on next
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length - 1) {
      playMusic(songs[index + 1].replaceAll("%20", " "));
    }
  });

  //add event on sound

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log(e.target.value);
      currentSong.volume = parseInt(e.target.value) / 100;
    });

//add event listener to mute the track
document.querySelector('.volume>img').addEventListener('click', e => {
  // console.log(e.target)
  // console.log('changing', e.target.src)
  if(e.target.src.includes('volume.svg')){
    e.target.src = e.target.src.replace('volume.svg','mute.svg')
    currentSong.volume = 0
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0
  }
  else{
    e.target.src = e.target.src.replace('mute.svg','volume.svg')
    currentSong.volume = .30
    document.querySelector(".range").getElementsByTagName("input")[0].value = 30
  }
})
}
main();

