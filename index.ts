const esprima = require('esprima');

interface parseOptions {
  sourceType?: string
}

class Walker {
  
  src: string;
  options: parseOptions;

  constructor (src: string, options: parseOptions) {

    if (typeof src !== "string") {
      throw new Error('src should be a string');
    }
    this.src = src;
    this.options = options || {};
  }

  parse = (): object =>  {
    let sourceType = this.options.sourceType || 'script';
    delete this.options.sourceType;
    let parseResult;

    if (sourceType === 'module') {
      parseResult = esprima.parseModule(this.src, this.options);
    } else if (sourceType === 'script') {
      parseResult = esprima.parseScript(this.src, this.options);
    } else {
      throw new Error('invalid sourceType');
    }
    return parseResult;
  }

  traverse = (node: any, cb: (node: object) => any): void => {
    if (Object.prototype.toString.call(node) === "[object Object]") {
      cb(node);
      for (let key in node) {
        if (key === 'parent' || !node[key]) continue;

        node[key].parent = node;
        this.traverse(node[key], cb);
      }
    } else if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        let value = node[i];
        if (value !== null) {
          value.parent = node;
          this.traverse(value, cb);
        }
      }
    }
  }

}

module.exports = Walker;