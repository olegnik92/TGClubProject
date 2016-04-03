/**
 * Created by OLEG on 03.04.2016.
 */

var React = require('react');
var Provider = require('react-redux').Provider;
var store = require('./store').instance;
var AppBar = require('material-ui').AppBar;
module.exports = React.createClass({

	render: function(){
		return (
			<div id="app">
				<Provider store={store}>
					<AppBar title="HI THERE"  iconElementLeft={<span></span>}/>
				</Provider>
			</div>
		);
	}
});