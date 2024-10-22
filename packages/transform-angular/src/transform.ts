import type { PluginObj } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';

export default declare(({ assertVersion, types: t }) => {
  assertVersion(7);

  const MOUNT_FUNCTION_NAME = 'mount';

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

        /* Replace fixture `{mount}` with `{runInBrowser}`. */
        for (const property of binding.path.node.properties) {
          if (
            t.isObjectProperty(property) &&
            t.isIdentifier(property.key) &&
            property.key.name === MOUNT_FUNCTION_NAME
          ) {
            property.key = t.identifier('runInBrowser');
            property.value = t.identifier('runInBrowser');
          }
        }

        /* Replace `mount` with `runInBrowser`. */
        path.node.callee = t.identifier('runInBrowser');
        path.node.arguments = [
          t.arrowFunctionExpression(
            [],
            t.blockStatement([
              t.expressionStatement(
                t.awaitExpression(
                  t.callExpression(
                    t.identifier('pwMount'),
                    path.node.arguments,
                  ),
                ),
              ),
            ]),
            true,
          ),
        ];
      },
    },
  } satisfies PluginObj;
});
