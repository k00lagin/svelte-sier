<p class="time">{(new Date).toLocaleString()}</p>

<style global>
	.time {
		position: absolute;
		display: block;
		top: 0;
		left: 0;
		padding: 8px;
		width: 600px;
	}
	@media print {
		:global(button.trigger),
		:global(app-root),
		:global(.dialog-title),
		:global(.back-trigger) {
			display: none !important;
		}
		:global(dialog[open]) {
			background-color: white;
			position: fixed;
			left: 0 !important;
			top: 0;
			z-index: 9999;
			height: fit-content !important;
			max-width: unset !important;
			width: 100vw !important;
			overflow: visible;
		}

		:global(dialog[open] .anket-main) {
			flex-wrap: wrap !important;
			height: fit-content !important;
			overflow: visible !important;
		}

		:global(dialog[open] form) {
			counter-reset: question;
			width: 100% !important;
			display: flex;
			flex-flow: row wrap;
		}
		:global(dialog[open] .service-list) {
			width: 100%;
			min-height: fit-content !important;
			padding: 0 !important;
		}
		:global(dialog[open] .service-list::before) {
			content: "Исходя из информации, указанной заявителем в анкете на момент опроса, сформирован следующий перечень доступных услуг:";
			display: block;
			font-weight: 700;
			margin-top: 12px;
			margin-bottom: 4px;
		}
		:global(dialog[open] .dialog__header-button),
		:global(dialog[open] .service-info) {
			display: none;
		}
		:global(dialog[open] a::after) {
			content: "" !important;
		}
		:global(dialog[open] .question) {
			width: 100%;
		}
		:global(dialog[open] .question-title) {
			margin: 0;
			font-size: 13px;
			font-weight: 700;
			display: inline-block;
		}
		:global(dialog[open] .question-title::before) {
			counter-increment: question;
			content: counter(question) ") ";
		}
		:global(dialog[open] .question-title::after) {
			content: ': ';
		}
		:global(dialog[open] .answers),
		:global(dialog[open] .answer) {
			display: contents;
		}
		:global(dialog[open] .answers::before) {
			content: '(';
		}
		:global(dialog[open] .answers::after) {
			content: ')';
		}
		:global(dialog[open] .answer:has( input:checked)::before) {
			content: '✓';
		}
		:global(dialog[open] .answer:not(:last-child)::after) {
			content: '|';
		}
		:global(dialog[open] .answer:has( input:checked) > label) {
			font-weight: 700;
		}
		:global(dialog[open] .answer:not(:has( input:checked)) > label) {
			color: grey;
		}
		:global(dialog[open] .answer label) {
			padding: 0 !important;
			margin: 0 !important;
		}
		:global(dialog[open] .answer label::before),
		:global(dialog[open] .answer label::after) {
			display: none;
		}
		:global(dialog[open] .service-list-item) {
			display: contents;
		}
		:global(dialog[open] .service-list-item a) {
			display: block;
		}
		:global(dialog[open] .service-list-item .service-info-wrap) {
			display: none;
		}
		:global(dialog[open]) {
			counter-reset: service;
		}
		:global(dialog[open] .service-list-item > a::before) {
			counter-increment: service;
			content: counter(service) ") ";
		}
		:global(dialog[open] details:not([open])) {
			display: none;
		}
		:global(dialog[open] details[open]) {
			padding-left: 16px;
			border-left: 1px dashed;
			margin: 4px 0 8px 16px;
		}
	}
</style>
