/**
 * Created by OLEG on 26.01.2016.
 */

'use strict'
var EventEmitter = require('events');
var WebSocketServer = require('ws').Server;
var debug = require('debug')('tgc:wsHub');
var authModule = require('./services/auth');
var auth = authModule.instance;
var actions = require('./frontend/Common/Actions').instance;
var utils = require('./services/utils').instance;

class WSClient{
	constructor(login){
		this.login = login;
		this._ws = null;
		this._queue = [];
		this._sendInterval = 100;
		this._intervalRef = setInterval(this._sendQueue.bind(this), this._sendInterval);

	}

	send(actionType, data, error){
		this._queue.push({type: actionType, data: data, error: error});
	}

	destroy(){
		clearInterval(this._intervalRef);
		this.send('AUTH_LOGIN_REUSED', null, 'Логин был использован кем-то другим');
		this._sendQueue();
		this._ws.close()
	}

	setWs(ws){
		this._ws = ws;
	}

	_sendQueue(){
		while (this._queue.length > 0){
			if(!this._ws){
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
	}
}

var actionTypes = {
	connection: 'WSS_CONNECTION',
	message: 'WSS_MESSAGE',
	clientClose: 'WSS_CLIENT_CLOSE'
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
			debug(`ws new connection ${ws.webSocketID}`);
			this.emit(actionTypes.connection, ws);
			ws.isWsConnectionAuthed = false;
			setTimeout(() => {
				if(!ws.isWsConnectionAuthed) {
					ws.close();
				}
			}, this._notAuthCloseTime);

			ws.on('message', (message) => {
				debug(`ws receive message ${ws.webSocketID} --- ${message}`);
				let action = null;
				try{
					action = JSON.parse(message);
					this._processAction(action, ws);
				} catch (error){
					debug(`ERROR BAD MESSAGE ${error}`);
				}
			});


			ws.on('close', function(){
				debug(`ws connection closed ${ws.webSocketID}`);
			});

		});
	}

	_processAction(action, ws){
		if(action.type === actions.openWsConnection.type){
			let user = auth.getUser(action.data.login);
			if(user && user.token === action.data.token){
				ws.isWsConnectionAuthed = true;
				let client = new WSClient(action.data.login);
				client.setWs(ws);
				ws.wsHubClient = client;
				if(this._clients[client.login]){
					this._clients[client.login].destroy();
				}
				this._clients[client.login] = client;
			}
		}

		if(ws.isWsConnectionAuthed){
			this.emit(actionTypes.message, action, ws.wsHubClient);
		}
	}

	getClients(){
		return this._clients;
	}

	getClient(login){
		return this._clients[login];
	}
}

var hub = new WSHub();

module.exports.actionTypes = actionTypes;
module.exports.instace = hub;