// Buscamos el formulario en la página usando su id.
const form = document.getElementById('formulario');
// Buscamos el elemento donde mostramos mensajes generales de error o éxito.
const formResult = document.getElementById('formResult');
// Lista de los campos que vamos a validar.
// Cada campo tiene un id que coincide con el input en el HTML.
const fields = [
{ id: 'nombre', label: 'Nombre' },
{ id: 'apellido', label: 'Apellido' },
{ id: 'email', label: 'Email' },
{ id: 'date', label: 'Fecha de nacimiento' },
{ id: 'password', label: 'Contraseña' },
{ id: 'confirmPassword', label: 'Confirmar contraseña' }
];
// Expresión regular para validar que solo haya letras.
// Incluye letras con acentos y la ñ para español.
const regexTexto = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
// Expresión regular básica para validar el formato del email.
const regexEmail = /^[^\s@]+@ucasal+\.[^\s@]+$/;
// Esta función muestra un error visual para un input específico.
// input: el elemento HTML del campo.
// message: el texto del error que queremos mostrar.
// Se usa cuando el valor es inválido.
function setError(input, message) {
    // Agrega la clase de Bootstrap que pinta el borde y el mensaje de error.
    input.classList.add('is-invalid');
// Si el campo estaba marcado como válido, lo quitamos.
    input.classList.remove('is-valid');
// El mensaje de error se coloca en el div que está justo después del input.
    const feedback = input.nextElementSibling;
    if (feedback) feedback.textContent = message;
}
// Esta función limpia el error de un input y lo marca como correcto.
function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = input.nextElementSibling;
    if (feedback) feedback.textContent = '';
}
// Esta función valida un solo campo del formulario.
// id: el identificador del input que queremos validar.
// Devuelve true si el campo está correcto, false si tiene un error.
function validateField(id) {
// busca del html , un id que tenga el nombre
    const input = document.getElementById(id);
// Obtenemos el id ingresado y quitamos espacios al inicio y final e obtengo su valor 
    const value = input.value.trim();
// Suponemos que el campo es válido hasta encontrar un error.
// banderas
    let valid = true;
    let message = '';
// Si el campo está vacío, ya sabemos que es incorrecto.
    if (value === '') {
        valid = false;
        message = 'Este campo es obligatorio.';
    } else {
// Validación según el tipo de campo.
        switch (id) {
            case 'nombre':
            case 'apellido':
// Nombre y apellido deben tener al menos 3 letras.
                if (value.length < 3) {
                    valid = false;
                    message = 'Debe tener al menos 3 caracteres de letra';
                } else if (!regexTexto.test(value)) {
// No permitimos números ni símbolos.
                    valid = false;
                    message = 'Solo se permiten letras.';
                }
                break;
            case 'email':
// Verificamos que el email siga un formato básico válido.
                if (!regexEmail.test(value)) {
                    valid = false;
                    message = 'Ingrese un email válido.';
                }
                break;
            case 'date': {
                // guarda el valor que ingreso el usuario
                const fechNacimiento = new Date(value);
                // guardara la fecha actualizada para realizar la resta
                const fecha_actual = new Date();
                // el metodo get.(permite separar los datos del tipo date)
                // let se usa para valores de variables que cambiaran y const para los q no
                // hago la diferencia de anos
                let edad = fecha_actual.getFullYear() - fechNacimiento.getFullYear();
                // diferencia de meses
                const meses = fecha_actual.getMonth() - fechNacimiento.getMonth();

                if (meses < 0 || (meses === 0 && fecha_actual.getDate() < fechNacimiento.getDate())){
                    edad--;
                }                
                if (edad <= 18 || edad>= 40) {
                    valid = false;
                    message = 'Debes ser mayor a 18 y menor a 40 , Su edad es ' + edad ;
                }
                break;
            }
            case 'password':
// La contraseña debe tener al menos 6 caracteres.
                if (value.length < 6) {
                    valid = false;
                    message = 'La contraseña debe tener al menos 6 caracteres.';
                }
                break;
            case 'confirmPassword':
// Comparamos con el valor del campo password.
            const password = document.getElementById('password').value;
            if (value !== password) {
                valid = false;
                message = 'Las contraseñas no coinciden.';
            }
            break;
        default:
            break;
    }
}
// Si el campo es válido, quitamos el estilo de error.
if (valid) {
    clearError(input);
} else {
// Si hay error, lo mostramos.
    setError(input, message);
}
return valid;
}
/*
// Recorremos cada campo para agregar la validación en tiempo real.
fields.forEach(field => {
const input = document.getElementById(field.id);
input.addEventListener('input', () => validateField(field.id));
});
*/
// Este evento se dispara cuando el usuario hace clic en el botón Enviar.
// Su propósito es validar el formulario completo antes de aceptar los datos.
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que la página se recargue automáticamente.
// Limpiamos el mensaje general anterior para mostrar uno nuevo.
    formResult.className = 'alert d-none';
    formResult.textContent = '';
// Recorremos todos los campos y ejecutamos validateField para cada uno.
// Si alguno falla, allValid será false.
// field tendra el valor de la funcion validatefield
    const allValid = fields.every(field => validateField(field.id));
    // si algun valor no es valido
    if (!allValid) {
// Si hay errores, mostramos un mensaje general de advertencia.
        formResult.className = 'alert alert-danger';
        formResult.textContent = 'Corriga los errores en el formulario, por favor antes de enviar.';
        return; // No enviamos el formulario porque hay errores.
    }
// Si todos los campos son válidos, mostramos un mensaje de éxito.
    formResult.className = 'alert alert-success';
    formResult.textContent = 'Formulario enviado correctamente.';
// Reiniciamos el formulario para dejarlo limpio.
    form.reset();
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        input.classList.remove('is-valid');
    });
});
