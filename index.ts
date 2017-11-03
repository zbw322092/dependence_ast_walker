const esprima = require('esprima');

interface parseOptions {
  sourceType?: string
}

class Walker {
  
  src: string;
  options: parseOptions;
  private shouldStop: boolean;

  constructor (src: string, options: parseOptions) {

    if (typeof src !== "string") {
      throw new Error('src should be a string');
    }
    this.src = src;
    this.options = options || {};
    this.shouldStop = false;
  }

  /**
   * parse javascript source code using Esprima.
   */
  public parse = (): object =>  {
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

  /**
   * travser nodes of ast. You can stop traverse by call method `stopWalking`
   */
  public traverse = (node: any, cb: (node: object) => any): void => {
    if (this.shouldStop) { return; }

    if (Object.prototype.toString.call(node) === "[object Object]") {
      cb(node);
      for (let key in node) {
        if (key === 'parent' || !node[key]) { continue; }

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

  /**
   * calling this method to stop ast traverse
   */
  public stopWalking = ():void => {
    this.shouldStop = true;
  }

  public startWalking = ():void => {
    this.shouldStop = false;
  }

  private reverseTraverse = (node: any, cb: (node: object) => any):void => {
    if (this.shouldStop || !node.parent) { return; }
    
    if (Array.isArray(node.parent)) {
      for (let i = 0, l = node.parent.length; i < l; i++) {
        cb(node.parent[i]);
      }
    } else {
      cb(node.parent);
    }

    this.reverseTraverse(node.parent, cb);
  }

}

module.exports = Walker;