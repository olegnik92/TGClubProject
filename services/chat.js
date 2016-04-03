/**
 * Created by OLEG on 30.01.2016.
 */

'use strict'
var debug = require('debug')('tgc:chat');
var hubActions = require('../wsHub').actionTypes;
var hub = require('../wsHub').instance;
var actions = require('../wsHub').actionsProxy(require('../wsAPI/chat').instance);
var auth = require('./auth').instance;
var authActions = require('./auth').actionTypes;

class Chat{

	constructor(){
		//auth.on(authActions.userLogin, this.updateUsersList);
		auth.on(authActions.userLogout, this.updateUsersList);
		hub.on(hubActions.connection, this.updateUsersList);
		actions.userSendMessage.on(this.onUserMessage)
	}

	onUserMessage(user, data){

		var message = {form: user, text: data.text, time: new Date()};
		if(data.receiverType === 'user'){
			actions.userReceivedMessage.emitTo([data.receiver, user], message);
		} else if(data.receiverType === 'all' ){
			actions.userReceivedMessage.emitTo(null, message);
		} else{
			debug(`unreceived message ${JSON.stringify(action)} form ${JSON.stringify(user)}`);
		}

	}

	updateUsersList(){
		var message = {
			users: auth.getUsers().map(u => u.login)
		};

		actions.updateUsersList.emitTo(null, message);
	}
}

module.exports.instance = new Chat();