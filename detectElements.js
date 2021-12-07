/*
	detectElements.js: Utility functions to detect new or modified elements.
		Licensed under MIT

	Functions:
		detectNewElements(selector, callback)
		detectFirstNewElement(selector, callback)
		
	Usage Example:
		detectNewElements("div.red", (e) => { console.log("Another div with class red: ", e); })
*/


function __detectNewElements(selector, callback, onlyFirst = false) {
	let found = [];
	let observer = new MutationObserver( mutations => {
		for(let mutation of mutations) {
			if(mutation.type == 'childList') {
				for(let e of mutation.addedNodes) {
					if(e.nodeType != Node.ELEMENT_NODE) continue;
					checkMatch(e);
				}
				for(let e of mutation.removedNodes) {
					found = found.filter( f => (e!=f && !e.contains(f)) );
				}
			} else {
				checkMatch(mutation.target);
			}
		}
	});
	function checkMatch(element) {
		if(found.includes(element)) return;
		if(element.matches(selector)) {
			found.push(element);
			callback(element);
			if(onlyFirst) {
				observer.disconnect();
			}
		}
	}
	observer.observe(window.document, { childList: true, subtree: true, attributes: true, characterData: false });
}

function detectNewElements(selector, callback) {
	return __detectNewElements(selector, callback);
}

function detectFirstNewElement(selector, callback) {
	return __detectNewElements(selector, callback, true);
}
