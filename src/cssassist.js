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
 *
 * these are the chainable methods
 *      init, forEach, hasClass, addClass, removeClass, toggleClass
 *      setStyle, setAttr, addListener, removeListener
 *
 * additional methods supplied by plugin (chainable)
 *      unique, union, intersects, difference
 *
 * non-chainable methods
 *      makeArray, loadCSS, createCSS
 */

// create a self-invoking function
;(function () {

        // this is the main object
        // internally assigned to _ to enhance compressor performance
        var _ = CSSAssist = function (selector, context) {
                return new _.fn.init(selector);
        };

        // _ version number
        _.version = '2.0.0-alpha';

        // define the CSSAssist prototype
        _.fn = _.prototype = {

                /**
                 * CSSAssist
                 *
                 */
                init: function (selector) {
                        var context = [];
                        // if no selector, pass 
                        if (!selector) context = [];
                        // got self
                        else if (selector instanceof CSSAssist) return selector;
                        else {
                                // if an array
                                if (selector instanceof Array) context = selector;
                                // wrap dom nodes.
                                else if (typeof selector === 'object') context = [selector];
                                // if its a string (CSS selector)
                                else if (typeof selector === 'string') {
                                        context = [].slice.call(document.querySelectorAll(selector));
                                }
                        }

                        // set the prototype for the context tp CSSAssist and return
                        context.__proto__ = _.fn;
                        return context;

                },

                // simple forEach loop (faster than native forEach for most cases)
                forEach: function (func, context) {
                        for (var i = 0; i < this.length; ++i) {
                                func.call(this, this[i]);
                        }
                        return this;
                },

                /**
                 * Returns true if each node in the context containes each class in values
                 * Returns false otherwise.
                 * values may be either a space delimited string or an array
                 * e.g. CSSAssist('div').hasClass('myAwesomeStyle');
                 */
                hasClass: function (values, context) {
                        if (!values) values =' ';
                        var context = (context) ? _(context) : this,
                                values = _.makeArray(values);
                        for (var i = 0; i < context.length; ++i) {
                                var className = (' ' + context[i].className + ' ').replace(rSpace, ' ');
                                for (var j = 0; j < values.length; ++j) {
                                        if ((className.indexOf(' ' + values[j] + ' ') < 0)) return false;
                                }
                        }
                        return true;

                },

                /**
                 * Adds each class in values to each node in context
                 * values may be either a space delimited string or an array
                 * e.g. CSSAssist('div').addClass('myAwesomeStyle');
                 */
                addClass: function (values, context) {
                        if (values) {
                                var context = (context) ? _(context) : this,
                                        values = _.makeArray(values);
                                context.forEach(
                                        function (item) {
                                                for (var j = 0; j < values.length; ++j) {
                                                        if (!context.hasClass(values[j], item)) item.className += ' ' + values[j];
                                                }
                                        }
                                );
                        }
                        return this;
                },

                /**
                 * Removes each class in values from each node in context
                 * values may be either a space delimited string or an array
                 * e.g. CSSAssist('div').removeClass('myAwesomeStyle');
                 */
                removeClass: function (values, context) {
                        var context = (context) ? _(context) : this;
                        if (values) values = _.makeArray(values);
                        context.forEach(
                                function (item) {
                                        if (values) {
                                                var className = (' ' + item.className + ' ').replace(rSpace, ' ');
                                                for (var j = 0; j < values.length; ++j) {
                                                        while (className.indexOf(' ' + values[j] + ' ') > -1) {
                                                                className = className.replace(' ' + values[j] + ' ', ' ');
                                                        }
                                                }
                                                item.className = className.trim();
                                        } else item.removeAttribute('class');
                                }
                        );

                        return this;
                },

                /**
                 * For each class in values for each node in context
                 *    if the class is present, remove it
                 *    if the class is not present, add it
                 * values may be either a space delimited string or an array
                 * e.g. CSSAssist('div').toggleClass('myAwesomeStyle');
                 */
                toggleClass: function (values, context) {
                        if (values) {
                                var context = (context) ? _(context) : this,
                                    values = _.makeArray(values);
                                context.forEach(
                                        function (item) {
                                                for (var j = 0; j < values.length; ++j) {
                                                        if (context.hasClass(values[j], item)) context.removeClass(values[j], item)
                                                        else context.addClass(values[j], item);
                                                }
                                        }
                                );
                        }
                        return this;
                },

                /**
                 * for each node in context
                 *      sets or clears the specified style property
                 * e.g. CSSAssist('.red').setStyle('color', '#FF0000'); // sets the style
                 * e.g. CSSAssist('.red').setStyle('color', ); // clears the style
                 */
                setStyle: function (property, value, context) {
                        if (property) {
                                var context = (context) ? _(context) : this;
                                context.forEach(
                                        function (item) {
                                                if (value) item.style[property] = value;
                                                else item.style[property] = '';
                                        }
                                );
                        }
                        return this;
                },

                /**
                 * for each node in context
                 *      sets or clears the specified style property
                 * e.g. CSSAssist('span').setAttr('data-src', 'my data source'); // sets the style
                 * e.g. CSSAssist('span').setAttr('data-src', ); // clears the style
                 */
                setAttr: function (attr, value, context) {
                        if (attr) {
                                var context = (context) ? _(context) : this;
                                context.forEach(
                                        function (item) {
                                                if (value) item.setAttribute(attr, value);
                                                else item.removeAttribute(attr);
                                        }
                                );
                        }
                        return this;
                },

                /**
                 * Set operations (as plugins)
                 */

                // unique function (returns an array not a CSSAssist object)
                unique:  function (context) {
                        var context = (context) ? _(context) : this;
                        var unique = [];
                        for (var i = 0; i < context.length; i += 1) {
                                if (unique.indexOf(context[i]) < 0) {
                                        unique.push(context[i]);
                                }
                        }
                        return _(unique);
                },

                // union (concat)
                union: function (arrayObj, context) {
                        var context = (context) ? _(context) : this;
                        if (arrayObj) {
                                return _([].concat.call(context, arrayObj)).unique();
                        }
                },

                // intersection (brute force)
                intersects: function (arrayObj, context) {
                        var context = (context) ? _(context) : this;
                        if (arrayObj) {
                                var ret = [];
                                context.forEach(
                                        function (item) {
                                                for (var i = 0; i < arrayObj.length; ++i) {
                                                        if (item == arrayObj[i]) {
                                                                ret.push(item);
                                                                break;
                                                        }
                                                }
                                        }
                                );
                                return _(ret).unique();
                        }
                        return this;
                },

                // difference
                difference: function (arrayObj, context) {
                        var context = (context) ? _(context) : this;   
                        if (arrayObj) {
                                var ret = []
                                var all = context.union(arrayObj);
                                all.forEach(
                                    function (item) {
                                        //var item = all[i];
                                        if (([].indexOf.call(context, item) > -1) != ([].indexOf.call(arrayObj, item) > -1)) {
                                                ret.push(item)
                                        }
                                    }
                                ); 
                                return _(ret);
                        }
                        return this;
                },

                /**
                 * Add an event listener to each node in context
                 */
                addListener: function (type, listener, useCapture) {
                        if (type && listener) {
                                var capture = useCapture || false;
                                this.forEach(
                                        function (item) {
                                                item.addEventListener(type, listener, capture);
                                        }
                                );
                        }
                        return this;
                },

                /**
                 * Remove an event listener from each node in context
                 */
                removeListener: function (type, listener, useCapture) {
                        if (type && listener) {
                                var capture = useCapture || false;
                                this.forEach(
                                        function (item) {
                                                item.removeEventListener(type, listener, capture);
                                        }
                                );
                        }
                        return this;
                }

        };  // end prototype

        // regex for collapsing space, tabs, returns, and newlines to single space
        var rSpace = /[\s+\t\r\n\f]/g;

        /** 
         * Utility methods outside of the prototype but in CSSAssist namespace
         * these methods do not require/accept a context
         */

        /**
         * Utility method to coerce a space delimited string into an array
         * if values is not passed, return an empty array
         * if values is already an array, simply return it
         * if values is a string clean and split it
         * oterwise, return this
         */
        _.makeArray = function (values) {
                if (!values) return []
                if (values instanceof Array) return values
                else if (typeof values === 'string') return values.replace(/^\s+|\s+$/g, '').split(/\s+/);
                else return this;
        };

        /**
         * Load an external CSS file
         * e.g. CSSAssist.loadCSSLink('http://meyerweb.com/eric/tools/css/reset/reset.css');
         */
        _.loadCSS = function (url) {
                if (url) {
                        var head = document.getElementsByTagName('head')[0],
                                link = document.createElement('link');
                        link.type = 'text/css';
                        link.rel = 'stylesheet';
                        link.href = url;
                        head.appendChild(link);
                        return this;
                }
                return this;
        }


        /**
         * Inject a programmatically created stylesheet
         * styles is a string containing css rules to be injected
         * e.g CSSAssist.loadCSS( 'body { background-color: red;} div { background-color: yellow;}' );
         */
        _.createCSS = function (styles) {
                if (styles) {
                        var head = document.getElementsByTagName('head')[0],
                                styleNode = document.createElement('style');
                        styleNode.type = 'text/css';
                        if (styleNode.styleSheet) styleNode.styleSheet.cssText = styles;
                        else styleNode.appendChild(document.createTextNode(styles));
                        head.appendChild(styleNode);
                }
                return this;
        }     

        // Give the init method the CSSAssist prototype for later instantiation
        _.fn.init.prototype = _.fn;

})() // end self-invoking function
