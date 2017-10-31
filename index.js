"use strict";
var esprima = require('esprima');
var Walker = /** @class */ (function () {
    function Walker(src, options) {
        if (typeof src !== "string") {
            throw new Error('src should be a string');
        }
        this.src = src;
        this.options = options || {};
    }
    return Walker;
}());
