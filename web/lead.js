function make_dropable(data,el,attr={}) {
	var ele = document.createElement(el);
	ele.setAttribute('ondrop',"drop(event)") 
	ele.setAttribute('ondragover',"allowDrop(event)")
	if (attr !== {} ) {
		Object.keys(attr).forEach( function(a) { 
			ele.setAttribute(a,attr[a]) 
		})
	}
	if  (data[0] !== '')  {
		//console.log(typeof data, data);
		data.forEach( function(d) { 
			var randomNumber = Math.floor(Math.random() * 900) + 100;
			var li = document.createElement('li');
			li.setAttribute('draggable',"true")
			li.setAttribute('ondragstart',"dragstart(event)")
			li.setAttribute('ondragend',"dragend(event)")
			li.id = safename(d+"_"+randomNumber);
			li.innerHTML = d;
			if ( d.substr(0,1)=="[") { li.classList.add('static'); }
			ele.append(li);
		})
	}
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
function makeselection(data,attr={},selected=false) {
	var ele = document.createElement('select');
	if (attr !== {} ) {
		Object.keys(attr).forEach( function(a) { 
			ele.setAttribute(a,attr[a]) 
		})
	}
	data.forEach( function(d) { 
		var opt = document.createElement('option');
		opt.value = d
		opt.innerText=d
		if (d == selected) { opt.setAttribute('selected','selected') }
		ele.append(opt);
	})
	return ele
}
/**/
function rgp_process(gp=[]) {
	gp.forEach ( function(r) {
		if ( r.substr(0,1)=="[") {
			argp.push(r);
		} else {
			if ( Object.keys(prompts).includes(r)) { argp.push(r); }
		}
	})
	return agp;
}
function seqpage(w=false) {
	let ta = new ta_jsfunc();
	var prompts = ta.ls_get('prompts');	
	var leads = ta.ls_get('leads');	
	//var rgp = default_rgp;
	//var rgplist = ['sample1','sample2','sample3']
	//console.log(typeof rgp);
	var stock_list = make_dropable(uniquesort(Object.keys(prompts)),'ul');
	var stack_list = make_dropable([],'ul')
	var template = Cookies.get('template');
	var lta = document.createElement('textarea'); 
	lta.id = 'lead_view';
	lta.setAttribute('data-lead',template);
	lta.setAttribute('onchange','update_leads(false)');
	var lnav = document.createElement('nav'); ta.class = 'tab';
	var ndiv1 = document.createElement('div');
	ndiv1.innerHTML = "<span class='note'><b>Note:</b> for static prompts: use [ and ], like [photo].</span>"+
	"<button id='lead_save_button' onclick='tp_leadsave(true)'><i data-feather='save'></i></button>"
	var ndiv2 = document.createElement('div');
	ndiv2.innerHTML="<button onclick='tp_addlead()'><i data-feather='plus'></i></button>";
	var selection = makeselection(uniquesort(Object.keys(leads)),{
		'id':'leads_select',
		'onchange':'tp_leadsSelect(this)'
	},template);
	ndiv2.prepend( wrapper(selection,'span',{'id':'lead_ctl'}) )
	lnav.append(ndiv2)
	lnav.append(ndiv1)
	var dnd = document.createElement('div');
	dnd.className = "tab-content";
	dnd.id = 'lgdnd';
	dnd.append(wrapper(stock_list,'div',{
			'id':'lstock',
			'class':'stock dnd-area',
		})
	);	
	dnd.append(wrapper(stack_list,'div',{
			'id':'lstack',
			'class':'stack dnd-area',
		})
	);	
	var lead_page = document.getElementById('lead');
	var seqpage = document.createElement('div');
	[lnav,lta,dnd].forEach( function(e) {
		seqpage.append(e)
	});
	lead_page.innerHTML=''
	lead_page.append(seqpage)
	var tpl = leads[template];
	if (tpl[0] !== '')  {
		lta.value = JSON.parse(tpl).toString();
	} else {
		lta.value = tpl;
	}
	var h3 = document.createElement('h3')
	h3.classname = 'lead_name'
	document.querySelector('#lstack').prepend(h3);
	update_leads();
}
function tp_leadsSelect(obj) {
	let name = obj.value
	update_leads(name)
	Cookies.set('template',name);
}
function tp_addlead() {
	var name = prompt('Enter the new name:')
	if (name) {
		let ta = new ta_jsfunc();
		var leads = ta.ls_get('leads')
		leads[name]='';
		ta.ls_save('leads',JSON.stringify(leads));
		update_leads(name);
	}
}
function update_leads(cname=false) {
	if (!cname) {
		tp_leadsave();
		name = document.getElementById('lead_view').getAttribute('data-lead')
	} else {
		name = cname;
	}
	let ta = new ta_jsfunc();
	var leads = ta.ls_get('leads')
	var selection = makeselection(uniquesort(Object.keys(leads)),{
		'id':'leads_select',
		'onchange':'tp_leadsSelect(this)'
	},name);
	document.getElementById('lead_ctl').innerHTML=''
	document.getElementById('lead_ctl').append(selection);
	let pa =''
	if (leads[name] != '') {
		pa = JSON.parse(leads[name])
	}
	if (cname) {
		document.getElementById('lead_view').value = pa;
	}
	document.getElementById('lead_view').setAttribute('data-lead',name);
	let lstack = document.querySelector('#lstack');
	lstack.innerHTML="<h3 clas='lead_name'>"+name+"</h3>";
	var stack_list = make_dropable(pa.toString().split(','),'ul')
	lstack.append(stack_list)
}
function tp_leadsave(notice) {
	let ta = new ta_jsfunc();
	var leads = ta.ls_get('leads')
	let th = document.getElementById('lead_view')
	let name = th.getAttribute('data-lead')
	txt = th.value.replace("[","\[").replace("]","\]").replace(", ",",").replace(" ,",",")
	leads[name] = JSON.stringify( txt.split(',') );
	// console.log( JSON.stringify(leads) );
	ta.ls_save('leads',JSON.stringify(leads));
	if (notice) {
		document.getElementById('lead_save_button').classList.add('notice');
		setTimeout(() => {
			document.getElementById('lead_save_button').classList.remove('notice');
		}, "1100");
	}
}