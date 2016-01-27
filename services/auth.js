/**
 * Created by OLEG on 26.01.2016.
 */

'use strict'
var EventEmitter = require('events');
var utils = require('./utils').instance;
var debug = require('debug')('tgc:auth');

const actionTypes = {
	userLogin: 'AUTH_USER_LOGIN',
	userLogout: 'AUTH_USER_LOGOUT',
	userLoginFail: 'AUTH_USER_LOGIN_FAIL',
}
var _debugPass = 'w';

var _errors = [
	'Неверный логин или пароль'
];

class Auth extends EventEmitter {
	constructor(){
		super();
		this._errors = _errors;
		this._users = {};
	}

	login(login ,password){
		var self = this;
		return new Promise(function(resolve, reject){
			if(password === _debugPass){
				if(self._users[login]){
					debug(`${actionTypes.userLogout} ${login}`);
					self.emit(actionTypes.userLogout, login);
				}

				debug(`${actionTypes.userLogin} ${login}`);
				self._users[login] = {login: login, token: utils.guid()};
				self.emit(actionTypes.userLogin, login);
				resolve(self._users[login]);
			} else {
				debug(`${actionTypes.userLoginFail} ${login}`);
				self.emit(actionTypes.userLoginFail, login);
				reject(_errors[0]);
			}
		});
	}

	logout(login){
		if(this._users[login]){
			debug(`${actionTypes.userLogout} ${login}`);
			this.emit(actionTypes.userLogout, login);
			delete this._users[login];
		}
	}

	getUser(login){
		return this._users[login];
	}

}

module.exports.actionTypes = actionTypes;
module.exports.instance = new Auth();