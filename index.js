var esprima = require('esprima');
var Walker = /** @class */ (function () {
    function Walker(src, options) {
        var _this = this;
        /**
         * parse javascript source code using Esprima.
         */
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
        /**
         * travser nodes of ast. You can stop traverse by call method `stopWalking`
         */
        this.traverse = function (node, cb) {
            if (_this.shouldStop) {
                return;
            }
            if (Object.prototype.toString.call(node) === "[object Object]") {
                cb(node);
                for (var key in node) {
                    if (key === 'parent' || !node[key]) {
                        continue;
                    }
                    node[key].parent = node;
                    _this.traverse(node[key], cb);
                }
            }
            else if (Array.isArray(node)) {
                for (var i = 0; i < node.length; i++) {
                    var value = node[i];
                    if (value !== null) {
                        value.parent = node;
                        _this.traverse(value, cb);
                    }
                }
            }
        };
        /**
         * calling this method to stop ast traverse
         */
        this.stopWalking = function () {
            _this.shouldStop = true;
        };
        this.startWalking = function () {
            _this.shouldStop = false;
        };
        this.reverseTraverse = function (node, cb) {
            if (_this.shouldStop || !node.parent) {
                return;
            }
            if (Array.isArray(node.parent)) {
                for (var i = 0, l = node.parent.length; i < l; i++) {
                    cb(node.parent[i]);
                }
            }
            else {
                cb(node.parent);
            }
            _this.reverseTraverse(node.parent, cb);
        };
        if (typeof src !== "string") {
            throw new Error('src should be a string');
        }
        this.src = src;
        this.options = options || {};
        this.shouldStop = false;
    }
    return Walker;
}());
module.exports = Walker;
