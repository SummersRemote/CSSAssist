CSSAssist v2
============

> "Eagles come in all shapes and sizes, but you will recognize them chiefly by their attitudes." - E.F. Schumacher


CSSAssist v2 is a lean (3kb minified, 1kb gzipped), extensible JavaScript library which provides a lightweight wrapper around the JavaScript [querySelector method](https://developer.mozilla.org/en-US/docs/Web/API/Document.querySelectorAll) and a handful of operations for manipulating [CSS](http://en.wikipedia.org/wiki/Cascading_Style_Sheets).  CSSAssist is intended for modern mobile, tablet, and desktop browsers and works well on recent versions of all major dektop and mobile browsers including IE 9+.  If you require support for older browsers or a larger feature set, I highly recomment the excellent [jQuery](http://jquery.com/) and [AngularJS](http://angularjs.org/) projects.

Provided Methods
-----------------
Chainable Methods
- forEach
- hasClass, addClass, removeClass, toggleClass
- setStyle, setAttr
- addListener, removeListener
- unique, union, intersects, difference

Non-chainable/utility methods
- makeArray
- loadCSS, createCSS

Use
===

Include the CSSAssist library by adding the following script tag near the end of your document

```html
<script type="text/javascript" src="cssassist.js"></script>
```

CSSAssist(selector[, context])
------------------------------

CSSAssist provides a [fluent API](http://en.wikipedia.org/wiki/Fluent_interface) similiar to jQuery and relies on the CSS selector syntax for selecting DOM elements. The CSSAssist object accepts a selector and an optional context (e.g. a reference to a subcontext in the current document or an iFrame).

```javascript
CSSAssist()                         // selects nothing, returns an empty CSSAssist object
CSSAssist(window.document)          // selects the document object
CSSAssist('*')                      // selects all nodes in the document
CSSAssist('p.myAwesomeClass')       // selects all <p> nodes with the class .myAwesomeClass
CSSAssist('body > div')             // selects all <div> nodes that are a child of <body>
CSSAssist('div > p:nth-child(3n)')  // selects every 3rd <p> node of each <div> node

var frameDoc = document.getElementById ("myFrame").contentWindow.document;
CSSAssist('a', frameDoc)            // selects all <a> nodes in document contained in "myFrame"
```
CSS selector and property support may vary by browser - check out [caniuse.com](http://caniuse.com/#cats=CSS) for supported configurations.

For more information on CSS selectors:

* [W3Schools Selector Reference](http://www.w3schools.com/cssref/css_selectors.asp)
* [MDN reference on :pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
* [The W3C Selector Level 3 Spec](http://www.w3.org/TR/css3-selectors/)

Properties
=============
The following properties are supported on the CSSAssist object

```javascript
CSSAssist.version               // returns the version of CSSAssist in use

// for a given selector
CSSAssist(selector).length      // return the number of items in the selected context
CSSAssist(selector)[n]          // return the nth (0 based) item in the selected context (item will be a DOM node)
```

Methods
=======

Methods which accept a list of values will accept either an array of string values or a space delimited string of values. For example, each of the following hasClass() calls will return the same result.  Additionally, most methods will accept an optional context.

```javascript
var asString = 'myAwesomeClass someOtherClass';
var asArray = ['myAwesomeClass','someOtherClass'];

CSSAssist('div').hasClass(asString);
CSSAssist('div').hasClass(asArray);
CSSAssist('div').hasClass('myAwesomeClass someOtherClass');
```

hasClass([values[, context]])
-------------------------------
The hasClass() method return true if and only if each node in the context has each class in the values list.  For instance

```javascript
CSSAssist('div').hasClass()                                 // divs must NOT contain any classes
CSSAssist('div').hasClass('myAwesomeClass')                 // divs must contain myAwesomeClass
CSSAssist('div').hasClass('myAwesomeClass myOtherClass')    // divs must contain both myAwesomeClass and myOtherClass
```

addClass(values[, context])
--------------------
The addClass() method adds each class in the values list to each node in the context.  addClass() does NOT add duplicates. For example,

```javascript
CSSAssist('div').addClass('myAwesomeClass')             // add myAwesome class to all divs
CSSAssist('div.foo').addClass('aClass bClass')          // add aClass and bClass to all divs which have the class foo
```

removeClass([values[, context]])
-----------------------
The removeClass() method removes each class in classList from each node in the context. For example,

```javascript
CSSAssist('.bar').removeClass()                     // remove all classes from all nodes with .bar class (.bar inclusive)
CSSAssist('div').removeClass('myAwesomeClass')      // remove myAwesomeClass from all divs
```

toggleClass(values[, context])
----------------------
The toggleClass() method toggles each class in classList for each node in the context. For example,

```javascript
CSSAssist('div').toggleClass('myAwesomeClass')      // add myAwesome class to every div which did not alread have it,
                                                    // and remove myAwesomeClass from every node which already had it.
```

setStyle(property[,value[, context]])
---------------------
The setStyle() method will set or clear the specified style property (only one) for each node in the context.

```javascript
CSSAssist('span').setStyle('color')             // clears the color style on all spans
CSSAssist('p.big').setStyle('fontSize', '2em')  // sets the font size to 2em for all paragraphs with the class big
```

setAttr(attr[, value[, context]])
---------------------
The setAttr() method will set or remove the specified attribute (only one) for each node in the context.

```javascript
CSSAssist('*').setAttr('style')                     // remove the style attributes from all nodes
CSSAssist('span').setAttr('data-myData')            // removes the attribute data-myData from all spans
CSSAssist('span').setAttr('data-myData', 'some good data')  // sets the attribute data-myData to 'some good data' for all spans
```

loadCSS(url)
-----------------
The loadCSS() method loads an external CSS file (referenced by url) by creating and inserting an appropriate &lt;script&gt; element.  The context is not relevant and should be called like this

```javascript
CSSAssist.loadCSS('//cdnjs.cloudflare.com/ajax/libs/normalize/2.1.0/normalize.css');
```

createCSS(styles)
----------------
The createCSS() method loads a programmatically constructed stylesheet. The context is not relevant and should be called as

```javascript
var myStyles = "body { background-color: red;} div { background-color: yellow;}";
CSSAssist.createCSS(myStyles);
```

Event Listeners
===============
The cssassist.js file also includes two methods for binding custom event handlers to DOM events.  These methods wrap the add/removeEventListener methods such that the provided listener is added to each node in the context.
The following links are good resources for events:
* [MDN Reference fo DOM events](https://developer.mozilla.org/en-US/docs/Web/Reference/Events)
* [MDN Reference for window events](https://developer.mozilla.org/en-US/docs/Web/API/Window#Event_handlers)

addListener(type, listener[, useCapture])
--------------------------------------------
The addListener() method adds the specified listener to all nodes in the context.  For example,

```javascript
var myListener = function (event) {
  this.style.visibility='hidden';
};

CSSAssist('div.makeInvisible').addListener('click', myListener );
```
adds the event listener, myListener, to the click event of all &lt;div&gt; nodes with the class "makeInvisible".

removeListener(type, listener[, useCapture])
------------------------------------------
The removeListener() method removes the specified listener from all nodes in the context.  For example,

```javascript
CSSAssist('div.makeInvisible').removeListener('click', myListener );
```
removes the event listener, myListener, from the click event of all &lt;div&gt; nodes with the class "makeInvisible".  The event will no longer fire when the &lt;div&gt; is clicked.

Set Operations 
==============
The cssassist.js file also includes the following set operations.  The resulting CSSAssist object of each of these methods will NOT contain deuplicates.

unique([context])
-----------------
Ensures that duplicates are removed from the current CSSAssist object.  This method is used internally, but may be useful if the developer is manually adding items to the context.


union([context])
-----------------

intersects([context])
----------------------

difference([context])
----------------------

Plugins
=======
CSSAssist can be extended by providing new methods on the CSSAssist prototype.  When possible, return "this" to enable the method to be chained.

```javascript
;(function (CSSAssist) {
    CSSAssist.fn.makeRed = function () {         // add "makeRed" to the CSSAssist prototype
        for (var i = 0; i < this.length; i++) {  // loop over each node in the context
                this[i].style.color = 'red';     // do something
        }
        return this;                             // return "this"
    }
})(CSSAssist);
```

License
=======
CSSAssist is copyright William Summers (metatribal) and is available under the Apache License v2.0
