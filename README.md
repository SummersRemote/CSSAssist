CSSAssist
=========

CSSAssist is a small (<2kb) JavaScript library for working with CSS.

> It is amazing what you can do with a simple responsive grid and a handful of JavaScript methods!

I am a long standing fan of [jQuery](http://jquery.com/) and more recently [AngularJS](http://angularjs.org/) and frequently rely on them.  I have, however, come to realize that there are times when they are simply too much and that I desire a smaller library and smaller footprint.  CSSAssist provides methods for working with stylesheets. Period.  It does NOT provide methods for manipulating the style attribute on a node, append/prepend text/html, ajax, binding, etc. - if you need those things, I highly recommend [jQuery](http://jquery.com/) or [AngularJS](http://angularjs.org/).

Support is [limited to browsers](http://caniuse.com/queryselector) which provide the querySelector API; which includes most modern desktop and mobile browser back to IE 8 (not bad).

Enjoy!

Use
===
CSSAssist uses the CSS selector rule syntax for selecting DOM elements.
```javascript
$css()                         // select nothing
$css('*')                      // select all nodes in the document
$css('p.myAwesomeClass')       // select all <p> nodes with the class .myAwesomeClass
$css('body > div')             // select all <div> nodes that are a child of <body>
$css('div > p:nth-child(3n)')  // select every 3rd <p> node of each <div> node
```
More information:
* [W3Schools Selector Reference](http://www.w3schools.com/cssref/css_selectors.asp)
* [MDN reference on :pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
* [The W3C Selector Level 3 Spec](http://www.w3.org/TR/css3-selectors/)
Methods
=========
Methods which accept either "classList" or "attrList" will accept either an array of string values or a space delimited string of values. For example, each of the following hasClass() calls will return the same result.
```javascript
var asString = 'myAwesomeClass someOtherClass';
var asArray = ['myAwesomeClass','someOtherClass'];

$css('div').hasClass(asString);
$css('div').hasClass(asArray);
$css('div').hasClass('myAwesomeClass someOtherClass');
```
hasClass(classList)
-------------------
The hasClass() method return true if and only if each node in the context has each class in the classList.  For instance
```javascript
$css('div').hasClass('myAwesomeClass')
```
returns true if and only if ALL &lt;div&gt; nodes have the class "myAwesomeClass".
addClass(classList)
--------------------
The addClass() method adds each class in classList to each node in the context. For example,
```javascript
$css('div').addClass('myAwesomeClass')
```
adds the class "myAwesomeClass" to every &lt;div&gt; in the document.
removeClass(classList)
-----------------------
The removeClass() method removes each class in classList from each node in the context. For example,
```javascript
$css('div').removeClass('myAwesomeClass')
```
removes the class "myAwesomeClass" from every &lt;div&gt; in the document.
toggleClass(classList)
----------------------
The toggleClass() method toggles each class in classList for each node in the context. For example,
```javascript
$css('div').toggleClass('myAwesomeClass')
```
would add the class "myAwesomeClass" to every &lt;div&gt; which did not already contain it and remove "myAwesomeClass" from every &lt;div&gt; node that has it.
clearAttr(attrList)
---------------------
The clearAttr() method removes each attribute in attrList from each node in the context.  For example,
```javascript
$css('div').clearAttr('class style');
```
would remove the "class" and "style" attributes from every &lt;div&gt; node in the document.
loadCSSLink(url)
-----------------
The loadCSSLink() method loads an external CSS file (referenced by url).  The context is not relevant.  For example,
```javascript
$css().loadCSSLink('//cdnjs.cloudflare.com/ajax/libs/normalize/2.1.0/normalize.css);
```
would like the Normalize CSS stylesheet from [CDNJS](http://cdnjs.com/).
loadCSS(styles)
----------------
The loadCSS() method loads a programmatically constructed stylesheet.The context is not relevant. For example,
```javascript
var myStyles = "body { background-color: red;} div { background-color: yellow;}";
$css().loadCSS(myStyles);
```
Plugins
=======
CSSAssist can be extended by providing new methods on the CSSAssist prototype.
```javascript
$css.fn.makeRed = function () {                  // add "makeRed" to the CSSAssist prototype
        for (var i = 0; i < this.length; i++) {  // loop over each node in the context
                this[i].style.color = 'red';     // do something
        }
        return this;                             // return "this"
}
```
License
=======
CSSAssist is copyright William Summers (metatribal) and is available under the Apache License v2.0
