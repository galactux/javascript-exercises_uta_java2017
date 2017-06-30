const join = require('path').join;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const production = process.env.NODE_ENV === 'production';
const plugins = [new ExtractTextPlugin('bundle.css')];
if (!production) {
  plugins.push(
    new LiveReloadPlugin({
      appendScriptTag: true
    })
  );
}

module.exports = {
  devtool: production ? 'source-map' : 'eval-source-map',
  entry: {
    app: './src/client'
  },
  output: {
    path: join(process.cwd(), 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: join(process.cwd(), 'src')
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff' }
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'image/svg+xml' }
        }
      }
    ]
  },
  plugins
};
