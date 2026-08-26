// URL de tu API REST
const API_URL = "http://localhost:3000/api/usuarios"; // Ajusta la URL de tu API

async function registrarUsuario() {
	// 1. Obtener valores
	const rol = document.getElementById("rol").value.trim();
	const usuario = document.getElementById("usuario").value.trim();
	const contrasena = document.getElementById("contrasena").value;
	const validarContrasena = document.getElementById("validarContrasena").value;

	// 2. Validaciones básicas de campos
	if (!rol || !usuario || !contrasena || !validarContrasena) {
		alert("Por favor completa todos los campos.");
		return;
	}

	if (contrasena !== validarContrasena) {
		alert("Las contraseñas no coinciden. Por favor verifícalas.");
		document.getElementById("validarContrasena").focus();
		return;
	}

	try {
		// ========================================================
		// 3. VALIDACIÓN DE USUARIO ÚNICO (CONSULTA A LA API)
		// ========================================================
		const respuestaCheck = await fetch(API_URL);
		const usuariosRegistrados = await respuestaCheck.json();

		// Comprobamos si existe coincidencia (sin distinguir mayúsculas/minúsculas)
		const usuarioExiste = usuariosRegistrados.some(
			u => u.usuario.toLowerCase() === usuario.toLowerCase()
		);

		if (usuarioExiste) {
			alert(`El nombre de usuario "${usuario}" ya está en uso. Por favor elige otro.`);
			document.getElementById("usuario").focus();
			return; // Detiene el registro
		}

		// ========================================================
		// 4. GUARDAR EL NUEVO USUARIO SI NO EXISTE
		// ========================================================
		const nuevoUsuario = {
			rol: rol,
			usuario: usuario,
			contrasena: contrasena
		};

		const respuestaPost = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(nuevoUsuario)
		});

		if (respuestaPost.ok) {
			alert("¡Usuario registrado exitosamente!");
			document.getElementById("formRegistro").reset();
			window.location.href = "login.html";
		} else {
			alert("Error al registrar el usuario en el servidor.");
		}

	} catch (error) {
		console.error("Error al procesar el registro:", error);
		alert("Hubo un problema de conexión con el servidor.");
	}
}