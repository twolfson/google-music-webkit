// Load in dependencies
var gui = require('nw.gui');
var GoogleMusic = require('./google-music');

// Set up app
var app = gui.App;

// Generate a window for Google Music
// https://github.com/rogerwang/node-webkit/wiki/Window
// TODO: Can we change window.location for the same effect?
// TODO: Probably but the reason they usually open a subwindow is so we can act on a close event instead of exiting immediately
var googleWindow = window.open('https://play.google.com/music');
var googleWebkit = gui.Window.get(googleWindow);

// When our url changes
// Create a GoogleMusic instance for our window
var googleMusic = null;
googleWebkit.on('loaded', function () {
  // If we have arrived to a logged in state in Google Music
  var loc = googleWindow.location;
  if (loc.href.indexOf('//play.google.com/music') !== -1 && loc.hash !== '') {
    // If we need to add scripts
    if (!googleMusic) {
      // Bind to the window
      googleMusic = new GoogleMusic(googleWindow);
      googleMusic.on('song:changed', console.log);
    }
  // If we have left Google Music (e.g. left Google Music), clean up google music
  // TODO: Since the window has left the building, do we need to clean up any bindings?
  } else {
    googleMusic = null;
  }
});

// TODO: Set up `tray.tooltip` to update on song change
// TODO: Fill out package.json in full
// TODO: Add tray menu for all methods we want
// TODO: Look into icon for taskbar item https://github.com/rogerwang/node-webkit/wiki/Icons

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
    // TODO: If we are not logged in, prompt for login
    if (googleMusic) {
      googleMusic.playPause();
    }
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
