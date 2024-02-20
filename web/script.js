var vers = "m6.2"
var template_default = ['media','models','scene'];
var last_scope = Cookies.get('scope');
var prompts_default= {
    "media": "[\"character-sheet\",\"cover\",\"poster\",\"photos\",\"ilustration\"\]",
    "models": "[\"male\",\"female\",\"couples\",\"groups\"\]",
    "scene": "[\"airport\",\"beach\",\"bus station\",\"carnival\",\"church\"\]"
}

document.addEventListener("DOMContentLoaded", function() {

	var prot = window.location.protocol;
	if (prot == 'file:') {
		console.log('Protocol:'+prot)
		load_json_asvar();
	}
	
	exec_workspace();
	
	if ( Cookies.get('moon') ) {
		document.querySelector('html.tui').setAttribute('data-theme','dark')
	}
	
	document.querySelectorAll('main').forEach( function(e) { e.className='hide'; });
	var last = 	Cookies.get('last_page') || 'landing';
	tp_switch(last)
	ddata = document.getElementById('data');
	
	ddata.addEventListener('scroll',(e)=> {
		var t = ddata.scrollTop
		var fi = document.querySelector('#filter');
		if ( (t > 41) && (!fi.classList.contains('fixed')) ) {
			fi.style.width = fi.offsetWidth +"px"
			fi.style.height = "calc("+ fi.offsetHeight +"px + 1 rem)"
			fi.style.top = fi.offsetTop-24 +"px"
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
	
	document.getElementById('versioned').innerText= vers;
});
