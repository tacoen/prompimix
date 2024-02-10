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