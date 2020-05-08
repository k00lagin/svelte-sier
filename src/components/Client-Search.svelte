<script>
	import { fetchData, getPopularSurnames } from '../sier.js';
	import { toCyrillic, toTitleCase } from '../helpers.js';
	let query = '';
	let searchComponents = [];
	let namePrompts = [];
	let state = 'INITIAL';
	let recentClients = [],
		clients = [],
		filteredClients = [],
		isClientCopied = false;
	let lastSearchString = '';
	fetchRecentAppeals();
	let search = document.querySelector(
		'input[placeholder="Поиск по ФИО, СНИЛС или номеру мобильного телефона в реестре клиентов..."]'
	);
	search.classList.add('enhanced-client-search');
	search.addEventListener('input', handleQueryChange);
	let isSearchFocused = false;
	search.addEventListener('focus', () => {
		isSearchFocused = true;
	});
	search.addEventListener('blur', () => {
		isSearchFocused = false
	});
	function updatePrompts() {
			switch (state) {
				case 'LAST_NAME':
					namePrompts = [
						...(recentClients
							.filter(
								client =>
									client.lastName.toLowerCase().indexOf(searchComponents[0].toLowerCase()) === 0
							)
							.map(client => {
								return {value: client.lastName}
							})),
						...getPopularSurnames(searchComponents[0])
					]
					break;
				case 'FIRST_NAME':
					namePrompts = [...recentClients, ...clients]
						.filter(
							client =>
								client.firstName.toLowerCase().indexOf(searchComponents[1].toLowerCase()) === 0
						)
						.map(client => {
								return {value: client.firstName}
							})
						.filter((name, index, names) => names.findIndex(el => el.value === name.value) === index)
					break;
				case 'MIDDLE_NAME':
					namePrompts = [];
				default:
					namePrompts = [];
			}
	}
	$: filteredClients = [...recentClients, ...clients].filter(client => {
		return client.lastName.indexOf(searchComponents[0]) === 0 &&
		client.firstName.indexOf(searchComponents[1] || '') === 0 &&
		client.middleName.indexOf(searchComponents[2] || '') === 0
	});
	async function handleQueryChange() {
		query = search.value;
		if (query.match(/[a-zA-Z]/)) {
			query = toCyrillic(query);
		}
		searchComponents = query.split(' ');
		if (query.startsWith('+')) {
			state = 'MOBILE';
		} else if (query.match(/\d/)) {
			state = 'SNILS';
		} else {
			switch (searchComponents.length) {
				case 1:
					state = 'LAST_NAME';
					searchComponents[0] = toTitleCase(searchComponents[0]);
					break;
				case 2:
					state = 'FIRST_NAME';
					searchComponents[1] = toTitleCase(searchComponents[1]);
					break;
				case 3:
					state = 'MIDDLE_NAME';
					searchComponents[2] = toTitleCase(searchComponents[2]);
					break;
				case 4:
					state = 'WHOLE_NAME';
					break;
				default:
					state = 'ERROR';
			}
		}
		let searchParams = [];
		let searchString = '';
		if (searchComponents.length > 1 && searchComponents[0].length > 0) {
			let lastName = searchComponents[0];
			searchParams.push({
				field: 'data.person.lastName',
				operator: 'eq',
				value: toTitleCase(lastName)
			});
			searchString += toTitleCase(lastName);
			if (searchComponents.length > 2 && searchComponents[1].length > 0) {
				var firstName = searchComponents[1];
				searchParams.push({
					field: 'data.person.firstName',
					operator: 'eq',
					value: toTitleCase(firstName)
				});
				searchString += toTitleCase(firstName);
				if (searchComponents.length > 3 && searchComponents[2].length > 0) {
					var middleName = searchComponents[2];
					searchParams.push({
						field: 'data.person.middleName',
						operator: 'eq',
						value: toTitleCase(middleName)
					});
					searchString += toTitleCase(middleName);
				}
			}
		}
		if (searchParams.length > 0 && lastSearchString !== searchString) {
			lastSearchString = searchString;
			clients = await fetchData({
				url: 'api/v1/search/persons',
				body: JSON.stringify({
					search: {
						search: searchParams
					},
					sort: 'dateLastModification,DESC'
				})
			});
			clients = clients.content.map(data => {
				let client = data.data.person;
				client.reestrId = data._id;
				return client;
			});
		}
		updatePrompts()
	}
	async function fetchRecentAppeals() {
		let appeals = await fetchData({
			url: 'api/v1/search/appeals',
			body: JSON.stringify({
				search: {
					search: [
						{
							field: 'unit.id',
							operator: 'eq',
							value: JSON.parse(localStorage.currentOrganization)._id
						},
						{
							field: 'userCreation.login',
							operator: 'eq',
							value: JSON.parse(localStorage.user).login
						}
					]
				},
				sort: 'dateLastModification,DESC'
			})
		});
		appeals.content.forEach(appeal => {
			appeal.objects.forEach(object => {
				if (
					object.data &&
					object.data.person &&
					object.data.person.reestrId &&
					!recentClients.some(
						client => client.reestrId === object.data.person.reestrId
					)
				) {
					// TODO: подгружать данные отдельно, даже если нет reestrId
					recentClients.push(object.data.person);
				}
			});
		});
	}
	function applyPrompt(e) {
		switch (state) {
			case 'LAST_NAME':
				searchComponents[0] = e.currentTarget.textContent;
				break;
			case 'FIRST_NAME':
				searchComponents[1] = e.currentTarget.textContent;
				break;
			case 'MIDDLE_NAME':
				searchComponents[2] = e.currentTarget.textContent;
		}
		search.value = searchComponents.join(' ') + ' ';//e.currentTarget.textContent + ' ';
		handleQueryChange();
		search.focus();
	}
	function handleClientClick(e) {
		let client = [...recentClients,...clients].filter(client => client.reestrId === e.currentTarget.getAttribute('data-id'))[0];
		search.value = `${client.lastName} ${client.firstName} ${client.middleName} `;
		copyClientData(JSON.stringify({
			type: 'object',
			data: {
				person: client
			}
		}));
	}
	function copyClientData(client) {
		GM_setClipboard(client);
		isClientCopied = true;
		setTimeout(() => {
			isClientCopied = false;
		}, 3000)
		search.focus();
	}
</script>

<style>
	.enhanced-client-search:focus ~ .popular-names-flyout,
	.enhanced-client-search:focus ~ .client-search-flyout,
	.popular-names-flyout:hover,
	.client-search-flyout:hover {
		display: block;
	}
	.popular-names-flyout {
		display: none;
		width: 150px;
		position: absolute;
		left: 0;
		background-color: white;
		z-index: 10;
		top: 36px;
		box-shadow: 5px 0 5px -1px rgba(0, 0, 0, 0.2),
			0 5px 5px -1px rgba(0, 0, 0, 0.2);
	}
	ul {
		display: flex;
		flex-flow: column nowrap;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	li {
		cursor: default;
		padding: 2px 8px;
	}
	li:hover {
		background-color: rgba(25, 60, 218, 0.6);
		color: white;
	}
	.client-search-flyout {
		display: none;
		position: absolute;
		top: 36px;
		right: 0;
		width: calc(100% - 166px);
		background-color:	white;
		z-index: 10;
		max-height: 1000px;
		overflow-y: auto;
		box-shadow: 5px 0 5px -1px rgba(0,0,0,.2), 0 5px 5px -1px rgba(0,0,0,.2);
		flex-flow: column nowrap;
	}
	.paste-flyout {
		position: absolute;
		background-color: rgba(16, 18, 32, 0.6);
		padding: 2px 6px;
		border-radius: 4px;
		color: white;
		left: calc(50% - 128px);
		top: 6px;
		transform: translateX(-50%);
		z-index: 9;
	}
</style>

{#if query.length > 0}
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
{/if}
