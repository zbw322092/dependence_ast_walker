let Walker = require('../index.js');

const walker = new Walker('let a = 123; console.log(a);');

let ast = walker.parse();
walker.traverse(ast, (node) => {console.log(node.type)});

console.log(`



`);

walker.reverseTraverse(ast.body[1].expression.arguments[0], (node) => {
  console.log(node.type);
});

