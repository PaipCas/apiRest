// Variabes Globales del Formulario de Login
const d = document;
const userInput = d.querySelector('#usuarioForm');
const passInput = d.querySelector('#contraForm');
const btnLogin = d.querySelector('.btnLogin');

// Evento al Botón del Formulario
btnLogin.addEventListener('click', () => {
	const dataForm = getData();
	sendData(dataForm);
});

// Función para Validar el Formulario
// Obtener Datos del Formulario
const getData = () => {
	// Validar Formulario
	let user;

	if (userInput.value && passInput.value) {
		user = {
			usuario: userInput.value,
			contrasena: passInput.value
		};

		userInput.value = '';
		passInput.value = '';
	} else {
		alert('El usuario y la contraseña son obligatorios');
	}
	console.log(user);

	return user;
};

// Función para Recibir los Datos y Realizar la Petición al Sevidor
const sendData = async data => {
	const url = 'http://localhost:3000/api/login';

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		const userLogin = await response.json();

		// console.log(userLogin);
		alert(`Bienvenido ${userLogin.usuario}`);
		location.href = './index.html';
	} catch (error) {
		console.error(error);
	}
};