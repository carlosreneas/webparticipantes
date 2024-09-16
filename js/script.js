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
            
            // Recorre los datos y crea las filas
            data.forEach(participant => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${participant.nombre}</td>
                    <td>${participant.email}</td>
                    <td>${participant.alias}</td>
                    <td>${participant.edad}</td>
                `;
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Llama a la función para cargar los datos cuando se cargue la página
//document.addEventListener('DOMContentLoaded', fetchAndDisplayParticipants);
document.getElementById('loadButton').addEventListener('click', fetchAndDisplayParticipants);
