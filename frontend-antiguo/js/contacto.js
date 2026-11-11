const formularioContacto = document.querySelector("form[data-contacto]");
const mensajeContacto = document.getElementById("mensaje-contacto");

if (formularioContacto && mensajeContacto) {
    formularioContacto.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!validarFormulario(formularioContacto)) {
            return;
        }

        const nuevoMensaje = {
            nombre: formularioContacto.elements.nombre.value.trim(),
            correo: formularioContacto.elements.correo.value.trim().toLowerCase(),
            mensaje: formularioContacto.elements.mensaje.value.trim(),
            enviadoEn: new Date().toISOString()
        };

        try {
            const mensajesGuardados = JSON.parse(localStorage.getItem("huertaMensajesContacto") || "[]");

            if (!Array.isArray(mensajesGuardados)) {
                throw new Error("El almacenamiento de mensajes no tiene un formato válido.");
            }

            mensajesGuardados.push(nuevoMensaje);
            localStorage.setItem("huertaMensajesContacto", JSON.stringify(mensajesGuardados));
            formularioContacto.reset();
            formularioContacto.querySelectorAll("[data-regla]").forEach((campo) => limpiarError(campo));
            document.getElementById("mensaje-contador").textContent = "0/500 caracteres";
            mensajeContacto.textContent = "Mensaje guardado en este navegador. Esta demostración no envía correos.";
            mensajeContacto.className = "alert alert-success";
        } catch {
            mensajeContacto.textContent = "No se pudo guardar el mensaje en este navegador.";
            mensajeContacto.className = "alert alert-danger";
        }
    });

    formularioContacto.querySelectorAll("input, textarea").forEach((campo) => {
        campo.addEventListener("input", () => {
            mensajeContacto.textContent = "";
            mensajeContacto.className = "mb-3";
        });
    });
}