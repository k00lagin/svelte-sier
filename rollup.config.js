import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';

const preamble = fs.readFileSync('src/meta.js', 'utf-8');
const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/meta.js',
		output: {
			file: 'public/build/sier-anket.meta.js',
			banner: preamble
		}
	},
	{
		input: 'src/main.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/build/sier-anket.user.js',
			banner: preamble
		},
		plugins: [
			svelte({
				dev: !production,
				emitCss: false,
			}),

			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			!production && serve(),

			// !production && livereload('public'),

			production && terser({
				output: {
					beautify: false,
					preamble: preamble
				}
			})
		],
		watch: {
			clearScreen: false
		}
	}
];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
