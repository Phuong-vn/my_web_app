/* 
1. Render playlist                    -->   CHECK
2. Scroll                             -->   CHECK
3. Play / Pause / Seek                -->   CHECK
4. CD rotate                          -->   UNCHECK
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
      "title": "Độ Tộc 2",
      "singer": "Độ Mixi, Phúc Du, Pháo, Masew",
      "path": "./db/songs_database/Do Toc 2 - Do Mixi_ Phuc Du_ Phao_ Masew.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/share/2021/08/10/f/b/e/5/1628579602057.jpg"
    },
    {      
      "title": "Don't Go",
      "singer": "Skrillex, Justin Bieber, Don",
      "path": "./db/songs_database/Don_t Go - Skrillex_ Justin Bieber_ Don.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/08/20/f/c/f/e/1629439093883_640.jpg"
    },
    {      
      "title": "Lalisa",
      "singer": "Lisa",
      "path": "./db/songs_database/Lalisa - Lisa.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/share/2021/09/10/3/9/c/0/1631247722289.jpg"
    },
    {      
      "title": "Only",
      "singer": "Lee Hi",
      "path": "./db/songs_database/Only - Lee Hi.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/08/27/1/4/2/5/1630071516480_640.jpg"
    },
    {      
      "title": "Running Out Of Roses",
      "singer": "Alan Walker, Jami",
      "path": "./db/songs_database/Running Out Of Roses - Alan Walker_ Jami.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/playlist/2021/09/10/e/8/4/0/1631266564378_500.jpg"
    },
    {      
      "title": "Shivers",
      "singer": "Ed Sheeran",
      "path": "./db/songs_database/Shivers - Ed Sheeran.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/09/09/f/c/f/d/1631175994771_640.jpg"
    },
    {      
      "title": "Stay",
      "singer": "The Kid LAROI, Justin Bieber",
      "path": "./db/songs_database/Stay - The Kid LAROI_ Justin Bieber.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2021/07/09/5/5/8/2/1625815274622_500.jpg"
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
      "title": "Watermelon Sugar",
      "singer": "Harry Styles",
      "path": "./db/songs_database/Watermelon-Sugar-Harry-Styles.mp3",
      "img": "https://avatar-ex-swe.nixcdn.com/song/2019/11/18/b/0/e/0/1574042256777_640.jpg"
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

    // Handle audio on play -> play/pause button
    audio.onplay = function () {
      _this.isPlaying = true;
      playBtn.classList.add('playing');
    }

    // Handle audio on pause -> play/pause button
    audio.onpause = function () {
      _this.isPlaying = false;
      playBtn.classList.remove('playing');
    }
    
    // Handel audio on time update -> progress bar
    audio.ontimeupdate = function() {
      progress.value = this.currentTime;
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
        _this.currentIndex = songChosen.dataset.index;
        audio.setAttribute('src', _this.currentSong.path);
        _this.renderHeader();
        _this.activeCurrentSong();
        _this.isPlaying = true;
        playBtn.classList.add('playing');
        audio.play();
      }
    }
  },

  renderHeader: function() {
    // Render header
    cdTitle.innerHTML = this.currentSong.title;
    cdThumb.setAttribute('style', `background-image: url(${this.currentSong.img})`);
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