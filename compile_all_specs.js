var fs = require('fs');
var q = require('q');
var compile = require('./compile');

var SPEC_DIR = './spec';

q.nfcall(fs.readdir, SPEC_DIR).then(function(testFiles) {
  return q.all(testFiles.filter(function(path) {
    return /\.js$/.test(path);
  }).map(function(testFile) {
    testFile = SPEC_DIR + '/' + testFile;
    console.log('Reading', testFile);

    return q.nfcall(fs.readFile, testFile).then(function(content) {
      console.log('Compiling', testFile);
      var compiled = '// Compiled by Traceur\n' +
                     '// ' + testFile + '\n\n' +
                     compile(content.toString());

      console.log('Writing', testFile + '.dart');
      return q.nfcall(fs.writeFile, testFile + '.dart', compiled);
    })
  }));
}).then(function(outputs) {
  console.log('DONE', outputs.length, outputs);
}, function(e) {
  console.error(e.stack);
});


// function filter(filterFn) {
//   return function(paths) {
//     return paths.filter(filterFn);
//   };
// }

// function onlySpecFiles(path) {
//   return /\.js$/.test(path);
// }

// function done(outputs) {
//   console.log('DONE', outputs.length);
// }

// function error(e) {
//   console.error(e.stack || e);
// }

// readDirectory(SPEC_DIR)
//   .then(filter(onlySpecFiles))
//   .then(map(prepend(SPEC_DIR)))
//   .then(forEachResult(readFile))
//   .then(forcompile, writeFile))
//   .then(done, error);
