/**
 * Created by OLEG on 27.01.2016.
 */
require('./Button.styl')

var React = require('react');
module.exports = React.createClass({
	propTypes:{
		title: React.PropTypes.string,
		caption: React.PropTypes.string,
		enabled: React.PropTypes.bool,
		onClick: React.PropTypes.func,
	},

	getDefaultProps: function(){
		return {
			onClick: function(){}
		};
	},

	render: function() {
		return (
			<button className="Button" onClick={this.props.onClick} title={this.props.title}>{this.props.caption}</button>
		);
	}


});