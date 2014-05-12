/*
 * js/main.js
 *
 * This script is part of the JavaScript interface used to interact with
 * the Google Play Music page, in order to provide notifications functionality.
 *
 * Created by Sajid Anwar.
 *
 * Subject to terms and conditions in LICENSE.md.
 *
 */

// This check ensures that, even though this script is run multiple times, our code is only attached once.
function bindToWindow(win) {
    var doc = win.document;
    if (typeof win.MusicAPI === 'undefined') {
        var MusicAPI = win.MusicAPI = {};

        /* Set up for Safari versions less than 7. */
        var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;

        /* Create a volume API. */
        win.MusicAPI.Volume = {

            // A reference to the volume slider element.
            slider: doc.querySelector('#vslider'),

            // Get the current volume level.
            getVolume: function() {
                return parseInt(win.MusicAPI.Volume.slider.getAttribute('aria-valuenow'));
            },

            // Set the volume level (0 - 100).
            setVolume: function(vol) {
                var current = win.MusicAPI.Volume.getVolume();

                if (vol > current) {
                    win.MusicAPI.Volume.increaseVolume(vol - current);
                }
                else if (vol < current) {
                    win.MusicAPI.Volume.decreaseVolume(current - vol);
                }
            },

            // Increase the volume by an amount (default of 1).
            increaseVolume: function(amount) {
                if (typeof amount === 'undefined')
                    amount = 1;

                for (var i = 0; i < amount; i++) {
                    win.Keyboard.sendKey(win.MusicAPI.Volume.slider, win.Keyboard.KEY_UP);
                }
            },

            // Decrease the volume by an amount (default of 1).
            decreaseVolume: function(amount) {
                if (typeof amount === 'undefined')
                    amount = 1;

                for (var i = 0; i < amount; i++) {
                    win.Keyboard.sendKey(win.MusicAPI.Volume.slider, win.Keyboard.KEY_DOWN);
                }
            }
        };

        /* Create a playback API. */
        win.MusicAPI.Playback = {

            // References to the media playback elements.
            _eplayPause:  doc.querySelector('button[data-id="play-pause"]'),
            _eforward:    doc.querySelector('button[data-id="forward"]'),
            _erewind:     doc.querySelector('button[data-id="rewind"]'),
            _eshuffle:    doc.querySelector('button[data-id="shuffle"]'),
            _erepeat:     doc.querySelector('button[data-id="repeat"]'),

            // Repeat modes.
            LIST_REPEAT:    'LIST_REPEAT',
            SINGLE_REPEAT:  'SINGLE_REPEAT',
            NO_REPEAT:      'NO_REPEAT',

            // Shuffle modes.
            ALL_SHUFFLE:    'ALL_SHUFFLE',
            NO_SHUFFLE:     'NO_SHUFFLE',

            // Time functions.
            getPlaybackTime: function() {
                return parseInt(slider.getAttribute('aria-valuenow'));
            },

            setPlaybackTime: function(milliseconds) {
                var percent = milliseconds / parseFloat(slider.getAttribute('aria-valuemax'));
                var lower = slider.offsetLeft + 6;
                var upper = slider.offsetLeft + slider.clientWidth - 6;
                var x = lower + percent*(upper - lower);

                win.Mouse.clickAtLocation(slider, x, 0)
            },

            // Playback functions.
            playPause:      function() { MusicAPI.Playback._eplayPause.click(); },
            forward:        function() { MusicAPI.Playback._eforward.click(); },
            rewind:         function() { MusicAPI.Playback._erewind.click(); },

            getShuffle:     function() { return MusicAPI.Playback._eshuffle.value; },
            toggleShuffle:  function() { MusicAPI.Playback._eshuffle.click(); },

            getRepeat:      function() {
                return MusicAPI.Playback._erepeat.value;
            },

            changeRepeat:   function(mode) {
                if (!mode) {
                    // Toggle between repeat modes once.
                    MusicAPI.Playback._erepeat.click();
                }
                else {
                    // Toggle between repeat modes until the desired mode is activated.
                    while (MusicAPI.Playback.getRepeat() !== mode) {
                        MusicAPI.Playback._erepeat.click();
                    }
                }
            },

            // Taken from the Google Play Music page.
            toggleVisualization: function() {
                SJBpost('toggleVisualization');
            }

        };

        /* Create a rating API. */
        win.MusicAPI.Rating = {

            // Get current rating.
            getRating: function() {
                var el = doc.querySelector('.player-rating-container li.selected');

                if (el) {
                    return el.value;
                }
                else {
                    return 0;
                }
            },

            // Thumbs up.
            toggleThumbsUp: function() {
                var el = doc.querySelector('.player-rating-container li[data-rating="5"]');

                if (el)
                    el.click();
            },

            // Thumbs down.
            toggleThumbsDown: function() {
                var el = doc.querySelector('.player-rating-container li[data-rating="1"]');

                if (el)
                    el.click();
            }
        };

        var lastTitle = "";
        var lastArtist = "";
        var lastAlbum = "";

        var addObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                for (var i = 0; i < m.addedNodes.length; i++) {
                    var target = m.addedNodes[i];
                    var name = target.id || target.className;

                    if (name == 'text-wrapper')  {
                        var now = new Date();

                        var title = doc.querySelector('#playerSongTitle');
                        var artist = doc.querySelector('#player-artist');
                        var album = doc.querySelector('.player-album');
                        var art = doc.querySelector('#playingAlbumArt');
                        var duration = parseInt(doc.querySelector('#player #slider').getAttribute('aria-valuemax')) / 1000;

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
                            win.GoogleMusicApp.notifySong(title, artist, album, art, duration);

                            lastTitle = title;
                            lastArtist = artist;
                            lastAlbum = album;
                        }
                    }
                }
            });
        });

        var shuffleObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                var target = m.target;
                var id = target.dataset.id;

                if (id == 'shuffle') {
                    win.GoogleMusicApp.shuffleChanged(target.value);
                }
            });
        });

        var repeatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                var target = m.target;
                var id = target.dataset.id;

                if (id == 'repeat') {
                    win.GoogleMusicApp.repeatChanged(target.value);
                }
            });
        });

        var playbackObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                var target = m.target;
                var id = target.dataset.id;

                if (id == 'play-pause') {
                    var playing = target.classList.contains('playing');
                    win.GoogleMusicApp.playbackChanged(playing ? 1 : 0);
                }
            });
        });

        var playbackTimeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                var target = m.target;
                var id = target.id;

                if (id == 'slider') {
                    var currentTime = parseInt(target.getAttribute('aria-valuenow'));
                    var totalTime = parseInt(target.getAttribute('aria-valuemax'));
                    win.GoogleMusicApp.playbackTimeChanged(currentTime, totalTime);
                }
            });
        });

        var ratingObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                var target = m.target;

                if (target.classList.contains('selected'))
                {
                    win.GoogleMusicApp.ratingChanged(target.dataset.rating);
                }
            });
        });


        addObserver.observe(doc.querySelector('#playerSongInfo'), { childList: true, subtree: true });
        shuffleObserver.observe(doc.querySelector('#player button[data-id="shuffle"]'), { attributes: true });
        repeatObserver.observe(doc.querySelector('#player button[data-id="repeat"]'), { attributes: true });
        playbackObserver.observe(doc.querySelector('#player button[data-id="play-pause"]'), { attributes: true });
        playbackTimeObserver.observe(doc.querySelector('#player #slider'), { attributes: true });
        ratingObserver.observe(doc.querySelector('#player .player-rating-container'), { attributes: true, subtree: true });
    }
}
exports.bind = bindToWindow;
