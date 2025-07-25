import { writable } from 'svelte/store';

export function persistent(key, initialValue) {
	const store = writable(initialValue)
	const { subscribe, set } = store
	const json = GM_getValue(key)

	if (json) {
		set(JSON.parse(json))
	}

	return {
		set(value) {
			GM_setValue(key, JSON.stringify(value))
			set(value)
		},
		update(cb) {
			const value = cb(get(store))
			this.set(value)
		},
		subscribe
	}
}

export const lifeEvents = persistent('enhanced-sier_life-events', []);
export const standarts = persistent('enhanced-sier_standarts', {});

export const currentAnket = persistent('enhanced-sier_current-anket', '');
export const anketAnswers = persistent('enhanced-sier_anket-answers', {});
export const activeQuestions = persistent('enhanced-sier_active-questions', []);
