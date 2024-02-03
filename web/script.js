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

function tp_scopeflush() {
	Cookies.remove('scope');
	document.querySelector('#ped nav .scope').innerHTML = '';
}

function swcolor() {
	var h = document.querySelector('html.tui')
	if (h.getAttribute('data-theme') == 'dark') {
		h.removeAttribute('data-theme')
		Cookies.remove('moon');
	} else {
		h.setAttribute('data-theme','dark')
		Cookies.set('moon',1);
	}
	
}

function opoiki() {
	var ck = Cookies.get('lcss');
	
	if (typeof ck === 'undefined') {
		ck = {};
		ck['bg'] 			='#eee';
		ck['main-width'] 	='100%';
		ck['nav-bg'] 		='#ccc';
		ck['nav-color'] 	='#333';
		ck['nab-mini-h'] 	="40px";
		ck['nav-mini-hover']='#111';
		ck['nav-v-bg'] 		='#222';
		ck['nav-v-color'] 	='#ddd';
		ck['nav-v-hover'] 	='#fff';		
		ck['nav-v-w'] 		='42px';
		ck['ta-h'] 			='12vh';		
		
	}

	var ca = {
		"bg"			:['main background',   	ck['bg'] 			],
		"main-width"	:['main width',			ck['main-width'] 	],
		"nav-bg"		:['nav bg',        		ck['nav-bg'] 		],
		"nav-color"		:['nav color',  		ck['nav-color'] 	],
		"nav-mini-h"	:['nav-mini-h',			ck['nab-mini-h'] 	],
		"nav-mini-hover":['nav-mini-hover',		ck['nav-mini-hover']],
		"nav-v-bg"		:['nav-v-bg',			ck['nav-v-bg'] 		],
		"nav-v-color"	:['nav-v-color',		ck['nav-v-color'] 	],
		"nav-v-hover"	:['nav-v-hover',		ck['nav-v-hover'] 	],
		"nav-v-w"		:['nav-v-w',			ck['nav-v-w'] 		],
		"ta-h"			:['ta-h', 				ck['ta-h'] 			],
	};


	Object.keys(ca).forEach( function(c){
		//document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');
		console.log ('--'+c,ca[c][1])
		document.documentElement.style.setProperty('--'+c, ca[c][1]);
		
		
	})


}

async function exec_workspace(forceInit) {
	
	let ta = new ta_jsfunc();
	var ltm = Date.now();
	
	var prompts = await load_json('./prompts.json?void='+ltm);
	var spaces = await load_json('./spaces.json?void='+ltm);
	var clip = await load_json('./clip.json?void='+ltm);

	ta.ls_init({
		'spaces': spaces, 
		'prompts':prompts,
		'clip':clip
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

function findupe() {
	let ta = new ta_jsfunc();
	var ltm = new Date();

	//var cleanhtml = document.querySelector("#setting .settings");
	
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
	
		console.log(safename(k), ignore);

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
		
		var mixer = document.getElementById('mixer').value;
	
		var temp = document.createElement('input')
		temp.value = ''
		temp.setAttribute('type','hidden');
		temp.value = obj.innerText
		
		var div = obj.closest('div.topic')
		
		var prefix = div.getAttribute('data-prefix') || "";
		var suffix = div.getAttribute('data-suffix') || "";
		var txt = document.querySelector('#ped textarea').value;
	
		if (last_scope == div.id) {
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

function create_cliplist() {
	
	let ta = new ta_jsfunc();
	
  var notes = ta.ls_get('clip');
  
  // console.log(typeof notes);
  
  var nts = ''; var c = 0;
  
  if (typeof notes !== 'undefined') {

	notes.forEach( function(n,i) {
	
		nts = nts + "<div class='note'><button onclick='tp_arcopy(this)'><i data-feather='copy'></i></button><textarea class='txt'>"
		nts = nts + n 
		nts = nts + "</textarea></div>";
		c = c + 1;

	});

	}

	// document.getElementById('clipcount').innerHTML =c;
	document.getElementById('collection').innerHTML = nts
}

