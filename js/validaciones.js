const reglasValidacion = {
    nombre: (valor) => {
        if (!valor.trim()) {
            return "Este campo es obligatorio.";
        }

        return /^[\p{L}\p{M} ]+$/u.test(valor.trim())
            ? ""
            : "Usa solo letras, incluidas tildes, y espacios.";
    },
    correo: (valor) => {
        const correoLimpio = valor.trim();
        const formatoCorreo = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

        if (!correoLimpio) {
            return "Ingresa tu correo electrónico.";
        }

        return formatoCorreo.test(correoLimpio)
            ? ""
            : "Usa un correo válido, por ejemplo nombre.apellido@dominio.com.";
    },
    contrasena: (valor) => {
        if (!valor) {
            return "Ingresa tu contraseña.";
        }

        return valor.length <= 15
            ? ""
            : "La contraseña no puede superar los 15 caracteres.";
    },
    telefono: (valor) => {
        if (!valor) {
            return "Ingresa tu número de contacto.";
        }

        if (!/^\d+$/.test(valor)) {
            return "Usa solo números, sin espacios ni símbolos.";
        }

        return valor.length >= 9
            ? ""
            : "El teléfono debe tener al menos 9 números.";
    },
    mensaje: (valor) => {
        if (!valor.trim()) {
            return "Escribe un mensaje antes de enviar.";
        }

        return valor.length <= 200
            ? ""
            : "El mensaje no puede superar los 200 caracteres.";
    },
    cantidad: (valor, campo) => {
        if (!valor) {
            return "Ingresa una cantidad.";
        }

        const cantidadIngresada = Number(valor);
        const cantidadMinima = Number(campo.getAttribute("min")) || 1;

        if (!Number.isInteger(cantidadIngresada)) {
            return "Ingresa una cantidad entera.";
        }

        return cantidadIngresada >= cantidadMinima
            ? ""
            : `La cantidad mínima es ${cantidadMinima}.`;
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
            : "Selecciona una categoría disponible o deja todas las categorías.";
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
    const regla = reglasValidacion[campo.dataset.regla];
    const mensaje = regla ? regla(campo.value, campo) : "";
    const longitudMaxima = Number(campo.getAttribute("maxlength"));
    const mensajeFinal = mensaje || (longitudMaxima && campo.value.length > longitudMaxima
        ? `No puede superar los ${longitudMaxima} caracteres.`
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
            contador.textContent = `${campo.value.length}/200 caracteres`;
        }
    };

    campo.addEventListener("input", actualizarContador);
    actualizarContador();
});