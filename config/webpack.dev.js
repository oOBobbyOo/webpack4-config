const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    compress: true, //服务端压缩是否开启
    open: true,
    hot: true,
    host: 'localhost', //服务器的IP地址
    port: 3000, //配置服务端口号
    contentBase: './dist' //设置基本目录结构
  },
  module: {
    rules: [{
      test: /\.(sa|sc|c)ss$/,
      exclude: /node_modules/,
      use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        },
        'sass-loader',
        'postcss-loader'
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new BundleAnalyzerPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});