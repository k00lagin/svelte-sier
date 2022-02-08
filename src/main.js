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
		let docs = JSON.parse(localStorage.getItem('catalogueDocuments'));
		let changed = false;
		docs.map(doc => {
			if (doc.name === "Паспорт гражданина РФ" || doc.name === "Свидетельство о рождении") {
				doc.name = `·${doc.name}`;
				changed = true;
			}
		})
		if (changed) {
			localStorage.setItem('catalogueDocuments', JSON.stringify(docs));
		}
	}
	if (document.querySelector('input[placeholder="Поиск по ФИО, СНИЛС или номеру мобильного телефона в реестре клиентов..."]:not(.enhanced-client-search)')) {
		var clientSearch = new ClientSearch({
			target: document.querySelector('input[placeholder="Поиск по ФИО, СНИЛС или номеру мобильного телефона в реестре клиентов..."]').parentElement
		});
	}
}
export default app;
