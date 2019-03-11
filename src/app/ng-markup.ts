

export const _serializerList = [
    type => {

        const def = type.ngComponentDef;

        if (def == null) {
            return null;
        }

        return def.selectors[0][0];

    },
    type => {

        const def = type.ngDirectiveDef;

        if (def == null) {
            return null;
        }

        const selector = def.selectors[0][1] as string;
        return selector.replace(/^\[|\]$/g, '');

    },
    type => {
        const def = type.ngPipeDef;
        if (def == null) {
            return null;
        }
        return def.name;
    }
];

/**
 * @todo when `deps` will be added to `Component` definition,
 * we could return `{deps, template}` then use it like this:
 * ```
 * @Component({
 *   selector: 'wt-root',
 *   ...ngMarkup`<${Child}></${Child}>`
 * })
 * ```
 */
export function ngMarkup(blockList, ...typeList) {

    const [firstBlock, ...remainingBlockList] = blockList;

    return remainingBlockList.reduce((result, block, index) => {

        const type = typeList[index];

        /* Grab the selector from component|directive|pipe's metadata. */
        const selector = _serializerList
            .map(serializer => serializer(type))
            .find(_selector => _selector != null);

        return `${result}${selector}${block}`;

    }, firstBlock);

}
