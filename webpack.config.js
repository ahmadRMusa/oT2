var path = require('path');
module.exports = {
  entry: {
    app: ['./src/index.js'] // This is the main file that gets loaded first; the "bootstrap", if you will.
  },
  output: { // Transpiled and bundled output gets put in `build/bundle.js`.
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/', // But it gets served as "assets" for testing purposes.
    filename: 'bundle.js'   // Really, you want to upload index.html and assets/bundle.js
  },

  // This makes it easier to debug scripts by listing line number of whichever file
  // threw the exception or console.log or whathaveyounot.
  devtool: 'inline-source-map',

  module: {
    loaders: [
      {
        test: /\.js?$/, // Another convention is to use the .es6 filetype, but you then
                        // have to supply that explicitly in import statements, which isn't cool.
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      // This nifty bit of magic right here allows us to load entire JSON files
      // synchronously using `require`, just like in NodeJS.
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
