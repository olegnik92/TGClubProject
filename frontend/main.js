/**
 * Created by OLEG on 17.01.2016.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var MainLayout = require('./common/components/MainLayout/MainLayout.jsx');
//
var appRoot = document.createElement('div');
appRoot.id="AppRoot";
document.body.insertBefore(appRoot, null);
ReactDOM.render(React.createElement(MainLayout),appRoot);

if(DEBUG){
	console.log('app run in DEBUG mode');
	var p = new Promise(function(resolve, reject){
		setTimeout(resolve, 1000);
	});
}
