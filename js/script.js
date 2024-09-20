// URL del servicio
const url = 'https://01a47aec-bab8-4181-915c-8ea7479ebb8c-00-2qfb8gml2uwtg.kirk.replit.dev/participantes';

// Función para obtener los datos y llenar la tabla
function fetchAndDisplayParticipants() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('participantsTableBody');
            tableBody.innerHTML = '';  // Limpiar la tabla antes de agregar
            const limit = 20;
            const limitedData = data.slice(0, limit);

            limitedData.forEach(participant => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${participant.nombre}</td>
                    <td>${participant.email}</td>
                    <td>${participant.alias}</td>
                    <td>${participant.edad}</td>
                    <td><button class="btn btn-info btn-sm" onclick="showParticipantDetails('${participant.alias}')">Detalles</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al obtener los participantes:', error));
}

// Función para mostrar los detalles del participante
function showParticipantDetails(alias) {
    const modal = new bootstrap.Modal(document.getElementById('participantModal'));

    fetch(`${url}/${alias}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
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
        .catch(error => console.error('Error al obtener detalles:', error));
}

// Función para agregar un nuevo participante
function addParticipant(event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const alias = document.getElementById('aliasInput').value.trim();
    const age = parseInt(document.getElementById('ageInput').value.trim(), 10);

    if (!name || !email || !alias || isNaN(age)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const newParticipant = {
        nombre: name,
        email: email,
        alias: alias,
        edad: age
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newParticipant)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar participante');
        }
        return response.json();
    })
    .then(() => {
        // Recargar la lista de participantes
        fetchAndDisplayParticipants();
        // Limpiar el formulario
        document.getElementById('addParticipantForm').reset();
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addParticipantModal'));
        modal.hide();
    })
    .catch(error => console.error('Error:', error));
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
