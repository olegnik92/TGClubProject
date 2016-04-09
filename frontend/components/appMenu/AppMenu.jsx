/**
 * Created by OLEG on 03.04.2016.
 */
var React = require('react');
var AppBar = require('material-ui').AppBar;
var FlatButton = require('material-ui/lib/flat-button');
var Colors = require('material-ui/lib/styles/colors');
var LoginDialog = require('../loginDialog/LoginDialog.jsx');
require('./appMenu.styl');
var AppMenu = React.createClass({

	propTypes: {
		login: React.PropTypes.string,
		connected: React.PropTypes.bool,
		loginErrorMessage: React.PropTypes.string,
		loginDialogOpen: React.PropTypes.bool,
		onLogin: React.PropTypes.func.isRequired,
		onLogout: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {loginDialogOpen: false};
	},

	logout: function(){
		this.setState({loginDialogOpen: false});
		this.props.onLogout();
	},

	render: function(){
		var loginButton = this.props.login ?
					{text: 'Выйти', action: this.logout} :
					{text: 'Войти', action: () => this.setState({loginDialogOpen: true})};


		var connectionState = (this.props.login && this.props.connected) ? 'соединен' :
								(this.props.login && !this.props.connected) ? 'не соединен' : '';

		return(

			<div className="appMenu">
				<AppBar>
					<div className="appMenu-clientInfo">
						<div className="appMenu-loginCaption">{this.props.login}</div>
						<div className="appMenu-connectionState">{connectionState}</div>
						<FlatButton className="appMenu-loginButton" rippleColor={Colors.darkBlack}  onTouchTap={loginButton.action}>{loginButton.text}</FlatButton>
					</div>
				</AppBar>
				<LoginDialog
					open={this.state.loginDialogOpen && !this.props.login}
					onCloseRequest={() => this.setState( {loginDialogOpen: false})}
					onLogin={this.props.onLogin}
					errorMessage={this.props.loginErrorMessage}
				></LoginDialog>


			</div>
		);
	}
});


var sysActions = require('../../commands/system').creators;
var connect = require('react-redux').connect;
var mapStateToProps = function(state){
	return {
		login: state.system.login,
		connected: state.system.connected,
		loginErrorMessage: state.system.loginErrorMessage,
	};
};
var mapDispatchToProps = function(dispatch){
	return{
		onLogin: (login, password) => {
			dispatch(sysActions.login(login, password));
		},
		onLogout: () =>{
			dispatch(sysActions.logout());
		}
	}
};
module.exports = connect(mapStateToProps, mapDispatchToProps)(AppMenu);