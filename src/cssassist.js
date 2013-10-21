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
var CSSAssist = (function () {

        // this is the main object
        // internally assigned to CSSAssist to enhance compressor performance
        var CSSAssist = function (selector) {
                return new CSSAssist.prototype.init(selector);
        };

        CSSAssist.version = '2.0.0';

        // define the CSSAssist prototype
        CSSAssist.fn = CSSAssist.prototype = {

                init: function (selector) {
                        var context = [];
                        if (!selector) context = [];
                        // got self
                        else if (selector instanceof CSSAssist) return selector;
                        else {
                                // if an array
                                if (selector instanceof Array) context = selector;
                                // wrap dom nodes.
                                else if (selector.nodeType) context = [selector];
                                // if its a string (CSS selector)
                                else if (typeof selector === 'string') {
                                        context = [].slice.call(document.querySelectorAll(selector),0);
                                } else {
                                        context = [];
                                }
                        }

                        // build this object
                        // copy over the context array
                        for (var i = 0; i < context.length; ++i) this[i] = context[i];
                        // set this length
                        this.length = context.length;
                        return this;

                },

                // simple forEach loop (faster than native forEach for most cases)
                forEach: function (func) {
                        for (var i = 0; i < this.length; ++i) {
                                func.call(this, this[i], i);
                        }
                        return this;
                },

                /**
                 * Returns true if each node in the context containes each class in values
                 * Returns false otherwise.
                 * values may be either a space delimited string or an array
                 * e.g. CSSAssist('div').hasClass('myAwesomeStyle');
                 */
                hasClass: function (values) {
                        values = values || ' ';
                        values = CSSAssist.makeArray(values);
                        for (var i = 0; i < this.length; ++i) {
                                var className = (' ' + this[i].className + ' ').replace(rSpace, ' ');
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
                addClass: function (values) {
                        if (values) {
                                values = CSSAssist.makeArray(values);
                                this.forEach(
                                        function (item) {
                                                for (var j = 0; j < values.length; ++j) {
                                                        if (!CSSAssist(item).hasClass(values[j])) item.className += ' ' + values[j];
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
                removeClass: function (values) {
                        values = CSSAssist.makeArray(values) || null;
                        this.forEach(
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
                toggleClass: function (values) {
                        if (values) {
                                values = CSSAssist.makeArray(values);
                                this.forEach(
                                        function (item) {
                                                for (var j = 0; j < values.length; ++j) {
                                                        var it = CSSAssist(item);
                                                        if (it.hasClass(values[j])) it.removeClass(values[j])
                                                        else it.addClass(values[j]);
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
                setStyle: function (property, value) {
                        if (property) {
                                this.forEach(
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
                setAttr: function (attr, value) {
                        if (attr) {
                                this.forEach(
                                        function (item) {
                                                if (value) item.setAttribute(attr, value);
                                                else item.removeAttribute(attr);
                                        }
                                );
                        }
                        return this;
                },

                replace: function(regex, value) {
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
                        )
                    }
                    return this;
                },

                /**
                 * Set operations (as plugins)
                 */

                // unique function (returns an array not a CSSAssist object)
                unique: function (arrayObj) {
                        var ret = arrayObj || this,
                            unique = [];
                        for (var i = 0; i < ret.length; i += 1) {
                                if (unique.indexOf(ret[i]) < 0) {
                                        unique.push(ret[i]);
                                }
                        }
                        return CSSAssist(ret);
                },

                // union (brute force concat)
                union: function (arrayObj) {
                        if (arrayObj) {
                                var ret = [].slice.call(this,0);
                                for (var i = 0; i < arrayObj.length; ++i) {
                                        ret.push(arrayObj[i]);
                                }
                                return this.unique(ret);
                        }
                        return this;
                },

                // intersection (brute force)
                intersects: function (arrayObj) {
                        if (arrayObj) {
                                var ret = [];
                                this.forEach(
                                        function (item) {
                                                for (var i = 0; i < arrayObj.length; ++i) {
                                                        if (item == arrayObj[i]) {
                                                                ret.push(item);
                                                                break;
                                                        }
                                                }
                                        }
                                );
                                return CSSAssist(ret);
                        }
                        return this;
                },

                // difference
                difference: function (arrayObj) {
                        if (arrayObj) {
                                var ret = [],
                                        all = this.union(arrayObj);
                                all.forEach(
                                        function (item) {
                                                if (([].indexOf.call(this, item) > -1) != ([].indexOf.call(arrayObj, item) > -1)) {
                                                        ret.push(item)
                                                }
                                        }
                                );
                                return CSSAssist(ret);
                        }
                        return this;
                },

                /**
                 * Add an event listener to each node in context
                 */
                addListener: function (type, listener, useCapture) {
                        if (type && listener) {
                                useCapture = useCapture || false;
                                this.forEach(
                                        function (item) {
                                                if (item.addEventListener) item.addEventListener(type, listener, useCapture);
                                                else if (item.attachEvent) item.attachEvent( "on" + type, listener );
                                                else return false;
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
                                useCapture = useCapture || false;
                                this.forEach(
                                        function (item) {
                                                if (item.addEventListener) item.removeEventListener(type, listener, useCapture);
                                                else if (item.attachEvent) item.detachEvent( "on" + type, listener );
                                                else return false;
                                        }
                                );
                        }
                        return this;
                }

        }; // end prototype

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
        CSSAssist.makeArray = function (values) {
                if (!values) return []
                if (values instanceof Array) return values
                else if (typeof values === 'string') return values.replace(/^\s+|\s+$/g, '').split(/\s+/);
                else return [];
        };

        /**
         * Load an external CSS file
         * e.g. CSSAssist.loadCSSLink('http://meyerweb.com/eric/tools/css/reset/reset.css');
         */
        CSSAssist.loadCSS = function (url) {
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
        CSSAssist.createCSS = function (styles) {
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
        CSSAssist.fn.init.prototype = CSSAssist.fn;
        return CSSAssist;

})(); // end self-invoking function
