///Variables globales
const d = document;
let nameInput = d.querySelector("#productos-select")
let  priceInput = d.querySelector("#precio-pro")
let stockInput = d.querySelector("#stock-pro")
let descripcionInput = d.querySelector("#des-pro")
let imagen = d.querySelector("#imagen-pro")
let btnCreate = d.querySelector(".btn-create")

///Evento al boton crear producto
btnCreate.addEventListener("click", () => {
    //alert("Producto : "+ nameInput.value );
    let dataProduct= getDataProduct()
    sendDataProduct(dataProduct);
})

///Funcion para validar formulario
///y obtemer datos del formulario
const getDataProduct = () => {
	// Validar Formulario
	let product;

	if (nameInput.value && precioInput.value && stockInput.value && descripcionInput.value && imagen.src) {
		product = {
			nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio: precioInput.value,
            stock: stockInput.value,
            imagen: imagen.src
		};

		descripcionInput.value = '';
		precioInput.value = '';
		stockInput.value = '';
        imagen.src= "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg"

        console.log(product);

	} else {
		alert('Todos los campos son obligatorios');
		return null;
	}
	

	return product;
};

const sendDataProduct = async data => {
	const url = 'http://localhost:3000/api/productos'

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (respuesta.status === 406) {
				alert('Los datos enviados no son admitidos');
			}else{
                alert("Producto creado exitosamente")
                 }
		
	} catch (error) {
		console.error(error);
	}
    };