// Variables Globales
const listadoCli = document.getElementById('tabla-clientes');

document.addEventListener('DOMContentLoaded', () => {
	getClientes();
});

// Función para obtener los datos de la base de datos
async function getClientes() {
	try {
		const url = 'http://localhost:3000/api/clientes';
		const data = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		const clientes = await data.json();
		console.log('Clientes', clientes);

		// Limpiar contenido previo por seguridad
		listadoCli.innerHTML = '';

		// Mostrar los datos
		clientes.forEach((cliente, i) => {
			const fila = document.createElement('tr');

			fila.innerHTML = `
				<td>${i + 1}</td>
				<td>${cliente.nombre || ''}</td>
				<td>${cliente.apellido || ''}</td>
				<td>${cliente.email || ''}</td>
				<td>${cliente.celular || cliente.telefono || ''}</td>
				<td>${cliente.direccion || ''}</td>
				<td>
					<button id="btn-edit" onclick="editDataTable(${i})" class="btn btn-primary">
						<i class="fas fa-edit"></i>
					</button>
					<button id="btn-delete" onclick="deleteDataTable(${i})" class="btn btn-danger">
						<i class="fas fa-trash"></i>
					</button>
				</td>
			`;
			listadoCli.appendChild(fila);
		});
	} catch (error) {
		console.error(error);
	}
}

// Funciones para editar o eliminar clientes
let editDataTable = (id) => {

}

let deleteDataTable = (id) => {

}