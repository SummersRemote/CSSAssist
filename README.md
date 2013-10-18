CSSAssist v2
============

CSSAssist is lean JavaScript library for manipulating CSS and the document object model.  It uses CSS selectors to select elements and provides a minimal set of chainable operations.  CSSAssist is intended for all modern mobile, tablet, and desktop browsers.

Features
- Standalone, no external dependencies
- Less than 3 kb minified, 1 kb gzipped
- Modular and extensible
- Designed for mobile and desktop

Sneak peek
-------
```javascript
// select all img tags and add the 'border' and 'shadow' classes to them
CSSAssist('img').addClass('border shadow');

// select every 3rd <p> node of each <div> node and set the text color to red
CSSAssist('div > p:nth-child(3n)').setStyle('color', 'red');
```

Installation and Browser Support
------------
Include the CSSAssist library by adding the following script tag near the end of your document
```html
<script type="text/javascript" src="cssassist.js"></script>
```
If you are installing extensions, include them as well
```html
<script type="text/javascript" src="cssassist.js"></script>
<script type="text/javascript" src="cssassist.replace.js"></script>
```

Browser Support includes all modern mobile, tablet, and desktop browsers.  The caveat, as always, is Internet Explorer.  All version of IE 9+ are fully tested and supported.  Limited support for IE 8 is provided by including the ie8shim.js file found in the src directory (less than 400 bytes minified, 250 bytes gzipped).

The API
=======
CSSAssist provides a [fluent or chainable API](http://en.wikipedia.org/wiki/Fluent_interface) that will be familiar to users of [jQuery](http://www.jquery.com) (though not compatible).

Methods which accept a list of values will accept either an array of string values or a space delimited string of values. For example, each of the following hasClass() calls will return the same result.

```javascript
var asString = 'myAwesomeClass someOtherClass';
var asArray = ['myAwesomeClass','someOtherClass'];

CSSAssist('div').hasClass(asString);
CSSAssist('div').hasClass(asArray);
CSSAssist('div').hasClass('myAwesomeClass someOtherClass');
```

CSSAssist([selector])
----------------------
Returns a collection of elements matching the given selector.  Selectors must adhere to the CSS selector specification

```javascript
CSSAssist()                         // selects nothing, returns an empty CSSAssist object
CSSAssist(window.document)          // selects the document object
CSSAssist('*')                      // selects all nodes in the document
CSSAssist('p.myAwesomeClass')       // selects all <p> nodes with the class .myAwesomeClass
CSSAssist('body > div')             // selects all <div> nodes that are a child of <body>
CSSAssist('div > p:nth-child(3n)')  // selects every 3rd <p> node of each <div> node
```
CSS selector and property support may vary by browser - check out [caniuse.com](http://caniuse.com/#cats=CSS) for supported configurations.

For more information on CSS selectors:

* [W3Schools Selector Reference](http://www.w3schools.com/cssref/css_selectors.asp)
* [MDN reference on :pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
* [The W3C Selector Level 3 Spec](http://www.w3.org/TR/css3-selectors/)

The following properties are also supported on the CSSAssist object.

```javascript
CSSAssist.version               // (np parens) returns the CSSAssist version
// for a given selector
CSSAssist(selector).length      // return the number of items in the selected context
CSSAssist(selector)[n]          // return the nth (0 based) element in the selected context
```

hasClass([values])
-------------------------------
The hasClass() method returns true if and only if each node in the context has each class in the values list.

```javascript
CSSAssist('div').hasClass()                                 // divs must NOT contain any classes
CSSAssist('div').hasClass('myAwesomeClass')                 // divs must contain myAwesomeClass
CSSAssist('div').hasClass('myAwesomeClass myOtherClass')    // divs must contain myAwesomeClass AND myOtherClass
```

addClass(values)
--------------------
The addClass() method adds each class in the values list to each node in the context. The addClass() will NOT add duplicates.

```javascript
CSSAssist('div').addClass('myAwesomeClass')         // add myAwesome class to all divs
CSSAssist('div').addClass('aClass bClass')          // add aClass and bClass to all divs
```

removeClass([values])
-----------------------
The removeClass() method removes each class in values from each node in the context.

```javascript
CSSAssist('div').removeClass()                                  // removes all classes from all divs
CSSAssist('div').removeClass('myAwesomeClass')                  // remove myAwesomeClass from all divs
CSSAssist('div').removeClass('myAwesomeClass myOtherClass')     // remove myAwesomeClass AND myOtherClass from all divs
```

toggleClass(values)
----------------------
The toggleClass() method toggles each class in classList for each node in the context.

```javascript
CSSAssist('div').toggleClass('myAwesomeClass')      // add myAwesomeClass to every div which did not already have it
                                                    // AND remove myAwesomeClass from every node which did
```

setStyle(property[,value])
---------------------
The setStyle() method will set or clear the specified style property for each node in the context.

```javascript
CSSAssist('p').setStyle('color')                // clears the color style on all paragraphs
CSSAssist('p').setStyle('fontSize', '2em')      // sets the font size to 2em for all paragraphs
```

setAttr(attr[, value])
---------------------
The setAttr() method will set or remove the specified attribute for each node in the context.

```javascript
CSSAssist('*').setAttr('style')                     // remove the style attributes from all nodes
CSSAssist('span').setAttr('data-myData')            // removes the attribute data-myData from all spans
CSSAssist('span').setAttr('data-myData', 'some good data')  // sets the attribute data-myData to 'some good data' for all spans
```

unique()
-----------------
Ensures that duplicates are removed from the current CSSAssist object.  This method is used internally, but may be useful to developers creating extensions.

```javascript
CSSAssist('div').unique()                     // removes duplicate nodes from the context
```

union(context)
-----------------
Returns the union (concatenation) of two CSSAssist contexts and ensures that there are no duplicates. 

```javascript
// returns all 'div > p' nodes
CSSAssist('div > p:nth-child(odd)').union(CSSAssist('div > p:nth-child(even)'));

// would also return all 'div > p' nodes as it removes duplicates
CSSAssist('div > p').union(CSSAssist('div > p:nth-child(even)'));
```

intersects(context)
----------------------
Returns the intersection of two CSSAssist contexts and ensures that there are no duplicates.

```javascript
// returns only the EVEN nodes of 'div > p'
CSSAssist('div > p').intersects(CSSAssist('div > p:nth-child(even)'));
```

difference(context)
----------------------
Returns the difference of two CSSAssist contexts and ensures that there are no duplicates.

```javascript
// returns only the ODD nodes of 'div > p'
CSSAssist('div > p').difference(CSSAssist('div > p:nth-child(even)'));
```

forEach(func)
----------------------
A utility method for iterating over each item in the current context.  Callback functions are passed the current item and index.

```javascript
// print the context item's tag name to the console
CSSAssist('.myAwesomeClass').forEach(
    function(item, i) {
        console.log('Item ' + i + ' is a(n) ' + item.nodeName)
    }
);
```

loadCSS(url)
-----------------
The loadCSS() method loads an external CSS file (referenced by url) by creating and inserting an appropriate &lt;script&gt; element. Note that the context is not relevant, and this method should be called without parentheses.

```javascript
CSSAssist.loadCSS('//cdnjs.cloudflare.com/ajax/libs/normalize/2.1.0/normalize.css');
```

createCSS(styles)
----------------
The createCSS() method loads a programmatically constructed stylesheet. Note that the context is not relevant, and this method should be called without parentheses.

```javascript
var myStyles = "body { background-color: red;} div { background-color: yellow;}";
CSSAssist.createCSS(myStyles);
```

Event Listeners
===============
CSSAssist also provides two methods for binding custom event handlers to DOM events.  These methods wrap the add/removeEventListener methods such that the provided listener is added to each node in the context.
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

Extensions
===========
CSSAssist can be extended by providing new methods on the CSSAssist prototype.
- Wrap extension in self invoking functions.
- Pass in the CSSAssist object, esp if you rename it within your method.
- When possible, return "this" to enable the method to be chained.
- Name the JavaScript file 'cssassist.&lt;methodName&gt;.js'

```javascript
(function (CSSAssist) {
    CSSAssist.fn.makeRed = function () {         // add "makeRed" to the CSSAssist prototype
        for (var i = 0; i < this.length; i++) {  // loop over each node in the context
                this[i].style.color = 'red';     // do something
        }
        return this;                             // return "this"
    }
})(CSSAssist);

// calling the extension
CSSAssist('p').makeRed();
```
The extensions directory contains an example in the file cssassist.replace.js.  The replace method accepts a regular expression and replacement value and is can optionally iterate over all descendants or only the immediate children of each context node.

Unit Testing
============
Unit tests are written using the [Jasmine Test Framework](http://pivotal.github.io/jasmine/).

[CSSAssist test results](https://rawgithub.com/metatribal/CSSAssist/master/test/SpecRunner.html)

License
=======
CSSAssist is copyright William Summers (metatribal) and is available under the Apache License v2.0
