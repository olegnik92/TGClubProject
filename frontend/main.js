/**
 * Created by OLEG on 17.01.2016.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App.jsx');
//
var appRoot = document.createElement('div');
appRoot.id="root";
document.body.insertBefore(appRoot, null);
ReactDOM.render(React.createElement(App),appRoot);

