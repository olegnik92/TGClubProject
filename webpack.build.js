/**
 * Created by OLEG on 17.01.2016.
 */

console.log('webpack script start working')
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var rimraf = require('rimraf');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var NODE_ENV = 'development';


var config = {
	context: path.join(__dirname, 'frontend'),
	entry: './main',
	output:{
		path: path.join(__dirname, 'public'),
		filename: 'scripts.[hash].js'
	},
	module: {
		loaders:[
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015']
				}
			},
			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader?resolve url')
			}
		]
	},
	plugins:[
		{
			apply: (compiler) =>{

				compiler.plugin('compile', function(){
					rimraf.sync(path.join(__dirname, 'public'));
					console.log('%s webpack emit compile', new Date());
				});

			}
		},
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV),
			DEBUG: true,
		}),
		new webpack.ProvidePlugin({
			Promise: 'promise'
		}),
		new ExtractTextPlugin('styles.[contenthash].css'),
		new HtmlWebpackPlugin({
			title: 'TGClub v0.0.1'
		})
	],
	stylus:{
		use: [require('nib')()],
		import: ['~nib/lib/nib/index.styl']
	},
	devtool: 'source-map',

};




function printOutput (err, stats){
	if(err){
		console.error(err);
	}
}

var compiler = webpack(config);
if(NODE_ENV == 'development'){
	compiler.watch({
		aggregateTimeout: 300,
		poll: true
	}, printOutput);
} else{
	compiler.run(printOutput);
}


module.exports = config;
