/**
 * Created by OLEG on 27.01.2016.
 */

var dispatcher = require('../Utils/Dispatcher').instance;
var wsActions = require('../Utils/WSUtils').actionTypes;
var serviceActions = require('../../actions/chat').instance;
var ws = require('../Utils/WSUtils').instance;

function createAction(type){
	return{
		type: type,
		emit: function(data, error){
			dispatcher.dispatchAction(type, data, error);
		}
	}
}


module.exports.instance = {
	userSignIn: createAction('USER_SIGN_IN'),
	userSignOut: createAction('USER_SIGN_OUT'),
	userSendAuthData: createAction('USER_SEND_AUTH_DATA'),
	userAuthOK: createAction('USER_AUTH_OK'),
	userAuthFail: createAction('USER_AUTH_FAIL'),
	wsConnectionDead: createAction(wsActions.dead),
	userSendMessage: createAction(serviceActions.userSendMessage)
}

module.exports.createAction = createAction;
