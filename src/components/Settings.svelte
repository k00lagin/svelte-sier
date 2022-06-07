<script>
	import { aliases, faves } from '../stores.js';
	let hidden = true;
	function toggleDialog() {
		hidden = !hidden;
	}
	$: aliasesString = (() => {
		if (!prevAliases || prevAliases === aliasesString) {
			prevAliases = JSON.stringify($aliases);
			return JSON.stringify($aliases);
		} else {
			return aliasesString;
		}
	})();
	$: favesString = (() => {
		if (!prevFaves || prevFaves === favesString) {
			prevFaves = JSON.stringify($faves);
			return JSON.stringify($faves);
		} else {
			return favesString;
		}
	})();
	let aliasesInput,
		favesInput,
		aliasesString,
		prevAliases,
		favesString,
		prevFaves;
	function handleAliasesSave() {
		$aliases = JSON.parse(aliasesString);
		prevAliases = JSON.stringify($aliases);
	}
	function handleFavesSave() {
		$faves = JSON.parse(favesInput.value);
		prevFaves = JSON.stringify($faves);
	}
</script>

<button
	type="button"
	class="app-settings-trigger icon-cog"
	on:click={toggleDialog}
/>
<dialog class="app-settings-dialog" open={!hidden}>
	<header class="dialog-header">
		<h2 class="dialog-title">Настройки дополнений</h2>
		<button class="dialog__close-trigger icon-cross" on:click={toggleDialog} />
	</header>
	<div class="main">
		<h3>Псевдонимы услуг</h3>
		<textarea
			name="aliases"
			id=""
			bind:value={aliasesString}
			bind:this={aliasesInput}
		/>
		<button type="button" on:click={handleAliasesSave}>Сохранить</button>
		<h3>Избранные услуги</h3>
		<textarea
			name="faves"
			id=""
			bind:value={favesString}
			bind:this={favesInput}
		/>
		<button type="button" on:click={handleFavesSave}>Сохранить</button>
	</div>
</dialog>

<style>
	.app-settings-trigger {
		position: fixed;
		right: 0;
		bottom: 0;
		top: unset;
		background-color: rgba(38, 50, 56, 0.2);
		border: 0;
		color: white;
		height: 32px;
		width: 32px;
		z-index: 1;
	}
	.app-settings-trigger:hover {
		background-color: rgba(38, 50, 56, 0.3);
	}
	.app-settings-trigger:active {
		color: rgba(255, 255, 255, 0.7);
	}
	.app-settings-dialog[open] {
		margin: 0;
		position: fixed;
		width: 600px;
		max-height: 800px;
		right: 0;
		bottom: 32px;
		left: unset;
		z-index: 1;
		display: flex;
		flex-flow: column nowrap;
		padding: 0;
		padding-top: var(--es-2gap);
		border: 1px solid rgba(125, 125, 125, 0.2);
		box-shadow: 5px 0 5px -1px rgba(0, 0, 0, 0.2),
			0 5px 5px -1px rgba(0, 0, 0, 0.2);
	}
	.dialog-header {
		display: flex;
		font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-size: 19px;
		font-weight: 500;
	}

	.dialog-title {
		flex-grow: 1;
		margin: 0 0 0 var(--es-2gap);
	}

	.dialog__close-trigger {
		margin-left: var(--es-gap);
		margin-right: var(--es-2gap);
		background-color: transparent;
		border: 0;
	}
	.main {
		padding: 0 var(--es-2gap) var(--es-gap);
		display: flex;
		flex-flow: column nowrap;
	}
	.main textarea {
		resize: none;
		height: 100px;
		padding: var(--es-05gap) var(--es-gap);
	}
	.main button {
		align-self: flex-end;
	}
	h3 {
		margin: var(--es-gap) 0;
	}
</style>
