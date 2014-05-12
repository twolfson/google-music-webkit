// Load in dependencies
var gui = require('nw.gui');

// Set up app
var app = gui.App;

// Generate a window for Google Music
// https://github.com/rogerwang/node-webkit/wiki/Window
// TODO: Can we change window.location for the same effect?
// TODO: Probably but the reason they usually open a subwindow is so we can act on a close event instead of exiting immediately
var googleWindow = window.open('https://play.google.com/music');
var googleWebkit = gui.Window.get(googleWindow);

// TODO: When window closes, close process
console.log(googleWindow.location);

// TODO: Once full-formed, break out class as a node module so it can be reused in browsers with no penalty
// TODO: Create class for managing application state that emits events
// TODO: Set up `tray.tooltip` to update on song change
// TODO: Add methods for play/pause/forward/next/shuffle/repeat that we can bind to menus and media keys
// TODO: Fill out package.json in full
// TODO: Add tray menu for all methods we want

// TODO: Inherit from EventEmitter
// Define a constructor to interact with a GoogleMusic window
function GoogleMusic(win) {
  this.win = win;
}
GoogleMusic.prototype = {
  playPause: function () {
    // Find and click the play pause button
    // DEV: We cannot cache this in the constructor because we can be behind login wall
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.click
    var $playPause = this.win.document.querySelector('button[data-id="play-pause"]');
    $playPause.click();
  }
};

// Create a GoogleMusic instance for our window
var googleMusic = new GoogleMusic(googleWindow);

// TODO: Look into icon for taskbar item https://github.com/rogerwang/node-webkit/wiki/Icons

// Set up minification
// Modified from https://github.com/rogerwang/node-webkit/wiki/Minimize-to-tray

// Create our tray icon
// DEV: Icon via http://lorempixel.com/32/32/abstract/3/
// https://github.com/rogerwang/node-webkit/wiki/Tray
var tray = new gui.Tray({icon: 'lib/icon.png'});

// Add a menu to our tray with bindings for GoogleMusic
var trayMenu = new gui.Menu();
// TODO: Add/remove play/pause depending on if music is playing or not
trayMenu.append(new gui.MenuItem({
  label: 'Play/Pause',
  click: function () {
    googleMusic.playPause();
  }
}));
trayMenu.append(new gui.MenuItem({
  label: 'Quit',
  click: function () {
    app.quit();
  }
}));
tray.menu = trayMenu;

// When the tray icon is clicked, toggle the window state
googleWebkit.isVisible = true;
tray.on('click', function maximizeFromTray () {
  // If it is visible, hide it
  if (googleWebkit.isVisible) {
    googleWebkit.minimize();
    googleWebkit.isVisible = false;
  // Otherwise, show it
  } else {
    googleWebkit.restore();
    googleWebkit.isVisible = true;
  }
});

// When we minimize/restore our window, remember the state
googleWebkit.on('minimize', function minimizeToTray () {
  googleWebkit.isVisible = false;
});

// When we close the googleWebkit window, close the app
// https://github.com/rogerwang/node-webkit/wiki/Window#closed
googleWebkit.on('closed', function closeApp () {
  app.quit();
});
