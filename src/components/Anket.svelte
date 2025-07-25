<script>
	import { getStandart } from "../sier.js";
	import { anketAnswers, activeQuestions } from "../stores";
	export let anket,
		filteredServices = [];
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function intersection(sets) {
		return sets.reduce(
			(prev, current) => new Set([...prev].filter((x) => current.has(x)))
		);
	}

	let form;
	if (anket.questions) {
		for (let question of anket.questions) {
			if ($anketAnswers[question.title] === undefined) {
				$anketAnswers[question.title] = [];
			}
		}
	}
	function handleAnswerChange(e) {
		let input = e.currentTarget;
		let question = input.name;
		if (input.checked) {
			activeQuestions.set([...new Set([...$activeQuestions, question])]);
		} else {
			if (
				form.querySelectorAll(`input[name="${question}"]:checked`).length === 0
			) {
				activeQuestions.set($activeQuestions.filter((q) => q !== question));
			}
		}
		filteredServices = filterServices();
	}
	function filterServices() {
		return Object.keys(anket.services).filter((id) => {
			let service = anket.services[id];
			if (anket.title === "Семья с детьми" && (id === '727134' || id === '70115') &&
				$anketAnswers['На какого по счёту ребёнка оказывается услуга'].some(answer => answer === 'Первый') &&	$anketAnswers['На какого по счёту ребёнка оказывается услуга'].length === 1 &&
				$anketAnswers['Возраст ребенка'].some(answer => (answer === 'От 3 до 17 лет' || answer === 'От 17 до 18 лет' || answer === 'От 18 до 23 лет обучающийся по очной форме'))) {
				return false;
			}
			if (anket.title === "Инвалидность" && (id === '723672' || id === '65932' || id === '66013' || id === '723202') &&
				$anketAnswers['Категория заявителя'].some(answer => answer === 'Член семьи погибшего (умершего) инвалида') &&
				(
					// $anketAnswers['Группа инвалидности'].some(answer => (answer === 'Ребенок-инвалид')) ||
					$anketAnswers['Инвалидность связана с военной службой'].some(answer => (answer === 'нет'))
					//  ||	$anketAnswers['Инвалидность связана с радиацией'].some(answer => (answer === 'нет' || answer === 'да'))
				)) {
				return false;
			}
			if (service.options === undefined) return true;
			let activeOptions = Object.keys(service.options).filter((option) =>
				$activeQuestions.some((q) => q === option)
			);
			if (
				activeOptions.every((option) => {
					if (
						[
							...intersection([
								new Set($anketAnswers[option]),
								new Set(service.options[option]),
							]),
						].length > 0
					) {
						return true;
					} else {
						return false;
					}
				})
			) {
				return true;
			} else {
				return false;
			}
		});
	}
	filteredServices = filterServices();
</script>

<header>
	<button type="button" class="back-trigger" on:click={() => dispatch("back")}>
		<svg style="width:24px;height:24px" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
			/>
		</svg>
	</button>
	<h3 data-anket={JSON.stringify(anket)}>{anket.title}</h3>
</header>

<div class="anket-main">
	{#if anket.questions}
		<form bind:this={form}>
			{#each anket.questions as question}
				<article class="question">
					<h4 class="question-title">{question.title}</h4>
					<ul class="answers">
						{#each question.answers as answer}
							<li class="answer">
								<input
									class="visually-hidden"
									name={question.title}
									bind:group={$anketAnswers[question.title]}
									id="{question.title}-{answer.title}"
									type="checkbox"
									value={answer.title}
									data-positive-services={JSON.stringify(
										answer.positiveServices
									)}
									data-negative-services={JSON.stringify(
										answer.negativeServices
									)}
									on:change={handleAnswerChange}
								/>
								<label for="{question.title}-{answer.title}"
									>{answer.title}</label
								>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</form>
	{/if}

	<ul class="service-list">
		{#each filteredServices as id}
			{#await getStandart(id, JSON.parse(localStorage.currentOrganization)._id)}
				<li class="service-list-item"><span>Загрузка... {id}</span></li>
			{:then service}
				<li class="service-list-item qwe" data-desc={service.description}>
					<a
						href="http://sier-mfc.gov74.ru/ais/appeals/create/{service.id}"
						title={service.title}>{service.shortTitle}</a
					>
					{#if service.description}
						<div class="service-info-wrap">
							<button
								class="service-info"
								on:click={() => {
									document
										.querySelector(`#info-${service.id} > summary`)
										.click();
								}}>
									<svg viewBox="0 0 24 24"><path d="M13 9H11V7H13V9M14 15V17H10V15H11V13H10V11H13V15H14Z" /></svg>
								</button
							>
						</div>
					{/if}
				</li>
				{#if service.description}
					<details id="info-{service.id}">
						<summary />
						{@html service.description
							.split("&lt;")
							.join("<")
							.split("&gt;")
							.join(">")}
					</details>
				{/if}
			{/await}
		{/each}
	</ul>
</div>

<style>
	header {
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		height: 48px;
	}
	.anket-main {
		display: flex;
		flex-flow: row nowrap;
		overflow: hidden;
	}
	form {
		width: 250px;
		flex-shrink: 0;
		overflow-y: auto;
	}
	.question-title {
		position: relative;
	}
	.service-list {
		list-style: none;
		padding: 2px 6px;
		list-style: none;
		overflow: hidden auto;
		width: fit-content;
	}
	.service-list-item {
		margin-bottom: 8px;
		position: relative;
	}

	.service-info-wrap {
		position: relative;
		width: 24px;
		height: 8px;
		display: inline-block;
	}

	.service-info {
		width: 24px;
		height: 24px;
		position: absolute;
		top: -8px;
		left: 0;
		border: 0;
		background-color: rgba(0 0 0 / 5%);
		border-radius: 8px;
		padding: 0;
	}
	.service-info:hover {
		background-color: rgba(0 0 0 / 10%);
	}

	.back-trigger {
		padding: 0;
		border: 0;
		background-color: transparent;
		display: inline-block;
		width: 24px;
		height: 24px;
		margin-right: 8px;
		border-radius: 4px;
	}
	.back-trigger:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	h3 {
		display: inline-block;
		margin: 0;
	}
	.answers {
		list-style: none;
		padding: 0;
	}
	.answer {
		position: relative;
	}
	input[type="checkbox"] + label {
		padding-left: 24px;
		user-select: none;
	}
	input[type="checkbox"] + label:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 18px;
		height: 18px;
		border-radius: 3px;
		border: 2px solid #607d8b;
	}
	input[type="checkbox"] + label:after {
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
