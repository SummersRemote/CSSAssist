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
(function (window, undefined) {

        // this is the wrapper object
        CSSAssist = function (selector) {
                return new CSSAssist.fn.init(selector);
        };

        // define the CSSAssist prototype
        CSSAssist.fn = CSSAssist.prototype = {

                // CSSAssist verion, e.g.  CSSAssist().version;
                version: '1.0.0',

                // default length to 0
                length: 0,

                constructor: CSSAssist,

                /**
                 * CSSAssist
                 * context may be empty, a string, a node, or a nodeList
                 *    if context is empty ( $css() ), then no will be available
                 *    if context is a string, it must be a vaild CSS selector
                 */
                init: function (context) {

                        if (!context) {
                                this[0] = window;
                                this.length = 1;
                                return this;
                        } else if (context.nodeType) {
                                this[0] = context;
                                this.length = 1;
                                return this;
                        } else if (context === '[object NodeList]') {
                        } else if (typeof context === 'string') {
                                if (context.length === 0) {
                                        this[0] = document;
                                        this.length = 1;
                                        return this;
                                } else {
                                        context = document.querySelectorAll(context);
                                }
                        }
                        // copy the items in context (NodeList[i] to this[i])
                        if (context) {
                                for (var i = 0; i < context.length; ++i) {
                                        this[i] = context[i];
                                }
                                this.length = context.length;
                                return this;
                        }
                },

                /**
                 * Utility method to coerce a space delimited string into an array
                 */
                makeArray: function (values) {

                        if (values instanceof Array) {
                                return values;
                        } else if (typeof values === 'string') {
                                // remove beginning and ending spaces and split on space(s).
                                return values.replace(/^\s+|\s+$/g, '').split(/\s+/);
                        } else {
                                return [];
                        }

                },

                /**
                 * Returns true if each node in the context containes each class in classList
                 * Returns false otherwise.
                 * classList may be either a space delimited string or an array
                 * e.g. $css('div').hasClass('myAwesomeStyle');
                 */
                hasClass: function (classList) {
                        if (this.length === 0) {
                                return false;
                        } else if (classList) {
                                var classArray = this.makeArray(classList);
                                for (var i = 0; i < this.length; ++i) {
                                        var className = this[i].className;
                                        for (var j = 0; j < classArray.length; ++j) {
                                                if (!(RegExp('(^|\\s)' + classArray[j] + '($|\\s)').test(className))) {
                                                        return false;
                                                }
                                        }
                                }
                                return true;
                        } else {
                                return false;
                        }
                },

                /**
                 * Adds each class in classList to each node in context
                 * classList may be either a space delimited string or an array
                 * e.g. $css('div').addClass('myAwesomeStyle');
                 */
                addClass: function (classList) {
                        if (classList) {
                                var classArray = this.makeArray(classList);
                                for (var i = 0; i < this.length; ++i) {
                                        for (var j = 0; j < classArray.length; ++j) {
                                                if (!CSSAssist(this[i]).hasClass(classArray[j])) {
                                                        this[i].className += ' ' + classArray[j];
                                                }
                                        }
                                }

                        }
                        return this;
                },

                /**
                 * Removes each class in classList from each node in context
                 * classList may be either a space delimited string or an array
                 * e.g. $css('div').removeClass('myAwesomeStyle');
                 */
                removeClass: function (classList) {
                        if (classList) {
                                var classArray = this.makeArray(classList);
                                for (var i = 0; i < this.length; ++i) {
                                        var newClass = ' ' + this[i].className.replace(/\s+/g, ' ') + ' ';
                                        for (var j = 0; j < classArray.length; ++j) {
                                                while (newClass.indexOf(' ' + classArray[j] + ' ') >= 0) {
                                                        newClass = newClass.replace(' ' + classArray[j] + ' ', ' ');
                                                }
                                        }
                                        this[i].className = newClass.trim();
                                }
                        }
                        return this;
                },

                /**
                 * For each class in classList for each node in context
                 *    if the class is present, remove it
                 *    if the class is not present, add it
                 * classList may be either a space delimited string or an array
                 * e.g. $css('div').toggleClass('myAwesomeStyle');
                 */
                toggleClass: function (classList) {
                        if (classList) {
                                var classArray = this.makeArray(classList);
                                for (var i = 0; i < this.length; ++i) {
                                        for (var j = 0; j < classArray.length; ++j) {
                                                if (CSSAssist(this[i]).hasClass(classArray[j])) {
                                                        CSSAssist(this[i]).removeClass(classArray[j])
                                                } else {
                                                        CSSAssist(this[i]).addClass(classArray[j]);
                                                }
                                        }
                                }
                        }
                        return this;
                },

                /**
                 * Remove each attribute in attrList from each node in context
                 * attrList may be either a space delimited string or an array
                 * e.g. $css('div').clearAttr('class style');
                 */
                clearAttr: function (attrList) {
                        if (attrList) {
                                var attrArray = this.makeArray(attrList);
                                for (var i = 0; i < this.length; ++i) {
                                        for (var j = 0; j < attrArray.length; ++j) {
                                                this[i].removeAttribute(attrArray[j]);
                                        }
                                }
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

})(this);

// event listener methods as plugins

/**
 * Add an event listener to each node in context
 */
CSSAssist.fn.addEventListener = function (type, listener, useCapture) {
        if (type && listener) {
                if (typeof useCapture === "undefined") {
                        useCapture = false;
                }
                for (var i = 0; i < this.length; ++i) {
                        this[i].addEventListener(type, listener, useCapture);
                }
        }
        return this;
};

/**
 * Remove an event listener from each node in context
 */
CSSAssist.fn.removeEventListener = function (type, listener, useCapture) {
        if (type && listener) {
                if (typeof useCapture === "undefined") {
                        useCapture = false;
                }
                for (var i = 0; i < this.length; ++i) {
                        this[i].removeEventListener(type, listener, useCapture);
                }
        }
        return this;
};
