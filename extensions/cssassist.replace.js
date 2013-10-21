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
        CSSAssist.fn.replace = function(regex, value) {
            if (regex && value) {
                this.forEach(
                    function(item) {
                        var children = item.childNodes;
                        for (var i=0; i < children.length; i++) {
                            if (3 === children[i].nodeType) {
                                if (children[i].nodeValue != null) children[i].nodeValue = children[i].nodeValue.replace(regex, value);
                            }
                        }
                    }
                );
            }
            return this;
        };

})(); // close the self invoking function