/**
 * Created by OLEG on 10.04.2016.
 */
const actions = require('../actions/chat').actions;
var wsActions = require('../../wsAPI/chat').instance;
var incrementer = 0;
module.exports.instance = function(state, action){

	switch (action.type){
		case actions.chatBoxStateChange:{
			return Object.assign({}, state, {isOpen: action.isOpen});
		}


		case wsActions.updateUsersList:{
			return Object.assign({}, state, {members: action.data.users})
		}

		case wsActions.userReceivedMessage:{
			var messages = state.messages.slice(-30);
			messages.push({
				text: action.data.text,
				from: action.data.from,
				to: action.data.to || '',
				time: action.data.time || (new Date()),
				uid: incrementer++
			});
			return Object.assign({}, state, {messages: messages});
		}

		default:{
			if(state){
				return state;
			}

			return {
				isOpen: false,
				members: [],
				messages: []
			}
		}
	}
};