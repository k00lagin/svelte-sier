<script>
	import { fetchData, getPopularSurnames } from "../sier.js";
	import { toCyrillic } from "../helpers.js";
	let query = '';
	let state = 'INITIAL';
	let recentClients = [];
	fetchRecentAppeals();
	let search = document.querySelector('input[placeholder="Поиск по ФИО, СНИЛС или номеру мобильного телефона в реестре клиентов..."]');
	search.classList.add('enhanced');
	search.addEventListener('input', handleQueryChange)
	$: popularSurnames = [...(recentClients.filter(client => client.lastName.toLowerCase().indexOf(query.toLowerCase()) === 0).map(client => client.lastName)), ...getPopularSurnames(query)];
	function handleQueryChange() {
		query = search.value;
		if (query.startsWith('+')) {
			state = 'MOBILE';
		}
		else if (query.match(/\d/)) {
			state = 'SNILS';
		}
		else {
			let components = query.split(' ');
			switch (components.length) {
				case 1:
					state = 'SURNAME';
					break;
				case 2:
					state = 'NAME';
					break;
				case 3:
					state = 'PATRONYMIC';
					break;
				default:
					state = 'ERROR';
			}
		}
		if (query.match(/[a-zA-Z]/)) {
			query = toCyrillic(query);
		}
	}
	async function fetchRecentAppeals() {
		let appeals = await fetchData({
			url: 'api/v1/search/appeals',
			body: JSON.stringify({
				"search": {
					"search": [{
						"field": "unit.id",
						"operator": "eq",
						"value": JSON.parse(localStorage.currentOrganization)._id
					},
					{
						"field": "userCreation.login",
						"operator": "eq",
						"value": JSON.parse(localStorage.user).login
					}]
				},
				"sort": "dateLastModification,DESC"
			})
		});
		appeals.content.forEach(appeal => {
			appeal.objects.forEach(object => {
				if (object.data && object.data.person && object.data.person.reestrId && !recentClients.some(client => client.reestrId === object.data.person.reestrId)) {
					// TODO: подгружать данные отдельно, даже если нет reestrId
					recentClients.push(object.data.person);
				}
			});
		});
		console.log(recentClients);
	}
</script>

<style>
	.popular-names-flyout {
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
</style>

{#if query.length > 0}
	{#if state === 'SURNAME' && popularSurnames.length > 0}
		<div class="popular-names-flyout">
			<ul>
				{#each popularSurnames as name}
					<li data-value={name} on:click={(e) => {search.value = e.currentTarget.getAttribute('data-value') + ' '; handleQueryChange(); search.focus();}}>{name}</li>
				{/each}
			</ul>
		</div>
	{/if}
	<div class="client-search-flyout">
		<!-- 1 -->
	</div>
{/if}
