import type { RsbuildPlugin } from '@rsbuild/core';

export function templateCompilation(): RsbuildPlugin {
  return {
    name: 'storybook:vue-template-compilation',
    setup(api) {
      api.modifyRsbuildConfig((config) => {
        config.resolve ||= {};
        config.resolve.alias = {
          ...config.resolve.alias,
          vue: 'vue/dist/vue.esm-bundler.js',
        };
        return config;
      });
    },
  } satisfies RsbuildPlugin;
}
