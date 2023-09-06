let estudios = [];
let contenedorResultados = document.getElementById("contenedor-resultados");
let indiceModificacion = -1; // Se agregó una variable global para identificar los estudios que se estén modificando

const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

// Aquí se genera una referencia para los datos que se van a cargar en el formulario (Día y Mes) desde un desplegable
const diaSelect = document.getElementById("dia");
const mesSelect = document.getElementById("mes");

// Genera las opciones para el desplegable de día (del 1 al 31)
for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    diaSelect.appendChild(option);
}

// Genera las opciones para el gesplegable de mes (del 1 al 12)
for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    mesSelect.appendChild(option);
}

function filtrarYMostrarEstudios(criterio) {
    let estudiosFiltrados = [...estudios]; // Aquí se crea una copia de los estudios para poder asignar filtros y ordenamientos

    switch (criterio) {
        case 'nombre':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'nombre');
            break;
        case 'fecha':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'fecha de nacimiento');
            break;
        case 'simetría':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'simetría');
            break;
        case 'id':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'id');
            break;
        case 'sexo':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'sexo');
            break;
    }

    mostrarEstudios(estudiosFiltrados); // Se muestran los estudios dependiendo la selección de filtro que se haya realizado
}

function ordenarEstudios(estudios, criterio) {
    return [...estudios].sort((a, b) => {
        if (criterio === 'fecha de nacimiento') {
            const fechaA = parseFecha(a["fecha de nacimiento"]);
            const fechaB = parseFecha(b["fecha de nacimiento"]);
            return fechaA.getTime() - fechaB.getTime();
        }
        return a[criterio] < b[criterio] ? -1 : a[criterio] > b[criterio] ? 1 : 0;
    });
}

// Función para analizar fechas en formato escrito "6 de junio del año 1978" necesario para el filtro de orden por fecha de nacimiento
function parseFecha(fechaStr) {
    const partes = fechaStr.split(' ');
    const dia = parseInt(partes[0]);
    const mes = obtenerNumeroMes(partes[2]);
    const anio = parseInt(partes[5]);
    return new Date(anio, mes, dia);
}

// Función para obtener el número del mes a partir de su nombre en español necesario para el filtro de orden por fecha de nacimiento
function obtenerNumeroMes(nombreMes) {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return meses.indexOf(nombreMes.toLowerCase());
}

// Esta función se ejecutará cuando la página haya cargado completamente.
document.addEventListener("DOMContentLoaded", function() {
    // Estos son los eventos click para los filtros
    document.getElementById("filtro-id").addEventListener("click", () => filtrarYMostrarEstudios('id'));
    document.getElementById("filtro-nombre").addEventListener("click", () => filtrarYMostrarEstudios('nombre'));
    document.getElementById("filtro-fecha").addEventListener("click", () => filtrarYMostrarEstudios('fecha'));
    document.getElementById("filtro-simetría").addEventListener("click", () => filtrarYMostrarEstudios('simetría'));
    document.getElementById("filtro-sexo").addEventListener("click", () => filtrarYMostrarEstudios('sexo'));

    // Aquí se llama a la función para mostrar los estudios luego de la aplicación de los filtros
    cargarEstudiosDesdeAlmacenamiento();
});

// En este lugar, obtenemos las referencias de los datos cargados por el usuario en el formulario
const sexoInput = document.getElementById("sexo");
const nombreInput = document.getElementById("nombre");
const diaInput = document.getElementById("dia");
const mesInput = document.getElementById("mes");
const anioInput = document.getElementById("anio");

const addButton = document.getElementById("agregar");

addButton.addEventListener("click", agregarEstudio);

function agregarEstudio() {
    const nombre = nombreInput.value;
    const dia = parseInt(diaInput.value);
    const mes = parseInt(mesInput.value);
    const anio = parseInt(anioInput.value);
    const sexo = sexoInput.value;

    let resultado = dia + mes + anio;
    while (resultado > 9) {
        resultado = sumarDigitos(resultado);
    }

    const fechaNacimiento = `${dia} de ${meses[mes - 1]} del año ${anio}`;

    const estudio = {
        nombre: nombre,
        "fecha de nacimiento": fechaNacimiento,
        simetría: resultado,
        sexo: sexo
    };

    if (indiceModificacion !== -1) {
        // Aquí chequeamos si se está modificando un estudio ya realizado.
        estudios[indiceModificacion] = estudio;
        indiceModificacion = -1; // En este espacio reestablecemos el índice si así fuera
    } else {
        // Si no se cumple lo anterior, creamos un nuevo estudio
        estudios.push(estudio);
    }

    // Restablecer el atributo data-id
    addButton.removeAttribute("data-id");

    // Llama a la función para asignar IDs
    asignarIdsAEstudios();

    // Mostrar los estudios después de guardarlos
    mostrarEstudios();

    // Aquí comprobamos si hay o no un estudio ya realizado
    if (estudios.length === 1) {
        // Se oculta el mensaje de "Usted todavía no realizó ningún estudio" si hay estudios
        document.getElementById("mensaje-no-estudios").style.display = "none";
        document.getElementById("mensaje-no-estudios-ayuda").style.display = "none";
    }

    // Mostrar siempre la sección de "Sus estudios realizados"
    document.getElementById("contenedor-resultados").style.display = "block";

    // Se limpia el formulario después de agregar o modificar un estudio para que no queden cargados los datos
    nombreInput.value = "";
    diaInput.value = "";
    mesInput.value = "";
    anioInput.value = "";
    sexoInput.value = "";

    // Guardar los estudios en el local storage
    guardarEstudiosEnAlmacenamiento();
}

function sumarDigitos(numero) {
    let suma = 0;
    while (numero) {
        suma += numero % 10;
        numero = Math.floor(numero / 10);
    }
    return suma;
}

function mostrarEstudios(estudiosAMostrar = estudios) {
    const container = document.getElementById("resultados");
    container.innerHTML = '';

    estudiosAMostrar.forEach((estudio, indice) => {
        const div = document.createElement('div');
        div.classList.add('tarjeta');

        // Obtener el ID del estudio (índice original del local storage + 1)
        const id = estudio.id;

        // Crear botones para eliminar y modificar cada estudio
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => eliminarEstudio(estudio)); // Pasa el objeto del estudio

        const modifyButton = document.createElement('button');
        modifyButton.textContent = 'Modificar';
        modifyButton.addEventListener('click', () => modificarEstudio(estudio.id)); // Pasa el id del estudio

        // Crear párrafos para mostrar el ID y otros detalles del estudio de forma más ordenada
        const idParagraph = document.createElement('p');
        idParagraph.textContent = `ID: ${id}`;

        const nombreParagraph = document.createElement('p');
        nombreParagraph.textContent = `Nombre: ${estudio.nombre}, Sexo: ${estudio.sexo}`;

        const fechaParagraph = document.createElement('p');
        fechaParagraph.textContent = `Fecha de Nacimiento: ${estudio["fecha de nacimiento"]}`;

        const simetriaParagraph = document.createElement('p');
        simetriaParagraph.textContent = `Simetría: ${estudio.simetría}`;

        // Agregar párrafos y botones al div
        div.appendChild(idParagraph);
        div.appendChild(nombreParagraph);
        div.appendChild(fechaParagraph);
        div.appendChild(simetriaParagraph);
        div.appendChild(deleteButton);
        div.appendChild(modifyButton);

        container.appendChild(div);
    });
}

function eliminarEstudio(estudio) {
    const index = estudios.findIndex(e => e.id === estudio.id);
    if (index !== -1) {
        estudios.splice(index, 1); // Eliminar el estudio
        mostrarEstudios(); // Actualizar la vista
        guardarEstudiosEnAlmacenamiento(); // Guarda los estudios después de eliminar uno

        // Comprobación si es el primer estudio
        if (estudios.length === 1) {
            // Ocultar el mensaje de "Usted todavía no realizó ningún estudio"
            document.getElementById("mensaje-no-estudios").style.display = "none";
            document.getElementById("mensaje-no-estudios-ayuda").style.display = "none";

            // Mostrar la sección de "Sus estudios realizados"
            document.getElementById("contenedor-resultados").style.display = "block";
        } else if (estudios.length === 0) {
            // No se encontraron estudios, ocultar la sección de "Sus estudios realizados"
            document.getElementById("contenedor-resultados").style.display = "none";

            // Mostrar el mensaje de "Usted todavía no realizó ningún estudio"
            document.getElementById("mensaje-no-estudios").style.display = "block";
            document.getElementById("mensaje-no-estudios-ayuda").style.display = "block";
        }
    }
}

// Función para modificar datos de un estudio
function modificarEstudio(id) {
    const index = estudios.findIndex(estudio => estudio.id === id);
    if (index !== -1) {
        // Obtener el estudio que queremos modificar
        const estudio = estudios[index];

        // Llena el formulario con todos los datos del estudio
        nombreInput.value = estudio.nombre;
        
        // Divide la fecha de nacimiento en partes para poderla cargar en el form inicial
        const fechaNacimientoParts = estudio["fecha de nacimiento"].split(" ");
        
        // Asigna los valores a los campos del form
        diaInput.value = parseInt(fechaNacimientoParts[0]);
        mesInput.value = meses.indexOf(fechaNacimientoParts[2]) + 1;
        anioInput.value = parseInt(fechaNacimientoParts[5]);

        sexoInput.value = estudio.sexo;

        // Establece el índice de modificación
        indiceModificacion = index;

        // Actualizar la vista
        mostrarEstudios();
    }
}

// Función para guardar los estudios en el almacenamiento en localStorage
function guardarEstudiosEnAlmacenamiento() {
    // Convierte la información del estudio en una cadena JSON
    const estudiosJson = JSON.stringify(estudios);

    // Guarda la cadena JSON en localStorage
    localStorage.setItem('estudios', estudiosJson);
}

// Función para asignar el ID a cada estudio
function asignarIdsAEstudios() {
    estudios.forEach((estudio, index) => {
        estudio.id = index + 1;
    });
}

// Función para cargar los estudios desde el almacenamiento (localStorage)
function cargarEstudiosDesdeAlmacenamiento() {
    // Intenta obtener los datos de estudios desde localStorage
    const estudiosJson = localStorage.getItem('estudios');

    // Si se encuentran datos en el almacenamiento, convierte la cadena JSON a un array
    if (estudiosJson) {
        const estudiosCargados = JSON.parse(estudiosJson);

        // Asigna un campo "id" a cada estudio
        estudios = estudiosCargados;

        // Llama a la función para asignar IDs
        asignarIdsAEstudios();

        // Muestra los estudios después de cargarlos y asignar los IDs
        mostrarEstudios();

        // Ocultar el mensaje de "Usted todavía no realizó ningún estudio"
        document.getElementById("mensaje-no-estudios").style.display = "none";
        document.getElementById("mensaje-no-estudios-ayuda").style.display = "none";

        // Mostrar la sección de "Sus estudios realizados"
        document.getElementById("contenedor-resultados").style.display = "block";
    } else {
        // No se encontraron estudios, ocultar la sección de "Sus estudios realizados"
        document.getElementById("contenedor-resultados").style.display = "none";

        // Mostrar el mensaje de "Usted todavía no realizó ningún estudio"
        document.getElementById("mensaje-no-estudios").style.display = "block";
        document.getElementById("mensaje-no-estudios-ayuda").style.display = "block";
    }
}