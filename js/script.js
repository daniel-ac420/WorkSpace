/* --- Получение списка городов и вакансий --- */

const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";
const VACANCY_URL = "api/vacancy";

const vacanciesList = document.querySelector(".vacancies__list");

let lastURL = "";
const pagination = {};

const getData = async(url, callbackSuccess, callbackError) => {
	try {
		const response = await fetch(url);
		const data = await response.json();
		callbackSuccess(data);
	} catch(error) {
		callbackError(error);
	}
};

const createCard = vacancy => `
	<article class="vacancy" tabindex="0" data-id="${vacancy.id}">
		<img class="vacancy__logo" src="${API_URL}${vacancy.logo}" alt="${vacancy.company} Logo">
		<p class="company-name">${vacancy.company}</p>
		<h3 class="title vacancy__title" title="">${vacancy.title}</h3>
		<ul class="vacancy__fields">
			<li class="vacancy__field">от ${Number(vacancy.salary).toLocaleString()}₽</li>
			<li class="vacancy__field">${vacancy.type}</li>
			<li class="vacancy__field">${vacancy.format}</li>
			<li class="vacancy__field">${vacancy.experience}</li>
		</ul>
	</article>
`;

const createCards = (data) => 
//	console.log(data);
	data.vacancies.map((vacancy) => {
		const li = document.createElement("li");
		li.classList.add("vacancies__item");
		li.insertAdjacentHTML("beforeend", createCard(vacancy));
		
		return li;
	});

const renderVacancies = (data) => {
	vacanciesList.textContent = "";
	
	const cards = createCards(data);
	vacanciesList.append(...cards);
	
	if (data.pagination) {
		Object.assign(pagination, data.pagination);
	}
	
	observer.observe(vacanciesList.lastElementChild);
};

const renderMoreVacancies = (data) => {
	const cards = createCards(data);
	vacanciesList.append(...cards);
	
	if (data.pagination) {
		Object.assign(pagination, data.pagination);
	}
	
	observer.observe(vacanciesList.lastElementChild);
};

const loadMoreVacancies = () => {
	if (pagination.totalPages > pagination.currentPage){ 
		const urlWithParams = new URL(lastURL);
		urlWithParams.searchParams.set("page", pagination.currentPage + 1);
		urlWithParams.searchParams.set("limit", window.innerWidth < 540 ? 6 : 12);
		
		getData(urlWithParams, renderMoreVacancies, renderError).then(() => {
			lastURL = urlWithParams;
		});
	}
};

const renderError = error => {
	console.warn(error);
};

const createModalVacancy = (data) =>`
	<article class="vacancy-detail">
		<div class="vacancy-detail__header">
			<img class="vacancy-detail__header-image" src="${API_URL}/${data.logo}" alt="${data.company} Logo">

			<div class="vacancy-detail__header-wrapper">
				<p class="vacancy-detail__header-company">
					${data.company}
				</p>

				<h2 class="title vacancy-detail__header-title" title="${data.title}">
					${data.title}
				</h2>
			</div>
		</div>

		<div class="vacancy-detail__main">
			<div class="vacancy-detail__main-description">
				<p class="vacancy-detail__main-description-text">
					${data.description.replaceAll("\n", "<br>")}
				</p>
			</div>

			<ul class="vacancy-detail__main-fields">
				<li class="vacancy-detail__main-field" title="">
					от ${Number(data.salary).toLocaleString()}₽
				</li>
				<li class="vacancy-detail__main-field" title="">
					${data.type}
				</li>
				<li class="vacancy-detail__main-field" title="">
					${data.format}
				</li>
				<li class="vacancy-detail__main-field" title="">
					${data.experience}
				</li>
				<li class="vacancy-detail__main-field" title="">
					${data.location}
				</li>
			</ul>
		</div>

		<div class="vacancy-detail__footer">
			<p class="vacancy-detail__footer-info">
				Отправляйте резюме на 
				<a class="vacancy-detail__footer-info-link" href="mailto:${data.email}">${data.email}</a>
			</p>
		</div>

		<img class="vacancy-detail__decorative-image" src="images/modal/decorative--image--likemen.svg" alt="">
	</article>

	<button class="modal__close" type="button" title="Закрыть окно описания вакансии">
	</button>
`;

const renderModal = (data) => {
//	console.log(data);
	const modal = document.createElement("div");
	modal.classList.add("modal");
	const modalMain = document.createElement("div");
	modalMain.classList.add("modal__body");
	modalMain.innerHTML = createModalVacancy(data);
	modal.append(modalMain);
	document.body.append(modal);
	
	/* --- Закрытие модального окна --- */
	
	/* Не работает wtf??? ↓ */
//	modal.addEventListener("click", ({target}) => {
//		if (target === modal || target.closest(".modal__close")) {
//			modal.remove;
//		}
//	});
	
	
	/* ↓ Работает только здесь wtf??? ↓ */
	/* ПРИ КЛИКЕ ПО КНОПКЕ "X" */
	
	$(".modal__close").on("click", function() {
		$(".modal").remove();
	});
	
	/* ПРИ КЛИКЕ ВНЕ МОДАЛЬНОГО ОКНА */
	
	$(".modal").click(function (click) {
		if ($(click.target).closest(".modal__body").length) {
		// клик внутри элемента
			return;
		}
		// клик снаружи элемента
		$(".modal__body").fadeOut();
		$(".modal").remove();
	});
};

const openModal = (id) => {
//	console.log(`ID = ${id}`);
	getData(`${API_URL}${VACANCY_URL}/${id}`, renderModal, renderError);
};

/* --- Пагинация --- */

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				loadMoreVacancies();
			}
		})
	},
	{
		rootMargin: "200px"
	}
);

const init = () => {
	const filterForm = document.querySelector(".filter__form");
	
	/* --- Selector --- */
	const citySelect = document.querySelector(".filter__form-select");
	const cityChoices = new Choices(citySelect, {
		itemSelectText: "",
		shouldSort: false,
	});
	
		
	getData(
		`${API_URL}${LOCATION_URL}`, 
		(locationData) => {
			const locations = locationData.map(location => ({
				value: location
			}));
			cityChoices.setChoices(
				locations,
				"value",
				"label",
				true
			);
//			console.log(locations);
		},
		(error) => console.log(error)
	);
	
	
	/* --- Карточки вакансий --- */
	const urlWithParams = new URL(`${API_URL}${VACANCY_URL}`);
	
	urlWithParams.searchParams.set("limit", window.innerWidth < 540 ? 6 : 12);
	urlWithParams.searchParams.set("page", 1);
	
	getData(urlWithParams, renderVacancies, renderError).then(() => {
		lastURL = urlWithParams;
	});
	
	
	/* --- Модальное окно --- */
	
	vacanciesList.addEventListener("click", ({target}) => {
		const vacancyCard = target.closest(".vacancy");
//		console.log(vacancyCard);
		if (vacancyCard) {
			const vacancyID = vacancyCard.dataset.id;
			openModal(vacancyID);
		}
	});
	
	/* --- Фильтр --- */
	filterForm.addEventListener("submit", (event) => {
		event.preventDefault();
		
		const formData = new FormData(filterForm);
//		console.log(formData);
		
		const urlWithParams = new URL(`${API_URL}${VACANCY_URL}`);
		
		formData.forEach((value, key) => {
			urlWithParams.searchParams.append(key, value);
		});
		
//		console.log(urlWithParams);
		
		getData(urlWithParams, renderVacancies, renderError).then(() => {
			lastURL = urlWithParams;
		});
	});
};

init();