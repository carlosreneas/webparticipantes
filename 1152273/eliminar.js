// Evento para abrir el modal de eliminar participante
document.getElementById('deleteButton').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('deleteParticipantModal'));
    modal.show(); // Mostrar el modal
});

// Función para eliminar un participante
function deleteParticipant(alias) {
    fetch(`${url}/${alias}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el participante');
        }
        // Recargar la lista de participantes
        fetchAndDisplayParticipants();
        alert(`Participante con alias ${alias} eliminado exitosamente.`);
    })
    .catch(error => console.error('Error al eliminar participante:', error));
}

// Evento para enviar el formulario de eliminar participante desde el modal
document.getElementById('deleteParticipantForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el envío normal del formulario
    const alias = document.getElementById('aliasDeleteInput').value.trim(); // Obtener el alias del input
    
    if (alias) {
        if (confirm(`¿Estás seguro de que deseas eliminar al participante con alias: ${alias}?`)) {
            deleteParticipant(alias);
            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteParticipantModal'));
            modal.hide();
        }
    } else {
        alert('Por favor, introduce un alias válido.');
    }
});
