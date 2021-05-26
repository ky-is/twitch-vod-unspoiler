import path from 'path'

import TerserJSPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

const ROOT_PATH = path.resolve()

export default {
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
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
		inject: path.join(ROOT_PATH, 'src/scripts/inject.ts'),
		background: path.join(ROOT_PATH, 'src/scripts/background.ts'),
	},
	output: {
		filename: '[name].js',
		path: path.join(ROOT_PATH, 'dist/generated'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					'ts-loader',
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
