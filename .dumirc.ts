import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  logo: '/tf.png',
  favicons: ['/tf.png'],
  themeConfig: {
    name: 'tf.js',
    socialLinks: {
      github: 'https://git.jzxer.cn/devlifestyle/tensorflow-model',
    },
  },
  alias: {
    '@jzx/knn-classifier': path.join(__dirname, 'packages/knn-classifier/src')
  },
  mfsu: false,
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      { type: 'knn', dir: 'packages/knn-model/src' },
    ],
  },
  monorepoRedirect: {
    srcDir: ['packages', 'src'],
    peerDeps: true,
  },
  plugins: ['dumi-plugin-color-chunk'],
  esbuildMinifyIIFE: false
});
