/**
 * This is an example plugin for CSSAssist.
 *
 * This plugin accepts a regular expression and a replacement string
 * and executes the expression against the textnode of each item
 * in the current context. If deep = true, it will also process
 * the text nodes of each items descendants
 */
// self invoking function wrapper
(function () {
        // place the new function, replace, in the CSSAssist namespace
        // and specify the parameters it should expect
        CSSAssist.fn.replace = function (regex, value, deep) {
        		// ensure deep is set
        		var deep = (deep) ? deep : false;

                // iterate over each item in the context using the
                // CSSAssist forEach function
                // 		'item' is the current node (HTMLElement)
                // 		'i' is the index of the current item in the context
                this.forEach(function (item, i) {
                        // do something awesome!
                        nodeWalk(item, deep);
                });

        		// nodeWalk function modifies text of current node
        		// if deep=true, also modifies text of all descendant nodes
                function nodeWalk(node, deep) {
                	if (deep) {
                		// if deep recurse through all nodes elements looking for textnodes
                        if ((1 === node.nodeType)) {
                                for (var i = 0; i < node.childNodes.length; i++) {
                                        nodeWalk(node.childNodes[i], deep);
                                }
                        } 
	                	if (3 === node.nodeType) {
	                        if (node.nodeValue != null) node.nodeValue = node.nodeValue.replace(regex, value);

                    	}
                	} else {
                		// if not 'deep', just process the child textnodes
                		var children = node.childNodes;
                		for (var i=0; i < children.length; i++) {
                			if (3 === children[i].nodeType) {
	                        	if (children[i].nodeValue != null) children[i].nodeValue = children[i].nodeValue.replace(regex, value);

                    		}
                		}
                	}
                }

                // return 'this' to keep the function chainable
                return this;
        };

})(); // close the self invoking function