// Variabes Globales del Formulario de Login
const d = document;
const userInput = d.querySelector('#usuarioForm');
const passInput = d.querySelector('#contraForm');
const btnLogin = d.querySelector('.btnLogin');

// Evento al Botón del Formulario
btnLogin.addEventListener('click', () => {
	const dataForm = getData();

	if (dataForm) {
		sendData(dataForm);
	}
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
		return null;
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

		if (!response.ok) {
			if (response.status === 401) {
				alert('El usuario y/o la contraseña son incorrectos');
			}
			return;
		}

		const userLogin = await response.json();

		console.log(userLogin);
		alert(`Bienvenido ${userLogin.rol}`);

		// Guardar Datos en LocalStorage
		localStorage.setItem('userLogin', JSON.stringify(userLogin));
		location.href = './index.html';
	} catch (error) {
		console.error(error);
	}
};