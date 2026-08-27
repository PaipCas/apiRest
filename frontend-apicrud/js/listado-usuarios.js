// Variables Globales
const listadoUsu = document.getElementById('tabla-usuarios');

document.addEventListener('DOMContentLoaded', () => {
	getUsuarios();
});

// Función para obtener los usuarios de la base de datos
async function getUsuarios() {
	try {
		const url = 'http://localhost:3000/api/usuarios';
		const data = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (!data.ok) {
			throw new Error(`Error HTTP: ${data.status}`);
		}

		const usuarios = await data.json();
		console.log('Respuesta del Backend para Usuarios:', usuarios); // Revisa la consola del navegador (F12)

		// Limpiar filas previas
		listadoUsu.innerHTML = '';

		// Si el backend devuelve un objeto envoltorio tipo { data: [...] } o directamente el arreglo [...]
		const lista = Array.isArray(usuarios) ? usuarios : (usuarios.data || []);

		// Mostrar los datos
		lista.forEach((usuario, i) => {
			const fila = document.createElement('tr');

			// Detectar el nombre de usuario (probamos distintas variantes)
			const nombreUsuario = usuario.usuario || usuario.nombre_usuario || usuario.username || 'Sin usuario';

			// Detectar el rol (si viene de una tabla roles como objeto o como string)
			const nombreRol = 
				(typeof usuario.rol === 'object' ? usuario.rol?.nombre_rol || usuario.rol?.rol : usuario.rol) ||
				usuario.nombre_rol ||
				usuario.role ||
				'Sin Rol';

			// Detectar fecha de creación
			const fechaCreacion = usuario.created_at || usuario.creado || usuario.fecha_creacion
				? new Date(usuario.created_at || usuario.creado || usuario.fecha_creacion).toLocaleDateString()
				: 'N/A';

			fila.innerHTML = `
				<td>${i + 1}</td>
				<td>${nombreUsuario}</td>
				<td><span class="badge badge-info">${nombreRol}</span></td>
				<td>${fechaCreacion}</td>
				<td>
					<button onclick="editDataTable(${i})" class="btn btn-primary btn-sm">
						<i class="fas fa-edit"></i>
					</button>
					<button onclick="deleteDataTable(${i})" class="btn btn-danger btn-sm">
						<i class="fas fa-trash"></i>
					</button>
				</td>
			`;
			listadoUsu.appendChild(fila);
		});
	} catch (error) {
		console.error('Error al cargar usuarios:', error);
	}
}

// Funciones para editar o eliminar usuarios
let editDataTable = (id) => {

};

let deleteDataTable = (id) => {

};