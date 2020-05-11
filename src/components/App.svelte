<svelte:head>
<style>
body {
	--es-05gap: calc(var(--es-gap) / 2);
	--es-gap: 8px;
	--es-2gap: calc(var(--es-gap) * 2);
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
