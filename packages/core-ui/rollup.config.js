import { readFileSync } from 'fs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    json(),
    image(),
    copy({
      targets: [
        { src: 'src/assets/*', dest: 'lib/assets' } // Adjust the source and destination paths as per your project structure
      ]
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      extensions: ['.css']
    })
  ],
  onwarn: function (message, warn) {
    // Ignore circular dependencies produced within 3rd party libraries
    if (/Circular dependency.*node_modules/.test(message)) {
      return;
    } else {
      warn(message);
    }
  }
};
