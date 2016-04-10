/**
 * Created by OLEG on 03.04.2016.
 */

const actions = require('../actions/system').actions;
module.exports.instance = function(state, action){
	switch(action.type){

		case actions.userLogin:{
			let newState = Object.assign({}, state, {login: action.login, token: action.token, connected: false, loginErrorMessage: ''});
			sessionStorage.setItem('system', JSON.stringify(newState));
			sessionStorage.setItem('loginData', JSON.stringify({login: newState.login, token: newState.token}));
			return newState;
		}

		case actions.userLoginFailed:{
			let newState = Object.assign({}, state, {loginErrorMessage: action.error});
			sessionStorage.setItem('loginData', JSON.stringify({login: '', token: ''}));
			return newState;
		}

		case actions.userLogout:{
			let newState = Object.assign({}, state, {login: null, token: null, connected: false});
			sessionStorage.setItem('system', JSON.stringify(newState));
			sessionStorage.setItem('loginData', JSON.stringify({login: '', token: ''}));
			return newState;
		}

		case actions.connectionOpened:{
			let newState = Object.assign({}, state, {connected: true});
			return newState;
		}

		case actions.connectionClosed:{
			let newState = Object.assign({}, state, {connected: false});
			return newState;
		}

		default: {
			if(state){
				return state;
			}

			if(state = sessionStorage.getItem('system')){
				return JSON.parse(state);
			}

			return {};
		}
	}
};