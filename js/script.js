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
            tableBody.innerHTML = ''; // Limpiar el contenido de la tabla

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
            console.error('There was a problem with the fetch operation:', error);
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
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Función para eliminar un participante
function deleteParticipant(alias) {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este participante?");
    
    if (confirmDelete) {
        // Eliminar del servidor
        fetch(`${url}/${alias}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar el participante');
            }
            alert('Participante eliminado correctamente.');
            
            // Actualizar la lista local sin recargar
            removeParticipantFromTable(alias);
        })
        .catch(error => {
            console.error('Hubo un problema al eliminar el participante:', error);
        });
    }
}

// Función para remover al participante de la tabla sin recargar
function removeParticipantFromTable(alias) {
    const tableBody = document.getElementById('participantsTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    // Buscar la fila del participante con el alias dado
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].querySelector('td:nth-child(3)').textContent === alias) {
            tableBody.removeChild(rows[i]);
            break;
        }
    }
}

// Asignar el evento al botón "Cargar Participantes"
document.getElementById('loadButton').addEventListener('click', fetchAndDisplayParticipants);
