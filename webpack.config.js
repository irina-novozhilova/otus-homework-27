const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const glob = require("glob");

const pages = glob.sync("./src/pages/*.html");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env) => ({
  entry: {
    index: "./build/src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash].js",
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  devtool: env.production ? "source-map" : "eval-source-map",
  mode: env.production ? "production" : "development",
  devServer: {
    compress: true,
    port: 9000,
    watchFiles: "./src/**/*",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpeg|jpg|svg)/i,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext]",
        },
      },
      // {
      //   test: /\.html$/i,
      //   loader: "html-loader",
      // },
    ],
  },
  plugins: [
    ...pages.map(
      (el) =>
        new HtmlWebpackPlugin({
          filename: el.replace(/^src\/pages\//, ""),
          template: el,
        })
    ),
    new MiniCssExtractPlugin({
      filename: "[name]-[hash].css",
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "./src/pages/images/"),
    //       to: path.resolve(__dirname, "./dist/images"),
    //     },
    //   ],
    // }),
  ],
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
});
