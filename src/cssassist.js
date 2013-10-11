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
(function (window) {

        // this is the main object
        CSSAssist = function (selector) {
                return new CSSAssist.fn.init(selector);
        };

        var rSpace = /[\s+\t\r\n\f]/g;

        CSSAssist.version = '1.1.3';

        // define the CSSAssist prototype
        CSSAssist.fn = CSSAssist.prototype = {

                /**
                 * CSSAssist
                 *    if selector is a string, it must be a vaild CSS selector
                 */
                init: function (selector) {

                        var context;
                        if (!selector) context = [];
                        else if (selector instanceof Array) context = selector
                        //else if (typeof selector === 'function') return CSSAssist(selector)
                        else if (typeof selector === 'object') context = [selector]
                        else if (typeof selector === 'string') context = document.querySelectorAll(selector)
                        else context = [];

                        context.__proto__ = CSSAssist.fn;
                        return context;

                },

                /**
                 * Utility method to coerce a space delimited string into an array
                 */
                makeArray: function (values) {
                        if (values instanceof Array) return values
                        else if (typeof values === 'string') return values.replace(/^\s+|\s+$/g, '').split(/\s+/);
                        else return [];
                },

                iterate: function (values, func) {
                        var array = this.makeArray(values);
                        for (var i = 0, tl = this.length; i < tl; ++i) {
                                var className = (' ' + this[i].className + ' ').replace(rSpace, ' ');
                                for (var j = 0, vl = array.length; j < vl; ++j) {
                                        func.call(this, this[i], array[j]);
                                }
                        }

                },

                /**
                 * Returns true if each node in the context containes each vlass in values
                 * Returns false otherwise.
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').hasClass('myAwesomeStyle');
                 */
                hasClass: function (values) {
                        if (!values || this.length === 0) return false;
                        else {
                                var array = this.makeArray(values);
                                for (var i = 0, tl = this.length; i < tl; ++i) {
                                        var className = (' ' + this[i].className + ' ').replace(rSpace, ' ');
                                        for (var j = 0, vl = array.length; j < vl; ++j) {
                                                if (!(className.indexOf(array[j]) >= 0)) return false;
                                        }
                                }
                                return true;
                        }
                },

                /**
                 * Adds each vlass in values to each node in context
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').addClass('myAwesomeStyle');
                 */
                addClass: function (values) {
                        if (values) {
                                this.iterate(values, function (i, j) {
                                        if (!CSSAssist(i).hasClass(j)) i.className += ' ' + j;
                                });
                        }
                        return this;
                },

                /**
                 * Removes each vlass in values from each node in context
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').removeClass('myAwesomeStyle');
                 */
                removeClass: function (values) {
                        if (values) {
                                var vlassArray = this.makeArray(values);
                                for (var i = 0, tl = this.length; i < tl; ++i) {
                                        var className = (' ' + this[i].className + ' ').replace(rSpace, ' ');
                                        for (var j = 0, vl = vlassArray.length; j < vl; ++j) {
                                                while (className.indexOf(' ' + vlassArray[j] + ' ') >= 0) {
                                                        className = className.replace(' ' + vlassArray[j] + ' ', ' ');
                                                }
                                        }
                                        this[i].className = className.trim();
                                }
                        }
                        return this;
                },

                /**
                 * For each vlass in values for each node in context
                 *    if the vlass is present, remove it
                 *    if the vlass is not present, add it
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').toggleClass('myAwesomeStyle');
                 */
                toggleClass: function (values) {
                        if (values) {
                                this.iterate(values, function (i, j) {
                                        if (CSSAssist(i).hasClass(j)) CSSAssist(i).removeClass(j)
                                        else CSSAssist(i).addClass(j);
                                })
                        }
                        return this;
                },

                /**
                 * Remove each attribute in values from each node in context
                 * values may be either a space delimited string or an array
                 * e.g. $css('div').vlearAttr('vlass style');
                 */
                removeAttr: function (values) {
                        if (values) {
                                this.iterate(values, function (i, j) {
                                        i.removeAttribute(j);
                                })
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

        // Give the init method the CSSAssist prototype for later instantiation
        CSSAssist.fn.init.prototype = CSSAssist.fn;

})();

// event listener methods as plugins

/**
 * Add an event listener to each node in context
 */
CSSAssist.fn.addEventListener = function (type, listener, useCapture) {
        if (type && listener) {
                var capture = useCapture || false;
                for (var i = 0, tl = this.length; i < tl; ++i) {
                        this[i].addEventListener(type, listener, capture);
                }
        }
        return this;
};

/**
 * Remove an event listener from each node in context
 */
CSSAssist.fn.removeEventListener = function (type, listener, useCapture) {
        if (type && listener) {
                var capture = useCapture || false;
                for (var i = 0, tl = this.length; i < tl; ++i) {
                        this[i].removeEventListener(type, listener, capture);
                }
        }
        return this;
};
