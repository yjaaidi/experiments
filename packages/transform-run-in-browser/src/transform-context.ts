import type { NodePath } from '@babel/core';
import * as T from '@babel/types';

export class TransformContext {
  private _imports: NodePath<T.ImportDeclaration>[] = [];
  private _currentRunInBrowserCall: T.CallExpression | null = null;
  private _extractedFunctions: ExtractedFunctions[] = [];
  private _identifiersToExtract: Array<{
    source: string;
    specifier: T.ImportSpecifier;
  }> = [];

  constructor(public readonly relativeFilePath: string) {}

  get currentRunInBrowserCall() {
    return this._currentRunInBrowserCall;
  }

  get extractedFunctions(): ReadonlyArray<ExtractedFunctions> {
    return this._extractedFunctions;
  }

  get identifiersToExtract(): ReadonlyArray<{
    source: string;
    specifier: T.ImportSpecifier;
  }> {
    return this._identifiersToExtract;
  }

  get imports(): ReadonlyArray<NodePath<T.ImportDeclaration>> {
    return this._imports;
  }

  addExtractedFunction(extractedFunction: ExtractedFunctions) {
    if (
      this._extractedFunctions.every(
        ({ functionName }) => extractedFunction.functionName !== functionName,
      )
    ) {
      this._extractedFunctions.push(extractedFunction);
    }
  }

  addIdentifierUsedInRunInBrowser({
    source,
    specifier,
  }: {
    source: string;
    specifier: T.ImportSpecifier;
  }) {
    this._identifiersToExtract.push({
      source,
      specifier,
    });
  }

  isSpecifierUsedInRunInBrowser(specifier: T.ImportSpecifier) {
    return this._identifiersToExtract.some(
      (item) => item.specifier === specifier,
    );
  }

  addImport(importPath: NodePath<T.ImportDeclaration>) {
    this._imports.push(importPath);
  }

  isInRunInBrowserCall() {
    return this._currentRunInBrowserCall != null;
  }

  enterRunInBrowserCall(call: T.CallExpression) {
    this._currentRunInBrowserCall = call;
  }

  exitRunInBrowserCall() {
    this._currentRunInBrowserCall = null;
  }
}

export interface ExtractedFunctions {
  code: string;
  functionName: string;
}
