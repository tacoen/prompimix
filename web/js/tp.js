function swcolor(){var e=document.querySelector("html.tui");"dark"==e.getAttribute("data-theme")?(e.removeAttribute("data-theme"),Cookies.remove("moon")):(e.setAttribute("data-theme","dark"),Cookies.set("moon",1))}
function qdownload(e,t){let r=document.createElement("a"),a=Date.now(),o=new Blob([e],{type:"text/plain"});r.href=URL.createObjectURL(o),r.download=a+"-"+t,r.click(),URL.revokeObjectURL(r.href)}

function tp_switch(e){if(document.querySelectorAll("button.active").forEach(function(e){e.classList.remove("active")}),"string"!=typeof e){var t=e.getAttribute("data-page");e.classList.add("active")}else{var t=e;(document.querySelector("button[data-page='"+t+"']")||document.querySelector("button[data-page='info']")).classList.add("active")}switch(document.querySelectorAll("main").forEach(function(e){e.className="hide"}),document.querySelector("main#"+t).className="show",t){case"leads":seqpage();break;case"crafts":craftslist();break;default:document.getElementById("landing").innerHTML="<div><h1>Prompimix</h1><p>You see this pages, because this is the first time we notice you are using <b>Prompimix</b>. Your localstorage is empty, and we need to initially it. Please hit the Load button to doit, if you miss this step, you latter can doit at JSON Page.</p><p class='msg'><small>Fill your localstorage.</small> <button class='green' onclick='tp_reset(\"json\")'>Load</button></p></div></div>"}Cookies.set("last_page",t),feather.replace()}
function tp_scopeflush(){Cookies.remove("scope"),document.querySelector("#ped nav .scope").innerHTML=""}
function tp_addprompt(e){var t=["data-prefix","data-suffix"],r={};if("new"!==e){var a=e.closest("li").className,o=e.closest("li").querySelector("a").innerText.toLowerCase(),l=Array.from(document.querySelector(".data #data #"+a+" div.list").children),i=[];Array.from(l).forEach(function(e){i.push(e.innerText)}),t.forEach(function(e){r[e]=document.getElementById(safename(a)).getAttribute(e)})}else{var a="new",o="",i=[];t.forEach(function(e){r[e]=""})}document.querySelector("#prompts div.data").innerHTML=document.getElementById("ddform").innerHTML,document.querySelector("#prompts .ddform textarea").classList.add(a),document.querySelector("#prompts .ddform textarea").value=i.toString()||"",document.querySelector("#prompts .ddform .msg button").setAttribute("onclick","tp_newp('"+a+"')"),document.querySelector("#prompts .ddform input[name='name']").value=o.trim(),t.forEach(function(e){document.querySelector("#prompts .ddform input[name='"+e+"']").value=r[e]})}
function tp_newp(e){let t=new ta_jsfunc;var r=tp_trim(document.querySelector(".data .ddform textarea."+e).value);if("new"==e){var a=(e=document.querySelector(".data .ddform input[name='name']").value.trim()).replace("_"," ").toLowerCase();console.log("update: "+a)}else var a=(e=document.querySelector(".data .ddform input[name='name']").value.trim()).replace("_"," ").toLowerCase();var o=t.ls_get("prompts"),l=t.ls_get("spaces");if(void 0===l[a]&&(l[a]={}),void 0!==r&&r.length>1){var i=(r=(r=r.replace(/\n|\r/g,",")).replace(/, | ,/g,",")).split(",");i=uniquesort(i),e=document.querySelector(".data .ddform input[name='name']").value.trim(),o[a]=JSON.stringify(i),["data-prefix","data-suffix"].forEach(function(e){var t=document.querySelector(".data .ddform input[name='"+e+"']").value.trim();t=t.replace('"',""),l[a][e]=t}),console.log("update: "+a)}else console.log("delete: "+a),delete o[a],delete l[a];t.ls_save("spaces",JSON.stringify(l)),t.ls_save("prompts",JSON.stringify(o)),workspaces()}
function tp_arcopy(e){var t=e.closest("div.note").querySelector(".txt");console.log(t),t.select(),document.execCommand("copy")}
function tp_sample(){let e=new ta_jsfunc;var t,r=e.ls_get("prompts");rgp=void 0===(rgp=JSON.parse(e.ls_get("leads")[Cookies.get("template")||"default"]))?template_default:rgp.toString().split(",");var a="",o="";rgp.forEach(function(e){if("["==(e=e.replace("  "," ").trim()).substr(0,1))var t=e.replace(/\]/g," ").replace(/\[/g,"");else if(void 0!==r[e]){var l=JSON.parse(r[e]),t=l[Math.floor(Math.random()*l.length)],i=document.getElementById(safename(e)).getAttribute("data-prefix")||"",c=document.getElementById(safename(e)).getAttribute("data-suffix")||"";if(o!==e)var t=i+" "+t+" "+c;else var t=t+" "+c}a=""==a.trim()?t:o!==e?a+", "+t:a+document.getElementById("mixer").value+t,o=e}),document.querySelector("#ped textarea").value=tp_trim(a),tp_cookies(document.querySelector("#ped textarea")),button_notice(document.querySelector('button[title="Surprise me!"]'))}
function tp_jsonDownload(e){let t=JSON.stringify(new ta_jsfunc().ls_get(e)),r=document.createElement("a"),a=Date.now(),o=new Blob([t],{type:"text/plain"});r.href=URL.createObjectURL(o),r.download=a+"-"+e+".json",r.click(),URL.revokeObjectURL(r.href)}
function tp_downloadbak(){var e=new ta_jsfunc().ls_jsbak();let t=document.createElement("a"),r=Date.now(),a=new Blob([e],{type:"text/plain"});t.href=URL.createObjectURL(a),t.download=r+"-json-var.js",t.click(),URL.revokeObjectURL(t.href)}
function tp_clear(e){document.querySelector(e).value="",Cookies.remove("prompt"),tp_scopeflush()}
function tp_reset(e){!0==confirm("Are your sure?")&&("blank"===e?exec_workspace("blank"):exec_workspace("json"))}
function tp_cookies(e){var t=e.getAttribute("name");Cookies.set(t,e.value.trim())}
function tp_copytxt(e){document.querySelector(e).select(),document.execCommand("copy")}
function tp_saveit(e){var t=document.querySelector(e).value;let r=new ta_jsfunc,a=r.ls_get("crafts");void 0===a&&(a=[]),a.push(t.trim()),r.ls_save("crafts",JSON.stringify(a)),button_notice(document.getElementById("clipit"))}
function tp_filter(){var e=document.querySelectorAll("#data .topic span"),t=document.querySelector("#data input.filter").value.toLowerCase(),r=document.getElementById("toc"),a=document.getElementById("data");t.length<3?(r.classList.remove("filter"),a.classList.remove("filter"),document.querySelectorAll("#toc li").forEach(function(e){e.removeAttribute("found")}),document.querySelectorAll("#data div.topic").forEach(function(e){e.removeAttribute("found")}),e.forEach(function(e){e.classList.remove("found")})):(r.classList.remove("filter"),a.classList.remove("filter"),document.querySelectorAll("#toc li").forEach(function(e){e.removeAttribute("found")}),document.querySelectorAll("#data div.topic").forEach(function(e){e.removeAttribute("found")}),r.classList.add("filter"),a.classList.add("filter"),e.forEach(function(e){if(e.classList.remove("found"),e.innerText.toLowerCase().includes(t.toLowerCase())){e.classList.add("found");var r=e.closest("div.topic").querySelector("h4").getAttribute("href");document.querySelector("#toc li."+r).setAttribute("found",1),e.closest("div.topic").setAttribute("found",1)}}),document.querySelectorAll("#toc li").forEach(function(e){e.className.includes(t.toLowerCase())&&e.setAttribute("found",1)}),document.querySelectorAll("#data div.topic").forEach(function(e){e.id.includes(t.toLowerCase())&&e.setAttribute("found",1)}))}
function tp_trim(e=!1){if(e)var t=e;else var t=document.querySelector("#ped textarea").value.trim();if(t=(t=(t=(t=(t=(t=(t=(t=(t=t.toLowerCase()).replace(/\t/g," ").replace(/\n|\r/g,",")).replace(/\+\+,/g," ")).replace(/\[.*?\]/g," ")).replace(/\s+(\W)/g,"$1").replace(/(\W)\s+/g,"$1")).replace(/\s+/g," ").replace(/,,/g,",")).replace(/\,$|^\,/g,"")).replace(/,/g,", ")).trim(),e)return t;document.querySelector("#ped textarea").value=t}
function tp_leadsSelect(e){let t=e.value;update_leads(t),Cookies.set("template",t)}
function tp_addlead(){var e=prompt("Enter the new name:");if(e){let t=new ta_jsfunc;var a=t.ls_get("leads");a[e]=" ",t.ls_save("leads",JSON.stringify(a)),update_leads(e)}}
function tp_leadsave(e){let t=new ta_jsfunc;var a=t.ls_get("leads");let n=document.getElementById("lead_view"),l=n.getAttribute("data-lead");""==n.value?delete a[l]:(txt=n.value.replace("[","[").replace("]","]").replace(", ",",").replace(" ,",","),a[l]=JSON.stringify(txt.split(","))),t.ls_save("leads",JSON.stringify(a)),e&&button_notice(document.getElementById("lead_save_button"))}
