/**
 * Created by OLEG on 03.04.2016.
 */
const actions = {
	//pageLoaded: 'CL_PAGE_LOADED',

	userLogin: 'CL_SYSTEM_USER_LOGIN',
	userLoginFailed: 'CL_SYSTEM_USER_LOGIN_FAILED',
	userLogout: 'CL_SYSTEM_USER_LOGOUT',
	connectionOpened: 'CL_SYSTEM_CONNECTION_OPENED',
	connectionError: 'CL_SYSTEM_CONNECTION_ERROR',
	connectionClosed: 'CL_SYSTEM_CONNECTION_CLOSED',
	messageSent: 'CL_SYSTEM_MESSAGE_SENT',
	messageReceived: 'CL_SYSTEM_MESSAGE_RECEIVED',
};

const creators = {
	//pageLoaded: () => new Object({ type: actions.pageLoaded}),
	userLogin: (login, token) => new Object({ type: actions.userLogin, login: login, token: token}),
	userLoginFailed: (err) => new Object({type: actions.userLoginFailed, error: err}),
	userLogout: () => new Object({type: actions.userLogout}),
	connectionOpened: () => new Object({ type: actions.connectionOpened}),
	connectionError: (error) => new Object({type: actions.connectionError, error: error}),
	connectionClosed: () => new Object({ type: actions.connectionClosed}),
	messageSent: (type, data, error) => new Object({type: actions.messageSent, messageType: type, data: data, error: error}),
	messageReceived: (type, data, error) => new Object({type: actions.messageReceived, messageType: type, data: data, error: error})
};


module.exports.actions = actions;
module.exports.creators = creators;