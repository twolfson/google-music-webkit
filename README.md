# google-music-webkit [![Build status](https://travis-ci.org/twolfson/google-music-webkit.png?branch=master)](https://travis-ci.org/twolfson/google-music-webkit)

[Google Music][] desktop client via [node-webkit][]

**Features:**

- Google Music as a standalone application
- Tray for quick play/pause/quit and tooltip with information

![Screenshot](docs/screenshot.png)

[Google Music]: http://music.google.com/
[node-webkit]: https://github.com/rogerwang/node-webkit

## Requirements
- [node-webkit@0.9.2][node-webkit] or greater

## Getting Started
Install the module with: `npm install google-music-webkit`

```js
var google_music_webkit = require('google-music-webkit');
google_music_webkit.awesome(); // "awesome"
```

When the application has launched, it can be shown/hidden via its tray icon, ![tray icon](lib/icon.png).

![Screenshot](docs/screenshot.png)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Attribution
Headphones designed by Jake Dunham from [the Noun Project][headphones-icon]

[headphones-icon]: http://thenounproject.com/term/headphones/16097/

Modified `google-music-mac` source code from https://github.com/kbhomes/google-music-mac under [MIT license][google-music-mac-license].

[google-music-mac-license]: https://github.com/kbhomes/google-music-mac/tree/v1.1.3

## Unlicense
As of May 02 2014, Todd Wolfson has released this repository and its contents to the public domain, excluding that which has been attributed to other sources.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
