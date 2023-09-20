let estudios = []
let contenedorResultados = document.getElementById("contenedor-resultados")
let indiceModificacion = -1

const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]

function cargarSelects(diaSelect, mesSelect) {
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement("option")
        option.value = i
        option.text = i
        diaSelect.appendChild(option)
    }

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option")
        option.value = i
        option.text = i
        mesSelect.appendChild(option)
    }
}

function filtrarYMostrarEstudios(criterio, estudios, contenedorResultados) {
    let estudiosFiltrados = [...estudios]
    switch (criterio) {
        case 'nombre':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'nombre')
            break
        case 'fecha':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'fecha de nacimiento')
            break
        case 'simetría':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'simetría')
            break
        case 'id':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'id')
            break
        case 'sexo':
            estudiosFiltrados = ordenarEstudios(estudiosFiltrados, 'sexo')
            break
    }

    mostrarEstudios(estudiosFiltrados, contenedorResultados)
}

function ordenarEstudios(estudios, criterio) {
    return [...estudios].sort((a, b) => {
        if (criterio === 'fecha de nacimiento') {
            const fechaA = parseFecha(a["fecha de nacimiento"])
            const fechaB = parseFecha(b["fecha de nacimiento"])
            return fechaA.getTime() - fechaB.getTime()
        }
        return a[criterio] < b[criterio] ? -1 : a[criterio] > b[criterio] ? 1 : 0
    })
}

function parseFecha(fechaStr) {
    const partes = fechaStr.split(' ')
    const dia = parseInt(partes[0])
    const mes = obtenerNumeroMes(partes[2])
    const anio = parseInt(partes[5])
    return new Date(anio, mes, dia)
}

function obtenerNumeroMes(nombreMes) {
    return meses.indexOf(nombreMes.toLowerCase())
}

document.addEventListener("DOMContentLoaded", function() {
    const diaSelect = document.getElementById("dia")
    const mesSelect = document.getElementById("mes")
    const contenedorResultados = document.getElementById("contenedor-resultados")

    cargarSelects(diaSelect, mesSelect)

    document.getElementById("filtro-id").addEventListener("click", () => filtrarYMostrarEstudios('id', estudios, contenedorResultados))
    document.getElementById("filtro-nombre").addEventListener("click", () => filtrarYMostrarEstudios('nombre', estudios, contenedorResultados))
    document.getElementById("filtro-fecha").addEventListener("click", () => filtrarYMostrarEstudios('fecha', estudios, contenedorResultados))
    document.getElementById("filtro-simetría").addEventListener("click", () => filtrarYMostrarEstudios('simetría', estudios, contenedorResultados))
    document.getElementById("filtro-sexo").addEventListener("click", () => filtrarYMostrarEstudios('sexo', estudios, contenedorResultados))

    filtrarYMostrarEstudios('id', estudios, contenedorResultados)

    cargarEstudiosDesdeAlmacenamiento(estudios)
    cargarEstudiosArchivados('estudios-archivados', estudios)
})

const sexoInput = document.getElementById("sexo")
const nombreInput = document.getElementById("nombre")
const diaInput = document.getElementById("dia")
const mesInput = document.getElementById("mes")
const anioInput = document.getElementById("anio")

const addButton = document.getElementById("agregar")

addButton.addEventListener("click", () => agregarEstudio(estudios, nombreInput, diaInput, mesInput, anioInput, sexoInput))

function agregarEstudio(estudios, nombreInput, diaInput, mesInput, anioInput, sexoInput) {
    const nombre = nombreInput.value
    const dia = parseInt(diaInput.value)
    const mes = parseInt(mesInput.value)
    const anio = parseInt(anioInput.value)
    const sexo = sexoInput.value

    if (!nombre || isNaN(dia) || isNaN(mes) || isNaN(anio) || !sexo) {
        Swal.fire({
            icon: 'error',
            title: 'Faltan completar datos',
            text: 'Por favor chequee que estén todos los datos cargados y vuelva a intentarlo',
        })
        return
    }

    let resultado = dia + mes + anio
    while (resultado > 9) {
        resultado = sumarDigitos(resultado)
    }

    const fechaNacimiento = `${dia} de ${meses[mes - 1]} del año ${anio}`

    const estudio = {
        nombre: nombre,
        "fecha de nacimiento": fechaNacimiento,
        simetría: resultado,
        sexo: sexo
    }

    Swal.fire({
        icon: 'info',
        title: 'Por favor, confirme los datos del estudio',
        html: `
            <div>
                <p>Nombre: ${nombre}</p>
                <p>Fecha de Nacimiento: ${fechaNacimiento}</p>
                <p>Sexo: ${sexo}</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Realizar estudio',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            if (indiceModificacion !== -1) {
                estudios[indiceModificacion] = estudio
                indiceModificacion = -1
            } else {
                estudios.push(estudio)
            }

            addButton.removeAttribute("data-id")
            asignarIdsAEstudios(estudios)

            mostrarEstudios(estudios, contenedorResultados)

            if (estudios.length === 1) {
                document.getElementById("mensaje-no-estudios").style.display = "none"
                document.getElementById("mensaje-no-estudios-ayuda").style.display = "none"
                document.getElementById("contenedor-sin-estudios").style.display = "none"
            }

            document.getElementById("contenedor-resultados").style.display = "block"

            nombreInput.value = ""
            diaInput.value = ""
            mesInput.value = ""
            anioInput.value = ""
            sexoInput.value = ""

            guardarEstudiosEnAlmacenamiento(estudios)
            cargarEstudiosDesdeAlmacenamiento(estudios)
        }
    })
}

function sumarDigitos(numero) {
    let suma = 0
    while (numero) {
        suma += numero % 10
        numero = Math.floor(numero / 10)
    }
    return suma
}

function mostrarEstudios(estudiosAMostrar = estudios) {
    const container = document.getElementById("resultados")
    container.innerHTML = ""

    estudiosAMostrar.forEach((estudio, indice) => {
        const div = document.createElement("div")
        div.classList.add("tarjeta")

        const id = estudio.id

        const infoContainer = document.createElement("div")
        infoContainer.classList.add("info-container")

        const idParagraph = document.createElement("p")
        idParagraph.textContent = `Número de Estudio: ${id}`
        idParagraph.classList.add("id-estudios")

        const simetriaParagraph = document.createElement("p")
        simetriaParagraph.textContent = `Simetría: ${estudio.simetría}`
        simetriaParagraph.classList.add("simetria-num-estudios")

        const simetriaImagen = document.createElement('img')
        simetriaImagen.src = `./img/Simetria${estudio.simetría}.png`
        simetriaImagen.alt = `Simetría ${estudio.simetría}`
        simetriaImagen.classList.add('imagen-simetria')

        const nombreParagraph = document.createElement("p")
        nombreParagraph.innerHTML = `<strong>Nombre:</strong> ${estudio.nombre}`
        nombreParagraph.classList.add("nombre-estudios")

        const fechaParagraph = document.createElement("p")
        fechaParagraph.innerHTML = `<strong>Fecha de Nacimiento:</strong> </br>${estudio["fecha de nacimiento"]}`
        fechaParagraph.classList.add("fecha-estudios")

        const sexoParagraph = document.createElement("p")
        sexoParagraph.innerHTML = `<strong>Sexo:</strong> ${estudio.sexo}`
        sexoParagraph.classList.add("sexo-estudios")

        infoContainer.appendChild(idParagraph)
        infoContainer.appendChild(simetriaImagen)
        infoContainer.appendChild(simetriaParagraph)
        infoContainer.appendChild(nombreParagraph)
        infoContainer.appendChild(fechaParagraph)
        infoContainer.appendChild(sexoParagraph)

        const buttonsContainer = document.createElement("div")
        buttonsContainer.classList.add("buttons-container")

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Eliminar"
        deleteButton.addEventListener("click", () => eliminarEstudio(estudio, estudios))
        deleteButton.classList.add("btn-eliminar")

        const modifyButton = document.createElement("button")
        modifyButton.textContent = "Modificar"
        modifyButton.addEventListener("click", () => modificarEstudio(estudio.id, estudios))
        modifyButton.classList.add("btn-modificar")

        buttonsContainer.appendChild(deleteButton)
        buttonsContainer.appendChild(modifyButton)

        div.appendChild(infoContainer)
        div.appendChild(buttonsContainer)

        container.appendChild(div)
    })
}

function eliminarEstudio(estudio, estudios) {
    Swal.fire({
        icon: 'question',
        title: '¿Está seguro de que desea eliminar este estudio?',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            const index = estudios.findIndex(e => e.id === estudio.id)
            if (index !== -1) {
                estudios.splice(index, 1)
                mostrarEstudios(estudios, contenedorResultados)
                guardarEstudiosEnAlmacenamiento(estudios)

                if (estudios.length === 1) {
                    document.getElementById("mensaje-no-estudios").style.display = "none"
                    document.getElementById("mensaje-no-estudios-ayuda").style.display = "none"
                    document.getElementById("contenedor-sin-estudios").style.display = "none"
                } else if (estudios.length === 0) {
                    document.getElementById("contenedor-resultados").style.display = "none"
                    document.getElementById("mensaje-no-estudios").style.display = "block"
                    document.getElementById("mensaje-no-estudios-ayuda").style.display = "block"
                    document.getElementById("contenedor-sin-estudios").style.display = "block"
                }
            }
        }
    })
}

function modificarEstudio(id, estudios) {
    const index = estudios.findIndex(estudio => estudio.id === id)
    if (index !== -1) {
        const estudio = estudios[index]
        nombreInput.value = estudio.nombre

        const fechaNacimientoParts = estudio["fecha de nacimiento"].split(" ")
        diaInput.value = parseInt(fechaNacimientoParts[0])
        mesInput.value = meses.indexOf(fechaNacimientoParts[2]) + 1
        anioInput.value = parseInt(fechaNacimientoParts[5])

        sexoInput.value = estudio.sexo

        indiceModificacion = index

        mostrarEstudios(estudios, contenedorResultados)
    }
}

function guardarEstudiosEnAlmacenamiento(estudios) {
    const estudiosJson = JSON.stringify(estudios)
    localStorage.setItem('estudios', estudiosJson)
}

function asignarIdsAEstudios(estudios) {
    estudios.forEach((estudio, index) => {
        estudio.id = index + 1
    })
}

function cargarEstudiosDesdeAlmacenamiento(estudios) {
    const estudiosJson = localStorage.getItem('estudios')
    if (estudiosJson) {
        const estudiosCargados = JSON.parse(estudiosJson)
        estudios.length = 0
        estudios.push(...estudiosCargados)
        asignarIdsAEstudios(estudios)
        mostrarEstudios(estudios, contenedorResultados)

        if (estudios.length === 1) {
            document.getElementById("mensaje-no-estudios").style.display = "none"
            document.getElementById("mensaje-no-estudios-ayuda").style.display = "none"
            document.getElementById("contenedor-sin-estudios").style.display = "none"
        } else if (estudios.length === 0) {
            document.getElementById("contenedor-resultados").style.display = "none"
            document.getElementById("mensaje-no-estudios").style.display = "block"
            document.getElementById("mensaje-no-estudios-ayuda").style.display = "block"
            document.getElementById("contenedor-sin-estudios").style.display = "block"
        }
    }
}

function cargarEstudiosArchivados(contenedor, estudios) {
    const rutaArchivo = '../data/data.json'
    fetch(rutaArchivo)
        .then(response => response.json())
        .then(data => mostrarEstudiosArchivados(data, contenedor, estudios))
        .catch(error => console.error('Error al cargar el archivo JSON:', error))
}

function mostrarEstudiosArchivados(estudios, contenedor, estudiosActuales) {
    const contenedorElement = document.getElementById(contenedor)
    contenedorElement.innerHTML = ""

    estudios.forEach(estudio => {
        const estudioElemento = document.createElement('div')
        estudioElemento.classList.add('tarjeta-archivados', 'estudio-archivado')

        const nombreElemento = document.createElement('p')
        nombreElemento.textContent = `Nombre: ${estudio.nombre}`

        const fechaElemento = document.createElement('p')
        fechaElemento.textContent = `Fecha de Nacimiento: ${estudio.dia} de ${meses[estudio.mes - 1]} del año ${estudio.anio}`

        const sexoElemento = document.createElement('p')
        sexoElemento.textContent = `Sexo: ${estudio.sexo}`

        const recuperarButton = document.createElement('button')
        recuperarButton.textContent = 'Recuperar Estudio'
        recuperarButton.addEventListener('click', () => recuperarEstudio(estudio, estudiosActuales))

        estudioElemento.appendChild(nombreElemento)
        estudioElemento.appendChild(fechaElemento)
        estudioElemento.appendChild(sexoElemento)
        estudioElemento.appendChild(recuperarButton)

        contenedorElement.appendChild(estudioElemento)
    })
}

function recuperarEstudio(estudio, estudios) {
    const nombre = estudio.nombre
    const dia = estudio.dia
    const mes = estudio.mes
    const anio = estudio.anio
    const sexo = estudio.sexo

    let resultado = dia + mes + anio
    while (resultado > 9) {
        resultado = sumarDigitos(resultado)
    }

    const fechaNacimiento = `${dia} de ${meses[mes - 1]} del año ${anio}`

    const nuevoEstudio = {
        nombre: nombre,
        "fecha de nacimiento": fechaNacimiento,
        simetría: resultado,
        sexo: sexo
    }

    Swal.fire({
        icon: 'info',
        title: 'Por favor, confirme el estudio que desea recuperar',
        html: `
            <div>
                <p>Nombre: ${nombre}</p>
                <p>Fecha de Nacimiento: ${fechaNacimiento}</p>
                <p>Sexo: ${sexo}</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Recuperar estudio',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            estudios.push(nuevoEstudio)
            asignarIdsAEstudios(estudios)
            mostrarEstudios(estudios, contenedorResultados)
            guardarEstudiosEnAlmacenamiento(estudios)

            if (estudios.length === 1) {
                document.getElementById("mensaje-no-estudios").style.display = "none"
                document.getElementById("mensaje-no-estudios-ayuda").style.display = "none"
                document.getElementById("contenedor-sin-estudios").style.display = "none"
            }

            document.getElementById("contenedor-resultados").style.display = "block"
        }
    })
}