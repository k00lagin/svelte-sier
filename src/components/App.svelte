<svelte:head>
	<style>
		body {
			--es-05gap: calc(var(--es-gap) / 2);
			--es-gap: 8px;
			--es-2gap: calc(var(--es-gap) * 2);
			--es-toolbar-width: 70px;
			--es-toolbar-button-height: 76.4px;
		}
		@media (min-width: 1200px) {
			body {
				--es-toolbar-width: 100px;
				--es-toolbar-button-height: 85.6px;
			}
		}
		.visually-hidden {
			position: absolute;

			width: 1px;
			height: 1px;
			margin: -1px;
			border: 0;
			padding: 0;

			white-space: nowrap;

			-webkit-clip-path: inset(100%);
			clip-path: inset(100%);

			clip: rect(0 0 0 0);
			overflow: hidden;
		}
	</style>
</svelte:head>
