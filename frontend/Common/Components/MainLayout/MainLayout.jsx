/**
 * Created by OLEG on 18.01.2016.
 */

require('./MainLayout.styl')

var LayoutHeader = require('../LayoutHeader/LayoutHeader.jsx');
var React = require('react');
module.exports = React.createClass({

	render: function(){
		return (
			<div className="MainLayout">
				<LayoutHeader> </LayoutHeader>

			</div>
		);
	}

});