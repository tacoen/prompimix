function make_dropable(e,t,a={}){var n=document.createElement(t);return n.setAttribute("ondrop","drop(event)"),n.setAttribute("ondragover","allowDrop(event)"),a!=={}&&Object.keys(a).forEach(function(e){n.setAttribute(e,a[e])}),""!==e[0]&&e.forEach(function(e){var e=e.trim(),t=document.createElement("li");t.setAttribute("draggable","true"),t.setAttribute("ondragstart","dragstart(event)"),t.setAttribute("ondragend","dragend(event)"),t.id=safename(e+"_"+(Math.floor(900*Math.random())+100)),t.innerHTML=e,"["==e.substr(0,1)&&t.classList.add("static"),n.append(t)}),n}
function wrapper(e,t,a={}){var n=document.createElement(t);return a!=={}&&Object.keys(a).forEach(function(e){n.setAttribute(e,a[e])}),n.append(e),n}
function makeselection(e,t={},a=!1){var n=document.createElement("select");return t!=={}&&Object.keys(t).forEach(function(e){n.setAttribute(e,t[e])}),e.forEach(function(e){var t=document.createElement("option");t.value=e,t.innerText=e,e==a&&t.setAttribute("selected","selected"),n.append(t)}),n}
function rgp_process(e=[]){return e.forEach(function(e){"["==e.substr(0,1)?argp.push(e):Object.keys(prompts).includes(e)&&argp.push(e)}),agp}
function seqpage(e=!1){let t=new ta_jsfunc;var a=t.ls_get("prompts"),n=t.ls_get("leads"),l=Cookies.get("template")||"default",d=document.createElement("textarea");d.id="lead_view",d.setAttribute("data-lead",l),d.setAttribute("onchange","update_stack(false)");var r=document.createElement("nav"),s=document.createElement("div");s.innerHTML="<span class='note'><b>Note:</b> for static prompts: use [ and ], like [photo].</span><button id='lead_save_button' onclick='tp_leadsave(true)'><i data-feather='save'></i></button>";var i=document.createElement("div");i.innerHTML="<button onclick='tp_addlead()'><i data-feather='plus'></i></button><button title='Clear' onclick='tp_clear(\"#leads_view\")'><i data-feather='x-square'></i></button>";var c=makeselection(uniquesort(Object.keys(n)),{id:"leads_select",onchange:"tp_leadsSelect(this)"},l);i.prepend(wrapper(c,"span",{id:"lead_ctl"})),r.append(i),r.append(s);var p=document.createElement("div"),o=make_dropable(uniquesort(Object.keys(a)),"ul");p.className="tab-content",p.id="lgdnd",p.append(wrapper(o,"div",{id:"lstock",class:"stock dnd-area"}));var u=make_dropable([],"ul");p.append(wrapper(u,"div",{id:"lstack",class:"stack dnd-area"}));var v=document.getElementById("leads"),m=document.createElement("div");[r,d,p].forEach(function(e){m.append(e)}),v.innerHTML="",v.append(m),update_lta(d,l),update_stack(l)}
function update_lta(e,t){var a=new ta_jsfunc().ls_get("leads");null==e&&(e=document.getElementById("lead-view"));var n=a[t];void 0===n?e.value="":(e.value=JSON.parse(n).toString().replace(/\,/g,", ").replace(/  /g," "),e.setAttribute("data-lead",t))}
function update_stack(e=!1){e||(e=document.getElementById("lead_view").getAttribute("data-lead")||"default");let t=document.querySelector("#lstack");var a=document.getElementById("lead_view").value;t.innerHTML="";var n=document.createElement("h3");n.classname="lead_name",n.innerHTML=e;var l=document.createElement("button");l.setAttribute("onclick","json_pack(this)"),l.innerHTML="<i data-feather='download'></i><span>Json</span>";var d=document.createElement("div");d.className="flex packing",d.append(n),d.append(l);var r=make_dropable(a.split(","),"ul");t.append(d),t.append(r),feather.replace()}
function update_leads(e=!1){e?name=e:update_stack(name=document.getElementById("lead_view").getAttribute("data-lead")||"default");var t=new ta_jsfunc().ls_get("leads"),a=makeselection(uniquesort(Object.keys(t)),{id:"leads_select",onchange:"tp_leadsSelect(this)"},name);document.getElementById("lead_ctl").innerHTML="",document.getElementById("lead_ctl").append(a);let n="";""!=t[name]&&(n=JSON.parse(t[name])),e&&(document.getElementById("lead_view").value=n),document.getElementById("lead_view").setAttribute("data-lead",name),update_stack(name)}
function button_notice(e){e.classList.add("notice"),setTimeout(()=>{e.classList.remove("notice")},"1100")}

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
function tp_leadsave(notice) {
	let ta = new ta_jsfunc();
	var leads = ta.ls_get('leads')
	let th = document.getElementById('lead_view')
	let name = th.getAttribute('data-lead')
	if (th.value == '') {
		delete leads[name];
		// Cookies.remove('template');
	} else {
		txt = th.value.replace("[","\[").replace("]","\]").replace(", ",",").replace(" ,",",")
		leads[name] = JSON.stringify( txt.split(',') );
	}
	// console.log( JSON.stringify(leads) );
	ta.ls_save('leads',JSON.stringify(leads));
	if (notice) {
		button_notice(document.getElementById('lead_save_button'))
	}
}
