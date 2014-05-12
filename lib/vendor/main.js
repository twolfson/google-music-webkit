// Modified from https://github.com/kbhomes/google-music-mac/blob/v1.1.3/google-music-mac/js/main.js
// under MIT license
function GoogleMusic(win) {
  this.win = win;
  this.doc = win.document;
}
GoogleMusic.prototype = {
  // References to the media playback elements.
  get _eplayPause () { return this.doc.querySelector('button[data-id="play-pause"]'); },
  get _eforward () { return this.doc.querySelector('button[data-id="forward"]'); },
  get _erewind () { return this.doc.querySelector('button[data-id="rewind"]'); },
  get _eshuffle () { return this.doc.querySelector('button[data-id="shuffle"]'); },
  get _erepeat () { return this.doc.querySelector('button[data-id="repeat"]'); },

  // Repeat modes.
  LIST_REPEAT: 'LIST_REPEAT',
  SINGLE_REPEAT: 'SINGLE_REPEAT',
  NO_REPEAT: 'NO_REPEAT',

  // Shuffle modes.
  ALL_SHUFFLE: 'ALL_SHUFFLE',
  NO_SHUFFLE: 'NO_SHUFFLE',

  // Playback functions.
  playPause: function () {
    this._eplayPause.click();
  },
  forward: function () {
    this._eforward.click();
  },
  rewind: function () {
    this._erewind.click();
  },

  getShuffle: function () {
    return this._eshuffle.value;
  },
  toggleShuffle: function () {
    this._eshuffle.click();
  },

  getRepeat: function () {
    return this._erepeat.value;
  },

  changeRepeat: function (mode) {
    if (!mode) {
      // Toggle between repeat modes once.
      this._erepeat.click();
    } else {
      // Toggle between repeat modes until the desired mode is activated.
      while (this.getRepeat() !== mode) {
        this._erepeat.click();
      }
    }
  },

  // Taken from the Google Play Music page.
  toggleVisualization: function() {
    this.win.SJBpost('toggleVisualization');
  }
};
  //     var lastTitle = "";
  //     var lastArtist = "";
  //     var lastAlbum = "";

  //     var addObserver = new MutationObserver(function(mutations) {
  //         mutations.forEach(function(m) {
  //             for (var i = 0; i < m.addedNodes.length; i++) {
  //                 var target = m.addedNodes[i];
  //                 var name = target.id || target.className;

  //                 if (name == 'text-wrapper')  {
  //                     var now = new Date();

  //                     var title = doc.querySelector('#playerSongTitle');
  //                     var artist = doc.querySelector('#player-artist');
  //                     var album = doc.querySelector('.player-album');
  //                     var art = doc.querySelector('#playingAlbumArt');
  //                     var duration = parseInt(doc.querySelector('#player #slider').getAttribute('aria-valuemax')) / 1000;

  //                     title = (title) ? title.innerText : 'Unknown';
  //                     artist = (artist) ? artist.innerText : 'Unknown';
  //                     album = (album) ? album.innerText : 'Unknown';
  //                     art = (art) ? art.src : null;

  //                     // The art may be a protocol-relative URL, so normalize it to HTTPS.
  //                     if (art && art.slice(0, 2) === '//') {
  //                         art = 'https:' + art;
  //                     }

  //                     // Make sure that this is the first of the notifications for the
  //                     // insertion of the song information elements.
  //                     if (lastTitle != title || lastArtist != artist || lastAlbum != album) {
  //                         // TODO: Emit event
  //                         // win.GoogleMusicApp.notifySong(title, artist, album, art, duration);

  //                         lastTitle = title;
  //                         lastArtist = artist;
  //                         lastAlbum = album;
  //                     }
  //                 }
  //             }
  //         });
  //     });

  //     var playbackObserver = new MutationObserver(function(mutations) {
  //         mutations.forEach(function(m) {
  //             var target = m.target;
  //             var id = target.dataset.id;

  //             if (id == 'play-pause') {
  //                 var playing = target.classList.contains('playing');
  //                 // TODO: Emit event
  //                 // win.GoogleMusicApp.playbackChanged(playing ? 1 : 0);
  //             }
  //         });
  //     });


  //     addObserver.observe(doc.querySelector('#playerSongInfo'), { childList: true, subtree: true });
  //     playbackObserver.observe(doc.querySelector('#player button[data-id="play-pause"]'), { attributes: true });
  // }
module.exports = GoogleMusic;
