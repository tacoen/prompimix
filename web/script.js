var default_rgp = ['[photorealistic sfw]','fashion theme','[close-up:1.5]','models fakename','mods','mods','background','lighting','quality'];

document.addEventListener("DOMContentLoaded", function() {
	exec_workspace()
	if ( Cookies.get('moon') ) {
		document.querySelector('html.tui').setAttribute('data-theme','dark')
	}
	document.querySelectorAll('main').forEach( function(e) { e.className='hide'; });
	var last = 	Cookies.get('last_page');
	if (typeof last == 'undefined') { last = 'info'; }
	tp_switch(last)
});
var last_scope = Cookies.get('scope');
function makelist(data,el,str='',attr={},) {
	var ele = document.createElement(el);
	if (attr !== {} ) {
		Object.keys(attr).forEach( function(a) { 
			ele.setAttribute(a,attr[a]) 
		})
	}
	data.forEach( function(d) { 
		var li = document.createElement('li');
		li.setAttribute('draggable',"true")
		li.setAttribute('ondragstart',"dragstart(event)")
		li.setAttribute('ondragend',"dragend(event)")
		li.id = safename(d+"_drg"+str);
		li.innerHTML = d;
		ele.append(li);
	})
	return ele;
}
function wrapper(what, el, attr={}) {
	var ele = document.createElement(el);
	if (attr !== {} ) {
		Object.keys(attr).forEach( function(a) { 
			ele.setAttribute(a,attr[a]) 
		})
	}
	ele.append(what);
	return ele;
}
function htmlEntities(s){
	return s.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
  		return '&#' + i.charCodeAt(0) + ';';
	});
}
function rgp_page() {
	let ta = new ta_jsfunc();
	var ltm = new Date();
	var rgp = Cookies.get('sample')
	if (typeof rgp == 'undefined') {
		rgp =default_rgp
	} else {
		rgp = rgp.split(','); 
	}
//	console.log(typeof rgp,rgp);
	var inp = document.createElement('input');
	inp.className='sample'
	inp.setAttribute('name','sample')
	inp.setAttribute('onchange','tp_rgpkeep(this)')
	
	inp.value = rgp.toString();
	
	var argp = []
	var prompts = ta.ls_get('prompts');
	rgp.forEach ( function(r) {
		if ( r.substr(0,1)=="[") {
			argp.push(r);
		}
		if ( Object.keys(prompts).includes(r)) { argp.push(r); }
	})
	
	//inp.value = argp.toString();
	
	var p = document.querySelector('#setting div.rgp');
	p.innerHTML = '';
	p.append(inp);
	
	var readme =  document.createElement('p');
	readme.className = 'note'
	readme.innerHTML="<b>Note:</b> for static prompts: use [ and ], like [photo]."
	
	p.append(readme);

	var olist = makelist(argp,'ul','o')
	var ulist = makelist(uniquesort(Object.keys(prompts)),'ul','u')

	var div = document.createElement('div');
	div.id = 'gdnd';
	div.append(wrapper(ulist,'div',{
			'id':'stock',
			'class':'stock dnd-area',
			'ondrop':"drop(event)", 
			'ondragover':"allowDrop(event)"
		} ));
	div.append(wrapper(olist,'div',{
			'id':'stack',
			'class':'stack dnd-area',
			'ondrop':"drop(event)", 
			'ondragover':"allowDrop(event)"
	} ));
	p.append(div);
}
async function exec_workspace(forceInit) {
	let ta = new ta_jsfunc();
	var ltm = Date.now();
	switch(forceInit) {
		case('blank'):
			console.log('blank:')		
			ta.ls_reset();
			var prompts = { "image type" : "[\"3d render\",\"anime\",\"digital-art\",\"photo\"]" }
			var spaces = {}
			var craft = []		
			break;
		case('json'):
			console.log('json:')
			ta.ls_reset();
			var prompts = await load_json('./prompts.json?void='+ltm);
			var spaces = await load_json('./spaces.json?void='+ltm);
			var craft = await load_json('./craft.json?void='+ltm);
			break;
		default:
			var prompts = {}
			var spaces = {}
			var craft = {}	
	}
	ta.ls_init({
		'spaces': spaces, 
		'prompts':prompts,
		'craft':craft
		}, forceInit);
	workspaces();
}
function workspaces() {
	let ta = new ta_jsfunc();
	var ltm = new Date();
	var prompts = ta.ls_get('prompts');
	var spaces = ta.ls_get('spaces');
	var rdat = new Object();
	document.querySelector('#prompt .data').innerHTML="";
	var last_scope = Cookies.get('scope');
	if (typeof last_scope !== 'undefined') {
		document.querySelector('#ped nav .scope').innerHTML = last_scope.replace("_"," ");
	}
	var datahtml = document.createElement('div'); datahtml.id = 'data'
	var tochtml = document.createElement('div'); tochtml.id = 'toc'
	var toc = document.createElement('ul');
	toc.innerHTML = "<li class='new'><span>New</span><button onclick='tp_addprompt(\"new\")'><i data-feather='edit'></i></button></li>"
	datahtml.innerHTML = "<div id='filter'><div class='filter'>"+
		"<input onclick='this.value=\"\";tp_filter()' "+		
		"autocomplete='off' type='text' class='filter' "+
		"onkeyup='tp_filter()' placeholder='Filters with at least 3 character...'>"+
		"<i data-feather='filter'></i></div></div>"
	uniquesort ( Object.keys(prompts) ).forEach( function(k,i) {
		var div = document.createElement('div');
		div.id = safename(k)
		if (typeof spaces[k] !== 'undefined') {
			if (typeof spaces[k]['data-prefix'] !== 'undefined'  ) {
				div.setAttribute('data-prefix',spaces[k]['data-prefix'])
			}
			if (typeof spaces[k]['data-suffix'] !== 'undefined' ) {
				div.setAttribute('data-suffix',spaces[k]['data-suffix'])
			}
		}
		rdat[k] = new Array();
		div.classList.add('topic')
		div.innerHTML = "<div class='rel'><h4 href='"+safename(k)+"'>"+k+"</h4><a href='#filter'><i data-feather='arrow-up'></i></a></div>"
		toc.innerHTML = toc.innerHTML + "<li class='"+safename(k)+"'><a href='#"+safename(k)+"'>"+k+"</a><button onclick='tp_addprompt(this)'><i data-feather='edit'></i></button></li>"
		var array = uniquesort ( JSON.parse(prompts[k]) );
		var list = document.createElement('div');
		list.className='list';
		array.forEach( function(w) {
			var li = document.createElement('span')
			li.innerHTML = w
			li.setAttribute('onclick','qcopy(this)')
			list.append(li);
			rdat[k].push(w);
		})
		rdat[k] = JSON.stringify(rdat[k]);
		div.append(list)
		datahtml.append(div);
		tochtml.append(toc)
	})
	document.querySelector('#prompt .data').append(tochtml)
	document.querySelector('#prompt .data').append(datahtml)
	var lastprompt = Cookies.get('prompt');
	if ( (typeof lastprompt !== 'undefined') && (lastprompt !== '') ){
		document.querySelector('#ped textarea').value = lastprompt 
	}
	var lastmixer = Cookies.get('mixer');
	if ( (typeof lastmixer !== 'undefined') && (lastmixer !== '') ){
		document.querySelector('#mixer').value = lastmixer 
	}
	feather.replace();
}
function finddupe() {
	let ta = new ta_jsfunc();
	var ltm = new Date();
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
function qcopy(obj) {
	if (obj.classList.contains('dupe')) {		
		obj.remove();
	} else {
		var prefix ='';
		var suffix = '';
		var temp = document.createElement('input')
		temp.value = ''
		temp.setAttribute('type','hidden');
		temp.value = obj.innerText
		var div = obj.closest('div.topic')
		var current_scope = div.id
		var prefix = div.getAttribute('data-prefix') || "";
		var suffix = div.getAttribute('data-suffix') || "";
		var txt = document.querySelector('#ped textarea').value;
		var last_scope = Cookies.get('scope');
		if (txt.length <1) { tp_scopeflush(); }
		//console.log(last_scope,current_scope);
		if (last_scope == current_scope) {
			var mixer = document.getElementById('mixer').value;
			var sep = ''
			if (suffix != "") {
				var regex = /\s+[^ ]+$/g;
				txt = txt.replace(regex,'');
			}
			var entry = mixer + temp.value +" "+ suffix;
		} else {
			var sep = ", "
			var entry = prefix +" "+ temp.value +" "+ suffix;
			last_scope = div.id
			Cookies.set('scope',div.id);
			document.querySelector('#ped nav .scope').innerHTML = last_scope.replace("_"," ");
		}
		cursorPosition = document.querySelector('#ped textarea').selectionStart;
		//console.log(cursorPosition)
		let before = txt.substring(0,cursorPosition);
		let after = txt.substring(cursorPosition,txt.length);
		if (txt.length <1) { 
			document.querySelector('#ped textarea').value = entry
		} else {
			if ( cursorPosition >= txt.length) {
				document.querySelector('#ped textarea').value = txt + sep + entry
			} else {
				document.querySelector('#ped textarea').value = before + entry + after
			}
		}
		tp_cookies(document.querySelector('#ped textarea'))
	}
}
function create_craftlist() {
	let ta = new ta_jsfunc();
  var notes = ta.ls_get('craft');
  //console.log(typeof notes, notes.length);
  var nts = ''; var c = 0;
  if ((typeof notes !== 'undefined') && (typeof notes.length !== 'undefined') ) {
	notes.forEach( function(n,i) {
		nts = nts + "<div class='note'><button onclick='tp_arcopy(this)'><i data-feather='copy'></i></button><textarea class='txt'>"
		nts = nts + n 
		nts = nts + "</textarea></div>";
		c = c + 1;
	});
	}
	// document.getElementById('craftcount').innerHTML =c;
	document.getElementById('collection').innerHTML = nts
}

function tp_help() {

	var hlp = document.querySelector('main.show').id
	
	wiki = {
		'info':'https://github.com/tacoen/prompimix/wiki',
		'prompt':'https://github.com/tacoen/prompimix/wiki/prompt',
		'craft':'https://github.com/tacoen/prompimix/wiki/craft',
		'json':'https://github.com/tacoen/prompimix/wiki/json',
		'setting':'https://github.com/tacoen/prompimix/wiki/setting'
	}
	
	if (typeof wiki[hlp] == 'undefined') { wiki[hlp] = 'https://github.com/tacoen/prompimix/wiki/'+hlp }
	window.open(wiki[hlp],'_prompimix_help')
		
	
}