// Load in dependencies
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var gui = require('nw.gui');
var util = require('util');
var extend = require('obj-extend');
var forwardEvents = require('forward-events');
var GoogleMusic = require('./google-music');

// TODO: Fill out package.json in full
// TODO: Add play/pause icons for tray menu items
// TODO: Add/remove tray menu items when we leave (should be reused though for memory leaksO

// Define constructor for internalizing state
function GoogleMusicWebkit() {
  // Load up EventEmitter
  var that = this;
  EventEmitter.call(this);

  // Save app for later
  this.app = gui.App;

  // Generate a window for Google Music
  // https://github.com/rogerwang/node-webkit/wiki/Window
  // TODO: Can we change window.location for the same effect?
  // TODO: Probably but the reason they usually open a subwindow is so we can act on a close event instead of exiting immediately
  this.googleWindow = window.open('https://play.google.com/music');
  this.googleWebkit = gui.Window.get(this.googleWindow);

  // When we close the googleWebkit window, close the app
  // https://github.com/rogerwang/node-webkit/wiki/Window#closed
  this.googleWebkit.on('closed', function closeApp () {
    that.quit();
  });

  // By default, the window is visible (corresponds to `minimize` events and `toggleVisibility`)
  this.isVisible = true;

  // When the window is minimized, record the update
  this.googleWebkit.on('minimize', function handleMinimizeEvent () {
    that.isVisible = false;
  });

  // When our url changes
  this.googleWebkit.on('loaded', function () {
    // If we have arrived to a logged in state in Google Music
    var loc = that.googleWindow.location;
    if (loc.href.indexOf('//play.google.com/music') !== -1 && loc.hash !== '') {
      that.initMusic();
    // If we have left Google Music (e.g. logged out), destroy our music instance
    } else {
      that.destroyMusic();
    }
  });
}
util.inherits(GoogleMusicWebkit, EventEmitter);
extend(GoogleMusicWebkit.prototype, {
  // init/destroy first, then alphabetical
  initMusic: function () {
    // If we need to add scripts
    this.googleMusic = this.googleWindow.googleMusic;
    if (!this.googleMusic) {
      // Bind to the window
      this.googleMusic = this.googleWindow.googleMusic = new GoogleMusic(this.googleWindow);

      // Forward all events
      forwardEvents(this.googleMusic, this);

      // Emit an event
      this.emit('init-music');
    }
  },
  destroyMusic: function () {
    // If there is music, remove clean it up
    if (this.googleMusic) {
      this.googleMusic.removeAllListeners();
    }
    delete this.googleMusic;
    delete this.googleWindow.googleMusic;

    // Emit an event
    this.emit('destroy-music');
  },

  // ALPHABETICAL ORDER STARTS HERE

  playPause: function () {
    // TODO: If we are not logged in, prompt for login
    if (this.googleMusic) {
      this.googleMusic.playPause();
    }
  },
  next: function () {
    if (this.googleMusic) {
      this.googleMusic.forward();
    }
  },
  previous: function () {
    if (this.googleMusic) {
      this.googleMusic.rewind();
    }
  },

  toggleVisibility: function () {
    // If it is visible, hide it
    if (this.isVisible) {
      this.googleWebkit.minimize();
      this.isVisible = false;
    // Otherwise, show it
    } else {
      this.googleWebkit.restore();
      this.isVisible = true;
    }

    // TODO: Emit a visibility change event (requires handling `minimize` event)
  },
  quit: function () {
    this.app.quit();
  }
});

// Create our webkit
var gmw = new GoogleMusicWebkit();

// Create our tray icon
// DEV: Icon via http://lorempixel.com/32/32/abstract/3/
// https://github.com/rogerwang/node-webkit/wiki/Tray
var tray = new gui.Tray({icon: 'lib/icon.png'});

// Add a menu to our tray with bindings for GoogleMusic
var trayMenu = new gui.Menu();
// TODO: Add/remove play/pause depending on if music is playing or not
trayMenu.append(new gui.MenuItem({
  label: 'Show/Hide window',
  click: function () {
    gmw.toggleVisibility();
  }
}));
trayMenu.append(new gui.MenuItem({
  type: 'separator'
}));
trayMenu.append(new gui.MenuItem({
  label: 'Play/Pause',
  click: function () {
    gmw.playPause();
  }
}));
trayMenu.append(new gui.MenuItem({
  label: 'Next',
  click: function () {
    gmw.next();
  }
}));
trayMenu.append(new gui.MenuItem({
  label: 'Previous',
  click: function () {
    gmw.previous();
  }
}));
trayMenu.append(new gui.MenuItem({
  type: 'separator'
}));
trayMenu.append(new gui.MenuItem({
  label: 'Quit',
  click: function () {
    gmw.quit();
  }
}));
tray.menu = trayMenu;

// When the tray icon is clicked, toggle visibility
tray.on('click', function maximizeFromTray () {
  gmw.toggleVisibility();
});

// Bind media keys
// https://github.com/rogerwang/node-webkit/wiki/Shortcut
// https://github.com/rogerwang/node-webkit/blob/cf804fee63bd08aaf7fa16984ad9e0856451f7e4/tests/manual_tests/global_hotkey/index.html#L39-L40
var playPauseShortcut = new gui.Shortcut({
  key: 'MediaPlayPause',
  active: function () {
    gmw.playPause();
  },
  failed: function () {
    console.log('Could not bind "MediaPlayPause" shortcut');
  }
});
var previousShortcut = new gui.Shortcut({
  key: 'MediaPrevTrack',
  active: function () {
    gmw.previous();
  },
  failed: function () {
    console.log('Could not bind "MediaPrevTrack" shortcut');
  }
});
var nextShortcut = new gui.Shortcut({
  key: 'MediaNextTrack',
  active: function () {
    gmw.next();
  },
  failed: function () {
    console.log('Could not bind "MediaNextTrack" shortcut');
  }
});
var stopShortcut = new gui.Shortcut({
  key: 'MediaStop',
  active: function () {
    gmw.stop();
  },
  failed: function () {
    console.log('Could not bind "MediaStop" shortcut');
  }
});
gui.App.registerGlobalHotKey(playPauseShortcut);
gui.App.registerGlobalHotKey(previousShortcut);
gui.App.registerGlobalHotKey(nextShortcut);
gui.App.registerGlobalHotKey(stopShortcut);

// When the song changes, update the tooltip
// Data looks like: {title, artist, album, art, duration}
gmw.on('song:changed', function (data) {
  tray.tooltip = [
    'Title: ' + data.title,
    'Artist: ' + data.artist,
    'Album: ' + data.album,
  ].join('\n');
});

// When the playback state changes, update the icon
gmw.on('playback:changed', function (playbackState) {
  // Determine which icon to display based on state
  // By default, render the clean icon (stopped state)
  var icon = 'lib/icon.png';
  if (playbackState === GoogleMusic.PLAYBACK.PLAYING) {
    icon = 'lib/icon-playing.png';
  } else if (playbackState === GoogleMusic.PLAYBACK.PAUSED) {
    icon = 'lib/icon-paused.png';
  }

  // Update the icon
  tray.icon = icon;
});
gmw.on('destroy-music', function () {
  delete tray.tooltip;
});
