import path from 'path'

import TerserJSPlugin from 'terser-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin'

const ROOT_PATH = path.resolve()

export default {
	mode: 'none',
	plugins: [
		new MiniCSSExtractPlugin({
			filename: '[name].css',
		}),
	],
	optimization: {
		minimizer: [
			new TerserJSPlugin({
				extractComments: false,
			}),
			new CSSMinimizerPlugin(),
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
					MiniCSSExtractPlugin.loader,
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
