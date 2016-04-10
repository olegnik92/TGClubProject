/**
 * Created by OLEG on 10.04.2016.
 */

var React = require('react');
var TextField = require('material-ui/lib/text-field');
var FlatButton = require('material-ui/lib/flat-button');
var RaisedButton = require('material-ui/lib/raised-button');
var SelectField = require('material-ui/lib/SelectField');
var MenuItem = require('material-ui/lib/menus/menu-item');
var ReactDOM = require('react-dom');

require('./chatPanel.styl');
var ChatPanel = React.createClass({

	propTypes: {
		messages: React.PropTypes.array.isRequired,
		membersList: React.PropTypes.array.isRequired,
		login: React.PropTypes.string.isRequired,
		onMessageSent: React.PropTypes.func.isRequired
	},

	getInitialState: function(){
		return {
			newMessage: '',
			currentMember: ''
		};
	},

	onSendButtonClick: function(){
		if(!(this.state.newMessage)){
			return;
		}

		this.props.onMessageSent(this.state.newMessage, this.state.currentMember);
		this.setState({newMessage: ''});
	},


	messageFilter: function(m){
		if(this.state.currentMember){
			return (m.from == this.props.login && m.to == this.state.currentMember) ||
				(m.from == this.state.currentMember && m.to == this.props.login);
		}

		return (m.to == '');
	},

	componentDidUpdate: function() {
		var body = ReactDOM.findDOMNode(this).childNodes[1];
		body.scrollTop = body.scrollHeight;
	},

	render: function(){

		var memberItems = this.props.membersList.filter(m => m != this.props.login)
			.map((m) => <MenuItem value={m} key={m} primaryText={m}></MenuItem>);

		memberItems.unshift(<MenuItem value={''} key={'#__forAll__#'} primaryText={'Все'}></MenuItem>)

		var messages = this.props.messages.filter(m => this.messageFilter(m))
							.map(m => <div className="chatPanel-message" key={m.uid}>
											<div className="chatPanel-messageFrom">{m.from}</div>
											<pre>{m.text}</pre>
										</div>);

		var body = this.props.login ?
			(<div className="chatPanel-body">{messages}</div>) :
			(<div className="chatPanel-body"><div className="chatPanel-notAuthed">Для обмена сообщениями войдите в систему.</div></div>)


		return (
			<div className="chatPanel">
				<div className="chatPanel-header">
					<span className="chatPanel-title">Обмен сообщениями</span>
					<SelectField
						disabled={!this.props.login}
						value={this.state.currentMember}
						onChange={(e, i, v) => this.setState({currentMember: v})}
					>
						{memberItems}
					</SelectField>
				</div>
				{body}
				<div className="chatPanel-footer">
					<TextField
						style={{width: '100%'}}
						floatingLabelText="Новое сообщение"
						multiLine={true}
						rows={3}
						rowsMax={3}
						disabled={!this.props.login}
						value={this.state.newMessage}
						onChange={(e) => this.setState({newMessage: e.target.value})}
					/>
					<div className="chatPanel-actions">
						<RaisedButton
							label="Отправить"
							secondary={true}
							disabled={!this.props.login}
							onTouchTap={this.onSendButtonClick}
						/>
					</div>
				</div>
			</div>
		);
	}
});

var chatCommands = require('../../commands/chat').creators;
var connect = require('react-redux').connect;
var mapStateToProps = function(state){
	return {
		messages: state.chat.messages,
		membersList: state.chat.members,
		login: state.system.login || ''
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		onMessageSent: (messageText, receiverUser) => {
			dispatch(chatCommands.sendMessage(messageText, receiverUser));
		}
	};
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ChatPanel);