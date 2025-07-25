<script>
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let name,
		type,
		title,
		options = [];
	function handleChange(e) {
		dispatch("change", {
			name: name,
			value: e.currentTarget.checked,
		});
	}
	let select = {};
	function handleSelectChange() {
		dispatch("change", {
			name: name,
			value: select,
		});
	}
</script>

{#if type === "singular-boolean"}
	<div class="form-element">
		<input
			id={name}
			type="checkbox"
			class="visually-hidden"
			on:change={handleChange}
		/>
		<label for={name} class="">{title}</label>
	</div>
{:else if type === "multi-select"}
	<div class="form-element">
		{title}
		<ul class="option-list">
			{#each options as option}
				<li class="option">
					<input
						class="visually-hidden"
						{name}
						id="{name}-{option.value}"
						type="checkbox"
						classclassvalue={option.value}
						bind:checked={select[option.value]}
						on:change={handleSelectChange}
					/>
					<label for="{name}-{option.value}">{option.text}</label>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.form-element {
		position: relative;
	}
	.option-list {
		padding: 0;
		list-style: none;
	}
	.option {
		position: relative;
	}
	input[type="checkbox"] + label {
		padding-left: 24px;
		user-select: none;
	}
	input[type="checkbox"] + label::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 18px;
		height: 18px;
		border-radius: 3px;
		border: 2px solid #607d8b;
	}
	input[type="checkbox"] + label::after {
		position: absolute;
		top: 0;
		left: 3px;
		font-family: "FontAwesome";
		content: "\f00c";
		transition: all 0.2s;
		opacity: 0;
		color: #607d8b;
		font-size: 12px;
	}
	input[type="checkbox"]:checked + label:after {
		opacity: 1;
	}
</style>
