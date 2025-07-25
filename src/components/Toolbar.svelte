<script>
import QuestionnaireButton from './Questionnaire-Button.svelte';

let show = false;

</script>

<ul class="toolbar enhanced-sier-toolbar">
	<QuestionnaireButton />
</ul>

<style>
.toolbar {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 32px;
	background-color: transparent;
	padding: 0;
	z-index: 100;
	pointer-events: none;
}
.toolbar :global(*) {
	pointer-events: all;
}
</style>
