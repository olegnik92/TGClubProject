/**
 * Created by OLEG on 09.04.2016.
 */

var React = require('react');
var FlatButton = require('material-ui/lib/flat-button');
var Dialog = require('material-ui/lib/dialog');
var TextField = require('material-ui/lib/text-field');

require('./loginDialog.styl');
module.exports = React.createClass({
	propTypes: {
		open: React.PropTypes.bool,
		errorMessage: React.PropTypes.string,
		onCloseRequest: React.PropTypes.func.isRequired,
		onLogin: React.PropTypes.func.isRequired
	},


	getInitialState: function(){
		return {
			login: '',
			password: ''
		};
	},

	render: function(){
		var actions = [
			<FlatButton
				label="Отмена"
				secondary={true}
				onTouchTap={this.props.onCloseRequest}
			/>,
			<FlatButton
				label="Войти"
				primary={true}
				onTouchTap={() => this.props.onLogin(this.state.login, this.state.password)}
			/>,
		];
		return (
			<Dialog
				title={'Вход в систему'}
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.onCloseRequest}
				contentStyle={{maxWidth: '300px'}}
			>
				<div>
					<div>
						<TextField
							floatingLabelText="Логин"
							value={this.state.login}
							onChange={(e) => this.setState({login: e.target.value})}
						></TextField>
					</div>
					<div>
						<TextField
							floatingLabelText="Пароль"
							type="password"
							value={this.state.password}
							onChange={(e) => this.setState({password: e.target.value})}
						></TextField>
					</div>
					<div className="loginDialog-error">
						{this.props.errorMessage}
					</div>
				</div>
			</Dialog>
		);
	}
});