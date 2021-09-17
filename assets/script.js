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
      "id": 1,
      "title": "Leave Before You Love Me",
      "singer": "Marshmello, Jonas Brothers",
      "path": "./db/songs_database/Leave-Before-You-Love-Me-Marshmello-Jonas-Brothers.mp3",
      "img": "./db/thumbnails/leave_before_you_love_me.jpg"
    },
    {
      "id": 2,
      "title": "End Of Time",
      "singer": "K-391, Alan Walker, Ahrix",
      "path": "./db/songs_database/End-of-Time-K-391-Alan-Walker-Ahrix.mp3",
      "img": "./db/thumbnails/end_of_time.jpg"
    },
    {
      "id": 3,
      "title": "Beautiful Mistakes",
      "singer": "Maroon5, Megan Thee Stallion",
      "path": "./db/songs_database/Beautiful-Mistakes-Maroon-5-Megan-Thee-Stallion.mp3",
      "img": "./db/thumbnails/beautiful_mistakes.jpg"
    },
    {
      "id": 4,
      "title": "Wrap Me In Plastic",
      "singer": "CHROMANCE, Marcus Layton",
      "path": "./db/songs_database/Wrap-Me-In-Plastic-Marcus-Layton-Radio-Edit-CHROMANCE-Marcus-Layton.mp3",
      "img": "./db/thumbnails/wrap_me_in_plastic.jpg"
    },
    {
      "id": 5,
      "title": "Confetti",
      "singer": "Little Mix, Saweetie",
      "path": "./db/songs_database/Confetti-Little-Mix-Saweetie.mp3",
      "img": "./db/thumbnails/confetti.jpg"
    },
    {
      "id": 6,
      "title": "On My Way",
      "singer": "Alan Walker, Sabrina Carpenter, Farruko",
      "path": "./db/songs_database/On-My-Way-Alan-Walker-Sabrina-Carpenter-Farruko.mp3",
      "img": "./db/thumbnails/on_my_way.jpg"
    },
    {
      "id": 7,
      "title": "Rewrite The Stars",
      "singer": "James Arthur, Anne Marie",
      "path": "./db/songs_database/Rewrite-The-Stars-James-Arthur-Anne-Marie.mp3",
      "img": "./db/thumbnails/rewrite_the_stars.jpg"
    },
    {
      "id": 8,
      "title": "Slide Away",
      "singer": "Miley Cyrus",
      "path": "./db/songs_database/Slide-Away-Miley-Cyrus.mp3",
      "img": "./db/thumbnails/slide_away.jpg"
    },
    {
      "id": 9,
      "title": "Tomboy",
      "singer": "Destiny Rogers",
      "path": "./db/songs_database/Tomboy-Destiny-Rogers.mp3",
      "img": "./db/thumbnails/tomboy.jpg"
    },
    {
      "id": 10,
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
        _this.currentIndex = songChosen.getAttribute('data-index') - 1;
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
    this.songs.forEach((song) => {
      let li = document.createElement('li');
      let liHTML = `
        <div class="music__playlist-img" style="background-image: url(${song.img})"></div>
        <div class="music__playlist-details">
          <div class="music__playlist-title">${song.title}</div>
          <div class="music__playlist-singer">${song.singer}</div>
      `;
      li.innerHTML = liHTML;
      li.setAttribute('data-index', `${song.id}`)
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