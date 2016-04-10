/**
 * Created by OLEG on 03.04.2016.
 */

var Redux = require('redux');
var thunk = require('redux-thunk').default;

var reducer = Redux.combineReducers({
	system: require('./reducers/system').instance,
	chat: require('./reducers/chat').instance
});

var middleware = Redux.applyMiddleware(thunk);

var store = Redux.createStore(reducer, middleware);

var sysActions = require('./actions/system').creators;
var wsClient = require('./utils/wsUtils').instance;

wsClient.onOpen = function(event){
	store.dispatch(sysActions.connectionOpened());
};

wsClient.onClose = function(event){
	store.dispatch(sysActions.connectionClosed());
};

wsClient.onError = function(error){
	store.dispatch(sysActions.connectionError(error));
};

wsClient.onMessage = function(mes){
	store.dispatch(sysActions.messageReceived(mes.type, mes.data, mes.error));
	store.dispatch({type: mes.type, data: mes.data, error: mes.error});
};
module.exports.instance = store;