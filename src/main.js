import App from './components/App.svelte';
import Toolbar from './components/Toolbar.svelte'

function checkLoadState() {
	if (!document.querySelector('.navigation.navigation-main')) {
		if (document.querySelector('.enhanced-sier-toolbar')) {
			document.querySelector('.enhanced-sier-toolbar').remove();
		}
		return;
	}
	else {
		init();
	}
}
let initInterval = setInterval(checkLoadState, 100);

function init() {
	if (!document.querySelector('.enhanced-sier-toolbar')) {
		var app = new App({
			target: document.body
		});
		var toolbar = new Toolbar({
			target: document.body
		});
	}
}
export default app;
