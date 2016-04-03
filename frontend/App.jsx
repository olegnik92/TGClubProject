/**
 * Created by OLEG on 03.04.2016.
 */

var React = require('react');
var Provider = require('react-redux').Provider;
var store = require('./store').instance;
module.exports = React.createClass({

	render: function(){
		return (
			<div id="app">
				<Provider store={store}>
					<h1>HI THERE!!!</h1>
				</Provider>
			</div>
		);
	}
});