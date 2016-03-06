/**
 * Created by OLEG on 17.01.2016.
 */

require('./LayoutHeader.styl');
var React = require('react');

var AccountController  = require('../AccountController/AccountController.jsx');
module.exports = React.createClass({

	render: function(){
		return (
			<div className="LayoutHeader">
				<div className="LayoutHeader-logo">TGClub</div>
				<AccountController></AccountController>
			</div>
		);
	}
});