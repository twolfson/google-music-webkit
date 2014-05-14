// Load in dependencies
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var gui = require('nw.gui');
var util = require('util');
var extend = require('obj-extend');
var GoogleMusic = require('./google-music');

// TODO: Fill out package.json in full
// TODO: Add play/pause icons for tray menu items
// TODO: Add/remove tray menu items when we leave (should be reused though for memory leaksO

// Define constructor for internalizing state
function GoogleMusicWebkit() {
  // Load up EventEmitter
  EventEmitter.call(this);

  // Save app for later
  this.app = gui.App;

  // Generate a window for Google Music
  // https://github.com/rogerwang/node-webkit/wiki/Window
  // TODO: Can we change window.location for the same effect?
  // TODO: Probably but the reason they usually open a subwindow is so we can act on a close event instead of exiting immediately
  this.googleWindow = window.open('https://play.google.com/music');
  this.googleWebkit = gui.Window.get(googleWindow);

  // By default, the window is visible
  this.isVisible = true;

  // When the window is minimized, record the update
  var that = this;
  this.googleWebkit.on('minimize', function handleMinimizeEvent () {
    that.isVisible = false;
  });
}
util.inherits(GoogleMusic, EventEmitter);
extend(GoogleMusicWebkit.prototype, {
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
    // TODO: If we are not logged in, prompt for login
    if (googleMusic) {
      googleMusic.playPause();
    }
  }
}));
trayMenu.append(new gui.MenuItem({
  label: 'Next',
  click: function () {
    if (googleMusic) {
      googleMusic.forward();
    }
  }
}));
trayMenu.append(new gui.MenuItem({
  label: 'Previous',
  click: function () {
    if (googleMusic) {
      googleMusic.rewind();
    }
  }
}));
trayMenu.append(new gui.MenuItem({
  type: 'separator'
}));
trayMenu.append(new gui.MenuItem({
  label: 'Quit',
  click: function () {
    app.quit();
  }
}));
tray.menu = trayMenu;

tray.on('click', function maximizeFromTray () {
  gmw.toggleVisibility();
});

// When we close the googleWebkit window, close the app
// https://github.com/rogerwang/node-webkit/wiki/Window#closed
googleWebkit.on('closed', function closeApp () {
  app.quit();
});

// When our url changes
// Create a GoogleMusic instance for our window
googleWebkit.on('loaded', function () {
  // If we have arrived to a logged in state in Google Music
  var loc = googleWindow.location;
  if (loc.href.indexOf('//play.google.com/music') !== -1 && loc.hash !== '') {
    // If we need to add scripts
    if (!googleMusic) {
      // Bind to the window
      googleMusic = new GoogleMusic(googleWindow);

      // When the song changes, update the tooltip
      // Data looks like: {title, artist, album, art, duration}
      googleMusic.on('song:changed', function (data) {
        tray.tooltip = [
          'Title: ' + data.title,
          'Artist: ' + data.artist,
          'Album: ' + data.album,
        ].join('\n');
      });
    }
  // If we have left Google Music (e.g. left Google Music), clean up google music
  } else {
    delete tray.tooltip;
    if (googleMusic) {
      googleMusic.removeAllListeners();
    }
    googleMusic = null;
  }
});
