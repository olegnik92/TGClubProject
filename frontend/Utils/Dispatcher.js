/**
 * Created by OLEG on 22.01.2016.
 */

'use strict'
class Dispatcher{
	constructor(){
		this._callbacks = [];
		this._isDispatching = false;
		this._isHandled = [];
		this._isPending = [];
		this._lastID = 1;
		this._pendingPayload = null;
	}

	register(callback){
		let id = this._lastID++;
		this._callbacks[id] = callback;
		return id;
	}

	unregister(id){
		delete this._callbacks[id];
	}

	dispatch(payload){
		this._startDispatching(payload);
		try {
			for (var id in this._callbacks) {
				if (this._isPending[id]) {
					continue;
				}
				this._invokeCallback(id);
			}
		} finally {
			this._stopDispatching();
		}
	}

	dispatchAction(type, data, error){
		this.dispatch({
			type: type,
			data: data,
			error: error
		});
	}

	isDispatching() {
		return this._isDispatching;
	}


	waitFor(ids){
		for (var ii = 0; ii < ids.length; ii++) {
			var id = ids[ii];
			if (this._isPending[id]) {
				if(!this._isHandled[id]){
					throw new Error(`Dispatcher.waitFor(...): Circular dependency detected while waiting for ${id}`);
				}
				continue;
			}

			this._invokeCallback(id);
		}
	}

	_invokeCallback(id){
		this._isPending[id] = true;
		this._callbacks[id](this._pendingPayload);
		this._isHandled[id] = true;
	}

	_startDispatching(payload) {
		for (var id in this._callbacks) {
			this._isPending[id] = false;
			this._isHandled[id] = false;
		}
		this._pendingPayload = payload;
		this._isDispatching = true;
	}

	_stopDispatching() {
		this._pendingPayload = null;
		this._isDispatching = false;
	}

}


module.exports.instance = new Dispatcher();