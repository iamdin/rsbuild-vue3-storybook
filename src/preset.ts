import path from 'node:path';
import type { PresetProperty } from 'storybook/internal/types';

import type { RsbuildPlugin } from '@rsbuild/core';

import { vueComponentMeta } from './plugins/vue-component-meta.js';
import { vueDocgen } from './plugins/vue-docgen.js';
import { templateCompilation } from './plugins/vue-template.js';
import type {
  FrameworkOptions,
  StorybookConfig,
  VueDocgenPlugin,
} from './types.d.ts';

const getAbsolutePath = <I extends string>(input: I): I =>
  path.dirname(require.resolve(path.join(input, 'package.json'))) as any;

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework');

  console.log('builder', getAbsolutePath('storybook-builder-rsbuild'));
  return {
    builder: {
      name: getAbsolutePath('storybook-builder-rsbuild'),
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: getAbsolutePath('@storybook/vue3'),
  };
};

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = async (
  config,
  options,
) => {
  const plugins: RsbuildPlugin[] = [templateCompilation()];

  const framework = await options.presets.apply('framework');
  const frameworkOptions: FrameworkOptions =
    typeof framework === 'string' ? {} : (framework.options ?? {});

  const docgen = resolveDocgenOptions(frameworkOptions.docgen);

  // add docgen plugin depending on framework option
  if (docgen.plugin === 'vue-component-meta') {
    plugins.push(await vueComponentMeta(docgen.tsconfig));
  } else {
    plugins.push(await vueDocgen());
  }

  const { mergeRsbuildConfig } = await import('@rsbuild/core');
  return mergeRsbuildConfig(config, {
    plugins,
  });
};

export const typescript: PresetProperty<'typescript'> = async (config) => ({
  ...config,
  skipCompiler: true,
});

/** Resolves the docgen framework option. */
const resolveDocgenOptions = (
  docgen?: FrameworkOptions['docgen'],
): { plugin: VueDocgenPlugin; tsconfig?: string } => {
  if (!docgen) {
    return { plugin: 'vue-docgen-api' };
  }

  if (typeof docgen === 'string') {
    return { plugin: docgen };
  }
  return docgen;
};
