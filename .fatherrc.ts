import { defineConfig } from 'father-plugin-less';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: {
    output: 'es',
    ignores: ['**/demo/*', 'src/**/demo/*'],
    transformer: 'babel',
  },
  cjs: {
    output: 'lib',
    ignores: ['**/demo/*', 'src/**/demo/*'],
    transformer: 'babel',
  },
});
