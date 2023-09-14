const WextManifestWebpackPlugin = require("wext-manifest-webpack-plugin");

const path = require('path');
const targetBrowser = process.env.TARGET_BROWSER

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }
const nodeEnv = process.env.NODE_ENV;
const destPath = path.join(__dirname, 'dist', nodeEnv);

module.exports = {
    stats: {
        all: false,
        builtAt: true,
        errors: true,
        hash: true
    },
    mode: nodeEnv,
    entry: {
        manifest: './src/manifest.json',
        background: './src/app/background.js',
        options: './src/app/options.js'
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.join(destPath, targetBrowser),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        alias: {
          "webextension-polyfill": "webextension-polyfill",
          Buffer: "buffer",
          process: "process/browser",
          assert: "assert",
          stream: "stream-browserify",
        },
    },
    module: {
        rules: [
            {
                type: 'javascript/auto', // prevent webpack handling json with its own loaders,
                test: /manifest\.json$/,
                use: {
                    loader: 'wext-manifest-loader',
                    options: {
                        usePackageJSONVersion: true, // set to false to not use package.json version for manifest
                      },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "swc-loader",
                },
            },
        ]
    },
    plugins: [
        new WextManifestWebpackPlugin(),
    ]
}