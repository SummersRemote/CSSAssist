// this closure creates a function scope
// references for current window object and undefined are passed in.
(function(window, undefined)
{
    
        // this is the wrapper object
        $css = function( selector ) {
            // initialize the object
            return new CSSAssist( selector );
        };

        // the main CSSAssist class and constructor
        var CSSAssist = function( selector ) {
            var context;

            // if nothing is passed, select everything
            if (!selector) {selector = '*';}

            // selector type logic...(nodelist, node, or string)
            if (selector === '[object NodeList]') {
                context = selector; 
            } else if (selector.nodeType) {
                this[0] = selector;
                this.length=1;
            } else if (typeof selector === 'string' ) {
                context = document.querySelectorAll(selector);
            } else {
            }
            
            // set the context as an array on this
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
            // CSSAssist API methods

            // hasClass
            // returns true if each node in context contains each class in classList
            hasClass: function(classList)
            {
                var classArray = this.listToArray(classList);
                for (var i = 0; i < this.length; ++i) {
                    for (var j=0; j < classArray.length; ++j) {
                        if (! (RegExp('(^|\\s)' + classArray[j] + '($|\\s)').test(this[i].className) )) {
                            return false;
                        }
                    }
                }
                return true;
            },

            // makeArray
            // take a string of space separated strings and return an array
            // TODO: change to makeArray
            listToArray: function(classList) {
                return classList.replace(/\s+/g, ' ').trim().split(' ');
            },

            // addClass
            // adds all classes in classList to each node in context
            addClass: function(classList) {
                var classArray = this.listToArray(classList);

                for (var i = 0; i < this.length; ++i) {
                    for (var j=0; j < classArray.length; ++j) { 
                        if (! $css(this[i]).hasClass(classArray[j] )) {
                           this[i].className += ' ' + classArray[j];
                        }
                    }
                }
                return this;
            },

            // removeClass
            // remove each class in classList from each node in context
            removeClass: function(classList) {
                var classArray = this.listToArray(classList);

                for (var i = 0; i < this.length; ++i) {
                    var newClass = ' ' + this[i].className.replace( /[\t\r\n]/g, ' ') + ' ';
                    for (var j=0; j < classArray.length; ++j) {
                           while (newClass.indexOf(' ' + classArray[j] + ' ') >= 0 ) {
                              newClass = newClass.replace(' ' + classArray[j] + ' ', ' ');
                           }
                    }
                    this[i].className = newClass.replace(/^\s+|\s+$/g, '');
                }

            },

            // toggleClass
            // if class is present, remove it
            // if class is not present, add it
            toggleClass: function(classList) {
                var classArray = this.listToArray(classList);

                for (var i = 0; i < this.length; ++i) {
                    for (var j=0; j < classArray.length; ++j) {
                        if (css(this[i]).hasClass(classArray[j])) {
                            css(this[i]).removeClass(classArray[j] )
                        } else {
                            css(this[i]).addClass(classArray[j] );
                        }
                    }
                }
            },

            // clearAttr
            // remove attr from each node in context
            // e.g.  'class', 'style', 'data-', etc...
            clearAttr: function(attrList) {
                var attrArray = this.listToArray(attrList);
                for (var i = 0; i < this.length; ++i) {
                    for (var j=0; j < attrArray.length; ++j) {
                        this[i].removeAttribute(attrArray[j]);
                    }
                }
            },

            // loadCSS
            // load an external CSS file
            loadCSS: function(url) {
                console.log('loadCSS: ' + url);
                var head = document.getElementsByTagName('head')[0],
                link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = url;
                head.appendChild(link);
                return link;
            }

        }

})(this);
