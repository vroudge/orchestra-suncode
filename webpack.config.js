const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const configuration = require('./app/config')

const TARGET = process.env.NODE_ENV || 'development'

const SERVE = process.env.SERVE || 'build'

const config = {
  mode: TARGET,
  stats: 'verbose',
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          enforce: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial'
        }
      }
    }
  },
  entry: {
    app: path.join(__dirname, 'app/index.js')
  },
  output: {
    publicPath: TARGET === 'production' ? '/' : '/dist/',
    path: path.join(__dirname, 'dist'),
    filename:
      TARGET === 'development' ? '[name].bundle.js' : '[name].bundle.[hash].js',
    chunkFilename:
      TARGET === 'development' ? '[name].bundle.js' : '[name].bundle.[hash].js',
    pathinfo: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)\/|.[sS]pec\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'css/fonts/[name].[ext]',
          publicPath: TARGET === 'production' ? '/' : '/dist/'
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
                })
              ]
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: TARGET === 'production' ? 'compressed' : 'expanded',
              sourceMapContents: true
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'assets/imgs/[name].[ext]',
          publicPath: TARGET === 'production' ? '/' : '/dist/'
        }
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.spec\.js$/
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename:
        TARGET === 'production'
          ? 'css/[name].bundle.[hash].css'
          : 'css/[name].bundle.css',
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'app/index.html'),
      minify: TARGET === 'production',
      inject: false
    })
  ]
}

let conf = config
if (TARGET === 'production') {
  conf = merge.smart(config, {
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('production'),
        API_URL: JSON.stringify(configuration.apiURL)
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      })
    ],
    optimization: {
      minimizer: [new TerserPlugin({
        cache: true,
        parallel: true,
        extractComments: true
      })]
    }
  })
} else {
  conf = merge.smart(config, {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(false),
        'process.env.NODE_ENV': JSON.stringify('development'),
        API_URL: JSON.stringify(configuration.apiURL)
      })
    ]
  })
}

if (SERVE === 'development' || SERVE === undefined) {
  console.log('start dev server')

  conf = merge(config, {
    devServer: {
      port: 3030,
      hot: true,
      inline: true,
      historyApiFallback: {
        disableDotRule: true
      },
      stats: 'errors-only',
      contentBase: path.join(__dirname, 'dist/')
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: true
      }),
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(false),
        'process.env.NODE_ENV': JSON.stringify('development'),
        API_URL: JSON.stringify(configuration.apiURL)
      }),
      new webpack.HotModuleReplacementPlugin({
        multiStep: false
      })
    ],
    devtool: 'eval'
  })
}

module.exports = conf
