const configuracionValidacion = {
    limites: {
        texto: 100,
        contrasenaMinima: 4,
        contrasenaMaxima: 15,
        telefonoMinimo: 9,
        mensaje: 200,
        cantidadMinima: 1
    },
    mensajes: {
        requeridoNombre: "Este campo es obligatorio.",
        requeridoCorreo: "Ingresa tu correo electrónico.",
        requeridoContrasena: "Ingresa tu contraseña.",
        requeridoTelefono: "Ingresa tu número de contacto.",
        requeridoMensaje: "Escribe un mensaje antes de enviar.",
        requeridoCantidad: "Ingresa una cantidad.",
        nombre: "Usa solo letras, incluidas tildes, y espacios.",
        correo: "Usa un correo válido, por ejemplo nombre.apellido@dominio.com.",
        contrasenaMinima: (minimo) => `La contraseña debe tener al menos ${minimo} caracteres.`,
        contrasenaMayuscula: "Incluye al menos una letra mayúscula.",
        contrasenaMinuscula: "Incluye al menos una letra minúscula.",
        contrasenaNumero: "Incluye al menos un número.",
        contrasenaSimbolo: "Incluye al menos un símbolo, como ! o #.",
        contrasenaMaxima: (maximo) => `La contraseña no puede superar los ${maximo} caracteres.`,
        telefonoCaracteres: "Usa solo números, sin espacios ni símbolos.",
        telefonoMinimo: (minimo) => `El teléfono debe tener al menos ${minimo} números.`,
        mensajeMaximo: (maximo) => `El mensaje no puede superar los ${maximo} caracteres.`,
        cantidadEntera: "Ingresa una cantidad entera.",
        cantidadMinima: (minimo) => `La cantidad mínima es ${minimo}.`,
        cantidadMaxima: (maximo, unidad) => `La cantidad máxima es ${maximo} ${unidad}.`,
        cantidadSinStock: "Este producto ya no tiene unidades disponibles.",
        stockNoComprobado: "No se pudo comprobar el stock. Inténtalo nuevamente.",
        categoria: "Selecciona una categoría disponible o deja todas las categorías.",
        longitudMaxima: (maximo) => `No puede superar los ${maximo} caracteres.`
    }
};

const limitesPorRegla = {
    nombre: configuracionValidacion.limites.texto,
    correo: configuracionValidacion.limites.texto,
    contrasena: configuracionValidacion.limites.contrasenaMaxima,
    telefono: configuracionValidacion.limites.texto,
    mensaje: configuracionValidacion.limites.mensaje
};

const mensajes = configuracionValidacion.mensajes;

function obtenerMensajeValidacion(clave) {
    return mensajes[clave];
}

function obtenerRequisitosContrasena(valor) {
    const limites = configuracionValidacion.limites;

    return {
        longitud: valor.length >= limites.contrasenaMinima,
        mayuscula: /\p{Lu}/u.test(valor),
        minuscula: /\p{Ll}/u.test(valor),
        numero: /\p{N}/u.test(valor),
        simbolo: /[^\p{L}\p{N}\s]/u.test(valor),
        maximo: valor.length <= limites.contrasenaMaxima
    };
}

function actualizarProgresoContrasena(campo) {
    if (campo.dataset.regla !== "contrasena") {
        return;
    }

    const requisitos = obtenerRequisitosContrasena(campo.value);
    const cantidadCumplida = Object.values(requisitos).filter(Boolean).length;
    const progreso = document.getElementById("progreso-contrasena");
    const barraProgreso = document.getElementById("barra-progreso-contrasena");
    const resumenProgreso = document.getElementById("resumen-progreso-contrasena");

    if (progreso) {
        progreso.setAttribute("aria-valuenow", String(cantidadCumplida));
        progreso.setAttribute("aria-valuetext", `${cantidadCumplida} de 6 requisitos cumplidos`);
    }

    if (barraProgreso) {
        barraProgreso.style.width = `${(cantidadCumplida / 6) * 100}%`;
    }

    if (resumenProgreso) {
        resumenProgreso.textContent = `${cantidadCumplida} de 6 requisitos cumplidos.`;
    }

    Object.entries(requisitos).forEach(([requisito, cumplido]) => {
        const elemento = document.querySelector(`[data-requisito-contrasena="${requisito}"]`);
        const estado = elemento?.querySelector("[data-estado-requisito]");

        if (elemento && estado) {
            estado.textContent = cumplido ? "Cumplido" : "Pendiente";
            elemento.classList.toggle("text-success", cumplido);
            elemento.classList.toggle("text-body-secondary", !cumplido);
        }
    });
}

const reglasValidacion = {
    nombre: (valor) => {
        if (!valor.trim()) {
            return mensajes.requeridoNombre;
        }

        return /^[\p{L}\p{M} ]+$/u.test(valor.trim())
            ? ""
            : mensajes.nombre;
    },
    correo: (valor) => {
        const correoLimpio = valor.trim();
        const formatoCorreo = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

        if (!correoLimpio) {
            return mensajes.requeridoCorreo;
        }

        return formatoCorreo.test(correoLimpio)
            ? ""
            : mensajes.correo;
    },
    contrasena: (valor) => {
        if (!valor) {
            return mensajes.requeridoContrasena;
        }

        const requisitos = obtenerRequisitosContrasena(valor);
        const limites = configuracionValidacion.limites;

        if (!requisitos.maximo) {
            return mensajes.contrasenaMaxima(limites.contrasenaMaxima);
        }
        if (!requisitos.longitud) {
            return mensajes.contrasenaMinima(limites.contrasenaMinima);
        }
        if (!requisitos.mayuscula) {
            return mensajes.contrasenaMayuscula;
        }
        if (!requisitos.minuscula) {
            return mensajes.contrasenaMinuscula;
        }
        if (!requisitos.numero) {
            return mensajes.contrasenaNumero;
        }
        if (!requisitos.simbolo) {
            return mensajes.contrasenaSimbolo;
        }

        return "";
    },
    telefono: (valor) => {
        const minimo = configuracionValidacion.limites.telefonoMinimo;

        if (!valor) {
            return mensajes.requeridoTelefono;
        }

        if (!/^\d+$/.test(valor)) {
            return mensajes.telefonoCaracteres;
        }

        return valor.length >= minimo
            ? ""
            : mensajes.telefonoMinimo(minimo);
    },
    mensaje: (valor) => {
        const maximo = configuracionValidacion.limites.mensaje;

        if (!valor.trim()) {
            return mensajes.requeridoMensaje;
        }

        return valor.length <= maximo
            ? ""
            : mensajes.mensajeMaximo(maximo);
    },
    cantidad: (valor, campo) => {
        const limites = configuracionValidacion.limites;

        if (!valor) {
            return mensajes.requeridoCantidad;
        }

        const cantidadIngresada = Number(valor);
        const cantidadMinima = Number(campo.getAttribute("min")) || limites.cantidadMinima;
        const atributoMaximo = campo.getAttribute("max");
        const cantidadMaxima = atributoMaximo === null ? NaN : Number(atributoMaximo);

        if (!Number.isInteger(cantidadIngresada)) {
            return mensajes.cantidadEntera;
        }
        if (cantidadIngresada < cantidadMinima) {
            return mensajes.cantidadMinima(cantidadMinima);
        }
        if (Number.isFinite(cantidadMaxima) && cantidadIngresada > cantidadMaxima) {
            return mensajes.cantidadMaxima(cantidadMaxima, campo.dataset.unidadDisponible || "unidades");
        }

        return "";
    },
    categoria: (valor, campo) => {
        const categoriasPermitidas = [
            "",
            "frutas-frescas",
            "verduras-organicas",
            "productos-organicos",
            "productos-lacteos"
        ];

        return campo.selectedIndex >= 0 && categoriasPermitidas.includes(valor)
            ? ""
            : mensajes.categoria;
    }
};

function mostrarError(campo, mensaje) {
    const elementoMensaje = document.getElementById(campo.dataset.mensaje);
    campo.classList.add("is-invalid");
    campo.setAttribute("aria-invalid", "true");

    if (elementoMensaje) {
        elementoMensaje.textContent = mensaje;
    }
}

function limpiarError(campo) {
    const elementoMensaje = document.getElementById(campo.dataset.mensaje);
    campo.classList.remove("is-invalid");
    campo.removeAttribute("aria-invalid");

    if (elementoMensaje) {
        elementoMensaje.textContent = "";
    }
}

function validarCampo(campo) {
    actualizarProgresoContrasena(campo);
    const regla = reglasValidacion[campo.dataset.regla];
    const mensaje = regla ? regla(campo.value, campo) : "";
    const longitudMaxima = limitesPorRegla[campo.dataset.regla];
    const mensajeFinal = mensaje || (longitudMaxima && campo.value.length > longitudMaxima
        ? mensajes.longitudMaxima(longitudMaxima)
        : "");

    if (mensajeFinal) {
        mostrarError(campo, mensajeFinal);
        return false;
    }

    limpiarError(campo);
    return true;
}

function validarFormulario(formulario) {
    const campos = Array.from(formulario.querySelectorAll("[data-regla]"));
    let formularioValido = true;
    let primerCampoInvalido = null;

    campos.forEach((campo) => {
        if (!validarCampo(campo)) {
            formularioValido = false;
            primerCampoInvalido ||= campo;
        }
    });

    if (primerCampoInvalido) {
        primerCampoInvalido.focus();
    }

    return formularioValido;
}

document.querySelectorAll("[data-regla]").forEach((campo) => {
    const longitudMaxima = limitesPorRegla[campo.dataset.regla];

    if (longitudMaxima) {
        campo.maxLength = longitudMaxima;
    }
});

document.querySelectorAll("form[data-validacion]").forEach((formulario) => {
    formulario.addEventListener("submit", (evento) => {
        if (!validarFormulario(formulario)) {
            evento.preventDefault();
        }
    });
});

document.querySelectorAll("[data-regla]").forEach((campo) => {
    const validarTrasInteraccion = () => validarCampo(campo);

    campo.addEventListener("input", validarTrasInteraccion);
    campo.addEventListener("change", validarTrasInteraccion);
    campo.addEventListener("blur", validarTrasInteraccion);
});

const filtroCategoria = document.getElementById("filtro-categoria");
const productosPorCategoria = document.querySelectorAll("[data-categoria]");
const avisoSinResultados = document.getElementById("sin-resultados");

if (filtroCategoria && avisoSinResultados) {
    const filtrarProductos = () => {
        if (filtroCategoria.selectedIndex < 0) {
            return;
        }

        let cantidadVisible = 0;

        productosPorCategoria.forEach((producto) => {
            const coincide = !filtroCategoria.value
                || producto.dataset.categoria === filtroCategoria.value;

            producto.hidden = !coincide;
            cantidadVisible += coincide ? 1 : 0;
        });

        avisoSinResultados.hidden = cantidadVisible > 0;
    };

    filtroCategoria.addEventListener("change", filtrarProductos);
    filtrarProductos();
}

document.querySelectorAll("[data-contador]").forEach((campo) => {
    const contador = document.getElementById(campo.dataset.contador);
    const actualizarContador = () => {
        if (contador) {
            contador.textContent = `${campo.value.length}/${configuracionValidacion.limites.mensaje} caracteres`;
        }
    };

    campo.addEventListener("input", actualizarContador);
    actualizarContador();
});