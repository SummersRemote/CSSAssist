/* Copyright 2013 William Summers, Metatribal Research
 * adapted from https://developer.mozilla.org/en-US/docs/JXON
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author William Summers
 *
 * CSSAssist provides a minimal set of methods for working with CSS
 * Browser support is limited by the availability of
 *            querySelector (http://caniuse.com/queryselector)
 *            add/removeEventListener (ie9+, most others support)
 */
// create a self-invoking function
;(function () {

        // this is the main object
        CSSAssist = function (selector, context) {
                return new CSSAssist.fn.init(selector);
        };

        CSSAssist.version = '2.1.3';

        // define the CSSAssist prototype
        CSSAssist.fn = CSSAssist.prototype = {

                /**
                 * CSSAssist
                 *
                 */
                init: function (selector) {

                        // if no selector, return empty array
                        if (!selector) return [];
                        // got a function 
                        else if (typeof (selector) == 'function') return selector(CSSAssist);
                        // got self
                        else if (selector instanceof CSSAssist) return selector;
                        else {
                                var context;
                                if (selector instanceof Array) context = selector;
                                // wrap dom nodes.
                                else if (typeof selector === 'object') context = [selector];
                                // if its a string (CSS selector)
                                else if (typeof selector === 'string') {
                                        context = [].slice.call(document.querySelectorAll(selector));
                                } else context = [];

                                // set the prototype for the context tp CSSAssist and return
                                context.__proto__ = CSSAssist.fn;
                                return context;
                        }

                },

                // simple forEach loop (faster than native...)
                forEach: function( func ) {
                    for (var i=0; i < this.length; ++i) {
                        func.call(this, this[i]);
                    }
                },

                /**
                 * Returns true if each node in the context containes each class in values
                 * Returns false otherwise.
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').hasClass('myAwesomeStyle');
                 */
                hasClass: function (values, context) {
                        if (!values) return false;
                        else {
                                var context = (context) ? CSSAssist(context) : this;
                                var values = makeArray(values);
                                for (var i = 0; i < context.length; ++i) {
                                        var className = (' ' + context[i].className + ' ').replace(rSpace, ' ');
                                        for (var j = 0; j < values.length; ++j) {
                                                if (!(className.indexOf(' ' + values[j] + ' ') > -1)) return false;
                                        }
                                }
                                return true;
                        }
                },

                /**
                 * Adds each class in values to each node in context
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').addClass('myAwesomeStyle');
                 */
                addClass: function (values, context) {
                        if (values) {
                                var context = (context) ? CSSAssist(context) : this
                                var values = makeArray(values);
                                context.forEach(
                                        function (v) {
                                                for (var j = 0; j < values.length; ++j) {
                                                        if (! context.hasClass(values[j], v) ) v.className += ' ' + values[j];
                                                }
                                        }, context
                                );
                        }
                        return this;
                },

                /**
                 * Removes each class in values from each node in context
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').removeClass('myAwesomeStyle');
                 */
                removeClass: function (values, context) {
                        var context = (context) ? CSSAssist(context) : this
                        var values = makeArray(values);
                        context.forEach(
                                function (v) {
                                        if (values) {
                                            var className = (' ' + v.className + ' ').replace(rSpace, ' ');
                                            for (var j = 0; j < values.length; ++j) {
                                                    while (className.indexOf(' ' + values[j] + ' ') >= 0) {
                                                            className = className.replace(' ' + values[j] + ' ', ' ');
                                                    }
                                            }
                                            v.className = className.trim();
                                        } else v.removeAttribute('class');
                                }, context
                        );

                        return this;
                },

                /**
                 * For each class in values for each node in context
                 *    if the class is present, remove it
                 *    if the class is not present, add it
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').toggleClass('myAwesomeStyle');
                 */
                toggleClass: function (values, context) {
                        if (values) {
                                var context = (context) ? CSSAssist(context) : this
                                var values = makeArray(values);
                                context.forEach(
                                        function (v) {
                                                for (var j = 0; j < values.length; ++j) {
                                                        if (context.hasClass(values[j], v)) context.removeClass(values[j], v)
                                                        else context.addClass(values[j], v);
                                                }
                                        }, context
                                );
                        }
                        return this;
                },

                /**
                 * for each node in context
                 *      sets or clears the specified style property
                 * e.g. $css('.red').setStyle('color', '#FF0000'); // sets the style
                 * e.g. $css('.red').setStyle('color', ); // clears the style
                 */
                setStyle: function (property, value, context) {
                        if (property) {
                                var context = (context) ? CSSAssist(context) : this;
                                context.forEach(
                                        function (v) {
                                                if (value) v.style[property] = value;
                                                else v.style[property] = '';
                                        }, context
                                );
                        }
                        return this;
                },

                /**
                 * for each node in context
                 *      sets or clears the specified style property
                 * e.g. $css('.red').setStyle('color', '#FF0000'); // sets the style
                 * e.g. $css('.red').setStyle('color', ); // clears the style
                 */
                setAttr: function (attr, value, context) {
                        if (attr) {
                                var context = (context) ? CSSAssist(context) : this;
                                context.forEach(
                                        function (v) {
                                                if (value) v.setAttribute(attr, value);
                                                else v.removeAttribute(attr);
                                        }, context
                                );
                        }
                        return this;
                },

                /**
                 * Load an external CSS file
                 * e.g. $css().loadCSSLink('http://meyerweb.com/eric/tools/css/reset/reset.css');
                 */
                loadCSS: function (url) {
                        if (url) {
                                var head = document.getElementsByTagName('head')[0];
                                var link = document.createElement('link');
                                link.type = 'text/css';
                                link.rel = 'stylesheet';
                                link.href = url;
                                head.appendChild(link);
                                return this;
                        }
                        return this;
                },

                /**
                 * Inject a programmatically created stylesheet
                 * styles is a string containing css rules to be injected
                 * e.g $css().loadCSS( 'body { background-color: red;} div { background-color: yellow;}' );
                 */
                createCSS: function (styles) {
                        if (styles) {
                                var head = document.getElementsByTagName('head')[0];
                                var styleNode = document.createElement('style');
                                styleNode.type = 'text/css';
                                if (styleNode.styleSheet) styleNode.styleSheet.cssText = styles;
                                else styleNode.appendChild(document.createTextNode(styles));
                                head.appendChild(styleNode);
                        }
                        return this;
                }

        };

        // regex for collapsing space and newlines
        var rSpace = /[\s+\t\r\n\f]/g;

        /**
         * Utility method to coerce a space delimited string into an array
         */
        makeArray = function (values) {
                if (values instanceof Array) return values
                else if (typeof values === 'string') return values.replace(/^\s+|\s+$/g, '').split(/\s+/);
                else return [];
        };

        // Give the init method the CSSAssist prototype for later instantiation
        CSSAssist.fn.init.prototype = CSSAssist.fn;

})() // end self-invoking function

/**
 * Event Listeners (as plugins)
 */


/**
 * Add an event listener to each node in context
 */
CSSAssist.fn.addListener = function (type, listener, useCapture) {
        if (type && listener) {
                var capture = useCapture || false;
                this.forEach(
                        function (v) {
                                v.addEventListener(type, listener, capture);
                        }
                );
        }
        return this;
};

/**
 * Remove an event listener from each node in context
 */
CSSAssist.fn.removeListener = function (type, listener, useCapture) {
        if (type && listener) {
                var capture = useCapture || false;
                this.forEach(
                        function (v) {
                                v.removeEventListener(type, listener, capture);
                        }, this
                );
        }
        return this;
};


/**
 * Set operations (as plugins)
 */

// unique function (returns an array not a CSSAssist object)
CSSAssist.fn.unique = function ( ) {
    var unique= [];
    for (var i = 0; i < this.length; i += 1) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return CSSAssist( unique );
}

// union (concat)
CSSAssist.fn.union = function ( arrayObj ) {
        if (arrayObj) {
            return CSSAssist( [].concat.call(this, arrayObj) ).unique();
        }
}

// intersection (brute force)
CSSAssist.fn.intersects = function ( arrayObj ) {
        if (arrayObj) {
                var ret = [];
                this.forEach(
                    function (v) {
                        for (var z = 0; z < arrayObj.length; z++) {
                            if (v == arrayObj[z]) {
                                ret.push(v);
                                break;
                            }
                        }
                    }
                );
                return CSSAssist(ret).unique();
        }
        return this;
}
