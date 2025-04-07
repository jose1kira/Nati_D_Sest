document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTES Y VARIABLES ---
    const SECRET_WORD = 'secreto123'; // ¡CAMBIA ESTO POR TU PALABRA SECRETA!

    // Elementos de la Pantalla de Acceso
    const accessScreen = document.getElementById('access-screen');
    const accessForm = document.getElementById('access-form');
    const secretInput = document.getElementById('secret-word');
    const errorMessage = document.getElementById('error-message');

    // Elementos de la Pantalla Principal
    const mainScreen = document.getElementById('main-screen');
    const quoteList = document.getElementById('quote-list');
    const quoteItems = document.querySelectorAll('.quote-item'); // NodeList de todos los <li>
    const selectedQuoteDisplay = document.getElementById('selected-quote-display');
    const confirmButton = document.getElementById('confirm-button');
    const confirmationMessage = document.getElementById('confirmation-message');

    // Variable para guardar la cita seleccionada
    let currentSelectedQuoteText = null;
    let currentSelectedItem = null; // Para rastrear el elemento li seleccionado

    // --- LÓGICA DE ACCESO ---
    accessForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional
        const enteredWord = secretInput.value;

        if (enteredWord === SECRET_WORD) {
            // Palabra correcta: Ocultar pantalla de acceso, mostrar pantalla principal
            accessScreen.classList.add('hidden'); // Oculta pantalla acceso
            mainScreen.classList.remove('hidden'); // Muestra pantalla principal
            errorMessage.textContent = ''; // Limpiar mensaje de error si lo hubiera
        } else {
            // Palabra incorrecta
            errorMessage.textContent = 'Palabra secreta incorrecta. Inténtalo de nuevo.';
            secretInput.value = ''; // Limpiar el campo
            secretInput.focus(); // Poner el foco de nuevo en el input
        }
    });

    // --- LÓGICA DE SELECCIÓN DE CITAS ---
    quoteItems.forEach(item => {
        item.addEventListener('click', () => {
            handleQuoteSelection(item);
        });

        // Permitir selección con la tecla Enter para accesibilidad
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') { // Barra espaciadora también
                 event.preventDefault(); // Evitar scroll si se usa espacio
                 handleQuoteSelection(item);
            }
        });
    });

    function handleQuoteSelection(selectedItem) {
         // Quitar la clase 'selected' del item anteriormente seleccionado (si existe)
         if (currentSelectedItem) {
            currentSelectedItem.classList.remove('selected');
        }

        // Obtener el texto de la cita
        currentSelectedQuoteText = selectedItem.textContent;

        // Mostrar la cita en la caja derecha
        selectedQuoteDisplay.innerHTML = `<p>"${currentSelectedQuoteText}"</p>`; // Usar innerHTML para renderizar como párrafo

        // Marcar el nuevo item como seleccionado
        selectedItem.classList.add('selected');
        currentSelectedItem = selectedItem; // Actualizar el item actualmente seleccionado

        // Limpiar mensaje de confirmación si se selecciona una nueva cita
        confirmationMessage.textContent = '';
    }


    // --- LÓGICA DEL BOTÓN DE CONFIRMACIÓN (SIMULACIÓN DE ENVÍO) ---
    confirmButton.addEventListener('click', () => {
        if (currentSelectedQuoteText) {
            // --- SIMULACIÓN DE ENVÍO DE CORREO ---
            console.log('--- Simulación de Envío de Correo ---');
            console.log('Destinatario: [Correo del destinatario]'); // Aquí iría la lógica real
            console.log('Asunto: Nueva cita seleccionada');
            console.log('Cuerpo del mensaje:');
            console.log(`La cita seleccionada es: "${currentSelectedQuoteText}"`);
            console.log('--- Fin Simulación ---');

            // Mostrar mensaje de confirmación al usuario
            confirmationMessage.textContent = `¡Cita "${currentSelectedQuoteText.substring(0, 30)}..." seleccionada! (Simulación de envío exitosa - revisa la consola).`;
            confirmationMessage.className = 'success'; // Asegurar clase de éxito

            // Aquí es donde llamarías a tu función real de envío (p.ej., usando fetch con una API o EmailJS)
            // Ejemplo con EmailJS (requiere configuración previa):
            /*
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                selected_quote: currentSelectedQuoteText,
                // otros parámetros de tu plantilla...
            }).then(function(response) {
               console.log('SUCCESS!', response.status, response.text);
               confirmationMessage.textContent = '¡Correo enviado con éxito!';
               confirmationMessage.className = 'success';
            }, function(error) {
               console.log('FAILED...', error);
               confirmationMessage.textContent = 'Error al enviar el correo.';
               confirmationMessage.className = 'error';
            });
            */

        } else {
            // Si no se ha seleccionado ninguna cita
            confirmationMessage.textContent = 'Por favor, selecciona una cita de la lista primero.';
            confirmationMessage.className = 'error'; // Usar clase de error
        }
    });

}); // Fin del DOMContentLoaded