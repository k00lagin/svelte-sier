<script>
	import { alias, favoriteServices } from "../sier.js";
	import { createEventDispatcher } from 'svelte';
	export let sid, services;
	const dispatch = createEventDispatcher();
	let aliases = alias.get();
	$: alias.save(aliases);
  let faves = favoriteServices.get();
	$: favoriteServices.save(faves);
	let service = services.find(service => service.sid == sid);
	let url = service ? `http://172.153.153.48/ais/appeals/create/${service.id}` : undefined;
	let menu;
	function handleContextMenu(e) {
		e.preventDefault();
		menu.classList.add('active');
	}
	document.addEventListener("mousedown", e => {
		Array.from(document.querySelectorAll('.context-menu.active')).forEach(menu => {
			let menuGeometry = menu.getClientRects()[0];
			if (e.pageX < menuGeometry.left || e.pageX > menuGeometry.left + menuGeometry.width ||
				e.pageY < menuGeometry.top || e.pageY > menuGeometry.top + menuGeometry.height) {
				menu.classList.remove('active');
			}
		})
	}, false);
	function handleServiceRemove(e) {
		dispatch('remove', {
			sid: e.currentTarget.value
		});
	}
</script>

<style>
	.favorite {
		color: rgb(22, 21, 21);
		border-radius: 10px;
		padding: 2px 8px;
	}
	.favorite.external {
		color: rgb(126, 126, 126);
	}
	.favorite:not(.external):hover {
		background-color: rgba(0,0,0,.1);
	}
	.context-menu:not(.active) {
		display: none;
	}
	.context-menu {
		position: absolute;
		z-index: 1;
		list-style: none;
		padding: 0;
		background-color: white;
		box-shadow: 5px 0 5px -1px rgba(0, 0, 0, 0.2),
			0 5px 5px -1px rgba(0, 0, 0, 0.2);
	}
	.menu-button {
		width: 100%;
		background-color: white;
		border: 0;
		text-align: start;
		display: block;
		padding: 4px 8px;
		color: black;
	}
	button.menu-button:hover,
	a.menu-button[href]:hover {
		background-color: rgba(179, 179, 179, 0.2);
	}
	a.menu-button:not([href]) {
		color: rgb(145, 145, 145);
		cursor: default;
	}
</style>

<a class="favorite" href={url} title={!url?`${sid}: Услуга из другого МФЦ`:service.name} class:external={!url} on:contextmenu={handleContextMenu}>{aliases[sid] || sid}</a>
<ul class="context-menu" bind:this={menu}>
	<li><a href={url} class="menu-button">Начать</a></li>
	<li><a href={url} target="_blank" class="menu-button">Начать на новой вкладке</a></li>
	<!-- <li><button type="button" class="menu-button">Переименовать</button></li> -->
	<li><button type="button" class="menu-button" value={sid} on:click={handleServiceRemove}>Удалить</button></li>
</ul>

