/**
 * Webpack configuration for handling the component's source code
 */

module.exports = {
  module: {
    // file loaders definition
    loaders: [
      { 
        test: /\.(csv|gexf)$/, 
        loader: 'raw-loader' 
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
};
