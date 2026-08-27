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
let editDataTable = (id) => {
	let products = [];
	let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
	if (productsSave != null) {
		products = productsSave;
	}
	let singleProduct = products[pos];
	//console.log(singleProduct);
	localStorage.setItem("productEdit", JSON.stringify(singleProduct));
	localStorage.removeItem("datosTabla");
	location.href = "../crear-pro.html"

}

let deleteDataTable = (pos) => {
	let products = [];
	let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
	if (productsSave != null) {
		products = productsSave;
	}
	let singleProduct = products[pos];
	//console.log("Producto a eliminar: " + singleProduct.nombre);
	let IDproduct = {
		id: singleProduct
	}
	let confirmar = confirm(`¿Deseas eliminar ${singleProduct.nombre} ?`);
	if (confirmar) {
		sendDeleteProduct(IDproduct);
	}

}
let sendDeleteProduct = async (id) => {
	const url = 'http://localhost:3000/api/productos'

	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(id)
		});

		if (respuesta.status === 406) {
			alert('Los datos enviados no son admitidos');
		} else {
			alert("Producto creado exitosamente");
			location.reload();

		}

	} catch (error) {
		console.error(error);
	}

}

let clearDataTable = () => {
	let rowTable = document.querySelectorAll("#table-pro > tbody > tr");
	rowTable.forEach((row) => {
		row.remove();
	});
};

let searchProductTable = () => {
	let products = [];
	let productsSave = JSON.parse(localStorage.getItem("datosTable"));
	if (productsSave != null) {
		products = productsSave;

	}
}
