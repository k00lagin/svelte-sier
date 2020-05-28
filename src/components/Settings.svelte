<script>
	import { alias, favoriteServices } from "../sier.js";
  let aliases = alias.get();
	$: alias.save(aliases);
  let faves = favoriteServices.get();
	$: favoriteServices.save(faves);
  let hidden = true;
  function toggleDialog() {
    hidden = !hidden;
	}
	let aliasesInput, favesInput;
	function handleAliasesSave() {
		aliases = JSON.parse(aliasesInput.value);
	}
	function handleFavesSave() {
		faves = JSON.parse(favesInput.value);
	}
</script>

<style>
  .app-settings-trigger {
    position: fixed;
    right: 0;
		bottom: 0;
		top: unset;
    background-color: rgba(38, 50, 56, .2);
		border: 0;
		color: white;
		height: 32px;
		width: 32px;
		z-index: 1;
	}
	.app-settings-trigger:hover {
		background-color: rgba(38, 50, 56, .3);
	}
	.app-settings-trigger:active {
		color: rgba(255, 255, 255, .7);
	}
	.app-settings-dialog[open] {
		margin: 0;
		position: fixed;
    width: 600px;
    height: 800px;
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
		margin-bottom: var(--es-gap);
		font-family:Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size:19px;
		font-weight:500;
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
</style>

<button
  type="button"
  class="app-settings-trigger icon-cog"
  on:click={toggleDialog} />
<dialog class="app-settings-dialog" open={!hidden}>
	<header class="dialog-header">
		<span class="dialog-title">Настройки дополнений</span>
		<button class="dialog__close-trigger icon-cross" on:click={toggleDialog}></button>
	</header>
	<h3>Псевдонимы услуг</h3>
	<textarea name="aliases" id="" cols="30" rows="10" value={JSON.stringify(aliases)} bind:this={aliasesInput}></textarea>
	<button type="button" on:click={handleAliasesSave}>Сохранить</button>
	<h3>Избранные услуги</h3>
	<textarea name="faves" id="" cols="30" rows="10" value={JSON.stringify(faves)} bind:this={favesInput}></textarea>
	<button type="button" on:click={handleFavesSave}>Сохранить</button>
</dialog>
