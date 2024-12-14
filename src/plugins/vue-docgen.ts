import { createFilter } from '@rollup/pluginutils';
import type { RsbuildPlugin } from '@rsbuild/core';
import MagicString from 'magic-string';
import { parse } from 'vue-docgen-api';

export async function vueDocgen(): Promise<RsbuildPlugin> {
  const include = /\.(vue)$/;

  const filter = createFilter(include);
  console.log('vueDocgen');
  return {
    name: 'storybook:vue-docgen-plugin',
    setup(api) {
      api.transform(
        { test: (id) => filter(id) },
        async ({ code: src, resource: id }) => {
          try {
            const metaData = await parse(id);
            const s = new MagicString(src);
            s.append(`;script.__docgenInfo = ${JSON.stringify(metaData)}`);
            return {
              code: s.toString(),
              map: s.generateMap({ hires: true, source: id }),
            };
          } catch (e) {
            return src;
          }
        },
      );
    },
  } satisfies RsbuildPlugin;
}
