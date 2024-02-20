
function tp_trim(q=false) {
	if (!q) {
		var txt = document.querySelector('#ped textarea').value.trim();
	} else {
		var txt = q;
	}
	//console.log(txt);
	txt = txt.toLowerCase()
	txt = txt.replace(/\t/g, " ");
	txt = txt.replace(/\n|\r/g, ",");
	txt = txt.replace(/\;/g, ",");	
	txt = txt.replace(/\+\+,/g, "").replace(/,\+\+/g, "")
	txt = txt.replace(/\+\+ ,/g, "").replace(/, \+\+/g, "")
	txt = txt.replace(/\s+([\},\),\{,\,\|,\.,\:])/g, "$1");
	txt = txt.replace(/([\},\(,\{,\,\|,\.,\:])\s+/g, "$1");
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


function handleuploadSubmit() {
	var files = document.getElementById('selectFiles').files;
	//console.log(files);
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
	
	location.reload();
};


async function mergeJSON2LS(file) {

	let ta = new ta_jsfunc();
	var p1 = ta.ls_get('prompts');	
	var p2 = await load_json(file);
	var nprompts = __mergeJSON(p1,p2)
	console.log(Object.keys(p1).length, Object.keys(p2).length, Object.keys(nprompts).length);
	ta.ls_save('prompts',JSON.stringify(nprompts));

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

async function exec_workspace(forceInit) {
	let ta = new ta_jsfunc();
	let Cookies = new ta_lscookie();
	var ltm = Date.now();
	let template = { "default": JSON.stringify(template_default) }
	switch(forceInit) {
		case('blank'):	
			ta.ls_reset();
			var prompts = prompts_default;
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