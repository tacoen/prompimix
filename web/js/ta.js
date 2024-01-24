function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function uniquesort(retArray) {
	retArray.sort((b, a) => b.localeCompare(a));
	return retArray.filter(onlyUnique);
}

function cleantp(text) {
    text = text.replace(/^\,|\,$/gi, "");
    text = text.replace(/\s\s+/gi, " ");
    text = text.replace(/\s,/gi, ",").replace(/\:\s+/gi, ":");
    text = text.replace(/\(\s+/gi, "(").replace(/\s+\)/gi, ")").replace(/\{\s+/gi, "{").replace(/\s+\}/gi, "}");

	//    text = text.replace(" ,",", ");
//    text = text.replace(",,", ",");
//    text = text.replace(", ,", ",");
    text = text.replace(/,,/gi, ",");
	return text;
}


function tp_toggle(obj) {
    var el = obj.closest('section');

	var sclass = el.className.replace('on_input','');

	if (el.classList.contains('on_input')) {
        el.className = sclass;
        //build_selection(s);
    } else {
        el.className = "on_input" + " " + sclass.trim();
    }
}

function tpout_update() {
    var sel = Array.from(document.querySelectorAll("#spaces section"));

    var wo = [];
    var wn = [];
	
    sel.forEach(function(e, n) {
		var o = parseInt(e.getAttribute('data-order'));
		if (typeof wo[o] == 'undefined') {
			wo[o] = e;
//			console.log(n, o, "wo", e.getAttribute('data-tp'))
		} else {
			//wo[o*n] = e;
			//console.log(n, o, "wo", e.getAttribute('data-tp'))
			wo.push(e);
		}

	});
	
	//console.log(wo);
	
	//wo = Object.assign(wa,wo)

	var ar = [];
	
    wo.forEach(function(i, n) {
		var prefix ="";
		var suffix ="";
        if ( (i.getAttribute('data-tp') !== null) && (i.getAttribute('data-tp') !== '')) {

            var val = i.getAttribute('data-tp');
			if ((i.getAttribute('data-prefix') !== null) && (i.getAttribute('data-prefix') !== '')) {
				var prefix = i.getAttribute('data-prefix') + " ";
			}
			if ((i.getAttribute('data-suffix') !== null) && (i.getAttribute('data-suffix') !== '')) {
				var suffix = " " + i.getAttribute('data-suffix');
			}
			
//			console.log(n,'val',val);

			ar.push( " "+ prefix + val + suffix );
        }


    })

    var text = ar.toString();
    document.getElementById('output').value = cleantp(text.trim().toLowerCase());
}

function tp_input(obj) {
    if (obj.tagName == "SELECT") {
        var txt = obj.options[obj.options.selectedIndex].text.trim();
		obj.closest('section').querySelector(".input textarea").value=txt

    } else {

        var txt = obj.value.trim();
		var sel = obj.closest('section').querySelector(".select select")

		for (var i = 0; i < sel.options.length; ++i) {
			if (sel.options[i].text === txt) {
				sel.options[i].selected = true;
				vok = true;
			}
		}
	}

	obj.closest('section').setAttribute('data-tp',txt)

	tpout_update();

}


function tp_copy() {
    var copyText = document.getElementById("output");
    copyText.select();
    document.execCommand("copy");
}

function tp_add(obj) {

	var txt = obj.closest('section').querySelector(".input textarea").value.trim()
	var sel = obj.closest('section').querySelector(".select select")
	var option = document.createElement("option");
	option.value = txt;
	option.text = txt;
	option.setAttribute('selected','selected')
	sel.appendChild(option);
    obj.closest('section').setAttribute("data-tp", txt.trim() )
}


async function load_json(w) {
	try {
		console.log('load json: '+w);
		var ls = await fetch(w)
		var lsdata = await ls.json();
		return lsdata;
	} catch (error) {
        console.log('Error fetching and parsing data', error);
    }

}


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
	
	this.ls_init = function(data={},forced=false) {
		let host = window.location.pathname.toLowerCase().replace(/\W/g,"");

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
		let host = window.location.pathname.toLowerCase().replace(/\W/g,"");
		// console.log(host,what,data)
		var sdata = JSON.parse(localStorage.getItem(host));	
//		what2 = '\"'+what+'\"'
		sdata[what]=JSON.parse(data);
		localStorage.setItem(host,JSON.stringify(sdata));
		var data = JSON.parse(localStorage.getItem(host));	
		console.log(data);
	}
	
	this.ls_get = function(k,w=false) {
		let host = window.location.pathname.toLowerCase().replace(/\W/g,"");
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
