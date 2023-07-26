function obtenerSimetria() {
    const dia = obtenerValor(" día de nacimiento (dd)");
    const mes = obtenerValor(" mes de nacimiento (mm)");
    const anio = obtenerValor(" año de nacimiento (aaaa)");

    let resultado = dia + mes + anio;

    while (resultado > 9) {
        resultado = sumarDigitos(resultado);
    }

    alert("Si simetría es la número: " + resultado);
    console.log("Si simetría es la número: " + resultado);
}

function obtenerValor(etiqueta) {
    let valor = prompt("Ingrese su" + etiqueta + ":");
    valor = parseFloat(valor);

    if (isNaN(valor)) {
        alert("Por favor, ingrese un valor numérico válido.");
        valor = obtenerValor(etiqueta);
    }

    return valor;
}

function sumarDigitos(numero) {
    let suma = 0;

    while (numero) {
        suma += numero % 10;
        numero = Math.floor(numero / 10);
    }

    return suma;
}

// Llamamos a la función para que se ejecute al cargar el script.
obtenerSimetria();