/**
 * Created by OLEG on 30.01.2016.
 */

var React = require('react');

module.exports = React.createClass({

	propTypes:{
		model: React.PropTypes.any
	},

	render(){
		return (
			<div className="ChatUserItem">
				<div className="ChatUserItem-login">
					{this.props.model}
				</div>
			</div>
		);
	}
});