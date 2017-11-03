let Walker = require('../index.js');

const walker = new Walker('let a = 123; console.log(a);');

let ast = walker.parse();
walker.traverse(ast, function (node) {console.log(node.type)});
