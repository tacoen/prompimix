let host = window.location.pathname.toLowerCase().replace(/\W/g,"");

function ta_lscookie() {
	let hc = window.location.pathname.toLowerCase().replace(/\W/g,"");
	let k = '_cookies_'
	this.set = function (what,value) {
		localStorage.setItem(hc+k+what, value);
	},
	this.get = function (what) {
		if ( localStorage.getItem(hc+k+what) ) {
			return localStorage.getItem(hc+k+what)
		}
	},
	this.remove = function (what) {
		localStorage.removeItem(hc+k+what);
	}
}

let Cookies = new ta_lscookie();

function ta_jsfunc() {
	this.create = function(query, etag, attr={}, inner="") {
		let p = document.querySelector(query);
		var el = document.createElement(etag);
		Object.keys(attr).forEach( function(a) { el.setAttribute(a,attr[a]) });
		if (typeof inner == 'string') {
			if (inner !== "") { el.innerHTML=inner.trim() }
		} else {
			for (var i = 0; i < Object.keys(inner).length; i++) {
				el.append(inner[i]);
			}
		}
		p.append(el)
	},
	this.fetch = function(query,url,chains,chain_var='') {
		fetch(url).then((response) => response.text()).then((html) => {
			let p = document.querySelector(query);
			p.innerHTML = html.trim();
			if (typeof chains !== 'undefined') {
				window[chains](query,chain_var);
			}
		})
		.catch((error) => {
			console.warn(error);
		});
	},
	this.ls_check = function() {
		
//		let host = window.location.pathname.toLowerCase().replace(/\W/g,"");
		
		if ((typeof localStorage.getItem(host) === 'undefined') ||
			(localStorage.getItem(host) === null) ) {
			console.log('no data');
			return false;
		} else {
			return true;
		}
	},
	
	this.ls_reset = function () {
//		let host = window.location.pathname.toLowerCase().replace(/\W/g,"");
		localStorage.removeItem(host);
		console.log("ls_reset",host);
	}
	this.ls_init = function(data={},forced=false) {
//		let host = window.location.pathname.toLowerCase().replace(/\W/g,"");
		if (forced) {
			localStorage.setItem(host,JSON.stringify(data));
			console.log("ls_init: (forced)",host)
		} else {
			if ((typeof localStorage.getItem(host) === 'undefined') ||
				(localStorage.getItem(host) === null) ) {
				localStorage.setItem(host,JSON.stringify(data));
				console.log("ls_init:",host)
			} else {
				console.log("ls_load:",host)
			}
		}
	},
	this.ls_save = function(what,data) {
//		let host = window.location.pathname.toLowerCase().replace(/\W/g,"");
		// console.log(host,what,data)
		var sdata = JSON.parse(localStorage.getItem(host));	
//		what2 = '\"'+what+'\"'
		sdata[what]=JSON.parse(data);
		localStorage.setItem(host,JSON.stringify(sdata));
		var data = JSON.parse(localStorage.getItem(host));	
		console.log('ls_save:'+what);
	}
	this.ls_jsbak = function() {
		var da = {}
		da['prompts'] = this.ls_get('prompts');	
		da['spaces'] = this.ls_get('spaces');	
		da['pattern'] = this.ls_get('pattern');
		da['crafts'] = this.ls_get('crafts');
		return jsbak = "var jsbak =" + JSON.stringify(da) +"\n\n"+"// prompimix m4.0"
	},
	this.ls_get = function(k,w=false) {
		
		var data = JSON.parse(localStorage.getItem(host));
		if (!w) { return data[k]; } else { return data[k][w]; }
	},
	this.selection = function(w,array) {
		var selectList = document.createElement("select");
		selectList.name = w+ "_select";
		var option = document.createElement("option");
		option.value = "";
		option.text = "(none)";
		selectList.appendChild(option);
		selectList.setAttribute('onchange',"tp_input(this)");
		for (var i = 0; i < array.length; i++) {
			var option = document.createElement("option");
			option.value = array[i];
			option.text = array[i];
			selectList.appendChild(option);
		}
		return selectList;
	}
}
