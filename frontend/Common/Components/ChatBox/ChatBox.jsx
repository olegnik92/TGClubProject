/**
 * Created by OLEG on 31.01.2016.
 */
'use strict'

var React = require('react');
var TextBox = require('../TextBox/TextBox.jsx');
var Button = require('../Button/Button.jsx');
module.exports = React.createClass({
	propTypes: {
		messages: React.PropTypes.array,
		onMessageCommit: React.PropTypes.func
	},

	getDefaultProps: function(){
		return{
			messages:[],
			onMessageCommit: function(){}
		}
	},

	getInitialState: function(){
		return{
			newMessage: ''
		};
	},

	onNewMessageChange: function(value){
		this.setState({
			newMessage: value
		});
	},

	render: function(){

		return (
			<div className="ChatBox">
				<div className="ChatBox-messagesBox">
					{(() => {
						return this.props.messages.map(message =>{
							return (
								<div className="ChatBox-message" key={message.time}>
									<span className="ChatBox-messageFrom">{message.from}</span>
									<span className="ChatBox-messageText">{message.text}</span>
								</div>
							);
						});
					})()}
				</div>
				<div className="ChatBox-newMessageBox">
					<TextBox placeholder="Сообщение" defaultValue={this.state.newMessage} onChange={this.onNewMessageChange}></TextBox>
					<Button caption="Отправить"></Button>
				</div>
			</div>
		);
	}
});