/**
 * This is an example plugin for CSSAssist.
 * This plugin accepts a regular expression and a replacement string
 * and executes the expression against the innerHTML of each item
 * in the current context.
 */

// self invoking function wrapper
(function () {
	// place the new function, rHTML, in the CSSAssist prototype
	// and specify the parameters it should expect
	CSSAssist.fn.rHTML = function(regex, value) {
		// iterate over each item in the context using the
		// CSSAssist forEach function
		// 		'item' is the current node (HTMLElement)
		// 		'i' is the index of the current item in the context
	    this.forEach( function (item, i) {
	    		// do something awesome!
				item.innerHTML = item.innerHTML.replace(regex, value);
	    });

	    // return 'this' to keep the function chainable
	    return this;
	};
// close the self invoking function
})(CSSAssist); 