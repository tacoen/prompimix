function tp_switch(id) {

	document.querySelectorAll('main').forEach( function(e) { e.className='hide'; });
	document.querySelector('main#'+id).className='show';
	
	switch(id) {

		case 'clip':
			create_cliplist();
			break;
		case 'workspace':
			workspaces();
			break;
		case 'setting':
			setting_page();
			break;
		default:
	}

	Cookies.set('last_page',id);
	feather.replace();

}


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

function tp_addprompt(obj) {

	var kar = ['data-prefix','data-suffix']
	var vkar = {}
	
	if (obj !== 'new') {

		// collecting
		
		var t = obj.closest('li').className;
		var ti = obj.closest('li').querySelector('a').innerText.toLowerCase();
		var indata = Array.from(document.querySelector('.data #data #'+t+' div.list').children);
		//console.log(indata)
		var collect =[]
		
		Array.from(indata).forEach( function (s) { 
			collect.push(s.innerText) 
		}); 
		
		kar.forEach( function(k) {
			vkar[k] = document.getElementById(safename(t)).getAttribute(k)
			// console.log ( vkar[k] );
		});

	} else {
		
		// new
		
		var t = 'new'
		var ti = ''
		var collect = []
		kar.forEach( function(k) {
			vkar[k] = ''
		});
	}
	
	// filling
	
	var div = document.querySelector('#prompt div.data')

	div.innerHTML = document.getElementById('ddform').innerHTML;
	
	document.querySelector('#prompt .ddform textarea').classList.add(t);	
	document.querySelector('#prompt .ddform textarea').value = collect.toString().trim();
	document.querySelector('#prompt .ddform .warn button').setAttribute('onclick',"tp_newp('"+t+"')")	

	document.querySelector("#prompt .ddform input[name='name']").value = ti.trim();

	/*
	if (obj !== 'new') {
		document.querySelector("#prompt .ddform input[name='name']").setAttribute('readonly',true);
	}
	*/
	
	kar.forEach( function(k) {
		document.querySelector("#prompt .ddform input[name='"+k+"']").value = vkar[k]
	});	


}

function tp_newp(what) {
	let ta = new ta_jsfunc();
	var ltm = new Date();

	var txt = document.querySelector('.data .ddform textarea.'+what).value;

	if (what == 'new') {
		what = document.querySelector(".data .ddform input[name='name']").value.trim();
		var t = what.replace("_"," ").toLowerCase();
		console.log('update: '+t);
	} else {
		what = document.querySelector(".data .ddform input[name='name']").value.trim();
		var t = what.replace("_"," ").toLowerCase();
	}

	var prompts = ta.ls_get('prompts');
	var spaces = ta.ls_get('spaces');	

	
	if (typeof spaces[t] == 'undefined') { spaces[t] = {} }
		
	if (txt.length > 1) {

		// prompts
		
		txt = txt.replace(/\n|\r/g,",");
		//txt = tp_trim(txt);
		txt = txt.replace(/, | ,/g,",")
		
		//console.log(txt);
		
		var array = txt.split(',')
		
		array = uniquesort(array);
		
		what = document.querySelector(".data .ddform input[name='name']").value.trim()

		prompts[t]= JSON.stringify(array);

		// spaces
		
		var kar = ['data-prefix','data-suffix']
			
		kar.forEach( function(k) {
			var txt = document.querySelector(".data .ddform input[name='"+k+"']").value.trim()
			txt = txt.replace('"','');
			spaces[t][k] = txt
		});
		
		console.log('update: '+t);

	} else {
		console.log('delete: '+t);
		delete prompts[t];
		delete spaces[t];
	}

	//console.log(spaces);
	
	ta.ls_save('spaces',JSON.stringify(spaces));
	ta.ls_save('prompts',JSON.stringify(prompts));
	
	workspaces();
}

function tp_gift() {

	let ta = new ta_jsfunc();
	var ltm = new Date();

	var prompts = ta.ls_get('prompts');
	//var spaces = ta.ls_get('spaces');
	var rgp = []
	rgp = Cookies.get('gift');
	
	// console.log('1',typeof rgp,rgp)
	
	if (typeof rgp == 'undefined') {
		rgp = ['quality','views','photo style','views','models','body type','body features','hair type','pose','pose extend','background','condition','condition','theme','lighting']
	} else {
		rgp  = rgp.toString().split(",");
	}


	
	var rgp_txt = ''
	
	// console.log(prompts);

	//console.log('2',typeof rgp,rgp)
	
	rgp.forEach( function(p) {
		
		if (typeof prompts[p] != 'undefined') {
		
			var ar = JSON.parse(prompts[p])
			var txt = ar[Math.floor(Math.random() * ar.length)];
	
			var pref = document.getElementById(safename(p)).getAttribute('data-prefix') || "";
			var suff = document.getElementById(safename(p)).getAttribute('data-suffix') || "";
			
			var txt = pref + " "+ txt+ " " + suff;
			
			if (rgp_txt.trim() == '') {
				rgp_txt = txt
			} else {
				rgp_txt = rgp_txt + ", " + txt
			}
		
		}
	})
	
	document.querySelector('#ped textarea').value = tp_trim(rgp_txt);
	
	tp_cookies(document.querySelector('#ped textarea'))

}

function tp_jsonDownload(what) {
	let ta = new ta_jsfunc();
	let lsdata = JSON.stringify( ta.ls_get(what) ).toLowerCase();
    const link = document.createElement("a");
    let dt= Date.now();
    const file = new Blob([lsdata], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = dt+"-"+what+".json";
    link.click();
    URL.revokeObjectURL(link.href);  
}

function tp_clear(what) {
    document.querySelector(what).value=''
	Cookies.remove('prompt')
}

function tp_resetjson() {
	
	let ta = new ta_jsfunc();
	ta.ls_reset();
	window.location.reload(); 
	
}

function tp_cookies(obj) {
	var cname = obj.getAttribute('name')
	
	console.log('c',name);
	
	//console.log(cname,obj.value.trim());
	Cookies.set(cname,obj.value.trim());

}


function tp_copytxt(what) {
    var cText = document.querySelector(what);
    cText.select();
    document.execCommand("copy");
}

function tp_clipit(what) {
    var cText = document.querySelector(what).value;
	
	let ta = new ta_jsfunc(); 
	let notes = ta.ls_get('clip');

	if (typeof notes === 'undefined') { notes = [] }
  
	notes.push ( cText.trim() )
	ta.ls_save('clip', JSON.stringify ( notes ) )	
}


function tp_filter() {
	
	var words = document.querySelectorAll('#data .topic span');
	var query = document.querySelector('#data input.filter').value.toLowerCase();
	var toc = document.getElementById('toc');
	var data = document.getElementById('data');	

	if (query.length < 3) {
		
		toc.classList.remove('filter')
		data.classList.remove('filter')

		document.querySelectorAll('#toc li').forEach( function(li) {
			li.removeAttribute('found')
		})

		document.querySelectorAll('#data div.topic').forEach( function(div) {
			div.removeAttribute('found')
		})
	
		words.forEach( function(w) { w.classList.remove('found') })
	
	} else {
	
		toc.classList.remove('filter')
		data.classList.remove('filter')
		
		document.querySelectorAll('#toc li').forEach( function(li) {
			li.removeAttribute('found')
		})

		document.querySelectorAll('#data div.topic').forEach( function(div) {
			div.removeAttribute('found')
		})
	
		toc.classList.add('filter')
		data.classList.add('filter')
	
		words.forEach( function(w) {
			
			w.classList.remove('found');
			
			if ( w.innerText.toLowerCase().includes( query.toLowerCase() )) {
				w.classList.add('found')
				var href= w.closest('div.topic').querySelector('h4').getAttribute('href');
				document.querySelector('#toc li.'+href).setAttribute('found',1)
				w.closest('div.topic').setAttribute('found',1)
			}
	
		})
		
		document.querySelectorAll('#toc li').forEach( function(li) {
			if ( li.className.includes( query.toLowerCase() )) {
					li.setAttribute('found',1)
			}
		})
		
		document.querySelectorAll('#data div.topic').forEach( function(div) {
			if ( div.id.includes( query.toLowerCase() )) {
				div.setAttribute('found',1)
			}
		})		
		
	
	}

}

function tp_trim(q=false) {

	if (!q) {
		var txt = document.querySelector('#ped textarea').value.trim();
	} else {
		var txt = q;
	}

	txt = txt.toLowerCase()
	
	txt = txt.replace(/\n|\r/g, ",");
	
	txt = txt.replace(/\s+([\},\{,\,\|,\.,\:])/g, "$1");

	txt = txt.replace(/([\},\{,\,\|,\.,\:])\s+/g, "$1");

	txt = txt.replace(/\[.*?\]/g, " ")

	txt = txt.replace(/\s+/g, " ").replace(/,,/g, ",")

	txt = txt.replace(/\,$|^\,/g, "")
	
	txt = txt.replace(/,/g, ", ");

	txt = txt.trim()
	
	if (!q) {
	
		document.querySelector('#ped textarea').value = txt

	} else {
		return txt;
	}
}
