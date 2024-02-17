var template_default = ['media','models','facial features','art style','art artist'];
document.addEventListener("DOMContentLoaded", function() {
	var prot = window.location.protocol;
	if (prot == 'file:') {
		console.log('Protocol:'+prot)
		load_json_asvar();
	} 
	exec_workspace()
	if ( Cookies.get('moon') ) {
		document.querySelector('html.tui').setAttribute('data-theme','dark')
	}
	document.querySelectorAll('main').forEach( function(e) { e.className='hide'; });
	var last = 	Cookies.get('last_page') || 'landing';
	tp_switch(last)
	ddata = document.getElementById('data');
	ddata.addEventListener('scroll',(e)=> {
		var t = ddata.scrollTop
		var fi = document.getElementById('filter');
		if (t > 41) {
			fi.style.width = fi.offsetWidth +"px"
			fi.style.height = "calc("+ fi.offsetHeight +"px + 1 rem)"
			fi.style.top = fi.offsetTop +"px"
			fi.style.left = fi.offsetLeft +"px"
		}
		if (t > 42) {
			fi.classList.add('fixed') 
		} else {
			fi.classList.remove('fixed') 
		}
	});
	const formupload = document.getElementById('import');
	formupload.addEventListener('click', handleuploadSubmit);
});
function handleuploadSubmit() {
    var files = document.getElementById('selectFiles').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }
	var fr = new FileReader();
	let ta = new ta_jsfunc();
	var p1 = ta.ls_get('prompts');		
  fr.onload = function(e) { 
  // console.log(e);
    var result = JSON.parse(e.target.result);
	var nprompts = __mergeJSON(p1,result)
	// console.log(Object.keys(p1).length, Object.keys(result).length, Object.keys(nprompts).length);
    //var formatted = JSON.stringify(nprompts, null, 2);
    //document.getElementById('result').value = formatted;
	ta.ls_save('prompts',JSON.stringify(nprompts));	
  }
  fr.readAsText(files.item(0));
};
var last_scope = Cookies.get('scope');
async function exec_workspace(forceInit) {
	let ta = new ta_jsfunc();
	let Cookies = new ta_lscookie();
	var ltm = Date.now();
	let template = { "default": JSON.stringify(template_default) }
	switch(forceInit) {
		case('blank'):	
			ta.ls_reset();
			var prompts = { "art style" : "[\"3d render\",\"anime\",\"digital-art\",\"photo\"]" }
			var spaces = {}
			var crafts = []		
			var leads = template	
			break;
		case('json'):
			console.log('json:')
			ta.ls_reset();
			var prompts = await load_json('./data/prompts.json?void='+ltm);
			var spaces = await load_json('./data/spaces.json?void='+ltm);
			var crafts = await load_json('./data/crafts.json?void='+ltm);
			var leads = await load_json('./data/leads.json?void='+ltm);
			break;
		default:
			var prompts = {}
			var spaces = {}
			var crafts = []	
			var leads = template	
	}
	ta.ls_init({
		'spaces': spaces, 
		'prompts':prompts,
		'crafts':crafts,
		'leads':leads
		}, forceInit);
	workspaces();
}
function workspaces() {
	let ta = new ta_jsfunc();
	let Cookies = new ta_lscookie();
	var prompts = ta.ls_get('prompts');
	var spaces = ta.ls_get('spaces');
	var rdat = new Object();
	document.querySelector('#prompts .data').innerHTML="";
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
	var tocndx=''
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
		tocndx = tocndx + "<li class='"+safename(k)+"'><a href='#"+safename(k)+"'>"+k+"</a><button onclick='tp_addprompt(this)'><i data-feather='edit'></i></button></li>"
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
	})
	toc.innerHTML = toc.innerHTML +tocndx; 
	tochtml.append(toc);
	document.querySelector('#prompts .data').append(tochtml)
	document.querySelector('#prompts .data').append(datahtml)
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
function craftslist() {
	let ta = new ta_jsfunc();
  var notes = ta.ls_get('crafts');
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
	// document.getElementById('craftscount').innerHTML =c;
	document.getElementById('collection').innerHTML = nts
}
function tp_help() {
	var hlp = document.querySelector('main.show').id
	wiki = {
		'info':'https://github.com/tacoen/prompimix/wiki',
		'prompts':'https://github.com/tacoen/prompimix/wiki/Workspaces',
		'leads':'https://github.com/tacoen/prompimix/wiki/Template',
		'crafts':'https://github.com/tacoen/prompimix/wiki/Crafted',
		'json':'https://github.com/tacoen/prompimix/wiki/json',
	}
	if (typeof wiki[hlp] == 'undefined') { wiki[hlp] = 'https://github.com/tacoen/prompimix/wiki/'+hlp }
	window.open(wiki[hlp],'_prompimix_help')
}