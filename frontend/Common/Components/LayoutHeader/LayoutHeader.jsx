/**
 * Created by OLEG on 17.01.2016.
 */


require('./LayoutHeader.styl');
var React = require('react');
module.exports = React.createClass({
	render: function(){
		return (
			<div className="LayoutHeader">
				<div className="LayoutHeader-logo">TGClub</div>
				<div>login</div>
			</div>
		);
	}
});