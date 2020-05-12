<script>
	import { fetchData, alias, favoriteServices } from "../sier.js";
	import Alias from "./Alias.svelte"
	import FavoriteButton from "./Favorite-Button.svelte"
  let serviceSearchInput, serviceSearchDialog;
  let query = "";
  let aliases = alias.get();
	$: alias.save(aliases);
  let faves = favoriteServices.get();
	$: favoriteServices.save(faves);
  function toggleDialog() {
    if (serviceSearchDialog.hasAttribute('open')) {
			serviceSearchDialog.removeAttribute('open');
			query = "";
			filterServices();
    } else {
			serviceSearchDialog.setAttribute('open', 'open');
			setTimeout(() => serviceSearchInput.focus(), 10);
    }
  }
  let isCtrlPressed = false;
  let services, filteredServices, allServices;
  services = getServices().then(data => {
    allServices = data;
    return data;
	});
  function filterServices() {
    if (query === "") {
			services = allServices;
			return;
    }
    let words = query.split(" ").sort((a, b) => b.length - a.length);
		let filteredServices = [];
		allServices.forEach(source => {
			let service;
			function match(priority, obj) {
				if (!service) {
					service = {
						id: source.id,
						sid: source.sid,
						name: source.name,
					}
				}
				if (obj.sid) {
					service.sid = service.sid.split(obj.sid).join(`<b>${obj.sid}</b>`);
				}
				if (obj.name) {
					service.name = service.name.split(obj.name).join(`<b>${obj.name}</b>`)
				}
				if (obj.alias) {
					service.alias = aliases[service.sid].split(obj.alias).join(`<b>${obj.alias}</b>`);
				}
				service.matchPriority = Math.max(priority, service.matchPriority || 0);
			}
      let isEvery = words.every(word => {
        if (aliases[source.sid] && aliases[source.sid].indexOf(word) !== -1) {
					match(4, {alias:word});
          return true;
        }
        if (Number(word) && source.sid.indexOf(word) !== -1) {
					match(3, {sid:word});
          return true;
        }
        if (source.name.indexOf(word) !== -1) {
					match(2, {name:word});
          return true;
				}
				let caseIgnorantIdx = source.name.toLowerCase().indexOf(word.toLowerCase());
        if (caseIgnorantIdx !== -1) {
					match(1, {name:source.name.substr(caseIgnorantIdx,word.length)});
          return true;
        }
			});
			if (isEvery) {
				filteredServices.push(service);
			}
    });
    services = filteredServices.sort((a, b) => b.matchPriority - a.matchPriority);
  }

  async function getServices() {
    let services = [];
    let rawServices = await fetchData({
      url: "api/v1/search/subservices",
      body: JSON.stringify({
        search: {
          search: [
            {
              field: "units.id",
              operator: "eq",
              value: JSON.parse(localStorage.currentOrganization)._id
            }
          ]
        },
        size: 200,
        sort: "serviceCode,DESC",
        prj: "servicesList"
      })
    });
    rawServices = rawServices.content;
    rawServices.forEach(rawService => {
      let service = {
        id: rawService._id,
        sid: rawService.serviceId.split("_")[3],
        name: rawService.serviceName
      };
      services.push(service);
    });
    return services;
  }
  function handleKeyDown(e) {
    switch (e.key) {
      case "Control":
        isCtrlPressed = true;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (e.ctrlKey) {
          e.preventDefault();
        }
        break;
    }
  }
  function handleKeyUp(e) {
    switch (e.key) {
      case "Escape":
        toggleDialog();
        break;
      case "Enter":
        if (
          document.querySelector(".service-search-dialog li.service-item:first-child > a")
        ) {
          document
            .querySelector(".service-search-dialog li.service-item:first-child > a")
            .click();
        }
        break;
      case "Control":
        isCtrlPressed = false;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (isCtrlPressed) {
          let link = document.querySelector(
            `.service-search-dialog li.service-item:nth-child(${
              e.key === "0" ? "10" : e.key
            }) > a`
          );
          if (link) {
            e.preventDefault();
            link.click();
          }
          break;
        }
      default:
        filterServices();
    }
	}
	function handleFaveChange(e) {
		if (e.currentTarget.checked) {
			faves.push(e.currentTarget.value);
			faves = faves;
		}
		else {
			let index = faves.indexOf(e.currentTarget.value);
			if (index >= 0) {
				faves.splice(index, 1);
				faves = faves;
			}
		}
	}
</script>

<style>
  .service-search-trigger {
    background-color: rgba(38, 50, 56, 0.2);
    border: 0;
    position: absolute;
    top: 130px;
    z-index: 100;
    color: white;
    height: 32px;
    width: 32px;
  }

  .service-search-trigger:hover {
    background-color: rgba(38, 50, 56, 0.1);
  }
  .service-search-trigger:active {
    color: rgba(255, 255, 255, 0.7);
  }
  :global(.service-search-dialog[open]) {
    margin: 0;
    width: 600px;
    height: 800px;
    position: absolute;
    left: 100px;
    top: 32px;
    z-index: 10;
    display: flex;
    flex-flow: column nowrap;
    padding: 0;
    padding-top: var(--es-2gap);
    border: 1px solid rgba(125, 125, 125, 0.2);
    box-shadow: 5px 0 5px -1px rgba(0, 0, 0, 0.2),
      0 5px 5px -1px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 1200px) {
    .service-search-trigger {
      top: 120px;
    }
    .service-search-dialog {
      left: 70px;
    }
  }

  .dialog-header {
    display: flex;
    margin-bottom: var(--es-gap);
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 19px;
    font-weight: 500;
  }

  .dialog-title {
    flex-grow: 1;
    margin-left: var(--es-2gap);
  }

  .dialog__close-trigger {
    margin-left: var(--es-gap);
    margin-right: var(--es-2gap);
    background-color: transparent;
    border: 0;
  }

  .service-search-input {
    margin: 0 var(--es-2gap) var(--es-gap) var(--es-2gap);
		width: calc(100% - calc(var(--es-2gap) * 2));
		height: 32px;
  }

  .service-list-node {
    overflow-y: scroll;
    list-style: none;
    padding: 0;
    flex-grow: 1;
    margin: 0;
  }

  .service-item {
    position: relative;
    padding: var(--es-05gap) 0 var(--es-05gap) var(--es-2gap);
  }

  :global(.service-item.active) {
    background-color: dodgerblue;
    color: white;
	}

  .service-item :global(b) {
		font-weight: normal;
		background-color: #ff7e33;
		color: white;
	}

  .service-code {
    margin-right: 8px;
  }

  .service-link:focus {
    color: #fdfdfd;
  }
  .control-flyout {
    position: absolute;
    background-color: rgba(16, 18, 32, 0.6);
    padding: 2px 6px;
    border-radius: 4px;
    color: white;
    left: 2px;
    top: 0;
	}
	.service-item:hover :global(.new-alias),
	.service-item:hover :global(.fave-label) {
		visibility: visible;
	}
	.favorite-list {
		display: flex;
		flex-flow: row wrap;
		list-style: none;
		padding: var(--es-05gap) var(--es-2gap);
		margin: 0;
	}
	.favorite {
		color: rgb(22, 21, 21);
		border-radius: 10px;
		padding: 2px 8px;
	}
	.favorite:hover {
		background-color: rgba(0,0,0,.1);
	}
</style>

<button
  type="button"
  class="service-search-trigger icon-magic-wand"
  on:click={toggleDialog} />
<dialog class="service-search-dialog" bind:this={serviceSearchDialog}>
  <header class="dialog-header">
    <span class="dialog-title">Начало нового дела</span>
    <button class="dialog__close-trigger icon-cross" on:click={toggleDialog} />
  </header>
  <input
    class="service-search-input form-control"
    type="text"
    placeholder="Часть названия услуги, её код, или псевдоним..."
    on:keydown={handleKeyDown}
    on:keyup={handleKeyUp}
    bind:value={query}
    bind:this={serviceSearchInput} />
	{#await services}
		Загрузка...
	{:then services}
		{#if faves.length > 0}
			<ul class="favorite-list">
				{#each faves as fave}
					<li class="favorite-item">
						<a class="favorite" href={(() => {
							let service = services.find(service => service.sid == fave);
							if (service) {
								return `http://172.153.153.48/ais/appeals/create/${service.id}`;
							}
							else {
								return '#';
							}
						})()}>{aliases[fave] || fave}</a>
					</li>
				{/each}
			</ul>
		{/if}
	{/await}
  <ul class="service-list-node">
    {#await services}
      <li class="service-item empty">Загрузка...</li>
    {:then services}
      {#each services as service, index}
        <li class="service-item">
          {#if isCtrlPressed && index < 10}
            <span class="control-flyout">{(index + 1) % 10}</span>
          {/if}
          <span class="service-code">{@html service.sid}</span>
          <a
            tabindex="0"
            class="service-link"
						on:focus={(e) => e.currentTarget.parentElement.classList.add('active')}
						on:blur={(e) => e.currentTarget.parentElement.classList.remove('active')}
            href={`http://172.153.153.48/ais/appeals/create/${service.id}`}>
            {@html service.name}
          </a>
					<span style="min-width: 52px;display: inline-block;">
						<Alias bind:value={aliases[service.sid]}  view={service.alias || aliases[service.sid]} on:change={filterServices}/>
						<FavoriteButton on:change={handleFaveChange} value={service.sid} checked={faves.indexOf(service.sid) !== -1}></FavoriteButton>
					</span>
        </li>
      {:else}
				<li class="service-item empty">Услуги не найдены...</li>
      {/each}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </ul>
</dialog>
