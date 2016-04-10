/**
 * Created by OLEG on 10.04.2016.
 */

var wsActions= require('../utils/wsUtils').actionsProxy(require('../../wsAPI/chat').instance);
module.exports.creators = {
	sendMessage: function(text, receiver){

		return function(dispatch){
			wsActions.userSendMessage.emit({
				text: text,
				receiver: receiver
			});
		};
	}


};