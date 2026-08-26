/// Variables globales
const d = document;

let nombreInput = d.querySelector("#nombre-cli");
let apellidoInput = d.querySelector("#apellido-cli");
let emailInput = d.querySelector("#email-cli");
let celularInput = d.querySelector("#celular-cli");
let direccionInput = d.querySelector("#direccion-cli");
let direccion2Input = d.querySelector("#direccion2-cli");
let descripcionInput = d.querySelector("#descripcion-cli");
let formulario = d.querySelector("#formulario-cliente");


/// Evento al formulario crear cliente
formulario.addEventListener("submit", (event) => {

    event.preventDefault();

    let dataCliente = getDataCliente();

    if (dataCliente) {
        sendDataCliente(dataCliente);
    }

});


/// Funcion para validar formulario
/// y obtener datos del formulario
const getDataCliente = () => {

    // Validar Formulario
    let cliente;

    if (
        nombreInput.value &&
        apellidoInput.value &&
        emailInput.value &&
        celularInput.value &&
        direccionInput.value
    ) {

        cliente = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            celular: celularInput.value,
            direccion: direccionInput.value,
            direccion2: direccion2Input.value,
            descripcion: descripcionInput.value
        };

        
        nombreInput.value = "";
        apellidoInput.value = "";
        emailInput.value = "";
        celularInput.value = "";
        direccionInput.value = "";
        direccion2Input.value = "";
        descripcionInput.value = "";

        console.log(cliente);

    } else {

        alert("Todos los campos obligatorios deben estar completos");
        return null;

    }

    return cliente;
};


/// Funcion para enviar datos del cliente
const sendDataCliente = async data => {

    const url = "http://localhost:3000/api/clientes";

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.status === 406) {

            alert("Los datos enviados no son admitidos");

        } else {

            alert("Cliente creado exitosamente");

        }

    } catch (error) {

        console.error(error);
        alert("Error al conectar con el servidor");

    }

};
