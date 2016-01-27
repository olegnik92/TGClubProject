/**
 * Created by OLEG on 27.01.2016.
 */


'use strict'

class Store{
	constructor(){
		this._callbacks = [];
	}

	onStateChangedRegister(callback){
		this._callbacks.push(callback);
	}

	onStateChangedUnRegister(callback){
		this._callbacks.splice(this._callbacks.indexOf(callback), 1);
	}

	stateChanged(){
		this._callbacks.forEach(callback => callback());
	}

	//for override
	getState(){
		return {};
	}
}

module.exports = Store;