/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent (at least before ES6),
 * IE hasn't needed to work this way). Also works on strings,
 * fixes IE < 9 to allow an explicit undefined for the 2nd argument
 * (as in Firefox), and prevents errors when called on other
 * DOM objects.
 */
(function () {
    // Add ECMA262-5 string trim if not supported natively

    if (!('trim' in String.prototype)) {
        String.prototype.trim = function () {
            return this.replace(/^\s+/, '').replace(/\s+$/, '');
        };
    }
}());
