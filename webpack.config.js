const webpack = require("webpack");
const path = require("path");
const DashboardPlugin = require("webpack-dashboard/plugin");
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

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
  new TypedocWebpackPlugin({
      out: './docs',
      module: 'commonjs',
      target: 'es5',
      exclude: ['node_modules', 'examples', '.history', 'templates'].map(subdir => path.resolve(__dirname, subdir)),
      experimentalDecorators: true,
      excludeExternals: true
  })
];

if (!isProd) {
  plugins.push(new DashboardPlugin());
}

const config = {
  devtool: isProd ? "hidden-source-map" : "source-map",
  context: path.resolve("./src"),
  entry: {
    app: "./index.ts"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "index.js",
    sourceMapFilename: "index.map",
    devtoolModuleFilenameTemplate: function(info) {
      return "file:///" + info.absoluteResourcePath;
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts?$/,
        exclude: ['node_modules'].map(subdir => path.resolve(__dirname, subdir)),
        use: ["ts-loader", "source-map-loader"]
      },
      {
        test: /\.(js|ts)$/,
        loader: "babel-loader",
        exclude: ['node_modules'].map(subdir => path.resolve(__dirname, subdir)),
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: plugins
};

module.exports = config;
