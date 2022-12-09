const webpack = require("webpack");
const path = require("path");

const postcssPresetEnv = require("postcss-preset-env");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [new TerserPlugin(), new CssMinimizerPlugin()];
  }

  return config;
};

const plugins = [
  new MiniCssExtractPlugin({
    filename: !isProd ? "css/[name].css" : "css/[name]-[contenthash].css",
  }),
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "src/index.html",
    minify: isProd,
  }),
];

if (isProd) {
  plugins.push(
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  );
  plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

if (process.env.NODE_ENV === "serve") {
  plugins.push(new ReactRefreshWebpackPlugin({ overlay: false }));
}

module.exports = {
  target: "web",
  mode: isProd ? "production" : "development",
  entry: ["./src/index.tsx"],
  resolve: {
    modules: ["node_modules", path.join(__dirname, "src")],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins,
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    static: path.resolve(__dirname, "/dist"),
    port: 8000,
    historyApiFallback: true,
  },
  output: {
    path: `${__dirname}/dist`,
    filename: !isProd ? "js/[name].js" : "js/[name]-[contenthash].js",
    chunkFilename: "[name].chunk.js",
    assetModuleFilename: !isProd ? "[name][ext]" : "[name]-[contenthash][ext]",
    publicPath: "/",
    clean: true,
  },
  optimization: optimization(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv],
              },
            },
          },
        ],
      },
      {
        test: /\.[jt]sx?/,
        loader: "babel-loader",
        exclude: [/node_modules/],
      },
    ],
  },
};
