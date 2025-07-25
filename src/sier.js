import { standarts } from "./stores";
let $standarts;
standarts.subscribe((value) => {
	$standarts = value;
});

export async function fetchData(options) {
	return new Promise((resolve, reject) => {
		let baseUrl = 'http://sier-mfc.gov74.ru/';
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

async function fetchRichServiceInfo(standardId, unitId) {
	let rawStandart = await fetchData({
		url: "api/v1/search/subservices",
		body: JSON.stringify({
			search: {
				search: [
					{
						field: "units.id",
						operator: "eq",
						value: unitId,
					},
					{
						field: "standardCode",
						operator: "eq",
						value: standardId,
					},
				],
			},
				page: 0,
				size: 10,
				sort: "serviceCode,DESC",
			}),
		});
		rawStandart = rawStandart.content[0]
		return {
			id: rawStandart._id,
			unitId: rawStandart.unitId,
			sid: rawStandart.shortServiceId,
			title: rawStandart.titles.branch[0].title,
			shortTitle: rawStandart.titles.branch[0].shortTitle,
			description: rawStandart.titles.branch[0].description,
			standardCode: rawStandart.standardCode
		}
}

export async function getStandart(standardId, unitId) {
	if (!$standarts[standardId] || !$standarts[standardId].servicesByUnitId[unitId]) {
		let newStandarts = $standarts
		let serviceInfo = await fetchRichServiceInfo(standardId, unitId)
		if (!$standarts[standardId]) {
			newStandarts[standardId] = {
				title: serviceInfo.title,
				shortTitle: serviceInfo.shortTitle,
				description: serviceInfo.description,
				standardCode: serviceInfo.standardCode,
				servicesByUnitId: {}
			}
		}
		if (!$standarts[standardId].servicesByUnitId[unitId]) {
			newStandarts[standardId].servicesByUnitId[unitId] = {
				id: serviceInfo.id,
				sid: serviceInfo.sid
			}
		}
		standarts.set(newStandarts);
		return getStandart(standardId, unitId)
	}
	else {
		let standart = {
			id: $standarts[standardId].servicesByUnitId[unitId].id,
			sid: $standarts[standardId].servicesByUnitId[unitId].sid,
			title: $standarts[standardId].title,
			shortTitle: $standarts[standardId].shortTitle,
			description: $standarts[standardId].description,
			standardCode: $standarts[standardId].standardCode
		}
		return standart
	}
}

async function fetchServiceInfo() {
	let services = {}, rawServices;
	let page = 0, totalPages;
	while (totalPages === undefined || page < totalPages) {
		rawServices = await fetchData({
		url: "api/v1/search/subservices",
		body: JSON.stringify({
			search: {
				search: [
					{
						field: "units.id",
						operator: "eq",
						value: JSON.parse(localStorage.currentOrganization)._id,
					},
				],
			},
				page: page,
				size: 200,
				sort: "serviceCode,DESC",
				prj: "servicesList",
			}),
		});
		totalPages = rawServices.totalPages;
		rawServices = rawServices.content;
		rawServices.forEach((rawService) => {
			let service = {
				id: rawService._id,
				sid: rawService.serviceId.split("_")[3],
				title: rawService.titles.branch[0].title,
				shortTitle: rawService.titles.branch[0].shortTitle,
				description: rawService.titles.branch[0].description,
			};
			services[service.id] = service;
		});
		page++;
	}
	return services;
}

export async function updateServiceInfo() {
	let info =  await fetchServiceInfo();
	let newStandarts = $standarts;
	let unitId = JSON.parse(localStorage.currentOrganization)._id;
	for (const standartId of Object.keys(newStandarts)) {
		let id = newStandarts[standartId]?.servicesByUnitId[unitId]?.id;
		let sid = newStandarts[standartId]?.servicesByUnitId[unitId]?.sid;
		let serviceId = Object.keys(info).find((id) => info[id].sid === sid)
		let service = info[id] || info[serviceId];
		if (sid && sid === service?.sid) {
			if (newStandarts[standartId].title !== service.title) {
				newStandarts[standartId].title = service.title;
			}
			if (newStandarts[standartId].shortTitle !== service.shortTitle) {
				newStandarts[standartId].shortTitle = service.shortTitle;
			}
			if (newStandarts[standartId].description !== service.description) {
				newStandarts[standartId].description = service.description;
			}
			if (id !== serviceId) {
				newStandarts[standartId].servicesByUnitId[unitId].id = serviceId;
			}
		}
	}
	standarts.set(newStandarts);
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

