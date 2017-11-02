let Walker = require('../index.js');

const walker = new Walker('let a = 123;');

console.log(walker.parse());