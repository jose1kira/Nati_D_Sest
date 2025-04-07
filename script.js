document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTES Y VARIABLES ---
    const SECRET_WORD = 'tiroteo'; // ¡CAMBIA ESTO!

    // Elementos de Acceso
    const accessScreen = document.getElementById('access-screen');
    const accessForm = document.getElementById('access-form');
    const secretInput = document.getElementById('secret-word');
    const errorMessage = document.getElementById('error-message');

    // Elementos de Pantalla Principal
    const mainScreen = document.getElementById('main-screen');
    const quoteList = document.getElementById('quote-list');
    const selectedQuoteArea = document.getElementById('selected-quote-area');
    const quoteItems = document.querySelectorAll('.quote-item');
    const selectedQuotePlaceholder = document.getElementById('selected-quote-placeholder');

    // Nuevos elementos del Footer
    const acceptButton = document.getElementById('accept-button');
    const escapeButton = document.getElementById('escape-button');
    const escapeMessage = document.getElementById('escape-message');

    const backgroundMusic = document.getElementById('background-music');

    let draggedItem = null;

    // --- LÓGICA DE ACCESO ---
    accessForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (secretInput.value === SECRET_WORD) {
            accessScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            errorMessage.textContent = '';

            // ---> INICIO: CÓDIGO PARA REPRODUCIR MÚSICA <---
            if (backgroundMusic) {
                // Opcional: Ajustar volumen (0.0 = silencio, 1.0 = máximo)
                backgroundMusic.volume = 0.2; // Poner volumen al 40%

                // Intentar reproducir la música
                const playPromise = backgroundMusic.play();

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // La reproducción automática comenzó con éxito
                        console.log("Música de fondo iniciada.");
                    }).catch(error => {
                        // La reproducción automática fue bloqueada por el navegador
                        console.error("Error al iniciar música:", error);
                        // Aquí podrías mostrar un botón "Play" manual si la reproducción automática falla.
                        // Por ejemplo: alert("El navegador bloqueó la música automática. Actívala manualmente si quieres.");
                    });
                }
            }
            // ---> FIN: CÓDIGO PARA REPRODUCIR MÚSICA <---
            setupDragAndDrop();
            setupActionButtons(); // Setup new buttons only after login
            updatePlaceholderVisibility();
        } else {
            errorMessage.textContent = 'Palabra secreta incorrecta.';
            secretInput.value = '';
            secretInput.focus();
        }
    });

    // --- FUNCIÓN PARA CONFIGURAR DRAG & DROP (sin cambios) ---
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

    // --- MANEJADORES DE EVENTOS DRAG & DROP (sin cambios) ---
    function handleDragStart(event) { /* ... Mismo código ... */
        draggedItem = event.target;
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            if(draggedItem) draggedItem.classList.add('dragging');
        }, 0);
    }
    function handleDragEnd() { /* ... Mismo código ... */
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
        }
        document.querySelectorAll('.drag-over').forEach(zone => zone.classList.remove('drag-over'));
        updatePlaceholderVisibility();
        draggedItem = null;
     }
    function handleDragOver(event) { /* ... Mismo código ... */
        event.preventDefault();
         const dropZone = event.target.closest('.drop-zone');
         if (dropZone && draggedItem && dropZone !== draggedItem.parentNode) {
            dropZone.classList.add('drag-over');
            event.dataTransfer.dropEffect = 'move';
         } else {
             event.dataTransfer.dropEffect = 'none';
         }
    }
    function handleDragLeave(event) { /* ... Mismo código ... */
         const dropZone = event.target.closest('.drop-zone');
          if (dropZone) {
              dropZone.classList.remove('drag-over');
          }
    }
    function handleDrop(event) { /* ... Mismo código ... */
        event.preventDefault();
        const dropZone = event.target.closest('.drop-zone');
        if (dropZone && draggedItem && dropZone !== draggedItem.parentNode) {
            dropZone.classList.remove('drag-over');
            dropZone.appendChild(draggedItem);
        }
        if (draggedItem) {
             draggedItem.classList.remove('dragging');
        }
        updatePlaceholderVisibility();
    }

    // --- GESTIÓN PLACEHOLDER (sin cambios) ---
    function updatePlaceholderVisibility() {
        const hasItemsSelected = selectedQuoteArea.querySelectorAll('.quote-item').length > 0;
        if (selectedQuotePlaceholder) {
            selectedQuotePlaceholder.style.display = hasItemsSelected ? 'none' : 'flex';
        }
    }

    // --- *** NUEVA LÓGICA PARA BOTONES DE ACCIÓN *** ---

    function setupActionButtons() {
        // 1. Botón Aceptar
        acceptButton.addEventListener('click', () => {
            // Verificar si hay citas seleccionadas (opcional, pero puede tener sentido)
             const selectedQuoteElements = selectedQuoteArea.querySelectorAll('.quote-item');
             if (selectedQuoteElements.length === 0) {
                 alert('Primero arrastra al menos un plan chiquita.');
                 return; // No hacer nada si no hay citas
             }
            // Mostrar el mensaje
            alert("Para más información, toma una captura y envíala al mentiroso");
            // Podrías resetear la selección aquí si quisieras:
            // selectedQuoteElements.forEach(item => quoteList.appendChild(item));
            // updatePlaceholderVisibility();
        });

        // 2. Botón Escapar
        escapeButton.addEventListener('mouseover', moveEscapeButton);
        escapeButton.addEventListener('click', handleEscapeButtonClick);
        // Podrías añadir 'focus' también si quieres que se mueva al tabular
        escapeButton.addEventListener('focus', moveEscapeButton);
    }

    function moveEscapeButton() {
        const button = escapeButton;
        const container = mainScreen; // Moverse dentro de la pantalla principal

        // Asegurar que el botón tenga position:absolute y la clase 'escaping'
         if (!button.classList.contains('escaping')) {
             button.classList.add('escaping');
             // Podrías necesitar ajustar el contenedor del botón si afecta al layout
         }

        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Calcular límites seguros dentro del contenedor
        // Restamos las dimensiones del botón para que no se salga por la derecha/abajo
        // Añadimos un pequeño padding para que no quede pegado a los bordes
        const padding = 15;
        const maxX = containerRect.width - buttonRect.width - padding;
        const maxY = containerRect.height - buttonRect.height - padding;
        const minX = padding;
        const minY = padding; // No moverse por encima de la parte superior

        // Generar posiciones aleatorias
        let randomX = Math.random() * (maxX - minX) + minX;
        let randomY = Math.random() * (maxY - minY) + minY;

        // Intentar evitar que se ponga encima del botón "Aceptar" (aproximado)
         const acceptRect = acceptButton.getBoundingClientRect();
         // Convertir coordenadas de acceptRect relativas a mainScreen
         const acceptTop = acceptRect.top - containerRect.top;
         const acceptLeft = acceptRect.left - containerRect.left;
         const acceptBottom = acceptTop + acceptRect.height;
         const acceptRight = acceptLeft + acceptRect.width;

         // Si la posición aleatoria cae sobre el botón aceptar, intentar otra vez (simple check)
         let attempts = 0;
         while (attempts < 10 && // Evitar bucle infinito
                randomX < acceptRight + padding && randomX + buttonRect.width > acceptLeft - padding &&
                randomY < acceptBottom + padding && randomY + buttonRect.height > acceptTop - padding) {
            randomX = Math.random() * (maxX - minX) + minX;
            randomY = Math.random() * (maxY - minY) + minY;
            attempts++;
         }


        // Aplicar nueva posición (relativa a mainScreen)
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
    }

    function handleEscapeButtonClick() {
        escapeButton.style.display = 'none'; // Ocultar el botón
        escapeMessage.style.display = 'block'; // Mostrar el mensaje
        // Opcional: remover listeners para que no se siga moviendo si reaparece
        // escapeButton.removeEventListener('mouseover', moveEscapeButton);
        // escapeButton.removeEventListener('focus', moveEscapeButton);
    }

}); // Fin del DOMContentLoaded