<script>
	import { fetchData, getPopularSurnames, getPopularFirstNames } from '../sier.js';
	import { toCyrillic, toTitleCase } from '../helpers.js';
	let search = {
		value: '',
		realPart: '',
		imaginaryPart: '',
		person: {
			lastName: '',
			firstName: '',
			middleName: '',
			gender: ''
		},
		mobile: '',
		snils: ''
	};
	// let prompts = {
	// 	recent: {
	// 		lastName: [],
	// 		firstName: [],
	// 		middleName: []
	// 	},
	// 	online: {
	// 		lastName: [],
	// 		firstName: [],
	// 		middleName: []
	// 	}
	// }
	let input = document.querySelector(
		'input[placeholder="Поиск по ФИО, СНИЛС или номеру мобильного телефона в реестре клиентов..."]'
	);
	input.classList.add('enhanced-client-search');
	input.addEventListener('input', () => {
		search.value = input.value;
	});
	$: search.realPart = (search.imaginaryPart.length > 0 && search.value.indexOf(search.imaginaryPart) === search.value.length - search.imaginaryPart.length) ? toCyrillic(search.value.substr(0, search.value.length - search.imaginaryPart.length)) : toCyrillic(search.value);
	$: search.mobile = (search.realPart.substr(0, 1) === '+') ? search.realPart : '';
	$: search.snils = (search.realPart.substr(0, 1).match(/\d/)) ? search.realPart : '';
	$: search.person.lastName = (search.realPart.substr(0, 1).match(/[a-zA-Zа-яА-ЯёЁ]/)) ? toTitleCase(search.realPart.split(' ')[0]) : '';
	$: search.person.firstName = (search.person.lastName.length > 0 && search.realPart.split(' ').length > 1) ? toTitleCase(search.realPart.split(' ')[1]) : '';
	$: search.person.middleName = (search.person.firstName.length > 0 && search.realPart.split(' ').length > 2) ? toTitleCase(search.realPart.split(' ')[2]) : '';
	// $: console.table(search);
	$: prompts = (() => {
		if (search.person.lastName && !search.person.firstName) {
			return getPopularSurnames(search.person.lastName);
		}
		else if (search.person.firstName && !search.person.middleName) {
			return getPopularFirstNames(search.person.firstName);
		}
	})();
	$: console.table(prompts);
	// input.addEventListener('key')
	// input.addEventListener('select')
</script>

<style>

</style>

<!-- {#if true}
	{#if (state === 'FIRST_NAME' || state === 'MIDDLE_NAME' || state === 'WHOLE_NAME') && clients.length > 0}
		<div class='client-search-flyout'>
			<ul>
				{#each filteredClients as client}
					<li on:click={handleClientClick} data-id={client._id || client.reestrId}>
						<span class='client-name'>{client.lastName} {client.firstName}{client.middleName ? ' ' + client.middleName : ''}</span>
						<span class="client-birthday">{client.birthday?client.birthday.formatted:''}</span>
						<div class="client-document">{client.documentType ? `${client.documentType[0].text} ${client.documentSeries} ${client.documentNumber}` : ''}</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	{#if namePrompts.length > 0}
		<div class='popular-names-flyout'>
			<ul>
				{#each namePrompts as name}
					<li	data-gender={name.gender}	on:click={applyPrompt}>{name.value}</li>
				{/each}
			</ul>
		</div>
	{/if}
{/if}
{#if isClientCopied}
	<div class="paste-flyout">Теперь нажмите Ctrl+V</div>
{/if} -->
