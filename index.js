"use strict";
var esprima = require('esprima');
var Walker = /** @class */ (function () {
    function Walker(src, options) {
        var _this = this;
        this.parse = function () {
            var sourceType = _this.options.sourceType || 'script';
            delete _this.options.sourceType;
            var parseResult;
            if (sourceType === 'module') {
                parseResult = esprima.parseModule(_this.src, _this.options);
            }
            else if (sourceType === 'script') {
                parseResult = esprima.parseScript(_this.src, _this.options);
            }
            else {
                throw new Error('invalid sourceType');
            }
            return parseResult;
        };
        this.traverse = function (node, cb) {
            if (Object.prototype.toString.call(node) === "[object Object]") {
                cb(node);
                for (var key in node) {
                    node[key].parent = node;
                    _this.traverse(node[key], cb);
                }
            }
        };
        if (typeof src !== "string") {
            throw new Error('src should be a string');
        }
        this.src = src;
        this.options = options || {};
    }
    return Walker;
}());
module.exports = Walker;
