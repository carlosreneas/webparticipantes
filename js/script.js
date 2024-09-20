// URL del servicio
const url = 'https://01a47aec-bab8-4181-915c-8ea7479ebb8c-00-2qfb8gml2uwtg.kirk.replit.dev/participantes';

// Función para obtener los datos y llenar la tabla
function fetchAndDisplayParticipants() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('participantsTableBody');
            tableBody.innerHTML = '';  // Limpiamos la tabla

            let limit = 20;
            const limitedData = data.slice(0, limit);

            limitedData.forEach(participant => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${participant.nombre}</td>
                    <td>${participant.email}</td>
                    <td>${participant.alias}</td>
                    <td>${participant.edad}</td>
                    <td>
                        <button class="btn btn-info btn-sm" data-alias="${participant.alias}" onclick="showParticipantDetails('${participant.alias}')">Detalles</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteParticipant('${participant.alias}')">Eliminar</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
}

// Función para mostrar los detalles del participante
function showParticipantDetails(alias) {
    const modal = new bootstrap.Modal(document.getElementById('participantModal'));

    fetch(`${url}/${alias}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(participant => {
            document.getElementById('modalName').textContent = participant.nombre;
            document.getElementById('modalEmail').textContent = participant.email;
            document.getElementById('modalAlias').textContent = participant.alias;
            document.getElementById('modalAge').textContent = participant.edad;
            document.getElementById('modalCapa').textContent = participant.capa;
            modal.show();
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
}

// Función para eliminar un participante tanto en el servidor como en la interfaz
function deleteParticipant(alias) {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este participante?");
    
    if (confirmDelete) {
        fetch(`${url}/${alias}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar el participante');
            }
            alert('Participante eliminado correctamente.');
            fetchAndDisplayParticipants(); // Recargar la lista después de eliminar
        })
        .catch(error => {
            console.error('Hubo un problema al eliminar el participante:', error);
        });
    }
}
//Codigo Majo actualizado
// Asignar el evento al botón "Cargar Participantes"
document.getElementById('loadButton').addEventListener('click', fetchAndDisplayParticipants);


function addParticipant(event) {
    event.preventDefault(); // Evitar que el formulario se envíe por defecto

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const alias = document.getElementById('alias').value;
    const edad = document.getElementById('edad').value;
    const capa = document.getElementById('capa').value;

    const newParticipant = {
        nombre,
        email,
        alias,
        edad,
        capa
    };

    console.log('Datos del nuevo participante:', newParticipant);  // Para depurar los datos

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newParticipant)
    })
        .then(response => {
            if (!response.ok) {
                console.error('Error en la respuesta de la API:', response);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Nuevo participante agregado:', data);

            // Actualizar la tabla después de un pequeño retraso para asegurarse de que la API haya sido actualizada
            setTimeout(() => {
                fetchAndDisplayParticipants();
            }, 500);  // Pequeño retraso para esperar que la API se actualice

            // Limpiar el formulario después de agregar
            document.getElementById('addParticipantForm').reset();
        })
        .catch(error => {
            console.error('Error al agregar participante:', error);
        });

    refreshTable();
}


document.getElementById('loadButton').addEventListener('click', fetchAndDisplayParticipants);

// Escuchar el evento de envío del formulario para agregar un participante
document.getElementById('addParticipantForm').addEventListener('submit', addParticipant);


function editParticipant(alias) {
    // Obtener los datos del participante
    fetch(`${url}/${alias}`)
        .then(response => response.json())
        .then(participant => {
            // Prellenar los campos del formulario en el modal
            document.getElementById('editNombre').value = participant.nombre;
            document.getElementById('editEmail').value = participant.email;
            document.getElementById('editAlias').value = participant.alias;
            document.getElementById('editEdad').value = participant.edad;
            document.getElementById('editCapa').value = participant.capa;

            // Mostrar el modal de edición
            const modal = new bootstrap.Modal(document.getElementById('editParticipantModal'));
            modal.show();

            // Actualizar el participante cuando se haga clic en "Guardar Cambios"
            document.getElementById('saveChangesButton').onclick = function () {
                updateParticipant(alias);
            };
        })
        .catch(error => {
            console.error('Error al obtener los datos del participante:', error);
        });
}

function updateParticipant(alias) {
    const updatedParticipant = {
        nombre: document.getElementById('editNombre').value,
        email: document.getElementById('editEmail').value,
        alias: document.getElementById('editAlias').value,
        edad: document.getElementById('editEdad').value,
        capa: document.getElementById('editCapa').value
    };

    fetch(`${url}/${alias}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedParticipant)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Participante actualizado:', data);
            // Actualizar la tabla para reflejar los cambios
            fetchAndDisplayParticipants();

            // Cerrar el modal después de guardar los cambios
            const modal = bootstrap.Modal.getInstance(document.getElementById('editParticipantModal'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error al actualizar el participante:', error);
        });

    refreshTable();
}

function refreshTable() {
    const tableBody = document.getElementById('participantsTableBody');
    tableBody.innerHTML = '';  // Limpiamos la tabla

    // Volvemos a llamar a la función fetchAndDisplayParticipants para recargar los datos actualizados
    fetchAndDisplayParticipants();
}