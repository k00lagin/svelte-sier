<script>
	import { createEventDispatcher } from 'svelte';
	export let value = '', view = '';
	let previousValue, tempValue;
	const dispatch = createEventDispatcher();
	let isEditing = false;
	let input, inputWidth = 128, isParentTooTight;
	function edit(e) {
		let buttonGeometry = e.currentTarget.getClientRects()[0];
		let containerGeometry = e.currentTarget.parentElement.getClientRects()[0];
		if (containerGeometry.left + containerGeometry.width - (buttonGeometry.left + inputWidth) < 0) {
			isParentTooTight = true;
		}
		tempValue = value;
		isEditing = true;
		setTimeout(() => input.focus(), 10);
	}
	function cancelChanges() {
		isEditing = false;
		tempValue = value;
	}
	function applyChanges() {
		value = tempValue;
		isEditing = false;
		dispatch('change', {});
	}
	function handleKeyUp(e) {
		switch (e.key) {
			case "Escape":
				cancelChanges();
				break;
			case "Enter":
				applyChanges()
				break;
		}
	}
</script>

<style>
	.alias {
		color: rgb(171, 171, 171);
		border: 0;
		background-color: transparent;
		padding: 0;
	}
	.alias:hover,
	.alias:focus {
		color: rgb(60, 60, 60);
		border-bottom: 0.5px dashed;
	}
	.new-alias {
		border: 0;
		background-color: transparent;
		height: 24px;
		width: 24px;
		padding: 0;
		margin-top: -6px;
		transform: translateY(4px);
		border-radius: 4px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: rgb(171, 171, 171);
		box-sizing: border-box;
		visibility: hidden;
		cursor: default;
	}
	.new-alias:hover {
		background-color: rgba(38, 50, 56, .2);
	}
	.new-alias:focus {
		background-color: rgba(93, 230, 52, 0.7);
		color: white;
		border: 0.5px dashed;
		visibility: visible;
	}
	input {
		box-sizing: border-box;
		height: 32px;
		position: absolute;
		border: 1px solid lightgrey;
		border-radius: 4px;
		margin-left: 1px;
		margin-top: -6px;
		box-shadow: 3px 0 4px -2px rgba(0,0,0,.2), 0px 3px 4px -2px rgba(0,0,0,.2);
		padding-left: var(--es-gap);
		z-index: 1;
	}
</style>

{#if isEditing}
<input type="text" bind:value={tempValue} on:blur={applyChanges} bind:this={input} on:keyup={handleKeyUp} width={inputWidth} style={isParentTooTight?'right:4px':''}>
{:else if value}
<button type="button" class="alias" on:click={edit}>
	[
	{@html view}
	]
</button>
{:else}
	<button type="button" on:click={edit} class="new-alias">
		<svg style="width:16px;height:16px" viewBox="0 0 24 24">
				<path fill="currentColor" d="M20.7,7C20.4,7.4 20,7.7 20,8C20,8.3 20.3,8.6 20.6,9C21.1,9.5 21.6,9.9 21.5,10.4C21.5,10.9 21,11.4 20.5,11.9L16.4,16L15,14.7L19.2,10.5L18.2,9.5L16.8,10.9L13,7.1L17,3.3C17.4,2.9 18,2.9 18.4,3.3L20.7,5.6C21.1,6 21.1,6.7 20.7,7M3,17.2L12.6,7.6L16.3,11.4L6.8,21H3V17.2M7,2V5H10V7H7V10H5V7H2V5H5V2H7Z" />
		</svg>
	</button>
{/if}
