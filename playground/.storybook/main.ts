import { dirname, join } from 'node:path';
import type { StorybookConfig } from '../../src';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    // name: getAbsolutePath('storybook-vue3-rsbuild'),
    name: getAbsolutePath('rsbuild-vue3-storybook'),
    options: {
      docgen: 'vue-component-meta',
    },
  },
  rsbuildFinal: (config) => {
    config.output = config.output || {};
    Object.assign(config.output, {
      overrideBrowserslist: ['chrome >= 120'],
      sourceMap: false,
      minify: false,
    });
    return config;
  },
} satisfies StorybookConfig;

export default config;
