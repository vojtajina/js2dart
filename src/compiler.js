import {Compiler} from 'traceur/src/Compiler';
import {ClassTransformer} from './class_transformer';
import {DartTreeWriter} from './dart_writer';

export class EcmaScript6ToDartCompiler extends Compiler {
  constructor() {
    var options = {
      annotations: true, // parse annotations
      types: true, // parse types
      script: false // parse as a module
    };
    super(options);
  }
  compile(source, filename) {
    return this.write(this.transform(this.parse(source, filename || '<unknown_file>')));
  }
  transform(tree) {
    var transformer = new ClassTransformer();
    return transformer.transformAny(tree);
  };
  write(tree, outputName) {
    var writer = new DartTreeWriter();
    writer.visitAny(tree);
    return writer.toString();
  }
}
