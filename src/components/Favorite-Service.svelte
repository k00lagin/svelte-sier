<script>
	import { alias } from "../sier.js";
	export let sid, services;
	let aliases = alias.get();
	$: alias.save(aliases);
	let service = services.find(service => service.sid == sid);
	let url = service ? `http://172.153.153.48/ais/appeals/create/${service.id}` : undefined;
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
</style>

<a class="favorite" href={url} title={!url?`${sid}: Услуга из другого МФЦ`:service.name} class:external={!url}>{aliases[sid] || sid}</a>
