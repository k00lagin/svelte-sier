<script>
	export let value = "",
		checked;
</script>

<style>
	.fave-label {
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
	}
	.fave-label:hover {
		background-color: rgba(38, 50, 56, .2);
	}
	.checked {
		color: rgb(245, 89, 89);
	}
</style>

<label class="fave-label" class:checked>
	{#if checked}
		<svg style="width:16px;height:16px" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3
				7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3
				22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
		</svg>
	{:else}
		<svg style="width:16px;height:16px" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5
				7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5
				20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81
				12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36
				10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41
				19.58,3 16.5,3Z" />
		</svg>
	{/if}
	<input class="visually-hidden" type="checkbox" on:change bind:value bind:checked />
</label>
