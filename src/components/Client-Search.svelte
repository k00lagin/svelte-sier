<script>
	import { fetchData, getPopularSurnames } from '../sier.js';
	import { toCyrillic } from '../helpers.js';
	let query = '';
	let state = 'INITIAL';
	let recentClients = [],
		clients = [];
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
	// search.addEventListener('blur', () => {
	// 	setTimeout(() => isSearchFocused = false, 10);
	// });
	$: popularSurnames = [
		...recentClients
			.filter(
				client =>
					client.lastName.toLowerCase().indexOf(query.toLowerCase()) === 0
			)
			.map(client => client.lastName),
		...getPopularSurnames(query)
	];
	async function handleQueryChange() {
		query = search.value;
		if (query.match(/[a-zA-Z]/)) {
			query = toCyrillic(query);
		}
		let searchComponents = query.split(' ');
		console.log(searchComponents)
		if (query.startsWith('+')) {
			state = 'MOBILE';
		} else if (query.match(/\d/)) {
			state = 'SNILS';
		} else {
			switch (searchComponents.length) {
				case 1:
					state = 'LAST_NAME';
					break;
				case 2:
					state = 'NAME';
					break;
				case 3:
					state = 'MIDDLE_NAME';
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
		if (searchComponents.length > 1) {
			let lastName = searchComponents[0];
			searchParams.push({
				field: 'data.person.lastName',
				operator: 'eq',
				value: lastName[0].toUpperCase() + lastName.substr(1)
			});
			searchString += lastName[0].toUpperCase() + lastName.substr(1);
			if (searchComponents.length > 2) {
				var firstName = searchComponents[1];
				searchParams.push({
					field: 'data.person.firstName',
					operator: 'eq',
					value: firstName[0].toUpperCase() + firstName.substr(1)
				});
				searchString += firstName[0].toUpperCase() + firstName.substr(1);
				if (searchComponents.length > 3) {
					var middleName = searchComponents[2];
					searchParams.push({
						field: 'data.person.middleName',
						operator: 'eq',
						value: middleName[0].toUpperCase() + middleName.substr(1)
					});
					searchString += middleName[0].toUpperCase() + middleName.substr(1);
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
			clients = clients.content.map(data => data.data.person);
		}
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
		console.log(recentClients);
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
		left: 0;
		width: 100%;
		background-color:	white;
		z-index: 10;
		max-height: 1000px;
		overflow-y: auto;
		box-shadow: 5px 0 5px -1px rgba(0,0,0,.2), 0 5px 5px -1px rgba(0,0,0,.2);
		flex-flow: column nowrap;
	}
</style>

{#if isSearchFocused && query.length > 0}
	{#if state === 'LAST_NAME' && popularSurnames.length > 0}
		<div class='popular-names-flyout'>
			<ul>
				{#each popularSurnames as name}
					<li
						data-value={name}
						on:click={e => {
							search.value = e.currentTarget.getAttribute('data-value') + ' ';
							handleQueryChange();
							search.focus();
						}}>
						{name}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	{#if (state === 'NAME' || state === 'MIDDLE_NAME' || state === 'WHOLE_NAME') && clients.length > 0}
		<div class='client-search-flyout'>
			<ul>
				{#each clients as client}
					<li>
						<span class='client-name'>{client.lastName} {client.firstName}{client.middleName ? ' ' + client.middleName : ''}</span>
						<span class="client-birthday">{client.birthday?client.birthday.formatted:''}</span>
						<div class="client-document">{client.documentType ? `${client.documentType[0].text} ${client.documentSeries} ${client.documentNumber}` : ''}</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/if}
