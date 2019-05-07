const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //用于删除上次构建的文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); //模板配置
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //用于提取css到文件中
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //css压缩
const PreloadWebpackPlugin = require('preload-webpack-plugin'); //预加载
const CopyWebpackPlugin = require('copy-webpack-plugin'); //用户拷贝静态资源
const ManifestPlugin = require('webpack-manifest-plugin'); //用于生成资产清单的Webpack插件
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin'); //PWA插件
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        commons: {
          name: 'chunk-common',
          minSize: 1, //表示在压缩前的最小模块大小,默认值是 30kb
          minChunks: 2, // 最小公用次数
          priority: -20, // 优先级
          chunks: 'initial', // 匹配的块的类型
          reuseExistingChunk: true // 公共模块必开启
        }
      }
    },
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}` //为每个仅含有运行时的入口起点添加一个额外块
    }
  },
  module: {
    rules: [{
      test: /\.(sa|sc|c)ss$/,
      exclude: /node_modules/,
      use: [{
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        },
        {
          loader: 'sass-loader'
        },
        {
          loader: 'postcss-loader'
        }
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'bobby',
      favicon: path.resolve(__dirname, '../public/favicons/favicon.ico'),
      minify: {
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html' // 生成后的文件名,
        // chunks: ['main'] // entry中的 main 入口才会被打包
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[id].[contenthash:8].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      //传递给 cssProcessor 的选项，默认为{}
      cssProcessorOptions: {
        safe: true,
        discardComments: { removeAll: true }
      },
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    }),
    new ManifestPlugin({
      fileName: 'cache-manifest.json'
    }),
    new InlineManifestWebpackPlugin(),
    // 配置 PWA
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'local', //打包到本地， 默认值是'cdn' 访问的是国外cdn需要翻墙
      include: [/\.js$/, /\.css$/, /\.(png|jpg|gif|svg)$/, /\.(woff2?|eot|ttf|otf)$/] //包含资源
        // exclude: [/\.html$/] //排除资源
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../public'),
      to: path.resolve(__dirname, '../dist')
    }])
  ]
});