function allowDrop(ev) {
	ev.preventDefault();
	ev.target.classList.add('drop-fx');
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
	var ul =  ev.target.closest('ul');
	document.querySelectorAll('.dnd-area .drop-fx').forEach( function(e) {
		e.classList.remove('drop-fx');
	});
	if (ev.target == ul) {
		ul.appendChild(document.getElementById(data));
	} else {
		nli = ev.toElement.closest('li');
  		ul.insertBefore(document.getElementById(data), nli);
	}
	content = ul.querySelectorAll('li');
	var array = [];
	content.forEach( function(s) { array.push(s.innerText.trim()) })
	var where = ul.closest('div').id
	if (where == 'lstock') {
		var ulist = make_dropable((uniquesort(array)),'ul')
		document.querySelector('#lstock').innerHTML="";
		document.querySelector('#lstock').append(ulist);
		var sarray = document.querySelector('#lstack ul').querySelectorAll('li')
		var array = [];
		sarray.forEach( function(s) { array.push(s.innerText.trim()) })

	}
	document.getElementById('lead_view').value = array.toString();
	tp_leadsave();
}