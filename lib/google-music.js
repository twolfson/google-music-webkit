// TODO: Once full-formed, break out class as a node module so it can be reused in browsers with no penalty
// TODO: Create class for managing application state that emits events
// TODO: Add methods for play/pause/forward/next/shuffle/repeat that we can bind to menus and media keys

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

// Expose constructor
module.exports = GoogleMusic;
