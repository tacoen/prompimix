function komadeal(obj) {
	var txta = obj.closest('div.ddform').querySelector('textarea[name=prompt_entries]');
	console.log(txta)
	var txtnya = txta.value;
	txta.value = txtnya.replace(/\,/gi,'\n')
}
	
function __mergeJSON(json1, json2) {
  const mergedJSON = { ...json1 };

  for (let key in json2) {
	  
	if ( ! Object.keys(json1).includes(key) ) {
			console.log('+',key);
	}		
	 
    if (json2.hasOwnProperty(key)) {
      if (mergedJSON.hasOwnProperty(key) && typeof mergedJSON[key] === 'object' && typeof json2[key] === 'object') {
        mergedJSON[key] = mergeJSON(mergedJSON[key], json2[key]);

      } else {
        mergedJSON[key] = json2[key];

      }
    }
  }

  return mergedJSON;
}



function findprompt(value) {
	var vfinds = []
	var kfinds = []
	let ta = new ta_jsfunc();
	var p1 = ta.ls_get('prompts');	
	Object.keys(p1).forEach( function(k) { 
		if (k.includes(value)) { kfinds.push(k) }
		if (p1[k].includes(value)) { vfinds.push(k) }
	})
	return { 'key':kfinds,'val':vfinds }
}
function packJSON(what) {
	let ta = new ta_jsfunc();
	var p1 = ta.ls_get('prompts');	
	var finds = findprompt(what);
	var data = {}; data['prompts'] = {}
	console.log(finds);
	finds['key'].forEach ( function(k) {
		data['prompts'][k] = p1[k]
	})
	
	qdownload(JSON.stringify( data ),what+".json")
}

function json_pack(obj) {
	let ta = new ta_jsfunc();
	var p1 = ta.ls_get('prompts');	
	var lstack = obj.closest('div.stack')
	var list = lstack.querySelector('ul').querySelectorAll('li:not(.static)')
	var what = lstack.querySelector('h3').innerText
	var array = []
	var data = {}; 
	list.forEach( function(lk) {
		array.push(lk.innerText)
	});
	console.log(array);
	array.forEach ( function(k) {
		data[k] = p1[k]
	})
	
	qdownload(JSON.stringify( data ),what+".json")	
}

function pkremove(what) {
	let ta = new ta_jsfunc();
	var p1 = ta.ls_get('prompts');	
	
	const removeKey = (key, {[key]: _, ...rest}) => rest;
	
	var nprompts = removeKey(what, p1);
	
	console.log(nprompts)
	ta.ls_save('prompts',JSON.stringify(nprompts));
}

async function mergeJSON2LS(file) {

	let ta = new ta_jsfunc();
	var p1 = ta.ls_get('prompts');	
	var p2 = await load_json(file);
	var nprompts = __mergeJSON(p1,p2)
	console.log(Object.keys(p1).length, Object.keys(p2).length, Object.keys(nprompts).length);
	ta.ls_save('prompts',JSON.stringify(nprompts));

}

function resetcookies() {
	var c = ['scope','last_page','template','moon']; 
	c.forEach ( function(t) { 
		Cookies.remove(t)
	});
	console.log('Cookies reset...');
}
function build_jsbak() {
	let ta = new ta_jsfunc();
	return ta.ls_jsbak()
}
function do_json_asvar_restore() {
	console.log(jsbak);
	let ta = new ta_jsfunc();
	ta.ls_reset();
	ta.ls_init({
		'spaces':jsbak['spaces'], 
		'prompts':jsbak['prompts'],
		'crafts':jsbak['crafts'],
		'leads':jsbak['leads']
		}, 1);	
}

function load_json_asvar() {	
	let ta = new ta_jsfunc();
	if (ta.ls_check()) {
		console.log('Already Populated')
	} else {
		console.log('using: json-var.js');
		loadScript("./data/json-var.js", do_json_asvar_restore);
	}
}

function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
function fixprompts() {
	let ta = new ta_jsfunc();
	var prompts = ta.ls_get('prompts');	
	var spaces = ta.ls_get('spaces');
	console.log('before',prompt);
	var nprompts = {}
	uniquesort( Object.keys(prompts)).forEach( function(p) {
		np = uniquesort(JSON.parse(prompts[p]));
		nprompts[p] = JSON.stringify(np);
		console.log(p,np.length+" items")
	})
	console.log('after',nprompts)
	ta.ls_save('prompts',JSON.stringify(nprompts));
}
function fixspace() {
	let ta = new ta_jsfunc();
	var prompts = ta.ls_get('prompts');	
	var spaces = ta.ls_get('spaces');
	console.log(spaces);
	var nspaces = {}
	uniquesort( Object.keys(spaces)).forEach( function(s) {
		if (Object.keys(prompts).includes(s)) {
			nspaces[s] = spaces[s]
		} else {
			console.log(s,'missing...')
		}
	})
	console.log(nspaces)
	ta.ls_save('spaces',JSON.stringify(nspaces));
}
function finddupe() {
	let ta = new ta_jsfunc();
	//var cleanhtml = document.querySelector("#setting .rgp");
	var prompts = ta.ls_get('prompts');
	var rdat = new Object();
	var exist = []
	uniquesort ( Object.keys(prompts) ).forEach( function(k,i) {
		var div = document.createElement('div');
		div.id = safename(k)	
		rdat[k] = new Array();
		div.classList.add('topic')
		div.innerHTML = "<div class='rel'><h4 href='"+safename(k)+"'>"+k+"</h4><a href='#filter'><i data-feather='arrow-up'></i></a></div>"
		var array = uniquesort ( JSON.parse(prompts[k]) );
		var list = document.createElement('div');
		list.className='list';
		var ignore = []
		array.forEach( function(w) {
			if ( exist.includes(w) ) {
				ignore.push(w);
			} else {
				var li = document.createElement('span')
				li.innerHTML = w
				list.append(li);
				exist.push(w);
				//rdat[k].push(w);				
			}	
		})
		//console.log(safename(k), ignore);
		var els = document.querySelectorAll('.data #data div#'+safename(k)+" div.list span")
		els.forEach( function(el) {
			if (ignore.includes(el.innerText)) {
					el.classList.add('dupe')
					console.log(el);
			}
		})
		//div.append(list)
		//cleanhtml.append(div);	
	})
	// rdat[k] = JSON.stringify(rdat[k]);
}