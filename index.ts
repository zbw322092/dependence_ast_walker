const esprima = require('esprima');

class Walker {

  constructor (src: string, options: object) {
    if (typeof src !== "string") {
      throw new Error('src should be a string');
    }
    this.src = src;
    this.options = options || {};
  }

}