/**
 * Created by OLEG on 09.04.2016.
 */

var React = require('react');
var AppMenu = require('../appMenu/AppMenu.jsx');

require('./appLayout.styl');
module.exports = React.createClass({

	render: function(){
		return (
			<div id="app" className="appLayout">
				<AppMenu></AppMenu>

			</div>
		);
	}
});