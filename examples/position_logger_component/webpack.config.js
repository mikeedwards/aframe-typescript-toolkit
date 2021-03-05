const webpack = require("webpack");
const path = require("path");
const DashboardPlugin = require("webpack-dashboard/plugin");
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";
const HtmlWebpackPlugin = require('html-webpack-plugin')

const plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      // eslint-disable-line quote-props
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      tslint: {
        emitErrors: true,
        failOnHint: true
      }
    }
  }),
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  })
];

if (!isProd) {
  plugins.push(new DashboardPlugin());
}

var config = {
  devtool: isProd ? "hidden-source-map" : "source-map",
  context: path.resolve("./"),
  entry: {
    app: "./src/index.ts"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "index.js",
    sourceMapFilename: "[file].map",
    devtoolModuleFilenameTemplate: function(info) {
      return "file:///" + info.absoluteResourcePath;
    },
    library: "AframeToolkitExample",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts?$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: ["ts-loader", "source-map-loader"]
      },
      {
        test: /\.(js|ts)$/,
        loader: "babel-loader",
        exclude: path.resolve(__dirname, "node_modules")
      },
      {
        test: /\.html$/,
        loader: "raw-loader" // loaders: ['raw-loader'] is also perfectly acceptable.
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: plugins,
  devServer: {
    contentBase: path.join(__dirname, '/src'),
    compress: true,
    port: 3000,
    hot: true,
    disableHostCheck: true,
    watchContentBase: true,
  }
};

module.exports = config;
