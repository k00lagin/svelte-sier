<script>
	import { fetchData, getStandart, updateServiceInfo } from "../sier.js";
	import { onMount } from "svelte/internal";
	import { lifeEvents, currentAnket, anketAnswers, activeQuestions } from "../stores.js";
	import FormElement from "./FormElement.svelte";
	import Anket from "./Anket.svelte";
	import qs from "qs"
	import { Set } from 'json-set-map'
  import Print from "./Print.svelte";

	async function loadLifeEventsAnkets() {
		let lifeEventsAnkets = await fetchData({
			url: 'api/v1/search/catalogueLifeEventsAnkets',
			body: JSON.stringify({
				size: 200
			})
		})
		lifeEventsAnkets = lifeEventsAnkets.content.filter(anket => {
			if (anket.lifeEvent.title.startsWith("_")) return true;
			let question = anket.anketaBlock.question[0] || anket.anketaBlock.question;
			if (question.title.startsWith('_')) return true;
			return false;
		}).map(anket => {
			return {
				title: anket.lifeEvent.title.split('?')[0],
				questions: anket.anketaBlock.question?.answers && anket.anketaBlock.question.answers.map(question => {
					return {
						title: question.question.title.split('?')[0],
						params: Object.fromEntries(new URLSearchParams(question.title.split('?')[1])),
						answers: question.question.answers.map(answer => {
							return {
								title: String(answer.title).startsWith('~') ? answer.title.substring(1) : answer.title,
								positiveServices: answer.positiveServices,
								irrelevant: String(answer.title).startsWith('~')
							}
						})
					}
				}).sort((q1, q2) => q1?.params?.order - q2?.params?.order),
				services: Object.fromEntries(qs.parse(anket.lifeEvent.title.split('?')[1]).services.split(',').map(id => {
					return [id, {}]
				}))
			}
		})
		for (let anket of lifeEventsAnkets) {
			if (anket.questions) {
				for (let question of anket.questions) {
					for (let answer of question.answers) {
						if (answer.positiveServices)
						for (let id of answer.positiveServices) {
							getStandart(id, JSON.parse(localStorage.currentOrganization)._id);
							if (anket.services[id].options === undefined) anket.services[id].options = {};
							if (anket.services[id].options[question.title] === undefined) anket.services[id].options[question.title] = new Set();
							anket.services[id].options[question.title].add(answer.title);
						}
					}
				}
			}
		}
		$lifeEvents = lifeEventsAnkets;
	}
	onMount(async () => {
		await loadLifeEventsAnkets();
		updateServiceInfo();
	})
	let show = false;
	let print = false;
</script>

<button class="trigger" on:click={() => (show = !show)}>ЖС</button>
{#if show}
	<dialog open={show}>
		<header class="dialog-header">
			<h2 class="dialog-title">Жизненные ситуации</h2>
			{#if $currentAnket !== '' && $activeQuestions.length > 0}
			<button class="dialog__clear-trigger dialog__header-button" title="Очистить анкету" on:click={()=>{
				currentAnket.set('');
				anketAnswers.set({});
				activeQuestions.set([]);
			}}>
				<svg style="width:16px;height:16px" viewBox="0 0 24 24">
					<path fill="currentColor" d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
				</svg>
			</button>
			{/if}
			<button class="dialog__header-button" title="Распечатать анкету" on:click={() => {
				print = true;
				setTimeout(() => {
					window.print();
				}, 500);
				setTimeout(() => {
					print = false;
				}, 1000);
			}}>
				<svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" /></svg>
			</button>
			<button
				class="dialog__close-trigger dialog__header-button icon-cross"
				on:click={() => (show = !show)}
			/>
		</header>
		{#if $lifeEvents}
			{#if $currentAnket === ''}
			<main class="life-events-main">
				<ul class="life-events">
					{#each $lifeEvents as anket, anketIndex}
						<li class="life-event">
							<button
								class="life-event__button"
								on:click={() => {
									currentAnket.set(anketIndex);
								}}>{anket.title.split("?")[0]}</button
							>
						</li>
					{/each}
				</ul>
			</main>
			{:else}
				<Anket
					anket={$lifeEvents[$currentAnket]}
					on:back={() => {
						currentAnket.set('');
						anketAnswers.set({});
						activeQuestions.set([]);
					}}
				/>
			{/if}
		{/if}
	</dialog>
{/if}

{#if print }
	<Print />
{/if}

<style>
	.trigger {
		background-color: rgba(38, 50, 56, 0.2);
		border: 0;
		position: absolute;
		top: calc(46px + var(--es-toolbar-button-height) * 2 - 32px);
		z-index: 100;
		color: white;
		height: 32px;
		width: 32px;
	}
	dialog[open] {
		width: 1000px;
		max-width: calc(96vw - var(--es-toolbar-width));
		height: 100vh;
		background-color: white;
		z-index: 100;
		position: absolute;
		left: var(--es-toolbar-width);
		top: 0;
		margin: 0;
		border: 0;
		box-shadow: 5px 0 5px -1px rgba(0, 0, 0, 0.2),
			0 5px 5px -1px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-flow: column nowrap;
		overflow: hidden;
	}
	.dialog-header {
		display: flex;
		margin-bottom: var(--es-gap);
		font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-size: 19px;
		font-weight: 500;
	}
	.dialog-title {
		flex-grow: 1;
		margin-left: var(--es-2gap);
	}
	.dialog__header-button,
	.dialog__clear-trigger,
	.dialog__close-trigger {
		margin-left: var(--es-gap);
		margin-right: var(--es-2gap);
		background-color: transparent;
		border: 0;
	}
	.life-events-main {
		overflow: hidden;
	}
	.life-events {
		list-style: none;
		display: flex;
		flex-flow: row wrap;
		overflow-x: hidden;
		height: 100%;
		width: 100%;
	}
	.life-event {
		margin-bottom: 16px;
	}
	.life-event__button {
		width: 200px;
		min-height: 48px;
		margin-right: 8px;
		background-color: hsl(200, 50%, 80%);
		border: 0;
		border-radius: 4px;
	}
	.life-event__button:hover {
		background-color: hsl(200, 50%, 70%);
	}
</style>
