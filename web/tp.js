function tp__reset() {
	var p = confirm('Are you sure?')
	if (p == true) {
		localStorage.clear();
		window.location.reload();
	}
}


function tp_copy_ff() {
    var copyText = document.querySelector("#freeform textarea");
    copyText.select();
    document.execCommand("copy");
}

function tp_stack_save(obj) {

  reorder(document.getElementById('stack').querySelectorAll('div.stack'));
  console.log('spaces update!')
  let ta = new ta_jsfunc();
  ta.ls_save('spaces', document.getElementById('newspaces').value )

  window.location.reload();
  
}

function tp_arcopy(obj) {
	var copytext = obj.closest('div.note').querySelector('.txt');
	console.log(copytext);
    copytext.select();
    document.execCommand("copy");
}

function tp_saveprompt(obj) {

  let ta = new ta_jsfunc();
  let notes = ta.ls_get('clip');

  if (typeof notes === 'undefined') { notes = [] }
  
  notes.push ( document.getElementById('output').value.trim() )

  console.log(notes);
  
  ta.ls_save('clip', JSON.stringify ( notes ) )
	
	
}

function tp_toggle(obj) {
    var el = obj.closest('section');

	var sclass = el.className.replace('on_input','');

	if (el.classList.contains('on_input')) {
        el.className = sclass;
        //build_selection(s);
    } else {
        el.className = "on_input" + " " + sclass.trim();
    }
}

function tpout_update() {
    var sel = Array.from(document.querySelectorAll("#spaces section"));

    var wo = [];
    var wn = [];
	
    sel.forEach(function(e, n) {
		var o = parseInt(e.getAttribute('data-order'));
		if (typeof wo[o] == 'undefined') {
			wo[o] = e;
//			console.log(n, o, "wo", e.getAttribute('data-tp'))
		} else {
			//wo[o*n] = e;
			//console.log(n, o, "wo", e.getAttribute('data-tp'))
			wo.push(e);
		}

	});
	
	//console.log(wo);
	
	//wo = Object.assign(wa,wo)

	var ar = [];
	
    wo.forEach(function(i, n) {
		var prefix ="";
		var suffix ="";
        if ( (i.getAttribute('data-tp') !== null) && (i.getAttribute('data-tp') !== '')) {

            var val = i.getAttribute('data-tp');
			if ((i.getAttribute('data-prefix') !== null) && (i.getAttribute('data-prefix') !== '')) {
				var prefix = i.getAttribute('data-prefix') + " ";
			}
			if ((i.getAttribute('data-suffix') !== null) && (i.getAttribute('data-suffix') !== '')) {
				var suffix = " " + i.getAttribute('data-suffix');
			}
			
//			console.log(n,'val',val);

			ar.push( " "+ prefix + val + suffix );
        }


    })

    var text = ar.toString();
    document.getElementById('output').value = cleantp(text.trim().toLowerCase());
}

function tp_input(obj) {
	
    if (obj.tagName == "SELECT") {
        var txt = obj.options[obj.options.selectedIndex].text.trim();
		obj.closest('section').querySelector(".input textarea").value=txt

    } else {

        var txt = obj.value.trim();
		var sel = obj.closest('section').querySelector(".select select")

		for (var i = 0; i < sel.options.length; ++i) {
			if (sel.options[i].text === txt) {
				sel.options[i].selected = true;
				vok = true;
			}
		}
	}

	obj.closest('section').setAttribute('data-tp',txt)

	tpout_update();

}


function tp_copy() {
    var copyText = document.getElementById("output");
    copyText.select();
    document.execCommand("copy");
}

function tp_add(obj) {

	var txt = obj.closest('section').querySelector(".input textarea").value.trim()
	var sel = obj.closest('section').querySelector(".select select")
	var option = document.createElement("option");
	option.value = txt;
	option.text = txt;
	option.setAttribute('selected','selected')
	sel.appendChild(option);
    obj.closest('section').setAttribute("data-tp", txt.trim() )
}

function tp_saveprompt_ff(obj) {

  let ta = new ta_jsfunc();
  let notes = ta.ls_get('clip');

  if (typeof notes === 'undefined') { notes = [] }

  notes.push ( document.querySelector("#freeform textarea").value.trim().toLowerCase() ); 

  console.log(notes);
  
  ta.ls_save('clip', JSON.stringify ( notes ) )

}	


function tp_jsonDownload(what) {
	let ta = new ta_jsfunc();
	let lsdata = JSON.stringify( ta.ls_get(what) ).toLowerCase();
    const link = document.createElement("a");
    let dt= new Date().toLocaleString();
    const file = new Blob([lsdata], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = dt+"-"+what+".json";
    link.click();
    URL.revokeObjectURL(link.href);  
}

