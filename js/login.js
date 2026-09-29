const formularioLogin = document.querySelector("form[data-login]");
const mensajeLogin = document.getElementById("mensaje-login");

if (formularioLogin && mensajeLogin) {
    formularioLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (formularioLogin.querySelector(".is-invalid")) {
            return;
        }

        const correoIngresado = formularioLogin.elements.correo.value.trim().toLowerCase();
        const contrasenaIngresada = formularioLogin.elements.contrasena.value;
        mensajeLogin.textContent = "Comprobando usuario de demostración...";
        mensajeLogin.className = "alert alert-info mt-3";

        let usuariosDisponibles = usuariosDemostracion;

        try {
            usuariosDisponibles = [...usuariosDemostracion, ...leerUsuariosLocales()];
        } catch {
            const usuarioDemoEncontrado = usuariosDemostracion.find((usuario) =>
                usuario.correo.toLowerCase() === correoIngresado
                && usuario.contrasena === contrasenaIngresada
            );

            if (!usuarioDemoEncontrado) {
                mensajeLogin.textContent = "No se pudieron leer las cuentas guardadas en este navegador.";
                mensajeLogin.className = "alert alert-danger mt-3";
                return;
            }
        }

        const usuarioEncontrado = usuariosDisponibles.find((usuario) =>
            usuario.correo.trim().toLowerCase() === correoIngresado
            && usuario.contrasena === contrasenaIngresada
        );

        if (usuarioEncontrado) {
            mensajeLogin.textContent = `Credenciales de demostración válidas. Hola, ${usuarioEncontrado.nombre}. No se inició una sesión.`;
            mensajeLogin.className = "alert alert-success mt-3";
            return;
        }

        mensajeLogin.textContent = "Correo o contraseña incorrectos.";
        mensajeLogin.className = "alert alert-danger mt-3";
    });

    formularioLogin.querySelectorAll("input").forEach((campo) => {
        campo.addEventListener("input", () => {
            mensajeLogin.textContent = "";
            mensajeLogin.className = "mt-3";
        });
    });
}
