/**
 * Created by OLEG on 22.01.2016.
 */

'use strict'

var Dispatcher = require('./Dispatcher.js').instance;

var messageTypes = {
	open: 'WS_OPEN',
	close: 'WS_CLOSE',
	error: 'WS_ERROR',
	message: 'WS_MESSAGE',
	dead: 'WS_RECONNECTS_DEAD',
	send: 'WS_SEND'
};

class WSConnection{
	constructor(){
		this._host = `ws://${window.location.host}`;
		this._reconnectTimeout = 10000;
		this._reconnects = 0;
		this._reconnectDeadLine = 6;
		this._messageQueue = [];
		this._sendIntervalRef = 0;
		this._sendIntervalTime = 100;
		this._ws = null;

		this._init();
		setInterval(() =>{
			if(!this._ws || this._ws.readyState !== 1){
				this._init();
			}
		}, this._reconnectTimeout)

	}

	sendAction(type, data, error){
		this._messageQueue.push({type: type, data: data, error: error})
	}


	_init(){
		var self = this;
		var loginData = JSON.parse(sessionStorage.getItem('loginData'));
		if(!loginData || !loginData.login || !loginData.token){
			this._reconnects = 0;
			return;
		}

		if(this._reconnects > this._reconnectDeadLine){
			Dispatcher.dispatchAction(messageTypes.dead);
			return;
		}

		this._ws = new WebSocket(this._host + `/${loginData.login}&${loginData.token}`);
		this._ws.onopen = function(event){
			Dispatcher.dispatchAction(messageTypes.open, event);
			self._sendIntervalRef = setInterval(self._sendFromQueue.bind(self), self._sendIntervalTime);
		};

		this._ws.onerror = function(error){
			Dispatcher.dispatchAction(messageTypes.error, null, error);
		};

		this._ws.onclose = function(event){
			Dispatcher.dispatchAction(messageTypes.close, event);
			clearInterval(self._sendIntervalRef);
		};

		this._ws.onmessage = function(event){
			Dispatcher.dispatchAction(messageTypes.message, event);
			setTimeout(function(){
				Dispatcher.dispatch(JSON.parse(event.data));
			});
		};

		this._reconnects++;
	}

	_sendFromQueue(){
		while (this._messageQueue.length > 0){
			if(!this._ws){
				break;
			}

			let action = this._messageQueue.shift();
			Dispatcher.dispatchAction(messageTypes.send, action);
			this._ws.send(JSON.stringify(action));
		}
	}

};

module.exports.actionTypes = messageTypes;

var ws = new WSConnection();
module.exports.instance = ws;

module.exports.actionsProxy = function(actionsObj){
	var result = {};
	for(let action of Object.keys(actionsObj)){
		result[action] = {
			type: actionsObj[action],
			emit: function(data, error) {
				ws.sendAction(this.type, data, error)
			}
		};
	}

	return result;
}

