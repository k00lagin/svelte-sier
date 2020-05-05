import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;
let preamble = '// ==UserScript==\n' +
	'// @name        Svelte SIER\n' +
	'// @namespace   k00lagin.svelte-sier\n' +
	'// @version     0.0.1\n' +
	'// @description Make SIER great again!\n' +
	'// @author      k00lagin\n' +
	'// @match       http://172.153.153.48/*\n' +
	'// @grant       GM_setValue\n' +
	'// @grant       GM_getValue\n' +
	'// @grant       GM_setClipboard\n' +
	'// @grant       GM_notification\n' +
	'// ==/UserScript==\n';

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
		banner: preamble
	},
	plugins: [
		svelte({
			dev: !production
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
};

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
