/**
 * Created by OLEG on 26.01.2016.
 */
function s4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function Utils(){
	this.guid  = function(){
		var guid = (s4() + s4() + "-" + s4() + "-4" + s4().substr(0,3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
		return guid;
	};
}

module.exports.instance = new Utils();