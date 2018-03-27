const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index",
    about: "./src/about"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    inline: true,
    hot: true,
    open: true,
    host: "localhost"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx"]
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: 'ts-loader'
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader",
          options: {
            minimize: true
          }
        }]
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader",
          options: {
            minimize: true
          }
        }, {
          loader: "sass-loader"
        }]
      })
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader",
          options: {
            minimize: true
          }
        }, {
          loader: "less-loader"
        }]
      })
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "images/[name].[ext]?[hash]"
        }
      }]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]?[hash]"
        }
      }]
    }]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          name: "commons"
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "dist")]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new HtmlWebpackPlugin({
      title: "index",
      filename: "./index.html",
      hash: true,
      template: "./src/index.html",
      chunks: ["commons", "index"],
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
    }),
    new HtmlWebpackPlugin({
      title: "about",
      filename: "./about.html",
      hash: true,
      template: "./src/about.html",
      chunks: ["commons", "about"],
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
    }),
    new ExtractTextPlugin({
      filename: "css/[name].css",
      disable: false,
      allChunks: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};