// js/listado-pedidos.js

const listadoPed = document.getElementById('tabla-pedidos');

document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosYClientes();
});

async function cargarPedidosYClientes() {
    if (!listadoPed) return;

    try {
        // 1. Obtenemos pedidos y clientes en paralelo
        const [resPedidos, resClientes] = await Promise.all([
            fetch('http://localhost:3000/api/pedidos'),
            fetch('http://localhost:3000/api/clientes')
        ]);

        if (!resPedidos.ok || !resClientes.ok) {
            throw new Error('Error al consultar las APIs');
        }

        const pedidos = await resPedidos.json();
        const clientes = await resClientes.json();

        // 2. Limpiamos la tabla
        listadoPed.innerHTML = '';

        const listaPedidos = Array.isArray(pedidos) ? pedidos : (pedidos.data || []);
        const listaClientes = Array.isArray(clientes) ? clientes : (clientes.data || []);

        if (listaPedidos.length === 0) {
            listadoPed.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">No hay pedidos registrados.</td>
                </tr>
            `;
            return;
        }

        // 3. Renderizamos cada pedido buscando la información del cliente
        listaPedidos.forEach((pedido, i) => {
            const fila = document.createElement('tr');

            // Buscamos el cliente coincidente por id o id_cliente
            const clienteEncontrado = listaClientes.find(c => 
                String(c.id) === String(pedido.id_cliente) || 
                String(c.id_cliente) === String(pedido.id_cliente)
            );

            // Construimos nombre completo
            const clienteNombre = clienteEncontrado 
                ? `${clienteEncontrado.nombre || ''} ${clienteEncontrado.apellido || ''}`.trim()
                : (pedido.nombre_cliente || 'Sin Cliente');

            // Email (priorizamos el cliente encontrado, o el que traiga el pedido)
            const emailCliente = clienteEncontrado?.email || pedido.email || pedido.email_cliente || 'N/A';
            
            // Fecha
            const fechaFormatted = pedido.fecha 
                ? new Date(pedido.fecha).toLocaleDateString() 
                : (pedido.created_at ? new Date(pedido.created_at).toLocaleDateString() : 'N/A');
            
            // Total
            const totalFormatted = pedido.total ? `$${Number(pedido.total).toLocaleString()}` : '$0';

            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${clienteNombre}</td>
                <td>${emailCliente}</td>
                <td>${fechaFormatted}</td>
                <td>${totalFormatted}</td>
                <td>
                    <span class="badge ${pedido.estado === 'Completado' ? 'badge-success' : 'badge-warning'}">
                        ${pedido.estado || 'Pendiente'}
                    </span>
                </td>
                <td>
                    <button onclick="editDataTable(${i})" class="btn btn-primary btn-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteDataTable(${i})" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            listadoPed.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        listadoPed.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">Error al cargar pedidos: ${error.message}</td>
            </tr>
        `;
    }
}

let editDataTable = (id) => {};
let deleteDataTable = (id) => {};