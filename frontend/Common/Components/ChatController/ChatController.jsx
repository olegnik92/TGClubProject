/**
 * Created by OLEG on 30.01.2016.
 */

var React = require('react');

var ChatUserItem = require('../ChatUserItem/ChatUserItem.jsx');
var ItemsList = require('../ItemsList/ItemsList.jsx');
var ChatBox = require('../ChatBox/ChatBox.jsx');
var chatStore = require('../../Stores/ChatStore').instance;
module.exports = React.createClass({

	getInitialState: function(){
		return {
			selectedUsers: [],
			users: [],
			messages: [{
				from: 'eho',
				time: new Date(),
				text: 'This is message!!!'
			}]
		};
	},

	onItemSelected: function(item){
		debugger;
	},

	onStoreStateChanged: function(){
		var state = chatStore.getState();
		this.setState({
			users: state.users,
			//messages: state.messages,

		});
	},

	componentDidMount: function(){
		chatStore.onStateChangedRegister(this.onStoreStateChanged);
	},

	componentWillUnmount: function(){
		chatStore.onStateChangedUnRegister(this.onStoreStateChanged);
	},

	render: function(){
		return (
			<div className="ChatController">
				<div className="ChatController-usersList">
					<ItemsList items={this.state.users} itemComponent={ChatUserItem} onItemSelected={this.onItemSelected} selectedItems={this.state.selectedUsers}>

					</ItemsList>
					<ChatBox messages={this.state.messages}>

					</ChatBox>
				</div>
			</div>
		);
	}
});