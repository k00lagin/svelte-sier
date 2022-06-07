import App from './components/App.svelte';
import ServiceSearch from './components/Service-Search.svelte';
import AppSettings from './components/Settings.svelte';
import ClientSearch from './components/Client-Search.svelte';

function checkLoadState() {
	if (!document.querySelector('.navigation.navigation-main')) {
		if (document.querySelector('.service-search-trigger')) {
			document.querySelector('.service-search-trigger').remove();
			document.querySelector('.service-search-dialog').remove();
		}
		return;
	}
	else {
		init();
	}
}
let initInterval = setInterval(checkLoadState, 100);

function init() {
	if (!document.querySelector('.service-search-trigger')) {
		var app = new App({
			target: document.body
		});
		var serviceSearch = new ServiceSearch({
			target: document.body
		});
		var appSettings = new AppSettings({
			target: document.body
		});
	}
	let clientSearchInput = document.querySelector('input[placeholder="Поиск по ФИО, СНИЛС или номеру мобильного телефона в реестре клиентов..."]:not(.enhanced-client-search)');
	if (clientSearchInput) {
		var clientSearch = new ClientSearch({
			target: clientSearchInput.parentElement
		});
	}
}
export default app;
