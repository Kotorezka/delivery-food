'use strict';
//============OF RECEIRT==============================
const modalAuth = document.querySelector('.modal-auth'),
buttonAuth = document.querySelector('.button-auth'),
closeAuth = document.querySelector('.close-auth'),
cartButton = document.querySelector("#cart-button"),
modal = document.querySelector(".modal"),
close = document.querySelector(".close"),
logInForm = document.querySelector('#logInForm'),
loginInput = document.querySelector('#login'),
userName = document.querySelector('.user-name'),
cardsRestaurants = document.querySelector('.cards-restaurants'),
containerPromo = document.querySelector('.container-promo'),
restaurants = document.querySelector('.restaurants'),
menu = document.querySelector('.menu'),
logo = document.querySelector('.logo'),
cardsMenu = document.querySelector('.cards-menu'),
buttonOut = document.querySelector('.button-out');

//============/OF RECEIRT==============================

//============VARIABLE==============================
let login = localStorage.getItem('delivery');

//============/VARIABLE=============================

//============FUNCTION=================================
const getData = async function (url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error (`Ошибка по адресу ${url}, статус ошибка ${response.status}`);
	} 
	return await response.json();
};

const toggleModal = () => {
	modal.classList.toggle('is-open');
};

const toggleModalAuth = () => {
	modalAuth.classList.toggle('is-open');
};

const authorized = () => {
	const logOut = () => {
		login = null;
		userName.style.display = '';
		buttonOut.style.display = '';
		buttonAuth.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		localStorage.removeItem('delivery');
		checkAuth();
		returnMain();
	};

	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'block';
	buttonOut.addEventListener('click', logOut);
};

const checkAuth = () => login ? authorized() : noAuthorized();

const noAuthorized = () => {

	const logIn = (event) => {
		event.preventDefault();
		//if required edited
		if(loginInput.value){
			login = loginInput.value;
			localStorage.setItem('delivery', login);
			toggleModalAuth();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			logInForm.reset();
			checkAuth();
		} else {
			alert("Введите логин и пароль!")
		}
		
	};
	console.log("No authorized");
	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
};

const createCardRestaurant = ({ image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery, }) => {
	
	const card = `					
		<a class="card card-restaurant" data-products="${products}">
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery} мин</span>
				</div>
				<div class="card-info">
					<div class="rating">
						${stars}
					</div>
					<div class="price">От ${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
				</div>
		</a>
	`;

	cardsRestaurants.insertAdjacentHTML('beforeend',card);
}

const createCardGood = ({ description, name, id, image,	price }) => {

	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend',`
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">${name}</h3>
				</div>
				<div class="card-info">
					<div class="ingredients">${description}
					</div>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart">
						<span class="button-card-text">В корзину</span>
						<span class="button-cart-svg"></span>
					</button>
					<strong class="card-price-bold">${price} ₽</strong>
				</div>
			</div>
	`);
	cardsMenu.insertAdjacentElement('beforeend',card);
}

const openGoods = (event) => {
	
	const target = event.target;
	const restaurant = target.closest('.card-restaurant');
	if(login) {
		console.log('Все окей');
		if (restaurant) {
			cardsMenu.textContent = '';
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');
			getData(`./db/${restaurant.dataset.products}`).then(function(data){
				data.forEach(createCardGood);
			})
			
		} 
	} else {
		toggleModalAuth();
	}
}

const returnMain = () => {
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');

}

function init () {
	getData('./db/partners.json').then(function (data) {
		data.forEach(createCardRestaurant);
	});



	cartButton.addEventListener("click", toggleModal);
	close.addEventListener("click", toggleModal);
	cardsRestaurants.addEventListener('click', openGoods);
	logo.addEventListener('click', returnMain);

	checkAuth();

	new Swiper('.container-promo', {
		loop: true,
		autoplay: true,
		delay: 2000,
	}) 
}
//============/FUNCTION================================

//============EVENTS================================
init();


//============/EVENTS================================




