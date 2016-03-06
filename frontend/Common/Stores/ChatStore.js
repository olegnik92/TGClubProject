/**
 * Created by OLEG on 30.01.2016.
 */

'use strict'
var Store = require('./Store');

var actions = require('../../Utils/WSUtils').actionsProxy(require('../../../actions/chat').instance);
var dispatcher = require('../../Utils/Dispatcher').instance;
class ChatStore extends Store{
	constructor(){
		super();
		this._messages = [];
		this._users = [];
		dispatcher.register((action) =>{
			switch(action.type){
				case actions.updateUsersList.type:{
					this.onUpdateUsersList(action.data.users);
					break;
				}
				case actions.userReceivedMessage.type:{
					this.onUserReceivedMessage(action.data);
					break;
				}
			}
		});
	}

	getState(){
		return {
			users: this._users,
			messages: this._messages
		};
	}

	onUpdateUsersList(users){
		if(!users){
			return;
		}

		this._users = users;
		this.stateChanged();
	}

	onUserReceivedMessage(message){

	}
}


module.exports.instance = new ChatStore();