(function () {
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

  // Expose constructor on window
  window.GoogleMusic = GoogleMusic;
}());
