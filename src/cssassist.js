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
        $css = function (selector) {
                return new CSSAssist(selector);
        };

        /**
         * CSSAssist
         * context may be empty, a string, a node, or a nodeList
         *    if context is empty ( $css() ), then no will be available
         *    if context is a string, it must be a vaild CSS selector
         */
        var CSSAssist = function (context) {

                if (!context) {
                        this.length = 0;
                } else if (typeof context === 'string') {
                        context = document.querySelectorAll(context);
                } else if (context.nodeType) {
                        this[0] = context;
                        this.length = 1;
                } else if (context === '[object NodeList]') {} else {
                        this.length = 0;
                }

                if (context) {
                        for (var i = 0; i < context.length; ++i) {
                                this[i] = context[i];
                        }
                        this.length = context.length;
                }

                return this;
        }

        // define the CSSAssist prototype
        $css.fn = CSSAssist.prototype = {

                /**
                 * Utility method to coerce a space delimited string into an array
                 */
                makeArray: function (values) {

                        if (values instanceof Array) {
                                return values;
                        } else if (typeof values === 'string') {
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
                                                if (!$css(this[i]).hasClass(classArray[j])) {
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
                                                if (css(this[i]).hasClass(classArray[j])) {
                                                        css(this[i]).removeClass(classArray[j])
                                                } else {
                                                        css(this[i]).addClass(classArray[j]);
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
                loadCSSLink: function (url) {
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
                loadCSS: function (styles) {
                        if (styles) {
                                var head = document.getElementsByTagName('head')[0];
                                var styleNode = document.createElement('style');
                                styleNode.type = 'text/css';
                                if (styleNode.styleSheet) styleNode.styleSheet.cssText = styles;
                                else styleNode.appendChild(document.createTextNode(styles));
                                head.appendChild(styleNode);
                        }
                        return this;
                },

                /**
                 * Add an event listener to each node in context
                 */
                addEventListener: function(type, listener, useCapture) {
                        if (type && listener) {
                                if (typeof useCapture === "undefined") {useCapture = false;}
                                for (var i = 0; i < this.length; ++i) {
                                    this[i].addEventListener(type, listener, useCapture);
                                }
                        }
                        return this;
                },

                /**
                 * Remove an event listener from each node in context
                 */
                removeEventListener: function(type, listener, useCapture) {
                        if (type && listener) {
                                if (typeof useCapture === "undefined") {useCapture = false;}
                                for (var i = 0; i < this.length; ++i) {
                                    this[i].removeEventListener(type, listener, useCapture);
                                }
                        }
                        return this;
                }

        }

})(this);
