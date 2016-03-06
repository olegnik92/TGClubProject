/**
 * Created by OLEG on 27.01.2016.
 */

require('./AccountController.styl')

var appStore = require('../../Stores/AppStore').instance;
var React = require('react');
var DialogOverlay = require('../DialogOverlay/DialogOverlay.jsx');
var LoginForm = require('../LoginForm/LoginForm.jsx');
var actions = require('../../Actions').instance;
module.exports = React.createClass({

	getInitialState: function(){
		let appState = appStore.getState();
		return {
			login: appState.login,
			showLoginForm: false
		};
	},

	componentDidMount: function(){
		appStore.onStateChangedRegister(this.onAppStoreChanged);
	},

	onAppStoreChanged: function(){
		let appState = appStore.getState();

		this.setState({
			login: appState.login,
			showLoginForm: !appState.login && this.state.showLoginForm
		});
	},

	onSignButtonClick: function(){
		if(!this.state.login){
			this.setState({showLoginForm: true});
		} else{
			actions.userSignOut.emit();
		}
	},

	onLoginDialogClose: function(){
		this.setState({showLoginForm: false});
	},

	render: function() {
		return (
			<div className="AccountController">
				<span className="AccountController-login">{this.state.login}</span>
				<button className="AccountController-signButton" onClick={this.onSignButtonClick}>{this.state.login ? 'Выйти' : 'Войти'}</button>
				{(() =>{
					if(this.state.showLoginForm) {
						return (
							<DialogOverlay caption="Вход в систему" onClose={this.onLoginDialogClose}>
								<LoginForm></LoginForm>
							</DialogOverlay>
						);
					}
				})()}
			</div>
		);
	}


});