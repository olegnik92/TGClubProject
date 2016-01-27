/**
 * Created by OLEG on 17.01.2016.
 */

var http = require('../../../Utils/HTTPUtils').instance;
require('./LayoutHeader.styl');
var React = require('react');

var TextBox  = require('../TextBox/TextBox.jsx');
module.exports = React.createClass({
	onClickTest: function(){
		http.post('/login', {login: 'ole', password: 'w'})
			.then(() => alert('good'),() => alert('bad'));
	},

	render: function(){
		return (
			<div className="LayoutHeader">
				<div className="LayoutHeader-logo">TGClub</div>
			</div>
		);
	}
});