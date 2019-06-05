const path = require('path')
// const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        include: [
          path.resolve(__dirname, 'src')
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules']
      }
    ]
  },
  entry: {
    bundle: './src/index'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js'
  },
  plugins: [
    // new WorkboxPlugin.GenerateSW({
    //   swDest: 'sw.js',
    //   globDirectory: './public',
    //   globPatterns: [
    //     '*.{html,css,js}'
    //   ],
    //   globIgnores: [
    //     '_redirects',
    //     'bundle.js',
    //     'sw.js'
    //   ],
    //   navigateFallback: '/index.html'
    // })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'public')
  },
  mode: process.env.NODE_ENV || 'development'
}
