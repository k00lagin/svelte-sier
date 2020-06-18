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
export function getPopularFirstnames(substring, gender = '') {
	if (!substring) {
		return [];
	}
	let firstnames = [{"value":"Александр","gender":"male"},{"value":"Мария","gender":"female"},{"value":"Максим","gender":"male"},{"value":"Михаил","gender":"male"},{"value":"Анна","gender":"female"},{"value":"Артём","gender":"male"},{"value":"Иван","gender":"male"},{"value":"Виктория","gender":"female"},{"value":"Алиса","gender":"female"},{"value":"Анастасия","gender":"female"},{"value":"Дмитрий","gender":"male"},{"value":"Полина","gender":"female"},{"value":"Елизавета","gender":"female"},{"value":"Александра","gender":"female"},{"value":"Дарья","gender":"female"},{"value":"Варвара","gender":"female"},{"value":"София","gender":"female"},{"value":"Екатерина","gender":"female"},{"value":"Кирилл","gender":"male"},{"value":"Ксения","gender":"female"},{"value":"Андрей","gender":"male"},{"value":"Матвей","gender":"male"},{"value":"Арина","gender":"female"},{"value":"Ева","gender":"female"},{"value":"Марк","gender":"male"},{"value":"Илья","gender":"male"},{"value":"Егор","gender":"male"},{"value":"Тимофей","gender":"male"},{"value":"Вероника","gender":"female"},{"value":"Роман","gender":"male"},{"value":"Василиса","gender":"female"},{"value":"Никита","gender":"male"},{"value":"Лев","gender":"male"},{"value":"Даниил","gender":"male"},{"value":"Алексей","gender":"male"},{"value":"Владимир","gender":"male"},{"value":"Милана","gender":"female"},{"value":"Фёдор","gender":"male"},{"value":"Валерия","gender":"female"},{"value":"Ярослав","gender":"male"},{"value":"Константин","gender":"male"},{"value":"Сергей","gender":"male"},{"value":"Ульяна","gender":"female"},{"value":"Кира","gender":"female"},{"value":"Степан","gender":"male"},{"value":"Вера","gender":"female"},{"value":"Николай","gender":"male"},{"value":"Георгий","gender":"male"},{"value":"Таисия","gender":"female"},{"value":"Владислав","gender":"male"},{"value":"Арсений","gender":"male"},{"value":"Павел","gender":"male"},{"value":"Софья","gender":"female"},{"value":"Тимур","gender":"male"},{"value":"Маргарита","gender":"female"},{"value":"Мирон","gender":"male"},{"value":"Глеб","gender":"male"},{"value":"Алёна","gender":"female"},{"value":"Алина","gender":"female"},{"value":"Григорий","gender":"male"},{"value":"Давид","gender":"male"},{"value":"Мирослава","gender":"female"},{"value":"Макар","gender":"male"},{"value":"Кристина","gender":"female"},{"value":"Денис","gender":"male"},{"value":"Амина","gender":"female"},{"value":"Диана","gender":"female"},{"value":"Ольга","gender":"female"},{"value":"Семён","gender":"male"},{"value":"Юлия","gender":"female"},{"value":"Евгений","gender":"male"},{"value":"Платон","gender":"male"},{"value":"Артемий","gender":"male"},{"value":"Есения","gender":"female"},{"value":"Виктор","gender":"male"},{"value":"Амир","gender":"male"},{"value":"Леонид","gender":"male"},{"value":"Ангелина","gender":"female"},{"value":"Руслан","gender":"male"},{"value":"Богдан","gender":"male"},{"value":"Эмилия","gender":"female"},{"value":"Стефания","gender":"female"},{"value":"Татьяна","gender":"female"},{"value":"Пётр","gender":"male"},{"value":"Евгения","gender":"female"},{"value":"Майя","gender":"female"},{"value":"Яна","gender":"female"},{"value":"Сафия","gender":"female"},{"value":"Игорь","gender":"male"},{"value":"Злата","gender":"female"},{"value":"Юрий","gender":"male"},{"value":"Ника","gender":"female"},{"value":"Василий","gender":"male"},{"value":"Савелий","gender":"male"},{"value":"Антон","gender":"male"},{"value":"Ирина","gender":"female"},{"value":"Агата","gender":"female"},{"value":"Захар","gender":"male"},{"value":"Олег","gender":"male"},{"value":"Елена","gender":"female"},{"value":"Умар","gender":"male"},{"value":"Демид","gender":"male"},{"value":"Аделина","gender":"female"},{"value":"Марьям","gender":"female"},{"value":"Артур","gender":"male"},{"value":"Данила","gender":"male"},{"value":"Вячеслав","gender":"male"},{"value":"Даниэль","gender":"male"},{"value":"Адам","gender":"male"},{"value":"Елисей","gender":"male"},{"value":"Надежда","gender":"female"},{"value":"Николь","gender":"female"},{"value":"Всеволод","gender":"male"},{"value":"Дарина","gender":"female"},{"value":"Элина","gender":"female"},{"value":"Роберт","gender":"male"},{"value":"Мухаммад","gender":"male"},{"value":"Ясмина","gender":"female"},{"value":"Али","gender":"male"},{"value":"Лука","gender":"male"},{"value":"Герман","gender":"male"},{"value":"Амелия","gender":"female"},{"value":"Вадим","gender":"male"},{"value":"Филипп","gender":"male"},{"value":"Святослав","gender":"male"},{"value":"Марина","gender":"female"},{"value":"Мия","gender":"female"},{"value":"Дамир","gender":"male"},{"value":"Нина","gender":"female"},{"value":"Ярослава","gender":"female"},{"value":"Милена","gender":"female"},{"value":"Борис","gender":"male"},{"value":"Светлана","gender":"female"},{"value":"Тихон","gender":"male"},{"value":"Алия","gender":"female"},{"value":"Мирослав","gender":"male"},{"value":"Савва","gender":"male"},{"value":"Оливия","gender":"female"},{"value":"Станислав","gender":"male"},{"value":"Аиша","gender":"female"},{"value":"Артем","gender":"male"},{"value":"Фатима","gender":"female"},{"value":"Гордей","gender":"male"},{"value":"Ариана","gender":"female"},{"value":"Лидия","gender":"female"},{"value":"Родион","gender":"male"},{"value":"Любовь","gender":"female"},{"value":"Зоя","gender":"female"},{"value":"Агния","gender":"female"},{"value":"Малика","gender":"female"},{"value":"Самира","gender":"female"},{"value":"Мадина","gender":"female"},{"value":"Карина","gender":"female"},{"value":"Антонина","gender":"female"},{"value":"Эмир","gender":"male"},{"value":"Амира","gender":"female"},{"value":"Айлин","gender":"female"},{"value":"Лилия","gender":"female"},{"value":"Ян","gender":"male"},{"value":"Серафима","gender":"female"},{"value":"Олеся","gender":"female"},{"value":"Данил","gender":"male"},{"value":"Леон","gender":"male"},{"value":"Каролина","gender":"female"},{"value":"Мелания","gender":"female"},{"value":"Мира","gender":"female"},{"value":"Марьяна","gender":"female"},{"value":"Эмиль","gender":"male"},{"value":"Серафим","gender":"male"},{"value":"Марианна","gender":"female"},{"value":"Ибрагим","gender":"male"},{"value":"Марта","gender":"female"},{"value":"Аврора","gender":"female"},{"value":"Раяна","gender":"female"},{"value":"Камилла","gender":"female"},{"value":"Наталья","gender":"female"},{"value":"Владислава","gender":"female"},{"value":"Юсуф","gender":"male"},{"value":"Алихан","gender":"male"},{"value":"Мила","gender":"female"},{"value":"Сабина","gender":"female"},{"value":"Амалия","gender":"female"},{"value":"Валерий","gender":"male"},{"value":"Демьян","gender":"male"},{"value":"Марсель","gender":"male"},{"value":"Камила","gender":"female"},{"value":"Лейла","gender":"female"},{"value":"Анатолий","gender":"male"},{"value":"Алинур","gender":"male"},{"value":"Яков","gender":"male"},{"value":"Эмин","gender":"male"},{"value":"Валентина","gender":"female"},{"value":"Федор","gender":"male"},{"value":"Алисия","gender":"female"},{"value":"Арсен","gender":"male"},{"value":"Асия","gender":"female"},{"value":"Марат","gender":"male"},{"value":"Эмма","gender":"female"},{"value":"Эвелина","gender":"female"},{"value":"Евдокия","gender":"female"},{"value":"Билал","gender":"male"},{"value":"Ислам","gender":"male"},{"value":"Аглая","gender":"female"},{"value":"Теона","gender":"female"},{"value":"Евангелина","gender":"female"},{"value":"Виталий","gender":"male"},{"value":"Тигран","gender":"male"},{"value":"Пелагея","gender":"female"},{"value":"Имран","gender":"male"},{"value":"Муслим","gender":"male"},{"value":"Рамазан","gender":"male"},{"value":"Лея","gender":"female"},{"value":"Мелисса","gender":"female"},{"value":"Тамара","gender":"female"},{"value":"Эрик","gender":"male"},{"value":"Самир","gender":"male"},{"value":"Альбина","gender":"female"},{"value":"Ильяс","gender":"male"},{"value":"Виолетта","gender":"female"},{"value":"Назар","gender":"male"},{"value":"Лада","gender":"female"},{"value":"Сумая","gender":"female"},{"value":"Медина","gender":"female"},{"value":"Алан","gender":"male"},{"value":"Анфиса","gender":"female"},{"value":"Айша","gender":"female"},{"value":"Альберт","gender":"male"},{"value":"Халид","gender":"male"},{"value":"Ахмад","gender":"male"},{"value":"Нурислам","gender":"male"},{"value":"Анжелика","gender":"female"},{"value":"рослав","gender":"male"},{"value":"Хадиджа","gender":"female"},{"value":"Мартин","gender":"male"},{"value":"Амин","gender":"male"},{"value":"Ростислав","gender":"male"},{"value":"Алеся","gender":"female"},{"value":"Аниса","gender":"female"},{"value":"Анисия","gender":"female"},{"value":"Тамерлан","gender":"male"},{"value":"Рамзан","gender":"male"},{"value":"Расул","gender":"male"},{"value":"Адель","gender":"female"},{"value":"Саид","gender":"male"},{"value":"Аслан","gender":"male"},{"value":"Камиль","gender":"male"},{"value":"Амирхан","gender":"male"},{"value":"Юлиана","gender":"female"},{"value":"Петр","gender":"male"},{"value":"Сара","gender":"female"},{"value":"Аяна","gender":"female"},{"value":"Сулейман","gender":"male"},{"value":"Альфия","gender":"female"},{"value":"Регина","gender":"female"},{"value":"Шамиль","gender":"male"},{"value":"Игнат","gender":"male"},{"value":"Моника","gender":"female"},{"value":"Аделя","gender":"female"},{"value":"Даниль","gender":"male"},{"value":"Аркадий","gender":"male"},{"value":"Лия","gender":"female"},{"value":"Дана","gender":"female"},{"value":"Алла","gender":"female"},{"value":"Рустам","gender":"male"},{"value":"Лиана","gender":"female"},{"value":"Магомед","gender":"male"},{"value":"Клим","gender":"male"},{"value":"Муслима","gender":"female"},{"value":"Людмила","gender":"female"},{"value":"Алекс","gender":"male"},{"value":"Станислава","gender":"female"},{"value":"Василина","gender":"female"},{"value":"Яромир","gender":"male"},{"value":"Микаэль","gender":"male"},{"value":"Арууке","gender":"female"},{"value":"Исмаил","gender":"male"},{"value":"Влада","gender":"female"},{"value":"Наталия","gender":"female"},{"value":"Мухаммед","gender":"male"},{"value":"Дария","gender":"female"},{"value":"Усман","gender":"male"},{"value":"Данис","gender":"male"},{"value":"Ариет","gender":"male"},{"value":"Сабрина","gender":"female"},{"value":"Абдуллах","gender":"male"},{"value":"Нелли","gender":"female"},{"value":"Хадижа","gender":"female"},{"value":"Рафаэль","gender":"male"},{"value":"Стефан","gender":"male"},{"value":"Алим","gender":"male"},{"value":"Карим","gender":"male"},{"value":"Абдулла","gender":"male"},{"value":"Абубакр","gender":"male"},{"value":"Алсу","gender":"female"},{"value":"Мустафа","gender":"male"},{"value":"Милослава","gender":"female"},{"value":"Добрыня","gender":"male"},{"value":"Мариам","gender":"female"},{"value":"Данияр","gender":"male"},{"value":"Мурад","gender":"male"},{"value":"Адриан","gender":"male"},{"value":"Аким","gender":"male"},{"value":"Иса","gender":"male"},{"value":"Тея","gender":"female"},{"value":"Зарина","gender":"female"},{"value":"Максимилиан","gender":"male"},{"value":"Айдар","gender":"male"},{"value":"Эльдар","gender":"male"},{"value":"Теодор","gender":"male"},{"value":"Виталина","gender":"female"},{"value":"Сумайя","gender":"female"},{"value":"Дина","gender":"female"},{"value":"Жасмин","gender":"female"},{"value":"Афина","gender":"female"},{"value":"Изабелла","gender":"female"},{"value":"Арианна","gender":"female"},{"value":"Ратмир","gender":"male"},{"value":"Ефим","gender":"male"},{"value":"Даниэла","gender":"female"},{"value":"Луиза","gender":"female"},{"value":"Марфа","gender":"female"},{"value":"Арслан","gender":"male"},{"value":"Даян","gender":"male"},{"value":"Жасмина","gender":"female"},{"value":"Саида","gender":"female"},{"value":"Ани","gender":"female"},{"value":"Мансур","gender":"male"},{"value":"Даниял","gender":"male"},{"value":"Катерина","gender":"female"},{"value":"Сафина","gender":"female"},{"value":"Эдуард","gender":"male"},{"value":"Оскар","gender":"male"},{"value":"Феликс","gender":"male"},{"value":"Аарон","gender":"male"},{"value":"Снежана","gender":"female"},{"value":"Элиза","gender":"female"},{"value":"Адриана","gender":"female"},{"value":"Аруузат","gender":"female"},{"value":"Мишель","gender":"female"},{"value":"Миа","gender":"female"},{"value":"Айбийке","gender":"female"},{"value":"Архип","gender":"male"},{"value":"Рамиль","gender":"male"},{"value":"Булат","gender":"male"},{"value":"Геннадий","gender":"male"},{"value":"Хамза","gender":"male"},{"value":"Армен","gender":"male"},{"value":"Ясмин","gender":"female"},{"value":"Лина","gender":"female"},{"value":"Зайнаб","gender":"female"},{"value":"Ася","gender":"female"},{"value":"Мариям","gender":"female"},{"value":"Салима","gender":"female"},{"value":"Салиха","gender":"female"},{"value":"Соня","gender":"female"},{"value":"Ясина","gender":"female"},{"value":"Ахмед","gender":"male"},{"value":"Прохор","gender":"male"},{"value":"Идрис","gender":"male"},{"value":"Гавриил","gender":"male"},{"value":"Кузьма","gender":"male"},{"value":"Осман","gender":"male"},{"value":"Эмирхан","gender":"male"},{"value":"Аида","gender":"female"},{"value":"Глафира","gender":"female"},{"value":"Элеонора","gender":"female"},{"value":"Галина","gender":"female"},{"value":"Аксинья","gender":"female"},{"value":"Белла","gender":"female"},{"value":"Рада","gender":"female"},{"value":"Доминика","gender":"female"},{"value":"Микаил","gender":"male"}];
	let prompts = [];
	let counter = 0;
	prompts = firstnames.filter(firstname => {
		if (counter <= 10) {
			if ((gender === '' || firstname.gender === gender) && firstname.value.indexOf(substring) === 0) {
				counter += 1;
				return true;
			}
		}
		return false;
	});
	console.table(prompts);
	return prompts;
}
