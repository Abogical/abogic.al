import multiInput from 'rollup-plugin-multi-input';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

const config = {
	input: 'src/assets/*.js',
	plugins: [
		multiInput({relative: 'src/assets/'}),
		resolve(),
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
