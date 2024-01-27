const debug = false;
const arv = [ 'data-order','title','class','data-prefix','data-suffix' ]

function sw(w) {
    document.getElementById('smp').className=w;
}

function allowDrop(ev) {
	ev.preventDefault();
}

function dragstart(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
	ev.dataTransfer.dropEffect = 'move';
	ev.target.style.opacity = '0.4';
}

function dragend(ev) {
	ev.target.style.opacity = '1';
}

function drop(ev) {

  ev.preventDefault();

  var data = ev.dataTransfer.getData("text");
  var parent = ev.toElement.closest('div.dnd-area');
 

  	if (ev.toElement == parent) {
  		parent.appendChild(document.getElementById(data));
  	} else {
		el = ev.toElement.closest('div.stack');
		// console.log(el);
  		parent.insertBefore(document.getElementById(data), el);
  	}

  	reorder(document.getElementById('stack').querySelectorAll('div.stack'));

}

function mustvalue(what,w,nspaces) {
	if (w.querySelector("input."+what) !== 'undefined') {
		var v = w.querySelector("input."+what).value
		if ((v !== null) && (v !== "")) { return v }
	} 
	return false;
}

function reorder(cn) {
  
  document.getElementById('stackcount').innerHTML = cn.length;

  var newspaces = {}

  cn.forEach( function(w,i) {

	var c = w.getAttribute('name');
	
	w.setAttribute('data-order',i)
	w.querySelector("input.data-order").value=i;

	newspaces[c]={ 'data-order': i }

	arv.forEach( function (a) {
		var v = mustvalue(a,w); if (v){ newspaces[c][a] = v }
	});

  });

  document.getElementById('newspaces').value = JSON.stringify(newspaces).trim();
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

	document.getElementById('clipcount').innerHTML =c;
	document.getElementById('collection').innerHTML = nts
}



function create_spaces(spaces,prompts) {
	
	let ta = new ta_jsfunc();
		
	Object.keys(spaces).forEach( function(w,i) {
	
		if (Object.keys(prompts).includes(w)) { 
			array = uniquesort(JSON.parse ( prompts[w] ))
		} else { 
			array = []
		}	
		
		var selection = document.createElement('div');
		selection.setAttribute('class','select')	
		selection.append( ta.selection(w,array) );
		
		var input = document.createElement('div');
		input.setAttribute('class','input')
		
		var textarea = document.createElement('textarea')
		textarea.setAttribute('class','container__textarea')
		textarea.setAttribute('onclick','autocomp(this)')
		textarea.setAttribute('onblur','autocomp_deactive(this)')
		textarea.setAttribute('onchange','tp_input(this)')
		textarea.setAttribute('name',w+'_input')
		
		input.append(textarea);
		
		var nav = document.createElement('nav');
		nav.innerHTML = "<button class='wtext' onclick='tp_toggle(this)'><i data-feather='toggle-left'></i><i data-feather='toggle-right'></i>"+ 
			spaces[w]['title'] +"</button>" + "<span>" +
			"<button onclick='tp_add(this)'><i data-feather='pocket'></i></button>" +
			"<button onclick='tp_clear(this)'><i data-feather='x'></i></button>" +
			"</span>"

		attr = Object.assign({'id':w},spaces[w]);
		
		ta.create ('#spaces','section', attr, [ nav, input, selection ]);
	
	});
}	
	
function stack(spaces) {

	var stacks = [];
	
	Object.keys(spaces).forEach( function(w,i) {
	
		var div = document.createElement('div')
		div.id = w+"_stack";
		div.setAttribute('class','stack');
		div.setAttribute('name',w);
		div.setAttribute('data-order',spaces[w]['data-order']);
		div.setAttribute('draggable',true);
		div.setAttribute('ondragstart',"dragstart(event)");
		div.setAttribute('ondragend',"dragend(event)");
		
		// console.log(typeof attr, attr);

		txt = "<b>"+w+"</b>";
		var sospaces = uniquesort(Object.keys(spaces[w]));
	
		arv.forEach( function (a) {

			if (! sospaces.includes(a)) {
				txt = txt + "<input type='text' placeholder='"+a+"'class='"+a+"' name='"+a+"' value=''>"
			} else {
				txt = txt + "<input type='text' placeholder='"+a+"'class='"+a+"' name='"+a+"' value='"+spaces[w][a]+"'>"
			}

		});		

		div.innerHTML = txt;

		stacks.push(div)

	});
	
	reorder(stacks);

	return stacks;
}

function stock(prompts,spaces) {

	var stocks = [];
	var c = Object.keys(spaces).length;
	
	Object.keys(prompts).forEach( function(w,i) {

		if (! Object.keys(spaces).includes(w)) { 
	
			c = c +1;

			var div = document.createElement('div')
		
			div.id = w+"_stack";
			div.setAttribute('class','stack');
			div.setAttribute('name',w);
			div.setAttribute('data-order',c);	
			div.setAttribute('draggable',true);
			div.setAttribute('ondragstart',"dragstart(event)");
			div.setAttribute('ondragend',"dragend(event)");
		
			var txt = "<b>"+w+"</b>"
			
			val = [];
			
			arv.forEach( function (a) {
				
				if(a == 'title') { val[a] = w; }
				else if (a == 'data-order') { val[a] = c; }
				else { val[a] = '' }
				
				txt = txt + "<input type='text' class='"+a+"' name='"+a+"' value='"+val[a]+"'>";		
			
			});

			div.innerHTML = txt;
			stocks.push(div)
		}
	});
	
	return stocks;	
}

function tp_addprompt() {

	var stock = document.getElementById('stock')	
	var div = document.createElement('div')

	var w = prompt('prompt name','custome');
	var c = Math.floor(Math.random() * (Math.pow(10,2)));
	
	
	if (( w !== null ) || (w !== "")) {
	
		w = w.trim().toLowerCase();
		
		div.id = w+"_stack";
		div.setAttribute('class','stack');
		div.setAttribute('name',w);
		div.setAttribute('data-order',c);	
		div.setAttribute('draggable',true);
		div.setAttribute('ondragstart',"dragstart(event)");
		div.setAttribute('ondragend',"dragend(event)");
		
		var txt = "<b>"+w+"</b>"
		
		val = [];
		
		arv.forEach( function (a) {
			
			if(a == 'title') { val[a] = w; }
			else if (a == 'data-order') { val[a] = c; }
			else { val[a] = '' }
			
			txt = txt + "<input type='text' class='"+a+"' name='"+a+"' value='"+val[a]+"'>";		
		
		});

		div.innerHTML = txt;
		stock.appendChild(div);
	
	}
}

function create_dnd_stack(spaces,prompts) {

	let ta = new ta_jsfunc();
  
	ta.create ('#set div.area','div',{
		'id':'stack',
		'class': 'dnd-area',
		'ondrop':'drop(event)',
		'ondragover':'allowDrop(event)'
		}, stack(spaces)
	)

	ta.create ('#set div.area','div',{
		'id':'stock',
		'class': 'dnd-area',
		'ondrop':'drop(event)',
		'ondragover':'allowDrop(event)',
		'onclick':'tp_addprompt()'
		}, stock(prompts,spaces)
	)		

}



async function exec(forceInit) {

	let ta = new ta_jsfunc();

	var ltm = new Date();
	var LS = await load_json('./data.json?'+ltm.getDate()+ltm.getMilliseconds());

	ta.ls_init({
	'spaces':{
		'type': {
			'title':'type', 
			'data-order':1, 
			'class': 'third'
		},
		'main': { 
			'title':'main prompt and style',
			'data-order':3,
			'data-prefix':'(',
			'data-suffix':')',
			'class': 'full on_input'
		},		
		'background': { 
			'title':'background',
			'data-order':4,
			'class': 'half',
			'data-prefix':'{ background:',
			'data-suffix':'}',
		},		
	},
	'prompts':LS,
	},forceInit);

	//console.log( ta.ls_get('prompt') );

	let spaces = ta.ls_get('spaces');
	let prompts = ta.ls_get('prompts');
	
	create_spaces(spaces,prompts);
	
	create_dnd_stack(spaces,prompts);
	

	
	create_cliplist();

	json_dive(prompts);
	
	feather.replace();


	
}


function json_dive(prompts) {
	
	var rdat = new Object();
	
	uniquesort ( Object.keys(prompts) ).forEach( function(k,i) {	

		var div = document.createElement('div');
		div.id = k+"_list"
		rdat[k] = new Array();
		div.classList.add('topic')
		div.innerHTML = "<b>"+k+"</b>"
		var array = uniquesort ( JSON.parse(prompts[k]) );
	
		var list = document.createElement('ul');
		
		array.forEach( function(w) {
			var li = document.createElement('li')
			li.innerHTML = w
			li.setAttribute('onclick','this.remove()')

			list.append(li);
			rdat[k].push(w);
		})
		
		rdat[k] = JSON.stringify(rdat[k]);
		
		div.append(list)
		
		document.querySelector('#data > div').append(div);
		
		

	});
	// var rdata = JSON.stringify(rdat).toLowerCase();

	document.getElementById('promptdata').value = JSON.stringify(rdat).toLowerCase();
}

function tp_list2Json() {
	
	var kA = document.querySelectorAll('#data .list >div')
	var rdat = new Object();
	
	kA.forEach( function(k) {
		var list = []
		var key = k.children[0].innerText
		k.children[1].querySelectorAll('li').forEach ( function(li) {
			list.push(li.innerText);
		});
		//console.log(key,list)
		rdat[key] = JSON.stringify(list);

	})

	document.getElementById('promptdata').value = JSON.stringify(rdat).toLowerCase();


  let ta = new ta_jsfunc();
  ta.ls_save('prompts', JSON.stringify ( rdat ) )	
}
	
