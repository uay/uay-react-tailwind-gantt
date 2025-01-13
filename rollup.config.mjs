import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { builtinModules } from 'module';
import * as packageJson from './package.json' with { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [resolve(), commonjs(), typescript()],
  external: [
    ...builtinModules,
    ...Object.keys(packageJson.peerDependencies || {}),
  ],
};
