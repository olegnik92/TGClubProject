/**
 * Created by OLEG on 09.04.2016.
 */

var sysActions = require('../actions/system').creators;
var http = require('../utils/httpUtils').instance;
module.exports.creators = {
	login: function(userLogin, userPassword){
		return function(dispatch){
			http.post('/login', {login: userLogin, password: userPassword})
				.then((result) => {
					dispatch(sysActions.userLogin(result.login, result.token));
				}, (result) =>{
					dispatch(sysActions.userLoginFailed(result.error.toString()));
				});
		};
	},

	logout: function(){
		return function(dispatch, getState){
			let state = getState().system;
			http.post('/logout', {login: state.login, token: state.token})
				.then((res) => {
					dispatch(sysActions.userLogout());
				}, (err) => {
					console.error(err);
					dispatch(sysActions.userLogout());
				});
		};
	}
};