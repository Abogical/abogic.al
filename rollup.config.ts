import multiInput from 'rollup-plugin-multi-input';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const config = {
	input: 'src/assets/*.ts',
	plugins: [
		multiInput({relative: 'src/assets/'}),
		resolve(),
		typescript({
			target: 'es6'
		}),
		babel({presets: ['@babel/preset-env'], babelHelpers: 'bundled'}),
		terser()
	],
	preserveEntrySignatures: false,
	output: {
		format: 'es',
		chunkFileNames: 'chunks/[name].js',
		dir: '_site/assets/'
	}
};

export default config;
