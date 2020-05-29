import { writable } from 'svelte/store';

export function persistent(key, initialValue) {
	const store = writable(initialValue)
	const {subscribe, set} = store
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

export const aliases = persistent('enhanced-sier_aliases', {});
export const faves = persistent('enhanced-sier_favorite-services', []);
