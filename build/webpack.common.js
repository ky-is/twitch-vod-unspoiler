const path = require('path')

const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const ROOT_PATH = path.join(__dirname, '..')

module.exports = {
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name]/index.css',
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserJSPlugin({
				extractComments: false,
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
	},
	entry: {
		inject: path.join(ROOT_PATH, 'src/scripts/inject/index.ts'),
		background: path.join(ROOT_PATH, 'src/scripts/background/index.ts'),
	},
	output: {
		filename: '[name]/index.js',
		path: path.join(ROOT_PATH, 'dist/generated'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					'ts-loader',
					path.resolve(__dirname, 'strip-template-whitespace-loader.js'),
				],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts'],
		alias: {
			'@': path.join(ROOT_PATH, 'src'),
		},
	},
}
