/**
 * Created by OLEG on 09.04.2016.
 */


var React = require('react');
var LeftNav = require('material-ui/lib/left-nav');
var ChatPanel = require('../chatPanel/ChatPanel.jsx');

var Chat = React.createClass({
	propTypes: {
		sideBarOpen: React.PropTypes.bool,
		onSideBarStateChange: React.PropTypes.func.isRequired
	},

	getInitialState: function(){
		return {

		};
	},

	onLeftNavRequestChange: function(open){
		this.props.onSideBarStateChange(open);
	},

	render: function(){
		var styleObj = this.props.sideBarOpen ? {width: '80%', maxWidth: '550px'} : {};
		return (
			<div>
				<LeftNav
					open={this.props.sideBarOpen}
					docked={false}
					onRequestChange={this.onLeftNavRequestChange}
					style={styleObj}
				>
					<ChatPanel></ChatPanel>
				</LeftNav>
			</div>
		);
	}
});


var connect = require('react-redux').connect;
var uiActions = require('../../actions/chat').creators;
var mapStateToProps = function(state){
	return {
		sideBarOpen: state.chat.isOpen
	};
};
var mapDispatchToProps = function(dispatch){
	return{
		onSideBarStateChange: (isOpen) =>{
			dispatch(uiActions.chatBoxStateChange(isOpen));
		}
	}
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Chat);