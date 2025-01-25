import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import { builtinModules } from 'module';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
  fs.readFileSync(`${__dirname}/package.json`, 'utf8'),
);
const tsconfig = JSON.parse(
  fs.readFileSync(`${__dirname}/tsconfig.json`, 'utf8'),
);

const peerDependencies = packageJson.peerDependencies || {};

const tsconfigPaths = tsconfig.compilerOptions.paths || {};

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.cjs.jsx',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.jsx',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: Object.entries(tsconfigPaths).map(([key, values]) => {
        if (values.length !== 1) {
          throw new Error('Only one path is supported');
        }

        const value = values[0];

        const postFix = '/*';

        if (!key.endsWith(postFix) || !value.endsWith(postFix)) {
          throw new Error(
            `Only paths ending with /* are supported (${key}, ${value})!`,
          );
        }

        const alias = key.slice(0, -postFix.length);
        const targetPath = value.slice(0, -postFix.length);

        const resolvedPath = path.resolve(process.cwd(), targetPath);

        if (!fs.existsSync(resolvedPath)) {
          throw new Error(
            `Path does not exist: ${resolvedPath} (${key}, ${value})`,
          );
        }

        return {
          find: alias,
          replacement: resolvedPath,
        };
      }),
    }),
    resolve(),
    commonjs(),
    typescript(),
  ],
  external: [...builtinModules, ...Object.keys(peerDependencies)],
};
