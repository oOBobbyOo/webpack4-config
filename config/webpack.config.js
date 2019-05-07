const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 放置生成的静态资源 (js、css、img、fonts)
const assetsDir = 'assets';

module.exports = {
  mode: 'development',
  entry: {
    // 配置入口文件
    main: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    // 配置打包文件输出的目录
    path: path.resolve(__dirname, '../dist'),
    // 生成的 js 文件名称
    filename: `${assetsDir}/js/[name].[hash:8].js`,
    // 生成的 chunk 名称
    chunkFilename: `${assetsDir}/js/[name].[chunkhash:8].js`,
    // 在script标签上添加crossOrigin,以便于支持跨域脚本的错误堆栈捕获
    crossOriginLoading: 'anonymous',
    // 资源引用的路径
    publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '..', 'src')
    }
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: `${assetsDir}/img/[name].[hash:8].[ext]`
              }
            }
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: `${assetsDir}/media/[name].[hash:8].[ext]`
              }
            }
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096, // 8192
            fallback: {
              loader: 'file-loader',
              options: {
                name: `${assetsDir}/fonts/[name].[hash:8].[ext]`
              }
            }
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'bobby',
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html'
    })
  ]
};