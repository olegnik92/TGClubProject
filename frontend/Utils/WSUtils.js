/**
 * Created by OLEG on 22.01.2016.
 */

'use strict'
var store = require('../store').instance;
var sysActions = require('../actions/system').creators;
class WSConnection{
	constructor(){
		this._host = `ws://${window.location.host}`;
		this._reconnectTimeout = 10000;
		this._reconnects = 0;
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

		this._ws = new WebSocket(this._host + `/${loginData.login}&${loginData.token}`);
		this._ws.onopen = function(event){
			store.dispatch(sysActions.connectionOpened());
			self._sendIntervalRef = setInterval(self._sendFromQueue.bind(self), self._sendIntervalTime);
		};

		this._ws.onerror = function(error){
			store.dispatch(sysActions.connectionError(error));
		};

		this._ws.onclose = function(event){
			store.dispatch(sysActions.connectionClosed());
			clearInterval(self._sendIntervalRef);
		};

		this._ws.onmessage = function(event){
			let mes = JSON.parse(event.data);
			store.dispatch(sysActions.messageReceived(mes.type, mes.data, mes.error));
		};

		this._reconnects++;
	}

	_sendFromQueue(){
		while (this._messageQueue.length > 0){
			if(!this._ws){
				break;
			}

			let action = this._messageQueue.shift();
			store.dispatch(sysActions.messageSent(action.type, action.data, action.error));
			this._ws.send(JSON.stringify(action));
		}
	}

};


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

