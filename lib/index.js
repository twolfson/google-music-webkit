// Load in dependencies
var gui = require('nw.gui');

// Generate a window for Google Music
// https://github.com/rogerwang/node-webkit/wiki/Window
// TODO: Can we change window.location for the same effect?
// TODO: Probably but the reason they usually open a subwindow is so we can act on a close event instead of exiting immediately
var googleWindow = window.open('https://play.google.com/music');
var $googleWindow = gui.Window.get(googleWindow);

console.log(googleWindow.document.querySelector('button'));

// TODO: Once full-formed, break out class as a node module so it can be reused in browsers with no penalty
// TODO: Create class for managing application state that emits events
// TODO: Set up `tray.tooltip` to update on song change
// TODO: Add methods for play/pause/forward/next/shuffle/repeat that we can bind to menus and media keys
// TODO: Fill out package.json in full
// TODO: Add tray menu for all methods we want

// TODO: Look into icon for taskbar item https://github.com/rogerwang/node-webkit/wiki/Icons

// Set up minification
// Modified from https://github.com/rogerwang/node-webkit/wiki/Minimize-to-tray

// Create our tray icon
// DEV: Icon via http://lorempixel.com/32/32/abstract/3/
// https://github.com/rogerwang/node-webkit/wiki/Tray
var tray = new gui.Tray({icon: 'lib/icon.png'});

// When the tray icon is clicked, show the window
// TODO: Should be a toggle
tray.on('click', function maximizeFromTray () {
  $googleWindow.restore();
});

// When we minimize our window, hide it
$googleWindow.on('minimize', function minimizeToTray () {
  $googleWindow.minimize();
});
