/*
	detectElements.js: Utility functions to detect new or modified elements.
		Licensed under MIT

	Functions:
		detectNewElements(selector, callback)
			> Detects elements as soon as they are added.
		detectFirstNewElement(selector, callback)
			> same as detectNewElements, but stop watching after the first element.
		detectElements(selector, callback)
			> Detects already existing and new elements.
		detectFirstElement(selector, callback)
			> same as detectFirstElement, but stop watching after the first element.
		
	Usage Example:
		detectNewElements("div.red", (e) => { console.log("Another div with class red: ", e); })
*/


function __detectElements(selector, callback, onlyFirst = false, onlyNew = false) {
	let found = [];
	let foundFirst = false;

	async function invokeCallback(element) {
		callback(element);
	}

	function checkMatch(element) {
		if(found.includes(element)) return;
		if(element.matches(selector)) {
			if(onlyFirst && foundFirst) return;
			found.push(element);
			invokeCallback(element);
			if(onlyFirst) {
				foundFirst = true;
				observer.disconnect();
			}
		}
	}

	if(!onlyNew) {
		const elementMatches = document.querySelectorAll(selector);
		for(let element of elementMatches) {
			found.push(element);
			invokeCallback(element);
			if(onlyFirst) return;
		}
	}

	let observer = new MutationObserver( mutations => {
		for(let mutation of mutations) {
			if(mutation.type == 'childList') {
				for(let e of mutation.addedNodes) {
					if(e.nodeType != Node.ELEMENT_NODE) continue;
					let childs = e.querySelectorAll("*");
					checkMatch(e);
					for(let child of [...childs]) { checkMatch(child); }
				}
				for(let e of mutation.removedNodes) {
					found = found.filter( f => (e!=f && !e.contains(f)) );
				}
			} else {
				checkMatch(mutation.target);
			}
		}
	});
	observer.observe(window.document, { childList: true, subtree: true, attributes: true, characterData: false });
}

function detectNewElements(selector, callback) {
	__detectElements(selector, callback, false, true);
}

function detectFirstNewElement(selector, callback) {
	__detectElements(selector, callback, true, true);
}

function detectElements(selector, callback) {
	__detectElements(selector, callback);
}

function detectFirstElement(selector, callback) {
	__detectNewElements(selector, callback, true);
}
