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
            // Selecciona el cuerpo de la tabla
            const tableBody = document.getElementById('participantsTableBody');
            let limit = 20;

            const limitedData = data.slice(0, limit);

            // Recorre los datos y crea las filas
            limitedData.forEach(participant => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${participant.nombre}</td>
                    <td>${participant.email}</td>
                    <td>${participant.alias}</td>
                    <td>${participant.edad}</td>
                    <td><button class="btn btn-info btn-sm" data-alias="${participant.alias}" onclick="showParticipantDetails('${participant.alias}')">Detalles</button></td>
                `;
                
                tableBody.appendChild(row);

            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function showParticipantDetails(alias) {
    const modal = new bootstrap.Modal(document.getElementById('participantModal'));

    fetch(`https://01a47aec-bab8-4181-915c-8ea7479ebb8c-00-2qfb8gml2uwtg.kirk.replit.dev/participantes/${alias}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(participant => {
            // Llenar el modal con los datos del participante
            document.getElementById('modalName').textContent = participant.nombre;
            document.getElementById('modalEmail').textContent = participant.email;
            document.getElementById('modalAlias').textContent = participant.alias;
            document.getElementById('modalAge').textContent = participant.edad;
            document.getElementById('modalCapa').textContent = participant.capa;

            // Mostrar el modal
            modal.show();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


// Llama a la función para cargar los datos cuando se cargue la página
//document.addEventListener('DOMContentLoaded', fetchAndDisplayParticipants);
document.getElementById('loadButton').addEventListener('click', fetchAndDisplayParticipants);
