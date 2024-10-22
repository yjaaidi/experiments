import type { NodePath } from '@babel/core';
import * as T from '@babel/types';

export class TransformContext {
  #imports: NodePath<T.ImportDeclaration>[] = [];
  #currentRunInBrowserCall: T.CallExpression | null = null;
  #extractedFunctions: ExtractedFunctions[] = [];
  #identifiersToExtract: Array<{
    source: string;
    specifier: T.ImportSpecifier;
  }> = [];

  constructor(public readonly relativePath: string) {}

  get currentRunInBrowserCall() {
    return this.#currentRunInBrowserCall;
  }

  get extractedFunctions(): ReadonlyArray<ExtractedFunctions> {
    return this.#extractedFunctions;
  }

  get identifiersToExtract(): ReadonlyArray<{
    source: string;
    specifier: T.ImportSpecifier;
  }> {
    return this.#identifiersToExtract;
  }

  get imports(): ReadonlyArray<NodePath<T.ImportDeclaration>> {
    return this.#imports;
  }

  addExtractedFunction(extractedFunction: ExtractedFunctions) {
    this.#extractedFunctions.push(extractedFunction);
  }

  addIdentifierUsedInRunInBrowser({
    source,
    specifier,
  }: {
    source: string;
    specifier: T.ImportSpecifier;
  }) {
    this.#identifiersToExtract.push({
      source,
      specifier,
    });
  }

  isSpecifierUsedInRunInBrowser(specifier: T.ImportSpecifier) {
    return this.#identifiersToExtract.some(
      (item) => item.specifier === specifier,
    );
  }

  addImport(importPath: NodePath<T.ImportDeclaration>) {
    this.#imports.push(importPath);
  }

  isInRunInBrowserCall() {
    return this.#currentRunInBrowserCall != null;
  }

  enterInRunInBrowser(call: T.CallExpression) {
    this.#currentRunInBrowserCall = call;
  }

  exitRunInBrowserCall() {
    this.#currentRunInBrowserCall = null;
  }
}

export interface ExtractedFunctions {
  code: string;
  functionName: string;
}
