function allowDrop(ev) {
	ev.preventDefault();
}

function dragstart(ev) {
	console.log(ev);
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
  var parent = ev.toElement.closest('ul');
  //var areaid = parent.closest('div.dnd-area').id
  var where =  ev.toElement.closest('div')
 
	ev.dataTransfer.dropEffect = 'move';
  	if (ev.toElement == parent) {
		// console.log('ini',parent);
  		parent.appendChild(document.getElementById(data));
  	} else {
		el = ev.toElement.closest('li');
		// console.log(el);
  		parent.insertBefore(document.getElementById(data), el);
  	}
	

  
  var stack = parent.querySelectorAll('li');
  var array = [];
  stack.forEach( function(s) { array.push(s.innerText.trim()) })
  
  if (where.id == 'stack') {
	Cookies.set('sample', array );
	var ulist = makelist(array,'ul','u')
    document.querySelector('#setting input.sample').value = array.toString()
  } else {
	var ulist = makelist((uniquesort(array)),'ul','u')
	document.querySelector('#stock').innerHTML='';
	document.querySelector('#stock').append(ulist)
	var sarray = Cookies.get('sample');
    document.querySelector('#setting input.sample').value = sarray.toString()
	
  }
  
  
}