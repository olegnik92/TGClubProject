/**
 * Created by OLEG on 26.01.2016.
 */

class HTTPUtils{

	isGoodStatus(status){
		return 199 < status && status < 300;
	}

	post(url, data){
		var self = this;
		return new Promise(function(resolve, reject){
			let xhr = new XMLHttpRequest();
			var json = JSON.stringify(data);
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

			xhr.onreadystatechange = function(){
				if (this.readyState != 4)
					return;

				var result = JSON.parse(this.responseText);
				if(self.isGoodStatus(this.status)){
					resolve(result);
				} else {
					reject(result);
				}
			};
			xhr.send(json);
		});
	}
}


module.exports.instance = new HTTPUtils();