/**
 * This is an example plugin for CSSAssist.
 *
 * This plugin provides the following functions on CSSAssist collections
 * prepend, append, remove, and regex
 */
// self invoking function wrapper
(function () {
        // place the new function, replace, in the CSSAssist namespace
        // and specify the parameters it should expect
        CSSAssist.fn.prepend = function(value) {
            if (value) {
                this.forEach(
                    function(item) {
                        item.innerHTML = value + item.innerHTML;
                    }
                );
            }
            return this;
        };

        CSSAssist.fn.append = function(value) {
            if (value) {
                this.forEach(
                    function(item) {
                        item.innerHTML = item.innerHTML + value;
                    }
                );
            }
            return this;
        };

        CSSAssist.fn.remove = function() {
            this.forEach(
                function(item) {
                    item.parentNode.removeChild(item);
                }
            );
            return this;
        };

        CSSAssist.fn.regex = function(regex, value) {
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
