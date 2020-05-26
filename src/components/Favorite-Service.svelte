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
		// let index = faves.indexOf(e.currentTarget.value);
		dispatch('remove', {
			sid: e.currentTarget.value
		});
		// if (index >= 0) {
		// 	faves.splice(index, 1);
		// 	faves = faves;
		// }
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
		box-shadow: 5px 0 5px -1px rgba(0, 0, 0, 0.2),
			0 5px 5px -1px rgba(0, 0, 0, 0.2);
	}
	.context-menu button {
		width: 100%;
		background-color: white;
		border: 0;
		text-align: start;
	}
	.context-menu button:hover {
		background-color: rgb(179, 179, 179);
	}
</style>

<a class="favorite" href={url} title={!url?`${sid}: Услуга из другого МФЦ`:service.name} class:external={!url} on:contextmenu={handleContextMenu}>{aliases[sid] || sid}</a>
<ul class="context-menu" bind:this={menu}>
	<li><button type="button">Начать</button></li>
	<li><button type="button">Переименовать</button></li>
	<li><button type="button" value={sid} on:click={handleServiceRemove}>Удалить</button></li>
</ul>

