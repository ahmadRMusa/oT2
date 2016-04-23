# oTranscribe2

This is an attempt to rebuild oTranscribe from the ground up. It's not quite ready to use yet, though.

Read more [about oTranscribe2 and how you can get involved](https://github.com/oTranscribe/oT2/wiki/About-oTranscribe2).

## Building source files

To compile the source files in the `src` folder, you will need to do the following:

Install [Node and npm](https://docs.npmjs.com/getting-started/installing-node) if you don't have it already, and then run:

    npm install

Then start the Webpack build system by running:

    npm start
  
oTranscribe should then be accessible at [localhost:8080](http://localhost:8080).

To build a distributable `dist` folder, run:

    npm run build

## Testing

Assuming you have already installed dependencies, run:

    npm test
    
## Architecture

### Controllers

These are functions which use [Ractive](http://www.ractivejs.org) to control the HTML on the page. They live in the **controllers** directory, and their corresponding HTML templates are in the **templates directory**.

#### File

Contructor opts:

- element
- setTime (callback that takes time in seconds as argument)
- getTime (callback that returns time in seconds)

Methods:

- getFile
- setFile
- onSave
- setFileLoaded
- setLastMedia
- find
- lock
- unlock

#### Media

Constructor opts:

- element

Methods:

- onReset
- setFile
- getTime
- setTime


### Storage

oTranscribe's storage system is a custom wrapper around [localforage](https://github.com/mozilla/localForage). When initialised, it returns an object with the following methods:

- `list`: Returns promise which resolves to  list of saved files
- `save`: Takes an object with `id` property. Returns promise which resolves to that id.
- `load`: Takes an id (eg. `32`). Returns promise which resolves to a saved file.

### Player

Takes the following arguments:

- `driver`: A valid Player driver (see below)
- `source`: Source file URL
- `onReady`: Callback function called when player is ready for playback

Returns an object of playback controls:

- `play`
- `pause`
- `getTime`: returns time in seconds
- `setTime`: seeks to time in seconds
- `skip`: `'forwards'` or `'backwards'`
- `getLength`: returns time in seconds
- `getStatus`: 'loading', 'playing' or 'paused'
- `getSpeed`: returns speed as number
- `setSpeed`: changes speed (`1` is normal speed)
- `speed`: `'up'` or `'down'`
- `destroy`: player becomes inactive and removes all markup from page


#### Player drivers

Player drivers should be objects initialise with a single `source` argument. They live in the **player-drivers** directory. An instance of a player driver should have the following methods:

- `play`
- `pause`
- `getTime`
- `setTime`: argument is time in seconds
- `isReady`: true if source is loaded and ready for playback
- `getLength`: time in seconds
- `getStatus`: 'paused' or 'playing'
- `getSpeed`: returns speed as number
- `setSpeed`: changes speed (`1` is normal speed)
- `destroy`: driver becomes inactive and removes all markup from page

Available player drivers:

- `Player.drivers.HTML5_AUDIO`
- (More to come!)

