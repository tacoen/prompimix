let getSiblings = function (e) {
            // for collecting siblings
            let siblings = []; 
            // if no parent, return no sibling
            if(!e.parentNode) {
                return siblings;
            }
            // first child of the parent node
            let sibling  = e.parentNode.firstChild;
            // collecting siblings
            while (sibling) {
                if (sibling.nodeType === 1 && sibling !== e) {
                    siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
            }
            return siblings;
        };
		

function autocomp_deactive(obj) {
	var p = obj.closest('section');
	var k = p.id
	var allcme = p.querySelectorAll('div.cme')
	allcme.forEach( 
		function(e) { 
			//console.log(e,1);
			if (typeof e !== 'undefined') { e.remove(); } 
	});
	
//	obj.removeEventListener('scroll');
//	obj.removeEventListener('input');
}

	
function autocomp(obj) {

	var p = obj.closest('section');
	var k = p.id
	
	//console.log(k);

	let ta = new ta_jsfunc();
	let prompts = ta.ls_get('prompts');

	var as = getSiblings(p);

	as.forEach( function(e) {
		e.classList.remove('active')
	})

		var suggestions = [];
		var its={}


	if (k === 'freeform') {

		Object.keys(prompts).forEach( function(k,i) {
			var array = JSON.parse(prompts[k]);
			array.forEach( function(w) {
				its[w] = k
				suggestions.push(w);
			})
		})
	

	} else {

		if (typeof prompts[k] !== "undefined") {

			var array = JSON.parse(prompts[k]);
			array.forEach( function(w) {
				its[w] = k
				suggestions.push(w);
			})

		} 

	}
	
	suggestions = uniquesort(suggestions)
	
	// console.log(suggestions);
		
		p.classList.add('active')
		
		const textarea = p.querySelector('textarea');
		const containerEle = textarea.closest('div');
			
		const cme = document.createElement('div');
		cme.textContent = textarea.value;
		cme.classList.add('cme');
		containerEle.prepend(cme);
	
		const suggestionsEle = document.createElement('div');
		suggestionsEle.classList.add('csg');
		containerEle.appendChild(suggestionsEle);
	
		const textareaStyles = window.getComputedStyle(textarea);
		[
			'border',
			'boxSizing',
			'fontFamily',
			'fontSize',
			'fontWeight',
			'letterSpacing',
			'lineHeight',
			'padding',
			'textDecoration',
			'textIndent',
			'textTransform',
			'whiteSpace',
			'wordSpacing',
			'wordWrap',
		].forEach((property) => {
			cme.style[property] = textareaStyles[property];
		});
		cme.style.borderColor = 'transparent';
	
		const parseValue = (v) => v.endsWith('px') ? parseInt(v.slice(0, -2), 10) : 0;
		const borderWidth = parseValue(textareaStyles.borderWidth);
	
		const ro = new ResizeObserver(() => {
			cme.style.width = `${textarea.clientWidth + 2 * borderWidth}px`;
			cme.style.height = `${textarea.clientHeight + 2 * borderWidth}px`;
		});
		ro.observe(textarea);
	
		textarea.addEventListener('scroll', () => {
			cme.scrollTop = textarea.scrollTop;
		});
	
	
		const findIndexOfCurrentWord = () => {
			// Get current value and cursor position
			const currentValue = textarea.value;
			const cursorPos = textarea.selectionStart;
	
			// Iterate backwards through characters until we find a space or newline character
			let startIndex = cursorPos - 1;
			while (startIndex >= 0 && !/\s/.test(currentValue[startIndex])) {
				startIndex--;
			}
			return startIndex;
		};
	
		// Replace current word with selected suggestion
		const replaceCurrentWord = (newWord) => {
			const currentValue = textarea.value;
			const cursorPos = textarea.selectionStart;
			const startIndex = findIndexOfCurrentWord();
	
			const newValue = currentValue.substring(0, startIndex + 1) +
							newWord +
							currentValue.substring(cursorPos);
			textarea.value = newValue;
			textarea.focus();
			textarea.selectionStart = textarea.selectionEnd = startIndex + 1 + newWord.length;
		};
	
		textarea.addEventListener('input', () => {
			const currentValue = textarea.value;
			const cursorPos = textarea.selectionStart;
			const startIndex = findIndexOfCurrentWord();
	
			// Extract just the current word
			const currentWord = currentValue.substring(startIndex + 1, cursorPos);
			if (currentWord === '') {
				suggestionsEle.style.display = 'none';
				return;
			}
	
			const matches = suggestions.filter((suggestion) => suggestion.indexOf(currentWord) > -1);
			if (matches.length === 0) {
				suggestionsEle.style.display = 'none';
				return;
			}
	
			const textBeforeCursor = currentValue.substring(0, cursorPos);
			const textAfterCursor = currentValue.substring(cursorPos);
	
			const pre = document.createTextNode(textBeforeCursor);
			const post = document.createTextNode(textAfterCursor);
			const caretEle = document.createElement('span');
			caretEle.innerHTML = '&nbsp;';
	
			cme.innerHTML = '';
			cme.append(pre, caretEle, post);
	
			const rect = caretEle.getBoundingClientRect();
			//suggestionsEle.style.top = `${rect.top + rect.height}px`;
			//suggestionsEle.style.left = `${rect.left}px`;
			// console.log(textarea);

			//containerEle.style.display = 'block';

			var oldz = suggestionsEle.style['z-index'];

			suggestionsEle.style.width = textarea.offsetWidth +"px";
			suggestionsEle.style['z-index'] = oldz + 1;
			
			var n = 0;
			
			suggestionsEle.innerHTML = '';
			matches.forEach((match) => {
				n = n+1;
				const option = document.createElement('div');
				option.innerText = match;
				option.setAttribute('data-key', its[match]);
				option.classList.add('cg');
				option.setAttribute('tabindex',n)
				option.addEventListener('click', function() {
					replaceCurrentWord(this.innerText);
					suggestionsEle.style.display = 'none';
				});
				suggestionsEle.appendChild(option);
			});
			suggestionsEle.style.display = 'block';
		});
		
		var ct = 0;
					
		const clamp = (min, value, max) => Math.min(Math.max(min, value), max);
	
		let currentSuggestionIndex = -1;
		textarea.addEventListener('keydown', (e) => {
			if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape','Tab'].includes(e.key)) {
				return;
			}
	
			const suggestions = suggestionsEle.querySelectorAll('.cg');
			const numSuggestions = suggestions.length;
			if (numSuggestions === 0 || suggestionsEle.style.display === 'none') {
				return;
			}
			e.preventDefault();
			

			
			switch (e.key) {
				case 'ArrowDown':
					suggestions[
						clamp(0, currentSuggestionIndex, numSuggestions - 1)
					].classList.remove('cg--focused');
					currentSuggestionIndex = clamp(0, currentSuggestionIndex + 1, numSuggestions - 1);
					suggestions[currentSuggestionIndex].classList.add('cg--focused');
					break;
				case 'ArrowUp':
					suggestions[
						clamp(0, currentSuggestionIndex, numSuggestions - 1)
					].classList.remove('cg--focused');
					currentSuggestionIndex = clamp(0, currentSuggestionIndex - 1, numSuggestions - 1);
					suggestions[currentSuggestionIndex].classList.add('cg--focused');
					break;
				case 'Enter':
					replaceCurrentWord(suggestions[currentSuggestionIndex].innerText);
					suggestionsEle.style.display = 'none';
					break;
				case 'Tab':
					if (ct == 1) {
						replaceCurrentWord(suggestions[currentSuggestionIndex].innerText);
						suggestionsEle.style.display = 'none';
						ct = 0;
					} else {
						currentSuggestionIndex = clamp(0, currentSuggestionIndex - 1, numSuggestions - 1);
						suggestions[currentSuggestionIndex].classList.add('cg--focused');
						ct = 1;
					}

					break;					
				case 'Escape':
					suggestionsEle.style.display = 'none';
					break;
				default:
					break;
			}
		});
		
}
