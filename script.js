document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTES Y VARIABLES ---
    const SECRET_WORD = 'secreto123'; // ¡CAMBIA ESTO!

    // Elementos de Acceso (igual que antes)
    const accessScreen = document.getElementById('access-screen');
    const accessForm = document.getElementById('access-form');
    const secretInput = document.getElementById('secret-word');
    const errorMessage = document.getElementById('error-message');

    // Elementos de Pantalla Principal
    const mainScreen = document.getElementById('main-screen');
    const quoteList = document.getElementById('quote-list'); // Drop zone izquierda (UL)
    const selectedQuoteArea = document.getElementById('selected-quote-area'); // Drop zone derecha (DIV)
    const quoteItems = document.querySelectorAll('.quote-item'); // Nodos de citas (LI)
    const selectedQuotePlaceholder = document.getElementById('selected-quote-placeholder');
    const confirmButton = document.getElementById('confirm-button');
    const confirmationMessage = document.getElementById('confirmation-message');

    let draggedItem = null; // Para guardar referencia al item arrastrado

    // --- LÓGICA DE ACCESO (igual que antes) ---
    accessForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (secretInput.value === SECRET_WORD) {
            accessScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            errorMessage.textContent = '';
            setupDragAndDrop();
            updatePlaceholderVisibility(); // Initial check for placeholder
        } else {
            errorMessage.textContent = 'Palabra secreta incorrecta.';
            secretInput.value = '';
            secretInput.focus();
        }
    });

    // --- FUNCIÓN PARA CONFIGURAR DRAG & DROP (igual que antes) ---
    function setupDragAndDrop() {
        quoteItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        });

        const dropZones = [quoteList, selectedQuoteArea];
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('dragleave', handleDragLeave);
            zone.addEventListener('drop', handleDrop);
        });
    }

    // --- MANEJADORES DE EVENTOS DRAG & DROP (Modificación en handleDrop) ---

    function handleDragStart(event) {
        draggedItem = event.target;
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            if(draggedItem) draggedItem.classList.add('dragging'); // Check if draggedItem still exists
        }, 0);
        confirmationMessage.textContent = '';
    }

    function handleDragEnd() {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
        }
        // Limpiar clases 'drag-over' de las zonas
        document.querySelectorAll('.drag-over').forEach(zone => {
            zone.classList.remove('drag-over');
        });
         // Check placeholder visibility AFTER drag operation might have changed content
        updatePlaceholderVisibility();
        draggedItem = null;
    }

    function handleDragOver(event) {
        event.preventDefault();
         const dropZone = event.target.closest('.drop-zone');
         if (dropZone && draggedItem && dropZone !== draggedItem.parentNode) { // Solo añadir clase si se puede soltar ahí
            dropZone.classList.add('drag-over');
            event.dataTransfer.dropEffect = 'move';
         } else {
             event.dataTransfer.dropEffect = 'none'; // Indicar que no se puede soltar aquí
         }
    }

    function handleDragLeave(event) {
         const dropZone = event.target.closest('.drop-zone');
          if (dropZone) {
              dropZone.classList.remove('drag-over');
          }
    }

    function handleDrop(event) {
        event.preventDefault();
        const dropZone = event.target.closest('.drop-zone');

        if (dropZone && draggedItem && dropZone !== draggedItem.parentNode) { // Ensure drop target is valid and not the parent itself
            dropZone.classList.remove('drag-over');

            // *** MODIFICACIÓN CLAVE ***
            // Ya sea en la lista izquierda o en el área derecha, simplemente añadimos el elemento.
            // No eliminamos elementos existentes en el área derecha.
             dropZone.appendChild(draggedItem);

        }
         // Asegurarse que el estilo de dragging se quite al soltar
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
        }
         // Actualizar visibilidad del placeholder DESPUÉS de mover el elemento
        updatePlaceholderVisibility();
    }

    // --- NUEVA FUNCIÓN para gestionar el placeholder ---
    function updatePlaceholderVisibility() {
        const hasItemsSelected = selectedQuoteArea.querySelectorAll('.quote-item').length > 0;
        if (selectedQuotePlaceholder) {
            selectedQuotePlaceholder.style.display = hasItemsSelected ? 'none' : 'flex'; // O 'block', según CSS
        }
    }


    // --- LÓGICA DEL BOTÓN DE CONFIRMACIÓN (Adaptada para Múltiples Citas) ---
    confirmButton.addEventListener('click', () => {
        // Buscar TODOS los elementos .quote-item dentro del área de selección
        const selectedQuoteElements = selectedQuoteArea.querySelectorAll('.quote-item');

        if (selectedQuoteElements.length > 0) {
            // Crear un array con los textos de las citas seleccionadas
            const selectedQuotesTexts = Array.from(selectedQuoteElements).map(el => el.textContent);

            // --- SIMULACIÓN DE ENVÍO DE CORREO ---
            console.log('--- Simulación de Envío de Correo ---');
            console.log('Destinatario: [Correo del destinatario]');
            console.log(`Asunto: ${selectedQuotesTexts.length} citas seleccionadas`);
            console.log('Cuerpo del mensaje:');
            console.log('Las citas seleccionadas son:');
            selectedQuotesTexts.forEach((quote, index) => {
                console.log(`${index + 1}. "${quote}"`);
            });
            console.log('--- Fin Simulación ---');

            // Mostrar mensaje de confirmación al usuario
            confirmationMessage.textContent = `¡${selectedQuotesTexts.length} cita(s) seleccionada(s)! (Simulación exitosa - revisa la consola).`;
            confirmationMessage.className = 'success';

            // Aquí iría la llamada a la API real (EmailJS, backend, etc.)
            // podrías pasar el array 'selectedQuotesTexts' o formatearlo como string

        } else {
            // Si no se ha movido ninguna cita al área derecha
            confirmationMessage.textContent = 'Por favor, arrastra una o más citas al área de selección primero.';
            confirmationMessage.className = 'error';
        }
    });

     // Llamada inicial para asegurar estado correcto del placeholder al cargar (después de login)
     // (Movido a la lógica de acceso para que se ejecute después de mostrar el mainScreen)

}); // Fin del DOMContentLoaded