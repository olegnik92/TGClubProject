/**
 * Created by OLEG on 27.01.2016.
 */

'use strict'
var Store = require('./Store');
var dispatcher = require('../../Utils/Dispatcher').instance;
var actions = require('../Actions').instance;
var http = require('../../Utils/HTTPUtils').instance;

class AppStore extends Store{
	constructor(){
		super();
		dispatcher.register((action) => {
			switch (action.type){
				case actions.userSendAuthData.type:{
					return this.sendLoginData(action.data);
				}
				case actions.userSignIn.type:{
					return this.onUserSignIn(action.data);
				}
				case actions.userSignOut.type:{
					return this.onUserSignOut();
				}
				case actions.wsConnectionDead.type:{
					return this.onWsConnectionDead();
				}
			}
		});
		this.initFromStore();
	}

	initFromStore(){
		this._login = null;
		this._token = null;
		let loginData = sessionStorage.getItem('loginData');
		if(!loginData){
			return;
		}
		let loginParsedData = JSON.parse(loginData);
		this._login = loginParsedData.login;
		this._token = loginParsedData.token;
	}

	getState(){
		return{
			login: this._login,
			token: this._token,
		}
	}

	sendLoginData(data){
		http.post('/login', data)
			.then((result) => {
				actions.userSignIn.emit(result);
			}, (error) => {
				actions.userAuthFail.emit(error, error);
			});
	}


	onUserSignIn(data){
		sessionStorage.setItem('loginData', JSON.stringify(data));
		this.initFromStore();
		this.stateChanged();
	}

	onUserSignOut(){
		http.post('/logout', {login: this._login, token: this._token});
		sessionStorage.removeItem('loginData');
		this.initFromStore();
		this.stateChanged();
	}

	onWsConnectionDead(){
		alert('Соединение с сервером потеряно, пользователь будет разлогинен');
		this.onUserSignOut();
	}

}


module.exports.instance = new AppStore();