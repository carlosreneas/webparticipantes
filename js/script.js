// URL del servicio
const url = 'https://01a47aec-bab8-4181-915c-8ea7479ebb8c-00-2qfb8gml2uwtg.kirk.replit.dev/participantes';

// Variable para almacenar los participantes
let participants = [];

// Función para obtener los datos y llenar la tabla
function fetchAndDisplayParticipants() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            participants = data; // Guardar los participantes
            updateTable(); // Actualizar la tabla con los datos
        })
        .catch(error => console.error('Error al cargar participantes:', error));
}

// Función para actualizar la tabla con los participantes
function updateTable() {
    const tableBody = document.getElementById('participantsTableBody');
    tableBody.innerHTML = '';  // Limpiar la tabla antes de agregar nuevas filas

    participants.forEach((participant, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.nombre}</td>
            <td>${participant.email}</td>
            <td>${participant.alias}</td>
            <td>${participant.edad}</td>
            <td><button class="btn btn-info btn-sm" onclick="editParticipant(${index})">Modificar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para abrir el modal y cargar los datos para editar
function editParticipant(index) {
    const participant = participants[index];

    // Llenar los campos del modal con los datos del participante
    document.getElementById('modalNameInput').value = participant.nombre;
    document.getElementById('modalEmailInput').value = participant.email;
    document.getElementById('modalAliasInput').value = participant.alias;
    document.getElementById('modalAgeInput').value = participant.edad;
    document.getElementById('modalCapaInput').value = participant.capa;

    // Guardar el índice del participante en el botón de guardar cambios
    document.getElementById('saveChangesButton').setAttribute('data-index', index);

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('participantModal'));
    modal.show();
}

// Función para guardar los cambios del participante editado
document.getElementById('saveChangesButton').addEventListener('click', function () {
    const index = this.getAttribute('data-index'); // Obtener el índice del participante

    // Actualizar los datos del participante con los valores del modal
    participants[index].nombre = document.getElementById('modalNameInput').value;
    participants[index].email = document.getElementById('modalEmailInput').value;
    participants[index].alias = document.getElementById('modalAliasInput').value;
    participants[index].edad = document.getElementById('modalAgeInput').value;
    participants[index].capa = document.getElementById('modalCapaInput').value;

    // Volver a renderizar la tabla con los cambios
    updateTable();

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('participantModal'));
    modal.hide();
});

// Cargar la tabla al hacer clic en el botón "Cargar Participantes"
document.getElementById('loadButton').addEventListener('click', fetchAndDisplayParticipants);
