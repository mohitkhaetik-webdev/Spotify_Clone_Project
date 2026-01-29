console.log("let's write javascript");
let currentAudio = new Audio();
let currentIndex = 0;
let songs = [];
function secondsToMMSS(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// async function getsongs() {
//     let a = await fetch("http://127.0.0.1:3000/songs/")
//     let response = await a.text();
//     console.log(response)
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as=div.getElementsByTagName("a")
//     let songs=[]
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if(element.href.endsWith(".mp3")){
//             songs.push(element.href)
//         }
//     }
//    return songs
// }
// async function main(){
//     //Get the list of all the songs
//  let songs= await getsongs()
// console.log(songs); 
// let songUL=document.querySelector(".songlist").getElementsByTagName("ol")[0]
// for (const song of songs) { 
//     songUL.innerHTML=songUL.innerHTML+`<li>${song.replaceAll('%20',"").split('%5Csongs%5C')[1]}</li>`;
// }
// //play the first song
// var audio = new Audio(songs[1]);
// audio.play()
// audio.addEventListener("loadeddata", () => {
//   console.log(audio.duration, audio.currentTime, audio.currentSrc);
//   // The duration variable now holds the duration (in seconds) of the audio clip
// });
// }
// main()


async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/")
  const response = await a.text();
  console.log(response)
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3"))
      songs.push(element.href)

  }
  return songs

}
getsongs()


const playmusic = (songURL) => {
  currentAudio.pause();
  currentAudio.src = songURL;
  currentAudio.play()
  play.classList.remove("hgi-play")
  play.classList.add("hgi-pause")


};

async function main() {



  //Get the list of all the songs   

  songs = await getsongs()
  console.log(songs)
  let songUi = document.querySelector(".songlist").getElementsByTagName("ol")[0]
  for (const song of songs) {
    songUi.innerHTML = songUi.innerHTML + `   <li data-song="${song}">
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", "").split("%5Csongs%5C")[1]}</div>
                            <div></div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="playnow.svg" alt="">
                        </div>
                    </li>`;
  }

  //Attach an event listener to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(li => {
    li.addEventListener('click', () => {
      currentIndex = songs.indexOf(li.dataset.song); // ⭐ KEY LINE
      playmusic(li.dataset.song);
      document.querySelector(".songinfo").innerHTML = li.querySelector('.info').firstElementChild.innerHTML

      document.querySelector(".songtime").innerHTML = '00:00/00:00'


      localStorage.setItem("lastSongSrc", currentAudio.src);
      localStorage.setItem(
        "lastSongName",
        document.querySelector(".songinfo").innerText
      );
    })


  })
  // play the first song
  play.addEventListener("click", () => {
    if (currentAudio.paused) {
      currentAudio.play()
      play.classList.remove("hgi-play")
      play.classList.add("hgi-pause")
    } else {
      currentAudio.pause()
      play.classList.remove("hgi-pause")
      play.classList.add("hgi-play")
    }
  })


  //listen for timeupdate event

  currentAudio.addEventListener("timeupdate", () => {
    if (isNaN(currentAudio.duration)) return;

    let currentTime = secondsToMMSS(currentAudio.currentTime);
    let totalTime = secondsToMMSS(currentAudio.duration);

    document.querySelector(".songtime").innerText =
      `${currentTime} / ${totalTime}`;
    document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%"
  });
  //add an event listener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";

    currentAudio.currentTime = ((currentAudio.duration) * percent) / 100
  })



  const lastSongSrc = localStorage.getItem("lastSongSrc");
  const lastSongName = localStorage.getItem("lastSongName");

  if (lastSongSrc && lastSongName) {
    currentAudio.src = lastSongSrc;
    document.querySelector(".songinfo").innerText = lastSongName;
    currentAudio.load();
  }

  currentAudio.addEventListener("loadedmetadata", () => {
    if (isNaN(currentAudio.duration)) return;

    let totalTime = secondsToMMSS(currentAudio.duration);

    document.querySelector(".songtime").innerText =
      `00:00 / ${totalTime}`;

  });
  //add event listener for hamburger
  document.querySelector('#hamburger').addEventListener("click", () => {
    document.querySelector('.left-border').style.left = "0"
  })

  //add event listener for cross
  document.querySelector('#cross').addEventListener("click", () => {
    document.querySelector('.left-border').style.left = "-100%"
  })

  //add an eventg listener for previous 

  document.getElementById("previous").addEventListener("click", () => {
    if (currentIndex <= 0) {
      currentIndex = songs.length - 1;
    } else {
      currentIndex--;
    }

    playmusic(songs[currentIndex]);
    updateSongInfo();
  });

  //for next
  next.addEventListener(('click'), () => {
    if (currentIndex >= songs.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }

    playmusic(songs[currentIndex]);
    updateSongInfo();
  });



  // updatesonginfo
  function updateSongInfo() {
    let songName = decodeURIComponent(
      songs[currentIndex].split("%5Csongs%5C").pop().replace(".mp3", "")
    );
    document.querySelector(".songinfo").innerText = songName;
  }




  // auto play when  songs ends
  currentAudio.addEventListener("ended", () => {
    currentIndex++;

    if (currentIndex >= songs.length) {
      currentIndex = 0;
    }

    playmusic(songs[currentIndex]);
    updateSongInfo();
  });


  //add an event listener to vseekbar
  function setvolume(percent) {
    currentAudio.volume = percent;
  }


  let vseekbar = document.querySelector(".vseekbar")
  vseekbar.addEventListener('click', (e) => {

    let percent = e.offsetX / vseekbar.clientWidth

    //circlemove
    document.querySelector(".vseekcircle").style.left = (percent * 100) + "%"

    // console.log(e.offsetX,e.target.clientWidth);
    // you can use this insteadof e.offsetX/e.target.getBoundingClientRect().width

    //setvolume
    setvolume(percent)

    let vol = Math.min(Math.max(percent, 0), 1);


    if (currentAudio.muted) {

      lastvolume = vol;          // ✅ just save volume
      document.querySelector(".vseekcircle").style.left = `${vol * 100}%`;
    } else {
      applyvolume(vol);          // ✅ normal case
    }




  })
  setvolume(0.3);
  document.querySelector(".vseekcircle").style.left = "30%"




  //add mute and unmute volume
  let speaker = document.querySelector("#speaker")
  let lastvolume = 0.3;

  // let lastseekbar = "30%"

  speaker.addEventListener('click', () => {
    if (currentAudio.muted) {
      //unmute
      currentAudio.muted = false;
      applyvolume(lastvolume);
      // currentAudio.volume = lastvolume;
      // document.querySelector(".vseekcircle").style.left = lastseekbar;
      speaker.classList.remove('hgi-volume-off')
      speaker.classList.add('hgi-volume-high')
      // setvolume(0.3);
      // document.querySelector(".vseekcircle").style.left = "30%" 

    }
    else {

      //mute
      lastvolume = currentAudio.volume;
      currentAudio.muted = true;


      speaker.classList.remove('hgi-volume-high')
      speaker.classList.add('hgi-volume-off')

      // document.querySelector(".vseekcircle").style.left = "0%"
      // lastvolume = currentAudio.volume
      // lastseekbar = document.queryselector(".vseekcircle").style.left
    }

    console.log(speaker)



  })

  function applyvolume(vol) {
    currentAudio.volume = vol;
    document.querySelector(".vseekcircle").style.left = `${vol * 100}%`
  }

  const spotifyPlayer = document.getElementById("spotifyPlayer");

  document.querySelectorAll(".greenplayspotify").forEach(card => {
    card.addEventListener("click", () => {
      if (card.dataset.noiframe === "true") {
        return //it mean that card
      }
      spotifyPlayer.src = card.dataset.spotify
        ;
      spotifyPlayer.hidden = false;
    });
  })



  //create audio for cardsongs
  document.querySelectorAll(".greenplayspotify").forEach(card=>{card.addEventListener("click", () => {
    currentAudio.pause();
    currentAudio.src = card.dataset.song;
    let songname = currentAudio.src.replaceAll("%20", "").split("/songsforcard/")[1]
    play.classList.remove("hgi-play")
    play.classList.add("hgi-pause")
    console.log(songname)
    currentAudio.play();
    document.querySelector(".songinfo").innerHTML = songname
    localStorage.setItem("lastSongSrc", currentAudio.src);
    localStorage.setItem("lastSongName", songname);
    document.querySelector(".songtime").innerHTML = '00:00/00:00'

    currentAudio.addEventListener("timeupdate", () => {
      if (isNaN(currentAudio.duration)) return;

      let currentTime = secondsToMMSS(currentAudio.currentTime);
      let totalTime = secondsToMMSS(currentAudio.duration);
      let currentIndex = 5;
      document.querySelector(".songtime").innerText =
        `${currentTime} / ${totalTime}`;
      document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%"
 
    });


  })
  })


  console.log();


}



//for previous

// let index = songs.indexOf(currentAudio.src)
// if ((index + 1) >=songs.length) {
//   index=0
// } else
// playmusic(songs[index + 1])



main()
