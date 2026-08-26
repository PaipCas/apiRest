/// Variables globales
const d = document;

let usuarioInput = d.querySelector("#usuario");
let contrasenaInput = d.querySelector("#contrasena");
let confirmarContrasenaInput = d.querySelector("#confirmar_contrasena");
let rolInput = d.querySelector("#rol");
let formulario = d.querySelector("#formulario-usuario");


/// Evento al formulario crear usuario
formulario.addEventListener("submit", (event) => {

    event.preventDefault();

    let dataUser = getDataUser();

    if (dataUser) {
        sendDataUser(dataUser);
    }

});


/// Funcion para validar formulario
/// y obtener datos del formulario
const getDataUser = () => {

    // Validar Formulario
    let user;

    if (
        usuarioInput.value &&
        contrasenaInput.value &&
        confirmarContrasenaInput.value &&
        rolInput.value
    ) {

        // Validar que las contraseñas coincidan
        if (contrasenaInput.value !== confirmarContrasenaInput.value) {

            alert("Las contraseñas no coinciden");

            return null;
        }

        user = {
            usuario: usuarioInput.value,
            contrasena: contrasenaInput.value,
            rol: rolInput.value
        };

        usuarioInput.value = "";
        contrasenaInput.value = "";
        confirmarContrasenaInput.value = "";
        rolInput.value = "";

        console.log(user);

    } else {

        alert("Todos los campos son obligatorios");

        return null;
    }

    return user;
};


/// Funcion para enviar datos del usuario
const sendDataUser = async data => {

    const url = "http://localhost:3000/api/usuarios";

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

            alert("Usuario creado exitosamente");

        }

    } catch (error) {

        console.error(error);

    }

};
