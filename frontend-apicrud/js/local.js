// Variables Globales de Admin
const d = document;
const nameUser = d.querySelector('#nombre-usuario');
const btnLogout = d.querySelector('#btnLogout');

d.addEventListener('DOMContentLoaded', () => {
	getUser();
});

// Función para Poner el Nombre
const getUser = () => {
	const user = JSON.parse(localStorage.getItem('userLogin'));
	nameUser.textContent = user.usuario;
};

// Evento para el Botón de Logout
btnLogout.addEventListener('click', () => {
	localStorage.removeItem('userLogin');
	location.href = './login.html';
});