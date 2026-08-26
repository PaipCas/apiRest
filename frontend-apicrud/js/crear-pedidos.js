// ======================================================
// VARIABLES GLOBALES
// ======================================================

const d = document;

const formulario = d.querySelector("#formulario-pedido");

const clienteSelect = d.querySelector("#id_cliente");
const metodoPagoSelect = d.querySelector("#metodo_pago");

const tablaCarrito = d.querySelector("#tabla-carrito tbody");

const descuentoInput = d.querySelector("#descuento");
const aumentoInput = d.querySelector("#aumento");

const totalPedido = d.querySelector("#total-pedido");


// Array donde guardaremos los productos del carrito
let carrito = [];


// ======================================================
// CUANDO CARGA LA PÁGINA
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    obtenerClientes();
    obtenerProductos();

});


// ======================================================
// OBTENER CLIENTES
// GET /api/clientes
// ======================================================

const obtenerClientes = async () => {

    try {

        const respuesta = await fetch("http://localhost:3000/api/clientes");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los clientes");
        }

        const datos = await respuesta.json();

        console.log("Clientes recibidos:", datos);

        // Algunas APIs devuelven directamente un array
        // y otras devuelven {data: []}
        const clientes = Array.isArray(datos)
            ? datos
            : datos.data || datos.clientes || [];

        clienteSelect.innerHTML = `
            <option value="">Seleccionar Cliente</option>
        `;

        clientes.forEach(cliente => {

            // Intentamos encontrar el ID dependiendo
            // de cómo venga tu API
            const idCliente =
                cliente.id_cliente ||
                cliente.id ||
                cliente.ID;

            const nombre =
                cliente.nombre ||
                cliente.nombre_cliente ||
                "";

            const apellido =
                cliente.apellido ||
                cliente.apellido_cliente ||
                "";

            const opcion = document.createElement("option");

            opcion.value = idCliente;

            opcion.textContent =
                `${nombre} ${apellido}`.trim();

            clienteSelect.appendChild(opcion);

        });

    } catch (error) {

        console.error("Error obteniendo clientes:", error);

        alert("No se pudieron cargar los clientes");

    }

};


// ======================================================
// OBTENER PRODUCTOS
// GET /api/productos
// ======================================================

const obtenerProductos = async () => {

    try {

        const respuesta = await fetch("http://localhost:3000/api/productos");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos");
        }

        const datos = await respuesta.json();

        console.log("Productos recibidos:", datos);

        const productos = Array.isArray(datos)
            ? datos
            : datos.data || datos.productos || [];

        crearSelectorProductos(productos);

    } catch (error) {

        console.error("Error obteniendo productos:", error);

        alert("No se pudieron cargar los productos");

    }

};


// ======================================================
// CREAR SELECTOR DE PRODUCTOS
// ======================================================

const crearSelectorProductos = (productos) => {

    // Buscamos el div donde están los productos
    const contenedorTabla = d.querySelector("#tabla-carrito").parentElement;

    // Creamos el contenedor
    const contenedorProductos = d.createElement("div");

    contenedorProductos.classList.add("mb-4");

    contenedorProductos.innerHTML = `
    
        <label for="producto-select" class="form-label">
            Seleccionar Producto
        </label>

        <select id="producto-select" class="form-control mb-2">

            <option value="">
                Seleccionar Producto
            </option>

        </select>

        <button
            type="button"
            id="btn-agregar-producto"
            class="btn btn-success">
            <i class="fas fa-plus"></i>
            Agregar Producto
        </button>

    `;

    // Insertamos antes de la tabla
    contenedorTabla.parentElement.insertBefore(
        contenedorProductos,
        contenedorTabla
    );

    const productoSelect =
        d.querySelector("#producto-select");

    // ==================================================
    // LLENAR SELECT DE PRODUCTOS
    // ==================================================

    productos.forEach(producto => {

        /*
         * IMPORTANTE:
         *
         * Aquí guardamos el ID REAL del producto
         * en el value del option.
         *
         * Esto evita el error:
         *
         * Column 'id_producto' cannot be null
         */

        const idProducto =
            producto.id_producto ||
            producto.id ||
            producto.ID;

        const nombre =
            producto.nombre ||
            producto.nombre_producto ||
            producto.producto;

        const precio =
            Number(
                producto.precio ||
                producto.precio_producto ||
                0
            );

        if (!idProducto) {

            console.warn(
                "Producto sin ID:",
                producto
            );

            return;

        }

        const opcion = d.createElement("option");

        // AQUÍ ESTÁ LA PARTE MÁS IMPORTANTE
        opcion.value = idProducto;

        opcion.textContent =
            `${nombre} - $${precio.toLocaleString()}`;

        // Guardamos también el objeto completo
        opcion.dataset.nombre = nombre;
        opcion.dataset.precio = precio;

        productoSelect.appendChild(opcion);

    });


    // ==================================================
    // BOTÓN AGREGAR PRODUCTO
    // ==================================================

    d.querySelector("#btn-agregar-producto")
        .addEventListener("click", () => {

            const idProducto = productoSelect.value;

            if (!idProducto) {

                alert("Selecciona un producto");

                return;

            }

            const opcionSeleccionada =
                productoSelect.options[
                    productoSelect.selectedIndex
                ];

            const nombre =
                opcionSeleccionada.dataset.nombre;

            const precio =
                Number(opcionSeleccionada.dataset.precio);


            // ==================================================
            // VERIFICAR SI YA ESTÁ EN EL CARRITO
            // ==================================================

            const productoExistente =
                carrito.find(
                    producto =>
                        String(producto.id_producto) ===
                        String(idProducto)
                );


            if (productoExistente) {

                productoExistente.cantidad++;

            } else {

                carrito.push({

                    // IMPORTANTE:
                    // Guardamos id_producto
                    id_producto: Number(idProducto),

                    nombre: nombre,

                    precio: precio,

                    cantidad: 1

                });

            }


            mostrarCarrito();

            calcularTotal();

            productoSelect.value = "";

        });

};


// ======================================================
// MOSTRAR CARRITO
// ======================================================

const mostrarCarrito = () => {

    tablaCarrito.innerHTML = "";

    carrito.forEach((producto, indice) => {

        const subtotal =
            producto.precio *
            producto.cantidad;

        const fila = d.createElement("tr");

        fila.innerHTML = `

            <td>
                ${producto.nombre}
            </td>

            <td>
                $${producto.precio.toLocaleString()}
            </td>

            <td>

                <input
                    type="number"
                    class="form-control cantidad-producto"
                    data-indice="${indice}"
                    value="${producto.cantidad}"
                    min="1"
                    style="width: 90px;"
                >

            </td>

            <td>
                $${subtotal.toLocaleString()}
            </td>

            <td>

                <button
                    type="button"
                    class="btn btn-danger btn-sm btn-eliminar"
                    data-indice="${indice}">

                    <i class="fas fa-trash"></i>

                </button>

            </td>

        `;

        tablaCarrito.appendChild(fila);

    });


    // ==================================================
    // CAMBIAR CANTIDAD
    // ==================================================

    const inputsCantidad =
        d.querySelectorAll(".cantidad-producto");

    inputsCantidad.forEach(input => {

        input.addEventListener("change", () => {

            const indice =
                Number(input.dataset.indice);

            let cantidad =
                Number(input.value);

            if (cantidad < 1 || isNaN(cantidad)) {

                cantidad = 1;

                input.value = 1;

            }

            carrito[indice].cantidad =
                cantidad;

            mostrarCarrito();

            calcularTotal();

        });

    });


    // ==================================================
    // ELIMINAR PRODUCTO
    // ==================================================

    const botonesEliminar =
        d.querySelectorAll(".btn-eliminar");

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", () => {

            const indice =
                Number(boton.dataset.indice);

            carrito.splice(indice, 1);

            mostrarCarrito();

            calcularTotal();

        });

    });

};


// ======================================================
// CALCULAR TOTAL
// ======================================================

const calcularTotal = () => {

    let subtotal = 0;

    carrito.forEach(producto => {

        subtotal +=
            producto.precio *
            producto.cantidad;

    });


    const descuento =
        Number(descuentoInput.value) || 0;

    const aumento =
        Number(aumentoInput.value) || 0;


    let total =
        subtotal -
        descuento +
        aumento;


    // Evitar total negativo
    if (total < 0) {

        total = 0;

    }


    totalPedido.textContent =
        `$${total.toLocaleString()}`;

};


// ======================================================
// ACTUALIZAR TOTAL CUANDO CAMBIA DESCUENTO
// ======================================================

descuentoInput.addEventListener(
    "input",
    calcularTotal
);


// ======================================================
// ACTUALIZAR TOTAL CUANDO CAMBIA AUMENTO
// ======================================================

aumentoInput.addEventListener(
    "input",
    calcularTotal
);


// ======================================================
// OBTENER DATOS DEL PEDIDO
// ======================================================

const obtenerDatosPedido = () => {

    const idCliente =
        clienteSelect.value;

    const metodoPago =
        metodoPagoSelect.value;


    const descuento =
        Number(descuentoInput.value) || 0;

    const aumento =
        Number(aumentoInput.value) || 0;


    // ==================================================
    // VALIDACIONES
    // ==================================================

    if (!idCliente) {

        alert("Selecciona un cliente");

        return null;

    }


    if (!metodoPago) {

        alert("Selecciona un método de pago");

        return null;

    }


    if (carrito.length === 0) {

        alert("Debes agregar al menos un producto");

        return null;

    }


    // ==================================================
    // CALCULAR TOTAL
    // ==================================================

    let subtotal = 0;

    carrito.forEach(producto => {

        subtotal +=
            producto.precio *
            producto.cantidad;

    });


    const total =
        subtotal -
        descuento +
        aumento;


    // ==================================================
    // CREAR OBJETO
    // ==================================================

    const pedido = {

        id_cliente: Number(idCliente),

        metodo_pago: metodoPago,

        descuento: descuento,

        aumento: aumento,

        total: total,

        productos: carrito.map(producto => ({

            /*
             * ESTE CAMPO ES FUNDAMENTAL
             *
             * Es el que estaba llegando como NULL
             */

            id_producto:
                Number(producto.id_producto),

            cantidad:
                Number(producto.cantidad),

            precio:
                Number(producto.precio)

        }))

    };


    console.log(
        "PEDIDO QUE SE ENVIARÁ:",
        pedido
    );


    return pedido;

};


// ======================================================
// ENVIAR PEDIDO
// POST /api/pedidos
// ======================================================

const enviarPedido = async (pedido) => {

    try {

        console.log(
            "Enviando pedido:",
            JSON.stringify(pedido, null, 2)
        );


        const respuesta = await fetch(
            "http://localhost:3000/api/pedidos",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(pedido)

            }
        );


        const datos =
            await respuesta.json()
                .catch(() => null);


        console.log(
            "Respuesta del servidor:",
            datos
        );


        // ==================================================
        // ERROR DEL SERVIDOR
        // ==================================================

        if (!respuesta.ok) {

            const mensaje =
                datos?.mensaje ||
                datos?.message ||
                datos?.error ||
                "Error al crear el pedido";


            throw new Error(mensaje);

        }


        // ==================================================
        // PEDIDO CREADO
        // ==================================================

        alert(
            "Pedido creado exitosamente"
        );


        // Limpiar carrito
        carrito = [];


        mostrarCarrito();


        // Reiniciar formulario
        formulario.reset();


        // Reiniciar valores
        descuentoInput.value = 0;

        aumentoInput.value = 0;


        calcularTotal();


        // Volver a cargar clientes por seguridad
        obtenerClientes();


    } catch (error) {

        console.error(
            "Error al crear pedido:",
            error
        );


        alert(
            "Error al crear pedido: " +
            error.message
        );

    }

};


// ======================================================
// EVENTO DEL FORMULARIO
// ======================================================

formulario.addEventListener(
    "submit",
    async (evento) => {

        // Evita que el formulario recargue la página
        evento.preventDefault();


        // Obtener datos
        const pedido =
            obtenerDatosPedido();


        // Si hay algún error de validación
        if (!pedido) {

            return;

        }


        // Enviar al backend
        await enviarPedido(pedido);

    }
);
