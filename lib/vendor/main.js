// Modified from https://github.com/kbhomes/google-music-mac/blob/v1.1.3/google-music-mac/js/main.js
// under MIT license

// Load in dependencies
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var extend = require('obj-extend');

// Define our GoogleMusic constructor
function GoogleMusic(win) {
  // Inherit from EventEmitter
  EventEmitter.call(this);

  // Save window and document for later
  this.win = win;
  this.doc = win.document;

  // Save media playback elements to prevent re-queries
  this._eplayPause = this.doc.querySelector('button[data-id="play-pause"]');
  this._eforward = this.doc.querySelector('button[data-id="forward"]');
  this._erewind = this.doc.querySelector('button[data-id="rewind"]');
  this._eshuffle = this.doc.querySelector('button[data-id="shuffle"]');
  this._erepeat = this.doc.querySelector('button[data-id="repeat"]');

  // Bind observers
  this.bindObservers();
}
util.inherits(GoogleMusic, EventEmitter);
extend(GoogleMusic.prototype, {
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
  toggleVisualization: function () {
    this.win.SJBpost('toggleVisualization');
  },

  bindObservers: function () {
    var lastTitle = '';
    var lastArtist = '';
    var lastAlbum = '';
    var that = this;

    var addObserver = new this.win.MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var target = m.addedNodes[i];
          var name = target.id || target.className;

          if (name == 'text-wrapper') {
            var now = new Date();

            var title = that.doc.querySelector('#playerSongTitle');
            var artist = that.doc.querySelector('#player-artist');
            var album = that.doc.querySelector('.player-album');
            var art = that.doc.querySelector('#playingAlbumArt');
            var duration = parseInt(that.doc.querySelector('#player #slider').getAttribute('aria-valuemax'), 10) / 1000;

            title = (title) ? title.innerText : 'Unknown';
            artist = (artist) ? artist.innerText : 'Unknown';
            album = (album) ? album.innerText : 'Unknown';
            art = (art) ? art.src : null;

            // The art may be a protocol-relative URL, so normalize it to HTTPS.
            if (art && art.slice(0, 2) === '//') {
              art = 'https:' + art;
            }

            // Make sure that this is the first of the notifications for the
            // insertion of the song information elements.
            if (lastTitle != title || lastArtist != artist || lastAlbum != album) {
              // TODO: Thoughts on Backbone app?
              that.emit('song:changed', {
                title: title,
                artist: artist,
                album: album,
                art: art,
                duration: duration
              });

              lastTitle = title;
              lastArtist = artist;
              lastAlbum = album;
            }
          }
        }
      });
    });

    addObserver.observe(that.doc.querySelector('#playerSongInfo'), {
      childList: true,
      subtree: true
    });
  }
});
module.exports = GoogleMusic;
