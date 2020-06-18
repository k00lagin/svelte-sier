export async function fetchData(options) {
	return new Promise((resolve, reject) => {
		let baseUrl = 'http://172.153.153.48/';
		let url = baseUrl + options.url;
		let body = { body: options.body } || {};
		fetch(url, options.selfContained || {
			method: options.method || 'POST',
			headers: options.headers || {
				Accept: 'application/hal+json',
				Authorization: 'Bearer ' + localStorage.accessToken,
				'Content-Type': 'application/json'
			},
			...body
		}).then(response => response.json()).then(result => {
				if (result.errorMessage === 'KPP:Token expire') {
					refreshCredentials().then(() => {
						fetchData(options).then(data => resolve(data));
					});
				}
				else if (result.errorMessage) {
					reject(new Error(result.errorMessage));
				}
				else {
					resolve(result)
				}
			}), error => {
			reject(new Error(error));
		}
	})
}

function refreshCredentials() {
	return new Promise((resolve, reject) => {
		fetchData({
			url: 'refresh' + '?refreshToken=' + localStorage.refreshToken,
			headers: {
				'Accept': 'application/hal+json',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).then(result => {
			if (result && result.accessToken && result.refreshToken) {
				localStorage.setItem('accessToken', result.accessToken);
				localStorage.setItem('refreshToken', result.refreshToken);
				resolve();
			}
		}), error => {
			reject(new Error(error));
		};
	});
}

export function getPopularSurnames(substring) {
	if (!substring) {
		return [];
	}
	substring = substring[0].toUpperCase() + substring.substr(1).toLowerCase();
	let surnames = ['Иванов','Смирнов','Кузнецов','Попов','Васильев','Петров','Соколов','Михайлов','Новиков','Фёдоров','Морозов','Волков','Алексеев','Лебедев','Семёнов','Егоров','Павлов','Козлов','Степанов','Николаев','Орлов','Андреев','Макаров','Никитин','Захаров','Зайцев','Соловьёв','Борисов','Яковлев','Григорьев','Романов','Воробьёв','Сергеев','Кузьмин','Фролов','Александров','Дмитриев','Королёв','Гусев','Киселёв','Ильин','Максимов','Поляков','Сорокин','Виноградов','Ковалёв','Белов','Медведев','Антонов','Тарасов','Жуков','Баранов','Филиппов','Комаров','Давыдов','Беляев','Герасимов','Богданов','Осипов','Сидоров','Матвеев','Титов','Марков','Миронов','Крылов','Куликов','Карпов','Власов','Мельников','Денисов','Гаврилов','Тихонов','Казаков','Афанасьев','Данилов','Савельев','Тимофеев','Фомин','Чернов','Абрамов','Мартынов','Ефимов','Федотов','Щербаков','Назаров','Калинин','Исаев','Чернышёв','Быков','Маслов','Родионов','Коновалов','Лазарев','Воронин','Климов','Филатов','Пономарёв','Голубев','Кудрявцев','Прохоров','Наумов','Потапов','Журавлёв','Овчинников','Трофимов','Леонов','Соболев','Ермаков','Колесников','Гончаров','Емельянов','Никифоров','Грачёв','Котов','Гришин','Ефремов','Архипов','Громов','Кириллов','Малышев','Панов','Моисеев','Румянцев','Акимов','Кондратьев','Бирюков','Горбунов','Анисимов','Ерёмин','Тихомиров','Галкин','Лукьянов','Михеев','Скворцов','Юдин','Белоусов','Нестеров','Симонов','Прокофьев','Харитонов','Князев','Цветков','Левин','Митрофанов','Воронов','Аксёнов','Софронов','Мальцев','Логинов','Горшков','Савин','Краснов','Майоров','Демидов','Елисеев','Рыбаков','Сафонов','Плотников','Демин','Фадеев','Молчанов','Игнатов','Литвинов','Ершов','Ушаков','Дементьев','Рябов','Мухин','Калашников','Леонтьев','Лобанов','Кузин','Корнеев','Евдокимов','Бородин','Платонов','Некрасов','Балашов','Бобров','Жданов','Блинов','Игнатьев','Коротков','Муравьёв','Крюков','Беляков','Богомолов','Дроздов','Лавров','Зуев','Петухов','Ларин','Никулин','Серов','Терентьев','Зотов','Устинов','Фокин','Самойлов','Константинов','Сахаров','Шишкин','Самсонов','Черкасов','Чистяков','Носов','Спиридонов','Карасёв','Авдеев','Воронцов','Зверев','Владимиров','Селезнёв','Нечаев','Кудряшов','Седов','Фирсов','Андрианов','Панин','Головин','Терехов','Ульянов','Шестаков','Агеев','Никонов','Селиванов','Баженов','Гордеев','Кожевников','Пахомов','Зимин','Костин','Широков','Филимонов','Ларионов','Овсянников','Сазонов','Суворов','Нефёдов','Корнилов','Любимов','Львов','Горбачёв','Копылов','Лукин','Токарев','Кулешов','Шилов','Большаков','Панкратов','Родин','Шаповалов','Покровский','Бочаров','Никольский','Маркин','Горелов','Агафонов','Берёзин','Ермолаев','Зубков','Куприянов','Трифонов','Масленников','Круглов','Третьяков','Колосов','Рожков','Артамонов','Шмелёв','Лаптев','Лапшин','Федосеев','Зиновьев','Зорин','Уткин','Столяров','Зубов','Ткачёв','Дорофеев','Антипов','Завьялов','Свиридов','Золотарёв','Кулаков','Мещеряков','Макеев','Дьяконов','Гуляев','Петровский','Бондарёв','Поздняков','Панфилов','Кочетков','Суханов','Рыжов','Старостин','Калмыков','Колесов','Золотов','Кравцов','Субботин','Шубин','Щукин','Лосев','Винокуров','Лапин','Парфёнов','Исаков','Голованов','Коровин','Розанов','Артёмов','Козырев','Русаков','Алёшин','Крючков','Булгаков','Кошелёв','Сычёв','Синицын','Черных','Рогов','Кононов','Лаврентьев','Евсеев','Пименов','Пантелеев','Горячёв','Аникин','Лопатин','Рудаков','Одинцов','Серебряков','Панков','Дегтярёв','Орехов','Царёв','Шувалов','Кондрашов','Горюнов','Дубровин','Голиков','Курочкин','Латышёв','Севастьянов','Вавилов','Ерофеев','Сальников','Клюев','Носков','Озеров','Кольцов','Комиссаров','Меркулов','Киреев','Хомяков','Булатов','Ананьев','Буров','Шапошников','Дружинин','Островский','Шевелев','Долгов','Суслов','Шевцов','Пастухов','Рубцов','Бычков','Глебов','Ильинский','Успенский','Дьяков','Кочетов','Вишневский','Высоцкий','Глухов','Дубов','Бессонов','Ситников','Астафьев','Мешков','Шаров','Яшин','Козловский','Туманов','Басов','Корчагин','Болдырев','Олейников','Чумаков','Фомичёв','Губанов','Дубинин','Шульгин','Касаткин','Пирогов','Сёмин','Трошин','Горохов','Стариков','Щеглов','Фетисов','Колпаков','Чесноков','Зыков','Верещагин','Минаев','Руднев','Троицкий','Окулов','Ширяев','Малинин','Черепанов','Измайлов','Алёхин','Зеленин','Касьянов','Пугачёв','Павловский','Чижов','Кондратов','Воронков','Капустин','Сотников','Демьянов','Косарев','Беликов','Сухарев','Белкин','Беспалов','Кулагин','Савицкий','Жаров','Хромов','Еремеев','Карташов','Астахов','Русанов','Сухов','Вешняков','Волошин','Козин','Худяков','Жилин','Малахов','Сизов','Ежов','Толкачёв','Анохин','Вдовин','Бабушкин','Усов','Лыков','Горлов','Коршунов','Маркелов','Постников','Чёрный','Дорохов','Свешников','Гущин','Калугин','Блохин','Сурков','Кочергин','Греков','Казанцев','Швецов','Ермилов','Парамонов','Агапов','Минин','Корнев','Черняев','Гуров','Ермолов','Сомов','Добрынин','Барсуков','Глушков','Чеботарёв','Москвин','Уваров','Безруков','Муратов','Раков','Снегирёв','Гладков','Злобин','Моргунов','Поликарпов','Рябинин','Судаков','Кукушкин','Калачёв','Грибов','Елизаров','Звягинцев','Корольков','Федосов'];
	return surnames.reduce((filteredList, surname) => {
		if (filteredList.length < 10 && surname.indexOf(substring) === 0) {
			let names = [];
			names.push({value: surname});
			if (surname.includes('ё')) {
				names.push({value: surname.replace('ё','е')});
			}
			names.map(name => {
				switch (name.value.substring(name.value.length - 2)) {
					case 'ов':
					case 'ев':
					case 'ёв':
					case 'ин':
					case 'ын':
						name.gender = 'male';
						names.push({value: name.value + 'а', gender: 'female'});
						break;
					case 'ий':
					case 'ый':
						name.gender = 'male'
						names.push({value: name.value.substring(0, name.value.length - 2) + 'ая', gender: 'female'});
				}
			});
			return [...filteredList, ...names];
		}
		else {
			return filteredList;
		}
	}, []);
}

export async function getPopularFirstNames(substring, gender = '') {
	return new Promise((resolve, reject) => {
		if (substring.length > 4) {
			substring = substring.substr(0, 4);
		}
		if (gender) {
			gender = `.${gender}`;
		}
		fetch(`https://k00lagin.github.io/static-api/name/${substring}${gender}.json`).then(response => response.json()).then(result => {
			resolve(result.names)
		});
	});
}
