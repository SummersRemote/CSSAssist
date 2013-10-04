CSSAssist
=========

CSSAssist is a small (<2kb) JavaScript library for working with CSS.
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
Methods
=========
The following methods are supported.
hasClass(classList)
-------------------
The hasClass() method return true if and only if each node in the context has each class in the classList.  For instance
```javascript
$css('div').hasClass('myAwesomeClass')
```
returns true if and only if ALL <div> nodes have the class "myAwesomeClass".
addClass(classList)
--------------------
The addClass() method adds each class in classList to each node in the context. For example,
```javascript
$css('div').addClass('myAwesomeClass')
```
adds the class "myAwesomeClass" to every <div> in the document.
removeClass(classList)
-----------------------
The removeClass() method removes each class in classList from each node in the context. For example,
```javascript
$css('div').removeClass('myAwesomeClass')
```
removes the class "myAwesomeClass" from every <div> in the document.
toggleClass(classList)
----------------------
The toggleClass() method toggles each class in classList for each node in the context. For example,
```javascript
$css('div').toggleClass('myAwesomeClass')
```
would add the class "myAwesomeClass" to every <div> which did not already contain it and remove "myAwesomeClass" from every <div> node that has it.
clearAttr(attrList)
---------------------
The clearAttr() method removes each attribute in attrList from each node in the context.  For example,
```javascript
$css('div').clearAttr('class style');
```
would remove the "class" and "style" attributes from every <div> node in the document.
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
