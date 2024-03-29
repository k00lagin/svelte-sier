# Скрипт для улучшения пользовательского опыта в работе с автоматизированной информационной системой исполнения электронных регламентов (АИС СИЭР)

Скрипт разрабатывается для упрощения работы документоведов, минимизации лишних действий, и всякого такого...

## Возможности

### Быстрый поиск услуг

* Нет необходимости ждать подгрузок услуг при прокрутке списка или поиске
* Можно присваивать услугам псевдонимы; вести по ним поиск
* Можно добавлять услуги в избранное; они отображаются вверху списка
* При поиске совпадения псевдонимов/кодов/названий услуг подсвечиваются, аналогично функции «поиска на странице» в браузерах
* Можно найти нужную услугу и начать дело не отрывая руки от клавиатуры: используя навигацию по списку Tab/Shift+Tab, и комбинации клавиш Ctrl+[1-9,0]
* Для упрощения администрирования настройки псевдонимов/избранного доступны в меню настроек в виде текста. Можно скопировать их и перенести на другой ПК.

### Упрощение ввода данных заявителя

* Моментальные подсказки распространённых фамилий без обращений к сети
* Подсказки имён из списка недавних заявителей, *распространённые имена будут добавлены позже*
* Список заявителей подгружается автоматически по мере ввода фамилии/имени/отчества
* Поиск идёт по точному соответствию ФИО, что ускоряет ответ сервера
* Заявители сортируются по времени последнего обращения (те кто были недавно отображаются выше тех кто был раньше, а те кого принимал конкретный специалист — имеют приоритет над остальными), благодяря чему выше вероятность найти нужного человека не вводя ФИО полностью

## Установка

* Установить в браузер дополнение Tampermonkey ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/), [Edge](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd))
* Открыть «Панель управления» (Dashboard) Tampermonkey
* Открыть вкладку Утилиты (Utilities)
* Вставить ссылку https://github.com/k00lagin/svelte-sier/releases/latest/download/svelte-sier.js в поле «Установка через URL» (Install from URL)
* Нажать «Установить» (Install)
