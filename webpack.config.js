const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
	context: path.resolve(__dirname, 'src'),
	entry: './app.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								['es2017']
							]
						}
					},
					{
						loader: 'eslint-loader',
						options: {
							configFile: './.eslintrc.json'
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							minimize: true,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							config: {
								path: './postcss.config.js'
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}

				],
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				// Don't take svg fonts
				exclude: [/fonts/, /icons/],
				use: [
					'file-loader?name=[path][name].[ext]&publicPath="img/"',
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65
							},
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: '65-90',
								speed: 4
							},
							gifsicle: {
								interlaced: false,
							}
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|ttf|otf|eot|svg)$/,
				exclude: [/img/, /icons/],
				use: [
					'file-loader?name=[path][name].[ext]'
				]
			},
			{
				// Only to detect changes and reload
				test: /\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						// Don't process images
						attrs: false
					}
				}
			},
			{
				test: /\.svg$/,
				exclude: [/img/, /fonts/],
				use: [
					{ loader: 'svg-sprite-loader', options: { } },
					'svg-fill-loader',
					'svgo-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'bundle.css',
		}),
		new StyleLintPlugin({configFile: './.stylelintrc.json'}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8080,
			server: { baseDir: ['./'] }
		})
	]
};

module.exports = config;
