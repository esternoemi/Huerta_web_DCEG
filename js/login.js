const formularioLogin = document.querySelector("form[data-login]");
const mensajeLogin = document.getElementById("mensaje-login");

if (formularioLogin && mensajeLogin) {
    formularioLogin.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        if (formularioLogin.querySelector(".is-invalid")) {
            return;
        }

        const correoIngresado = formularioLogin.elements.correo.value.trim().toLowerCase();
        const contrasenaIngresada = formularioLogin.elements.contrasena.value;
        mensajeLogin.textContent = "Comprobando usuario de demostración...";
        mensajeLogin.className = "alert alert-info mt-3";

        try {
            const respuesta = await fetch("../data/usuarios.txt", { cache: "no-store" });

            if (!respuesta.ok) {
                throw new Error("No fue posible leer usuarios.txt.");
            }

            const contenidoUsuarios = await respuesta.text();
            const usuarios = contenidoUsuarios
                .split(/\r?\n/)
                .filter((linea) => linea.trim() && !linea.trim().startsWith("#"))
                .map((linea) => {
                    const [nombre, apellido, correo, contrasena, telefono] = linea.split("|");

                    return { nombre, apellido, correo, contrasena, telefono };
                });

            const usuarioEncontrado = usuarios.find((usuario) =>
                usuario.correo?.trim().toLowerCase() === correoIngresado
                && usuario.contrasena === contrasenaIngresada
            );

            if (usuarioEncontrado) {
                mensajeLogin.textContent = `Credenciales de demostración válidas. Hola, ${usuarioEncontrado.nombre}. No se inició una sesión.`;
                mensajeLogin.className = "alert alert-success mt-3";
                return;
            }

            mensajeLogin.textContent = "Correo o contraseña incorrectos.";
            mensajeLogin.className = "alert alert-danger mt-3";
        } catch {
            mensajeLogin.textContent = "No se pudo consultar usuarios.txt. Abre el sitio mediante un servidor local.";
            mensajeLogin.className = "alert alert-warning mt-3";
        }
    });

    formularioLogin.querySelectorAll("input").forEach((campo) => {
        campo.addEventListener("input", () => {
            mensajeLogin.textContent = "";
            mensajeLogin.className = "mt-3";
        });
    });
}
