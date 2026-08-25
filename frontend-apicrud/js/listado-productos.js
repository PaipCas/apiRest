// Variables Globales
const listadoPro = document.getElementById('listado-producto');

document.addEventListener('DOMContentLoaded', () => {
	getProducts();
});

// Función para obtener los datos de la base de datos
async function getProducts() {
	try {
		const url = 'http://localhost:3000/api/productos';
		const data = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'json/application'
			}
		});
		const products = await data.json();
		console.log('Productos', products);

		// Mostrar los datos
		products.forEach((product, i) => {
			const fila = document.createElement('tr');

			fila.innerHTML = `
				<td>${i + 1}</td>
				<td>${product.nombre}</td>
				<td>${product.descripcion}</td>
				<td>${product.precio}</td>
				<td>${product.stock}</td>
				<td>
					<img src="${product.imagen}" width="100">
				</td>
				<td>
					<button id="btn-edit" onclick="editDataTable(${i})" class="btn btn-primary">
						<i class="fas fa-edit"></i>
					</button>
					<button id="btn-delete" onclick="deleteDataTable(${i})" class="btn btn-danger">
						<i class="fas fa-trash"></i>
					</button>
				</td>
			`;
			listadoPro.appendChild(fila);
		});
	} catch (error) {
		console.error(error);
	};
}

//Funcion para editar algun producto de la tabla
	// Función para editar algún producto de la tabla
let editDataTable = (id) => {

}

let deleteDataTable = (id) => {

}
	