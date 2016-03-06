/**
 * Created by OLEG on 27.01.2016.
 */

require('./LoginForm.styl')

var React = require('react');
var actions = require('../../Actions').instance;
var TextBox = require('../TextBox/TextBox.jsx');
var Button = require('../Button/Button.jsx');
module.exports = React.createClass({

	getInitialState: function(){
		return {
			login: '',
			password: 'w'
		};
	},

	onSubmit: function(){
		actions.userSendAuthData.emit({login: this.state.login, password: this.state.password});
	},

	render: function() {
		return (
			<div className="LoginForm">
				<div className="LoginForm-login">
					<TextBox label="Логин" value={this.state.login} onChange={(val) => {this.setState({login: val});}}></TextBox>
				</div>
				<div className="LoginForm-password">
					<TextBox label="Пароль" value={this.state.password} onChange={(val) => {this.setState({password: val});}}></TextBox>
				</div>
				<div className="LoginForm-submit">
					<Button caption="Войти" onClick={this.onSubmit}></Button>
				</div>
			</div>
		);
	}

});