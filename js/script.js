// URL del servicio
const url = 'https://01a47aec-bab8-4181-915c-8ea7479ebb8c-00-2qfb8gml2uwtg.kirk.replit.dev/participantes';

// Variables para almacenar el alias actual (para modificar/eliminar)
let currentAlias = '';

// Función para mostrar mensajes de verificación
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    alertContainer.appendChild(alertDiv);

    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
        const alert = bootstrap.Alert.getInstance(alertDiv);
        if (alert) {
            alert.close();
        }
    }, 5000);
}

// Función para obtener los datos y llenar la tabla
async function fetchAndDisplayParticipants() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener participantes: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const tableBody = document.getElementById('participantsTableBody');
        tableBody.innerHTML = '';  // Limpiar la tabla antes de agregar

        data.forEach((participant, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td> <!-- Numeración -->
                <td>${participant.nombre}</td>
                <td>${participant.email}</td>
                <td>${participant.alias}</td>
                <td>${participant.edad}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="showParticipantDetails('${participant.alias}')">Detalles</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al obtener los participantes:', error);
        showAlert('Hubo un error al cargar los participantes. Revisa la consola para más detalles.', 'danger');
    }
}

// Función para mostrar los detalles del participante
async function showParticipantDetails(alias) {
    try {
        const response = await fetch(`${url}/${alias}`);
        if (!response.ok) {
            throw new Error(`Error al obtener detalles: ${response.status} ${response.statusText}`);
        }
        const participant = await response.json();
        document.getElementById('modalName').textContent = participant.nombre;
        document.getElementById('modalEmail').textContent = participant.email;
        document.getElementById('modalAlias').textContent = participant.alias;
        document.getElementById('modalAge').textContent = participant.edad;
        document.getElementById('modalCapa').textContent = participant.capa || 'N/A'; // Asume que 'capa' puede no existir
        currentAlias = participant.alias; // Almacenar el alias actual para modificar/eliminar
        const modal = new bootstrap.Modal(document.getElementById('participantModal'));
        modal.show();
    } catch (error) {
        console.error('Error al obtener detalles del participante:', error);
        showAlert('Hubo un error al obtener los detalles del participante. Revisa la consola para más detalles.', 'danger');
    }
}

// Función para agregar un nuevo participante
async function addParticipant(event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const alias = document.getElementById('aliasInput').value.trim();
    const ageValue = document.getElementById('ageInput').value.trim();
    const age = parseInt(ageValue, 10);

    // Validación adicional
    if (!name || !email || !alias || isNaN(age)) {
        showAlert('Por favor, completa todos los campos correctamente.', 'warning');
        return;
    }

    const newParticipant = {
        nombre: name,
        email: email,
        alias: alias,
        edad: age
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newParticipant)
        });

        if (!response.ok) {
            throw new Error(`Error al agregar participante: ${response.status} ${response.statusText}`);
        }

        // Recargar la lista de participantes
        await fetchAndDisplayParticipants();

        // Limpiar el formulario
        document.getElementById('addParticipantForm').reset();

        // Cerrar el modal
        const addModalElement = document.getElementById('addParticipantModal');
        const addModal = bootstrap.Modal.getInstance(addModalElement) || new bootstrap.Modal(addModalElement);
        addModal.hide();

        showAlert('Participante agregado exitosamente.', 'success');
    } catch (error) {
        console.error('Error al agregar participante:', error);
        showAlert('Hubo un error al agregar el participante. Revisa la consola para más detalles.', 'danger');
    }
}

// Función para mostrar el modal de modificar participante
function showModifyParticipantModal(participant) {
    document.getElementById('modifyNameInput').value = participant.nombre;
    document.getElementById('modifyEmailInput').value = participant.email;
    document.getElementById('modifyAliasInput').value = participant.alias;
    document.getElementById('modifyAgeInput').value = participant.edad;

    const modifyModal = new bootstrap.Modal(document.getElementById('modifyParticipantModal'));
    modifyModal.show();
}

// Función para modificar un participante
async function modifyParticipant(event) {
    event.preventDefault();
    const name = document.getElementById('modifyNameInput').value.trim();
    const email = document.getElementById('modifyEmailInput').value.trim();
    const alias = document.getElementById('modifyAliasInput').value.trim(); // Alias no editable
    const ageValue = document.getElementById('modifyAgeInput').value.trim();
    const edad = parseInt(ageValue, 10);

    // Validación adicional
    if (!name || !email || !alias || isNaN(edad)) {
        showAlert('Por favor, completa todos los campos correctamente.', 'warning');
        return;
    }

    const updatedParticipant = {
        nombre: name,
        email: email,
        alias: alias, // Aunque no editable, se incluye para identificar al participante
        edad: edad
    };

    try {
        const response = await fetch(`${url}/${alias}`, {
            method: 'PUT', // O 'PATCH' dependiendo de la API
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedParticipant)
        });

        if (!response.ok) {
            throw new Error(`Error al modificar participante: ${response.status} ${response.statusText}`);
        }

        // Recargar la lista de participantes
        await fetchAndDisplayParticipants();

        // Cerrar el modal de modificar
        const modifyModalElement = document.getElementById('modifyParticipantModal');
        const modifyModal = bootstrap.Modal.getInstance(modifyModalElement) || new bootstrap.Modal(modifyModalElement);
        modifyModal.hide();

        // Cerrar el modal de detalles
        const detailsModalElement = document.getElementById('participantModal');
        const detailsModal = bootstrap.Modal.getInstance(detailsModalElement);
        if (detailsModal) detailsModal.hide();

        showAlert('Participante modificado exitosamente.', 'success');
    } catch (error) {
        console.error('Error al modificar participante:', error);
        showAlert('Hubo un error al modificar el participante. Revisa la consola para más detalles.', 'danger');
    }
}

// Función para eliminar un participante
async function deleteParticipant() {
    if (!currentAlias) {
        showAlert('No se ha seleccionado un participante para eliminar.', 'warning');
        return;
    }

    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este participante? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${url}/${currentAlias}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar participante: ${response.status} ${response.statusText}`);
        }

        // Recargar la lista de participantes
        await fetchAndDisplayParticipants();

        // Cerrar el modal de detalles
        const detailsModalElement = document.getElementById('participantModal');
        const detailsModal = bootstrap.Modal.getInstance(detailsModalElement);
        if (detailsModal) detailsModal.hide();

        showAlert('Participante eliminado exitosamente.', 'success');
    } catch (error) {
        console.error('Error al eliminar participante:', error);
        showAlert('Hubo un error al eliminar el participante. Revisa la consola para más detalles.', 'danger');
    }
}

// Evento para cargar participantes al hacer clic en el botón
document.getElementById('loadButton').addEventListener('click', fetchAndDisplayParticipants);

// Evento para abrir el modal de agregar participante
document.getElementById('addButton').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('addParticipantModal'));
    modal.show();
});

// Evento para enviar el formulario de agregar participante
document.getElementById('addParticipantForm').addEventListener('submit', addParticipant);

// Evento para enviar el formulario de modificar participante
document.getElementById('modifyParticipantForm').addEventListener('submit', modifyParticipant);

// Evento para eliminar participante
document.getElementById('deleteButton').addEventListener('click', deleteParticipant);

// Evento para abrir el modal de modificar participante desde el modal de detalles
document.getElementById('modifyButton').addEventListener('click', async () => {
    try {
        const response = await fetch(`${url}/${currentAlias}`);
        if (!response.ok) {
            throw new Error(`Error al obtener detalles para modificar: ${response.status} ${response.statusText}`);
        }
        const participant = await response.json();
        showModifyParticipantModal(participant);
    } catch (error) {
        console.error('Error al obtener detalles para modificar:', error);
        showAlert('Hubo un error al preparar la modificación. Revisa la consola para más detalles.', 'danger');
    }
});


