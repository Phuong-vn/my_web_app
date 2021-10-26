/* 
1. Render playlist                    -->   CHECK
2. Scroll                             -->   CHECK
3. Play / Pause / Seek                -->   CHECK
4. CD rotate                          -->   CHECK
5. Next / prev                        -->   CHECK
6. Random / Loop                      -->   CHECK
7. Next / Loop when ended             -->   CHECK
8. Active song                        -->   CHECK
9. Scroll active song to view         -->   CHECK
10. Play active song when clicked     -->   CHECK
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cdTitle = $('.music__name');
const cdThumb = $('.music__CD');
const progress = $('#progress');
const audio = $('audio');
const playlist = $('.music__playlist');


const playBtn = $('.play-pause-btn');
const prevBtn = $('.prev-btn');
const nextBtn = $('.next-btn');
const loopBtn = $('.loop-btn');
const randomBtn = $('.random-btn');


const musicApp = {
  songs: [
    {      
      "title": "Ghost",
      "singer": "Justin Bieber",
      "path": "./db/songs_database/2159643__Ghost__Justin Bieber__320.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/03/20/f/4/3/3/1616228351535_640.jpg"
    },
    {      
      "title": "Lạc",
      "singer": "Rhymastic",
      "path": "./db/songs_database/Lac - Rhymastic.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/singer/avatar/2019/10/01/d/7/6/8/1569917056188_600.jpg"
    },
    {      
      "title": "Leave Before You Love Me",
      "singer": "Marshmello ft Jonas Brother",
      "path": "./db/songs_database/Leave-Before-You-Love-Me-Marshmello-Jonas-Brothers.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/05/21/c/1/6/7/1621571817629_640.jpg"
    },
    {      
      "title": "Only",
      "singer": "Lee Hi",
      "path": "./db/songs_database/Only - Lee Hi.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/08/27/1/4/2/5/1630071516480_640.jpg"
    },
    {      
      "title": "Money",
      "singer": "Lisa",
      "path": "./db/songs_database/Money - Lisa.mp3",
      "img": "https://ss-images.saostar.vn/w800/pc/1632303136281/saostar-wq06pq6j93h5lmpg.png"
    },
    {      
      "title": "Shivers",
      "singer": "Ed Sheeran",
      "path": "./db/songs_database/Shivers - Ed Sheeran.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/09/09/f/c/f/d/1631175994771_640.jpg"
    },
    {      
      "title": "Strawberry moon",
      "singer": "IU",
      "path": "./db/songs_database/Strawberry Moon - IU.mp3",
      "img": "https://fb-images.saostar.vn/wp700/pc/1634995055040/saostar-j2jk3ps6e9q4myie.jpg"
    },
    {      
      "title": "Wrap Me In Plastic",
      "singer": "CHROMANCE, Marcus Layton",
      "path": "./db/songs_database/Wrap-Me-In-Plastic-Marcus-Layton-Radio-Edit-CHROMANCE-Marcus-Layton.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2020/12/02/9/c/a/1/1606899906741_640.jpg"
    },
    {      
      "title": "Tomboy",
      "singer": "Destiny Rogers",
      "path": "./db/songs_database/Tomboy-Destiny-Rogers.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/playlist/2019/03/26/4/b/2/a/1553590465464_500.jpg"
    },
    {      
      "title": "Yêu 5",
      "singer": "Rhymastic",
      "path": "./db/songs_database/Yeu 5 - Rhymastic.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2017/11/27/7/d/1/c/1511770260582_640.jpg"
    }
  ],

  isPlaying: false,
  isLoop: false,
  isRandom: false,
  currentIndex: 0,

  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex]
      }
    })
  },

  handleEvent: function() {
    let _this = this;
    // Update current song
    audio.setAttribute('src', this.currentSong.path);
    
    // Handle play/pause button on click -> audio play/pause
    playBtn.onclick = () => _this.isPlaying ? audio.pause() : audio.play();

    // Handle audio on play -> play/pause button & spin CD
    audio.onplay = function () {
      _this.isPlaying = true;
      playBtn.classList.add('playing');
      _this.CDThumbAnimate.play();
    }
    
    // Handle audio on pause -> play/pause button & spin CD
    audio.onpause = function () {
      _this.isPlaying = false;
      playBtn.classList.remove('playing');
      _this.CDThumbAnimate.pause();
    }
    
    // Handel audio on time update -> progress bar
    audio.ontimeupdate = function() {
      progress.value = (this.currentTime / audio.duration) * 100;
    }
    progress.onchange = function() {
      let seekTime = (this.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    }
    
    // Handle previous button on click -> previous audio
    prevBtn.onclick = () =>  _this.isRandom ? _this.nextSongInSuffle() : _this.prevSong();
    
    // Handle next button on click or music has ended ->  next audio
    nextBtn.onclick = () => _this.isRandom ? _this.nextSongInSuffle() : _this.nextSong();    
    audio.onended = () => _this.isRandom ? _this.nextSongInSuffle() : _this.nextSong();

    // Handle loop button on click -> loop audio
    loopBtn.onclick = function() {
      _this.isLoop = !_this.isLoop
      this.classList.toggle('active');
      audio.loop = _this.isLoop;
    }

    // Handle suffle button -> suffle playlist
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active');
    }

    // Handle clicking song -> active song
    playlist.onclick = function(e) {
      let songChosen = e.target.closest(".music__playlist li:not(.active)");
      if (songChosen) {
        _this.currentIndex = Number(songChosen.dataset.index);
        audio.setAttribute('src', _this.currentSong.path);
        _this.renderHeader();
        _this.activeCurrentSong();
        _this.isPlaying = true;
        playBtn.classList.add('playing');
        audio.play();
      }
    }
  },

  // Spin the CD -> Object
  CDThumbAnimate: cdThumb.animate([
    {transform: "rotate(360deg)"}
  ], {
    duration: 10000,
    iterations: Infinity
  }),  

  renderHeader: function() {
    // Render header
    cdTitle.innerHTML = this.currentSong.title;
    cdThumb.setAttribute('style', `background-image: url(${this.currentSong.img})`);
    this.isPlaying ? this.CDThumbAnimate.play() : this.CDThumbAnimate.pause();
  },

  renderPlaylist: function() {
    // Render playlist
    this.songs.forEach((song, index) => {
      let li = document.createElement('li');
      let liHTML = `
        <div class="music__playlist-img" style="background-image: url(${song.img})"></div>
        <div class="music__playlist-details">
          <div class="music__playlist-title">${song.title}</div>
          <div class="music__playlist-singer">${song.singer}</div>
      `;
      li.innerHTML = liHTML;
      li.setAttribute('data-index', `${index}`)
      playlist.appendChild(li);
    })    
  },

  activeCurrentSong: function() {
    // Remove 'active' in another song
    let anotherSong = $('.music__playlist li.active');
    if (anotherSong) anotherSong.classList.remove('active');

    // Active current song
    let activeSong = $$('.music__playlist li')[this.currentIndex]; 
    activeSong.scrollIntoView({behavior: 'smooth'});
    return activeSong.classList.add('active');
  },

  prevSong: function() {
    // Setting current index
    this.currentIndex == 0 ? this.currentIndex = this.songs.length - 1 : this.currentIndex -= 1;
    
    // Playing
    audio.setAttribute('src', this.currentSong.path);
    this.renderHeader();
    this.activeCurrentSong();
    this.isPlaying = true;
    audio.play();
  },

  nextSong: function() {
    // Setting current index
    this.currentIndex == this.songs.length - 1 ? this.currentIndex = 0 : this.currentIndex += 1;
    
    // Playing    
    audio.setAttribute('src', this.currentSong.path);
    this.renderHeader();
    this.activeCurrentSong();
    this.isPlaying = true;
    audio.play();
  },
  
  nextSongInSuffle: function() {
    // Setting current index    
    let newIndex = Math.floor(Math.random() * this.songs.length);
    while (newIndex === this.currentIndex) {
      newIndex = Math.floor(Math.random() * this.songs.length)
    }
    this.currentIndex = newIndex;
        
    // Playing    
    audio.setAttribute('src', this.currentSong.path);
    this.renderHeader();
    this.activeCurrentSong();
    this.isPlaying = true;
    audio.play();
  },

  start: function() {
    // Defining new properties of this object
    this.defineProperties();

    // Handling all event in DOM
    this.handleEvent();

    // Rendering CD thumb and song title
    this.renderHeader();

    // Rendering playlist
    this.renderPlaylist();
    this.activeCurrentSong();
  }
}
musicApp.start();