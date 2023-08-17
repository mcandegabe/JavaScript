let estudios = [];
let proximoId = 1;

// Datos de ejemplo para todos los datos mediante el Prompt. En la versión final se eliminarían estos datos de ejemplo.
estudios.push({ id: proximoId++, nombre: "miguel", "fecha de nacimiento": "14 de junio del año 1981", simetría: "3" });
estudios.push({ id: proximoId++, nombre: "maria", "fecha de nacimiento": "20 de mayo del año 1988", simetría: "6" });
estudios.push({ id: proximoId++, nombre: "emilia", "fecha de nacimiento": "7 de julio del año 2021", simetría: "1" });
estudios.push({ id: proximoId++, nombre: "marcelo", "fecha de nacimiento": "26 de septiembre del año 1950", simetría: "5" });
estudios.push({ id: proximoId++, nombre: "marta", "fecha de nacimiento": "22 de julio del año 1953", simetría: "2" });

function obtenerSimetria() {
    let continuar = true;

    while (continuar) {
        const nombre = obtenerNombre("Ingrese nombre:");
        const dia = obtenerValor(" día de nacimiento (dd)");
        const mes = obtenerValor(" mes de nacimiento (mm)");
        const anio = obtenerValor(" año de nacimiento (aaaa)");

        let resultado = dia + mes + anio;

        while (resultado > 9) {
            resultado = sumarDigitos(resultado);
        }

        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        const fechaNacimiento = `${dia} de ${meses[mes - 1]} del año ${anio}`;

        estudios.push({
            id: proximoId++,
            nombre: nombre,
            "fecha de nacimiento": fechaNacimiento,
            simetría: resultado
        });

        continuar = confirm("Para cargar un nuevo estudio presione en \"Aceptar\", caso contrario presione en \"Cancelar\" para concluir el proceso de carga.");
    }
}

function obtenerNombre(etiqueta) {
    return prompt(etiqueta);
}

function obtenerValor(etiqueta) {
    let valor = prompt("Ingrese su" + etiqueta + ":");
    return parseFloat(valor);
}

function sumarDigitos(numero) {
    let suma = 0;

    while (numero) {
        suma += numero % 10;
        numero = Math.floor(numero / 10);
    }

    return suma;
}

function ordenarSimetria() {
    estudios.sort((a, b) => a.simetría - b.simetría);
}

function filtrarSimetriaPar() {
    const estudiosFiltrados = estudios.filter(estudio => estudio.simetría % 2 === 0);
    return estudiosFiltrados;
}

function upperCaseImpar() {
    const estudiosImpar = estudios.filter(estudio => estudio.simetría % 2 !== 0);
    
    estudiosImpar.forEach(estudioImpar => {
        estudioImpar.nombre = estudioImpar.nombre.toUpperCase();
    });
}

function cambioNombreId() {
    const estudioEncontrado = estudios.find(estudio => estudio.id === 3);

    if (estudioEncontrado) {
        estudioEncontrado["nombre"] = "Emilia Candegabe";
        console.log(`Se cambió el Nombre del estudio con ID 3: ${estudioEncontrado["nombre"]}`);
    } else {
        console.log("No se encontró ningún estudio con ID 3.");
    }
}

// Funciones para ejecutar script principal, filtros y ordenamientos.
obtenerSimetria();

ordenarSimetria();

const estudiosFiltrados = filtrarSimetriaPar();

upperCaseImpar();

cambioNombreId();

// Diferentes console.log que muestran los resultados de la utilización de los métodos sort, filter, etc.
console.log("Estudios con simetría par:");
for (let i = 0; i < estudiosFiltrados.length; i++) {
    const estudio = estudiosFiltrados[i];
    console.log(`ID: ${estudio.id}, nombre: ${estudio.nombre}, fecha de nacimiento: ${estudio["fecha de nacimiento"]}, simetría: ${estudio.simetría}`);
}

console.log("Estudios ordenados por simetría:");
for (let i = 0; i < estudios.length; i++) {
    const estudio = estudios[i];
    console.log(`ID: ${estudio.id}, nombre: ${estudio.nombre}, fecha de nacimiento: ${estudio["fecha de nacimiento"]}, simetría: ${estudio.simetría}`);
}

console.log("Estudios con nombres en mayúscula y simetría impar:");
for (let i = 0; i < estudios.length; i++) {
    const estudio = estudios[i];
    console.log(`ID: ${estudio.id}, nombre: ${estudio.nombre}, fecha de nacimiento: ${estudio["fecha de nacimiento"]}, simetría: ${estudio.simetría}`);
}
