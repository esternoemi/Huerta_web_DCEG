const formularioRegistro = document.querySelector("form[data-registro]");
const mensajeRegistro = document.getElementById("mensaje-registro");

if (formularioRegistro && mensajeRegistro) {
    formularioRegistro.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (formularioRegistro.querySelector(".is-invalid")) {
            return;
        }

        const usuarioNuevo = {
            nombre: formularioRegistro.elements.nombre.value.trim(),
            apellido: formularioRegistro.elements.apellido.value.trim(),
            correo: formularioRegistro.elements.correo.value.trim().toLowerCase(),
            contrasena: formularioRegistro.elements.contrasena.value,
            telefono: formularioRegistro.elements.telefono.value
        };

        try {
            const usuariosGuardados = leerUsuariosLocales();
            const correoYaRegistrado = [...usuariosDemostracion, ...usuariosGuardados].some((usuario) =>
                usuario.correo.trim().toLowerCase() === usuarioNuevo.correo
            );

            if (correoYaRegistrado) {
                mensajeRegistro.textContent = "Ya existe una cuenta con ese correo electrónico.";
                mensajeRegistro.className = "alert alert-warning mt-3";
                return;
            }

            usuariosGuardados.push(usuarioNuevo);
            guardarUsuariosLocales(usuariosGuardados);
            formularioRegistro.reset();
            actualizarProgresoContrasena(formularioRegistro.elements.contrasena);
            mensajeRegistro.textContent = "Cuenta creada en este navegador. Ya puedes ingresar.";
            mensajeRegistro.className = "alert alert-success mt-3";
        } catch {
            mensajeRegistro.textContent = "No se pudo guardar la cuenta en este navegador.";
            mensajeRegistro.className = "alert alert-danger mt-3";
        }
    });

    formularioRegistro.querySelectorAll("input").forEach((campo) => {
        campo.addEventListener("input", () => {
            mensajeRegistro.textContent = "";
            mensajeRegistro.className = "mt-3";
        });
    });
}