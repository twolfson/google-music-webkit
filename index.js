// Load in dependencies
var gui = require('nw.gui');

// Generate a window for Google Music
var win = gui.Window.get(window.open('https://play.google.com/music'));

// Set up minification
// Modified from https://github.com/rogerwang/node-webkit/wiki/Minimize-to-tray

// Create our tray icon
// DEV: Icon via http://lorempixel.com/32/32/abstract/3/
var tray = new gui.Tray({icon: 'icon.png'});

// When the tray icon is clicked, show the window
// TODO: Should be a toggle
tray.on('click', function maximizeFromTray () {
  win.restore();
});

// When we minimize our window, hide it
win.on('minimize', function minimizeToTray () {
  win.minimize();
});
