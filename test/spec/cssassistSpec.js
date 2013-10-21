var fixture;
describe("CSSAssist Test Setup", function() {
    
	it("Setting up html fixtures...", function () {
		fixture = document.body.appendChild(document.createElement('div')); 
		fixture.setAttribute('id','cssassist');
		// these children should have no classes
		fixture.appendChild(document.createElement('p'));
		fixture.appendChild(document.createElement('p'));
		fixture.appendChild(document.createElement('p'));
		fixture.appendChild(document.createElement('p'));
	});
});

describe("CSSAssist Constructors", function() {

    it("prints the version", function() {
        expect(CSSAssist.version).toBeDefined();
    });

    it("returns empty CSSAssist given no parameters", function() {
    	obj = CSSAssist();
        expect(obj instanceof CSSAssist && obj.length==0).toBe(true);
    });

    it("accepts self as constructor", function() {
    	obj = CSSAssist()
        expect(obj instanceof CSSAssist).toBe(true);
    });

    it("accepts string as constructor (css selector)", function() {
    	obj = CSSAssist('#cssassist');
    	expect(obj instanceof CSSAssist && obj.length==1).toBe(true);
    });

    it("returns empty CSSAssist on bad parameters", function() {
    	obj = CSSAssist(1000);
    	expect(obj instanceof CSSAssist && obj.length==0).toBe(true);
    });

});

describe("CSSAssist hasClass", function() {

	beforeEach(function () {
		fixture.className = 'cssassist';
		fixture.removeAttribute('style');
	});

    it("matches 'no classes' when given empty string, ''", function() {
    	obj = CSSAssist('#cssassist > p').hasClass('');
    	expect(obj).toBe(true);
        obj = CSSAssist('#cssassist').hasClass('');
        expect(obj).toBe(false);
    });

    it("matches 'no classes' when given no parameter", function() {
    	obj = CSSAssist('#cssassist > p').hasClass();
    	expect(obj).toBe(true);
        obj = CSSAssist('#cssassist').hasClass();
        expect(obj).toBe(false);
    });

    it("matches a single class", function() {
    	obj = CSSAssist('#cssassist').hasClass('cssassist');
    	expect(obj).toBe(true);
    });

    it("matches multiple classes", function() {
    	fixture.className = 'cssassist foo bar';
    	obj = CSSAssist('#cssassist').hasClass('cssassist bar');
    	expect(obj).toBe(true);
    });

    it("does not match non-existent classes", function() {
    	obj = CSSAssist('#cssassist').hasClass('foo');
    	expect(obj).toBe(false);
    })    

});

describe("CSSAssist addClass", function() {

	beforeEach(function () {
		fixture.className = 'cssassist';
		fixture.removeAttribute('style');
	});

    it("add a single class", function() {
    	obj = CSSAssist('#cssassist').addClass('one');
    	expect(obj[0].className).toMatch(/one/);
    });

    it("add multiple classes", function() {
    	obj = CSSAssist('#cssassist').addClass('one two');
    	expect(obj[0].className).toMatch(/one two/);
    })    

});


describe("CSSAssist removeClass", function() {

	beforeEach(function () {
		fixture.className = 'cssassist';
		fixture.removeAttribute('style');
	});

    it("remove a single class", function() {
    	obj = CSSAssist('#cssassist').removeClass('cssassist');
    	expect(obj[0].className).toMatch('');
    });

    it("remove multiple classes", function() {
    	fixture.className = 'cssassist foo bar boom';
    	obj = CSSAssist('#cssassist').removeClass('foo boom');
    	expect(obj[0].className).toMatch(/cssassist bar/);
    });

    it("remove all classes given no parameters", function() {
    	fixture.className = 'cssassist foo bar boom';
    	obj = CSSAssist('#cssassist').removeClass();
    	expect(obj[0].className).toMatch('');
    });

});

describe("CSSAssist toggleClass", function() {

	beforeEach(function () {
		fixture.className = 'cssassist';
		fixture.removeAttribute('style');
	});

    it("toggle an existing class off", function() {
    	obj = CSSAssist('#cssassist').toggleClass('cssassist');
    	expect(obj[0].className).toMatch('');
    });

    it("toggle a non-existent class on", function() {
    	obj = CSSAssist('#cssassist').toggleClass('foo');
    	expect(obj[0].className).toMatch(/cssassist foo/);
    });

    it("toggle on/off multiple classes as exists", function() {
    	obj = CSSAssist('#cssassist').toggleClass('cssassist foo');
    	expect(obj[0].className).toMatch(/foo/);
    });

});

describe("CSSAssist setStyle", function() {

	beforeEach(function () {
		fixture.className = 'cssassist';
		fixture.removeAttribute('style');
	});

    it("add a style", function() {
    	obj = CSSAssist('#cssassist').setStyle('color', 'red');
    	expect(obj[0].style['color']).toMatch('red');
    });

    it("remove a style", function() {
    	CSSAssist('#cssassist').setStyle('color', 'red');
    	obj = CSSAssist('#cssassist').setStyle('color');
    	expect(obj[0].style['color']).toMatch('');
    });

    it("set a non-existent style (do nothing)", function() {
    	CSSAssist('#cssassist').setStyle('badstyle', 'badprop');
    	expect(obj[0].style['badstyle']).toMatch('');
    });

});

describe("CSSAssist setAttr", function() {

	beforeEach(function () {
		fixture.className = 'cssassist';
		fixture.removeAttribute('style');
	});

    it("add an attribute", function() {
    	obj = CSSAssist('#cssassist').setAttr('data-foo', 'bar');
    	expect(obj[0].getAttribute('data-foo')).toMatch('bar');
    });

    it("remove an attribute", function() {
    	CSSAssist('#cssassist').setAttr('data-foo', 'bar');
    	obj = CSSAssist('#cssassist').setAttr('data-foo');
    	expect(obj[0].getAttribute('data-foo')).toMatch('');
    });

});

// requires jquery setup
describe("CSSAssist addListener", function() {
    
    it("no test available (requires jQuery setup)", function() {
    	expect(true).toBe(true);
    });

	// beforeEach(function () {
	// 	fixture.className = 'cssassist';
	// 	fixture.removeAttribute('style');
	// });

//     it("adds an event listener to a DOM node", function() {
//     	obj = CSSAssist('#cssassist').addListener( "click",
//     		function(item) {
//     			CSSAssist('#cssassist').addClass('foo');
//     		}
//     	);
//     	expect(obj[0].className).not.toMatch(/foo/);
//     	$('#cssassist').trigger('click');
//     	expect(obj[0].className).toMatch(/foo/);
//     });

});


// require jquery setup
describe("CSSAssist removeListener", function() {
   
    it("no test available (requires jQuery setup)", function() {
    	expect(true).toBe(true);
    });

// 	beforeEach(function () {
// 		fixture.className = 'cssassist';
// 		fixture.removeAttribute('style');
// 	});

//     it("adds an event listener to a DOM node", function() {
//     	obj = CSSAssist('#cssassist').addListener( "click",
//     		function(item) {
//     			CSSAssist('#cssassist').addClass('foo');
//     		}
//     	);
//     	expect(obj[0].className).not.toMatch(/foo/);
//     	$('#cssassist').trigger('click');
//     	expect(obj[0].className).toMatch(/foo/);

//     	//reset
// 		fixture.className = 'cssassist';	
// 		obj = CSSAssist('#cssassist').removeListener( "click",
//     		function(item) {
//     			CSSAssist('#cssassist').addClass('foo');
//     		}
//     	);
//     	expect(obj[0].className).not.toMatch(/foo/);
//     	$('#cssassist').trigger('click');
//     	expect(obj[0].className).not.toMatch(/foo/);

//     });

});


describe("CSSAssist union", function() {

    it("returns the unique set of members from 'A union B' (concat)", function() {
    	obj = CSSAssist('#cssassist > p:nth-child(odd)').union(CSSAssist('#cssassist > p:nth-child(even)'));
    	obj.addClass('union');
    	expect(obj.length).toBe(4);
    	expect(obj.hasClass('union')).toBe(true);
    });

});

describe("CSSAssist intersects", function() {

    it("returns the unique set of members from 'A intersecting B'", function() {
    	obj = CSSAssist('#cssassist > p').intersects(CSSAssist('#cssassist > p:nth-child(odd)'));
    	obj.addClass('intersects');
    	expect(obj.length).toBe(2);
    	expect(obj.hasClass('intersects')).toBe(true);
    	expect(CSSAssist('#cssassist > p:nth-child(even)').hasClass('intersects')).toBe
    	(false);
    });

});

describe("CSSAssist difference", function() {

    it("returns the unique set of members from 'A difference B'", function() {
    	obj = CSSAssist('#cssassist > p').difference(CSSAssist('#cssassist > p:nth-child(odd)'));
    	obj.addClass('difference');
    	expect(obj.length).toBe(2);
    	expect(obj.hasClass('difference')).toBe(true);
    	expect(CSSAssist('#cssassist > p:nth-child(even)').hasClass('difference')).toBe
    	(true);
    	CSSAssist('#cssassist > p').removeClass();
    });

});

describe("CSSAssist loadCSS", function() {
	
	it("no test available (problems in test)", function() {
    	expect(true).toBe(true);
    });
	// beforeEach(function () {
	// 	fixture.className = 'cssassist';
	// 	fixture.removeAttribute('style');
	// });

 //    it("loads an external CSS file", function() {

	//     waitsFor(function() {
	//       		return CSSAssist.loadCSS('assets/test.css');
	//     	}, "external CSS failed to load", 5000
	//     );
    	
 //    	runs(function () {
	//     	obj = CSSAssist('#cssassist')[0];
	//     	tmp = document.defaultView.getComputedStyle(obj,null).getPropertyValue('display');
	//     	expect(tmp).toMatch('inline');
	//     });
 //    });

});

describe("CSSAssist createCSS", function() {
	
	beforeEach(function () {
		fixture.className = 'cssassist';
		fixture.removeAttribute('style');
	});

    it("loaded programmatically created CSS styles", function() {
    	CSSAssist.createCSS( 'div.cssassist { display: none;}' );
    	obj = CSSAssist('#cssassist')[0];
    	tmp = window.getComputedStyle(obj, null).getPropertyValue('display');
    	expect(tmp).toMatch('none');
    });

});