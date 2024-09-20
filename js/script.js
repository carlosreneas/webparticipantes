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
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar los datos

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
