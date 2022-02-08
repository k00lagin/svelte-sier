export function toCyrillic(str) {
	let regexp = str.match(/[а-яА-ЯёЁ\s\d\-]+/);
	if (regexp && regexp[0] === str) {
		return str;
	}
	let replacer = {
		'q': 'й',
		'w': 'ц',
		'e': 'у',
		'r': 'к',
		't': 'е',
		'y': 'н',
		'u': 'г',
		'i': 'ш',
		'o': 'щ',
		'p': 'з',
		'[': 'х',
		']': 'ъ',
		'a': 'ф',
		's': 'ы',
		'd': 'в',
		'f': 'а',
		'g': 'п',
		'h': 'р',
		'j': 'о',
		'k': 'л',
		'l': 'д',
		';': 'ж',
		'\'': 'э',
		'z': 'я',
		'x': 'ч',
		'c': 'с',
		'v': 'м',
		'b': 'и',
		'n': 'т',
		'm': 'ь',
		',': 'б',
		'.': 'ю',
		'/': '.',
		'Q': 'Й',
		'W': 'Ц',
		'E': 'У',
		'R': 'К',
		'T': 'Е',
		'Y': 'Н',
		'U': 'Г',
		'I': 'Ш',
		'O': 'Щ',
		'P': 'З',
		'{': 'Х',
		'}': 'Ъ',
		'A': 'Ф',
		'S': 'Ы',
		'D': 'В',
		'F': 'А',
		'G': 'П',
		'H': 'Р',
		'J': 'О',
		'K': 'Л',
		'L': 'Д',
		':': 'Ж',
		'"': 'Э',
		'Z': 'Я',
		'X': 'Ч',
		'C': 'С',
		'V': 'М',
		'B': 'И',
		'N': 'Т',
		'M': 'Ь',
		'<': 'Б',
		'>': 'Ю',
		'?': '.',
		'`': 'ё',
		'~': 'Ё'
	}
	for (let index = 0; index < str.length; index++) {
		if (replacer[str[index]]) {
			str = str.split(str[index]).join(replacer[str[index]]);
		}
	}
	return str;
}

export function toTitleCase(str) {
	if (str) {
		return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
	}
	return '';
}
