var fs = require('fs');
var filepath = process.argv[2];
var Compiler = new require('./src/compiler');

var LAST_FILE_POINTER = './.last_spec_pointer';
var lastFile = null;

try {
  lastFile = fs.readFileSync(LAST_FILE_POINTER).toString();
} catch (e) {}

if (/spec\/.*\.js$/.test(filepath)) {
  console.log('spec')
  // Editting JS spec - compile it.
  filepath = filepath;
} else if (/spec\/.*\.dart$/.test(filepath)) {
  // Editting Dart compiled spec - compile the original JS source.
  filepath = filepath.replace(/\.dart$/, '.js');
} else if (lastFile) {
  // Last editted spec.
  filepath = lastFile;
} else {
  console.error('No spec to run.');
  process.exit(1);
}

if (filepath !== lastFile) {
  fs.writeFile(LAST_FILE_POINTER, filepath, function() {});
}

fs.readFile(filepath, function(e, content) {
  console.log('Compiling', filepath);

  var compiledContent = (new Compiler).compile(content.toString());
  fs.writeFile(filepath.replace(/\.js$/, '.dart'), compiledContent, function() {
    console.log('DONE');
  })
})
