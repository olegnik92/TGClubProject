/**
 * Created by OLEG on 03.04.2016.
 */

var Redux = require('redux');
var reducer = Redux.combineReducers({
	system: require('./reducers/system').instance
});
var store = Redux.createStore(reducer);
module.exports.instance = store;