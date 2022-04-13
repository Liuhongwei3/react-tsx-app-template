const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');

// https://webpack.docschina.org/configuration/
module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';

    function jsLoaderWrap(loaders) {
        return [
            ...(isDev ? ['cache-loader'] : []),
            {
                loader: 'thread-loader',
                options: {
                    workers: require('os').cpus().length - 1,
                },
            },
            ...loaders,
        ];
    }

    function styleLoaderWrap(loaders, isModule = false) {
        return (isDev
            ? [
                {
                    loader: 'style-loader',
                },
            ]
            : [MiniCssExtractPlugin.loader]
        ).concat([
            isModule
                ? {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[folder]-[local]_[hash:hex:5]',
                    },
                }
                : 'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [require.resolve('autoprefixer')],
                    },
                },
            },
            ...loaders,
        ]);
    }

    return {
        // mode: 'development',
        entry: path.resolve(__dirname, './src/index.tsx'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            // filename: 'bundle.js'
        },
        target: 'web', // 开启热更新
        cache: {
            // 使用持久化缓存
            type: "memory", //memory:使用内容缓存 filesystem：使用文件缓存
        },
        devServer: {
            client: {
                progress: false,
            },
            hot: true, // HMR
            open: true,
            port: 8080,
            proxy: {
                // '/api': 'https://yapi.qunhequnhe.com/api',
                '/api': {
                    target: 'https://yapi.qunhequnhe.com/api',
                    pathRewrite: { '^/api': '' },
                    changeOrigin: true,
                },
            },
            server: 'https', //'http' | 'https' | 'spdy'
        },
        // src: path.resolve(__dirname, '../src'),
        // build: path.resolve(__dirname, '../dist'),
        // public: path.resolve(__dirname, '../public'),
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@/common': path.resolve(__dirname, './src/common'),
                '@/apps': path.resolve(__dirname, './src/apps'),
            },
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules(\/|\\)(?!@qunhe.(rc-components|kjl-site-common|mola|penrose|vc-employee))/,
                    use: jsLoaderWrap([
                        {
                            loader: 'babel-loader',
                            options: {
                                compact: false,
                                presets: [
                                    "@babel/preset-env",
                                    "@babel/preset-react",
                                ],
                            },
                        },
                    ]),
                },
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: jsLoaderWrap([
                        {
                            loader: 'babel-loader',
                            options: {
                                compact: false,
                            },
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                happyPackMode: true,
                                transpileOnly: true,
                            },
                        },
                    ]),
                },
                {
                    test: /\.css$/,
                    exclude: [/\.module.css$/],
                    use: styleLoaderWrap([]),
                },
                {
                    test: /\.module.css$/,
                    use: styleLoaderWrap([], true),
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
            }),
            new WebpackBar({
                name: 'webpack5-build-react-ts-app',
                // 生产模式时可开启查看具体耗时
                // profile: true,
                // reporters: [
                //     'basic',
                //     'fancy',
                //     'profile',
                //     'stats'
                // ],
            }),
        ].concat(isDev ? [] : [
            new MiniCssExtractPlugin({
                filename: isDev ? '[name].css' : '[name].[contenthash].css',
                chunkFilename: isDev ? '[name].css' : '[name].[contenthash].css',
            }),
        ]),
    };
};