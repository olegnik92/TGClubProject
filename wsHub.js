/**
 * Created by OLEG on 26.01.2016.
 */

'use strict'
var EventEmitter = require('events');
var WebSocketServer = require('ws').Server;
var debug = require('debug')('tgc:wsHub');
var authModule = require('./services/auth');
var auth = authModule.instance;
var utils = require('./services/utils').instance;

class WSClient{
	constructor(login, token){
		this.login = login;
		this.token = token;
		this._ws = null;
		this._queue = [];
		this._sendInterval = 100;
		this._intervalRef = setInterval(this._sendQueue.bind(this), this._sendInterval);
		this._checkInterval = 30000;
		this._connectionChecksFaildCount = 0;
		this._connectionChecksDeadLine = 4;
		this._connectionCheckIntervalRef = setInterval(this._checkConnection.bind(this), this._checkInterval);
	}

	send(actionType, data, error){
		this._queue.push({type: actionType, data: data, error: error});
	}

	destroy(){
		clearInterval(this._connectionCheckIntervalRef);
		clearInterval(this._intervalRef);
		this._sendQueue();
		this._ws.close()
	}

	setWs(ws){
		if(this._ws){
			this._ws.close();
		}
		this._ws = ws;
	}

	_checkConnection(){
		if(this._ws && this._ws.readyState === 1){
			this._connectionChecksFaildCount = 0;
		} else {
			this._connectionChecksFaildCount++;
		}

		if(this._connectionChecksFaildCount > this._connectionChecksDeadLine){
			debug(`ws connection dead, user ${this.login} - ${this.token} will be logouted`);
			auth.logout(this.login, this.token);
		}
	}

	_sendQueue(){
		try{
			while (this._queue.length > 0){
				if(!this._ws || this._ws.readyState !== 1){
					break;
				}

				var message = JSON.stringify(this._queue.shift());
				this._ws.send(message, function(error){
					if(error){
						debug('!! --- WS SEND ERROR --- !!')
						debug(error);
					}
					debug(message);
				});
			}
		} catch(error) {
			debug(error);
		}

	}
}

var actionTypes = {
	connection: 'WSS_CONNECTION',
	message: 'WSS_MESSAGE',
	clientClose: 'WSS_CLIENT_CLOSE',
	connectionClosed: 'WSS_CONNECTION_CLOSED'
}

class WSHub extends EventEmitter {
	constructor(){
		super();
		this._wss = null;
		this._clients = {};
		this._notAuthCloseTime = 30 * 1000;
		this._notConnectedCloseTime = 3 * 60 * 1000;
		auth.on(authModule.actionTypes.userLogout, (login) => {
			if(this._clients[login]){
				this._clients[login].destroy();
				delete this._clients[login];
			}
		});
	}

	init(httpServer){
		this._wss = new WebSocketServer({server: httpServer});
		this._wss.on('connection', (ws) => {
			ws.webSocketID  = utils.guid();
			var loginData = this.getLoginDataFromUrl(ws.upgradeReq.url);
			debug(`ws try open new connection --- ${JSON.stringify(loginData)} --- ${ws.webSocketID}`);
			ws.isWsConnectionAuthed = this.createWsClient(ws, loginData);
			if(!ws.isWsConnectionAuthed){
				ws.close();
				return;
			}

			this.emit(actionTypes.connection, ws);
			ws.on('message', (message) => {
				debug(`ws receive message ${ws.webSocketID} --- ${message}`);
				var action = null;
				try{
					action = JSON.parse(message);
					this._processAction(action, ws);
				} catch (error){
					debug(`ERROR BAD MESSAGE ${error}`);
				}
			});


			ws.on('close', function(){
				debug(`ws connection closed ${ws.webSocketID}`);
				this.emit(actionTypes.connectionClosed, ws);
			});

		});
	}

	getLoginDataFromUrl(url){
		if(!url){
			return null;
		}

		var data = url.split(/[/&]/);
		if(data.length !== 3){
			return null;
		}

		return {
			login: data[1],
			token: data[2],
		}
	}

	createWsClient(ws, loginData){
		if(!loginData || !loginData.login || !loginData.token ){
			debug(`ws connection authed FAILED (no login data) -  ${ws.webSocketID}`);
			return false;
		}

		let user = auth.getUser(loginData.login);
		//todo упростить
		if(user && user.token === loginData.token){
			let client = null;
			if(this._clients[loginData.login]){
				if(this._clients[loginData.login].token === loginData.token){
					client = this._clients[loginData.login];
					debug(`ws connection authed DODE (update client connection) -  ${ws.webSocketID}`)
				} else{
					this._clients[loginData.login].destroy();
					client = new WSClient(loginData.login, loginData.token);
					debug(`ws connection authed DODE (replace client) -  ${ws.webSocketID}`)
				}
			} else{
				client = new WSClient(loginData.login, loginData.token);
				debug(`ws connection authed DODE (new client) -  ${ws.webSocketID}`)
			}

			client.setWs(ws);
			ws.wsHubClient = client;
			this._clients[client.login] = client;
			return true;
		}else{
			debug(`ws connection authed FAILED -  ${ws.webSocketID}`)
			return false;
		}
	}

	_processAction(action, ws){
		if(ws.isWsConnectionAuthed){
			this.emit(actionTypes.message, action, ws.wsHubClient);
		}
	}

	getClients(){
		return Object.keys(this._clients).map(key => this._clients[key]);
	}

	getClient(login){
		return this._clients[login];
	}
}

var hub = new WSHub();

module.exports.actionTypes = actionTypes;
module.exports.instance = hub;

var wsCallbackes = {};
hub.on(actionTypes.message, function(action, client){
	if(wsCallbackes[action.type]){
		wsCallbackes[action.type].forEach(callback =>{
			callback(client.login, action.data, action.error);
		});
	}
});

module.exports.actionsProxy = function(actionsObject){
	var result = {};
	for(let action of Object.keys(actionsObject)){
		result[action] = {
			type: actionsObject[action],
			emitTo: function(target, data, error){
				if(target === null){
					hub.getClients().forEach(c => {
						c.send(this.type, data, error);
					});
				} else if(target && target.forEach){
					target.forEach(c => {
						if(hub.getClient(c)){
							hub.getClient(c).send(this.type, data, error);
						}
					});
				} else if(typeof (target) === 'string' && hub.getClient(target)){
					hub.getClient(target).send(this.type, data, error);
				}
			},

			on: function(callback){
				if(!wsCallbackes[this.type]){
					wsCallbackes[this.type] = [];
				}

				wsCallbackes[this.type].push(callback);
			},

			off: function(callback){
				if(!wsCallbackes[this.type]){
					return;
				}

				wsCallbackes[this.type].splice(wsCallbackes[this.type].indexOf(callback), 1);
			}
		};
	}

	return result;
}