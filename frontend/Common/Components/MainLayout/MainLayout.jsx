/**
 * Created by OLEG on 18.01.2016.
 */

require('./MainLayout.styl')

var LayoutHeader = require('../LayoutHeader/LayoutHeader.jsx');
var LoginForm = require('../LoginForm/LoginForm.jsx');
var React = require('react');
var appStore = require('../../Stores/AppStore').instance;
module.exports = React.createClass({

	render: function(){
		return (
			<div className="MainLayout">
				<LayoutHeader> </LayoutHeader>
				<LoginForm></LoginForm>
			</div>
		);
	}

});