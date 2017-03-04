// Modules
require('chili-js');
require('colors');

// Execa && figures missing
module.exports = firstRun = require('first-run');
module.exports = conf = require('conf');
module.exports = ora = require('ora');
module.exports = Listr = require('listr');
module.exports = inquirer = require('inquirer');
module.exports = program = require('commander');
module.exports = clear = require('clear');
module.exports = got = require('got');

module.exports = pkg = require('../package.json');

// Objects & Classes
module.exports = config     = new conf();



// Variable
module.exports = fRun = firstRun();
module.exports = prompt = inquirer.prompt;
module.exports = key = '1a8d1689f01251ca6ee058b29622441e';
module.exports = encode = encodeURIComponent;

module.exports = spacer = (counter = 3) => {
  for (i=0; i < counter; i++) {
    log('');
  }
};

module.exports = rate = (n) => {
  if (n < 1) {
    return '☆☆☆☆☆☆☆☆☆☆';
  } else if ( n >= 1 && n < 2 ) {
    return '★☆☆☆☆☆☆☆☆☆';
  } else if ( n >= 2 && n < 3) {
    return '★★☆☆☆☆☆☆☆☆';
  } else if ( n >= 3 && n < 4) {
    return '★★★☆☆☆☆☆☆☆';
  } else if ( n >= 4 && n < 5) {
    return '★★★★☆☆☆☆☆☆';
  } else if ( n >= 5 && n < 6) {
    return '★★★★★☆☆☆☆☆';
  } else if ( n >= 6 && n < 7) {
    return '★★★★★★☆☆☆☆';
  } else if ( n >= 7 && n < 8  ) {
    return '★★★★★★★☆☆☆';
  } else if ( n >= 9 && n < 10 ) {
    return '★★★★★★★★★☆';
  } else if ( n == 10) {
    return '★★★★★★★★★★';
  }
};
