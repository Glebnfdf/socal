const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
  const webpackMode = argv.mode
    ? argv.mode === 'production' ? 'production' : 'development'
    : 'production';

  return {
    entry: {
      app: './src/App.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'reactBuild'),
      filename: '[name].bundle.[contenthash].js',
      clean: true,
    },
    mode: webpackMode,
    devtool: webpackMode === 'production' ? false : 'source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
      watchFiles: ['./src/index.html'],
      proxy: {
        "/": "http://localhost:3000/"
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(scss|css)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          exclude: path.resolve(__dirname, 'source/img/svgIcons'),
          generator: {
            filename: 'assets/img/[name][ext][query]'
          }
        },
        {
          test: /favicon\.ico$/i,
          type: 'asset/resource',
          generator: {
            filename: 'favicon.ico'
          }
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext][query]'
          }
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: path.resolve(__dirname, 'source/img/svgIcons')
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.bundle.[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),
      new Dotenv({
        path: "./credentials.env"
      })
    ]
  }
};
