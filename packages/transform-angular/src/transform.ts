import type { PluginObj } from '@babel/core';
import type * as T from '@babel/types';
import { declare } from '@babel/helper-plugin-utils';

export default declare(({ assertVersion, types: t }) => {
  assertVersion(7);

  const MOUNT_FUNCTION_NAME = 'mount';
  const RUN_IN_BROWSER_FUNCTION_NAME = 'runInBrowser';
  const PW_MOUNT_FUNCTION_NAME = 'pwMount';
  const CALLBACKS_KEY = 'callbacks';
  const DATA_KEY = 'data';
  const ON_KEY = 'on';
  const PROPS_KEY = 'props';

  const utils = new Utils(t);

  return {
    name: 'transform-angular',
    visitor: {
      CallExpression(path) {
        if (
          !t.isIdentifier(path.node.callee) ||
          path.node.callee.name !== MOUNT_FUNCTION_NAME
        ) {
          return;
        }

        const binding = path.scope.getBinding(path.node.callee.name);
        /* The `mount` function source is not a destructured param object. */
        if (!t.isObjectPattern(binding?.path.node)) {
          return;
        }

        /*
         * Remove fixture `{mount}`.
         */
        const bindingProperties = binding.path.node.properties;
        const mountIndex = bindingProperties.findIndex(
          (property) =>
            t.isObjectProperty(property) &&
            t.isIdentifier(property.key) &&
            property.key.name === MOUNT_FUNCTION_NAME,
        );
        bindingProperties.splice(mountIndex, 1);

        /*
         * Add `runInBrowser` to the fixture if not already present.
         */
        if (
          !bindingProperties.some(
            (property) =>
              t.isObjectProperty(property) &&
              t.isIdentifier(property.key) &&
              property.key.name === RUN_IN_BROWSER_FUNCTION_NAME,
          )
        ) {
          bindingProperties.push(
            utils.createShorthandProperty(RUN_IN_BROWSER_FUNCTION_NAME),
          );
        }

        /*
         * Replace `mount` call with `runInBrowser`.
         */
        const [cmp, args] = path.node.arguments;

        const properties = (
          t.isObjectExpression(args) ? args.properties : []
        ).filter((p): p is T.ObjectProperty => t.isObjectProperty(p));
        const data = properties.find(
          (p) => t.isIdentifier(p.key) && p.key.name === PROPS_KEY,
        );
        const callbacks = properties.find(
          (p) => t.isIdentifier(p.key) && p.key.name === ON_KEY,
        );

        /* ({data, callbacks}) => pwMount(cmp, {props: data, on: callbacks}) */
        const arrowFunction = t.arrowFunctionExpression(
          [
            t.objectPattern([
              ...(data ? [utils.createShorthandProperty(DATA_KEY)] : []),
              ...(callbacks
                ? [utils.createShorthandProperty(CALLBACKS_KEY)]
                : []),
            ]),
          ],
          t.blockStatement([
            t.expressionStatement(
              t.awaitExpression(
                t.callExpression(t.identifier(PW_MOUNT_FUNCTION_NAME), [
                  cmp,
                  t.objectExpression([
                    ...(data
                      ? [
                          t.objectProperty(
                            t.identifier(PROPS_KEY),
                            t.identifier(DATA_KEY),
                          ),
                        ]
                      : []),
                    ...(callbacks
                      ? [
                          t.objectProperty(
                            t.identifier(ON_KEY),
                            t.identifier(CALLBACKS_KEY),
                          ),
                        ]
                      : []),
                  ]),
                ]),
              ),
            ),
          ]),
          true,
        );

        path.node.callee = t.identifier(RUN_IN_BROWSER_FUNCTION_NAME);
        path.node.arguments = [
          arrowFunction,
          t.objectExpression([
            ...(data
              ? [t.objectProperty(t.identifier(DATA_KEY), data.value)]
              : []),
            ...(callbacks
              ? [t.objectProperty(t.identifier(CALLBACKS_KEY), callbacks.value)]
              : []),
          ]),
        ];
      },
    },
  } satisfies PluginObj;
});

class Utils {
  constructor(private _t: typeof T) {}

  createShorthandProperty(key: string) {
    const identifier = this._t.identifier(key);
    return this._t.objectProperty(identifier, identifier, false, true);
  }
}
