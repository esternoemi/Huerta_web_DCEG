import { guardarLista, leerLista } from "./storage.js";

const CLAVE = "huertaUsuariosReact";
const ROLES = new Set(["cliente", "vendedor", "administrador"]);
const ITERACIONES_HASH = 210000;
const CAMPOS_EDITABLES = [
  "run",
  "nombre",
  "apellido",
  "correo",
  "fechaNacimiento",
  "region",
  "comuna",
  "direccion",
  "telefono",
  "rol",
];

function leerTodos() {
  return leerLista(CLAVE, []);
}

function perfilPublico(usuario) {
  const perfil = { ...usuario };
  delete perfil.credencial;
  return perfil;
}

function bytesHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function hexBytes(hex) {
  if (!/^(?:[0-9a-f]{2})+$/iu.test(hex)) {
    throw new Error("La credencial guardada no tiene un formato válido.");
  }
  return Uint8Array.from(
    hex.match(/.{2}/gu),
    (byte) => Number.parseInt(byte, 16),
  );
}

async function derivarHash(contrasena, sal) {
  const material = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(contrasena),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await globalThis.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: sal,
      iterations: ITERACIONES_HASH,
    },
    material,
    256,
  );
  return bytesHex(new Uint8Array(hash));
}

function validarContrasena(contrasena) {
  if (
    typeof contrasena !== "string" ||
    contrasena.length < 4 ||
    contrasena.length > 10 ||
    !/\p{Lu}/u.test(contrasena) ||
    !/\p{Ll}/u.test(contrasena) ||
    !/\p{N}/u.test(contrasena) ||
    !/[^\p{L}\p{N}\s]/u.test(contrasena)
  ) {
    throw new Error(
      "La contraseña debe tener entre 4 y 10 caracteres, con mayúscula, minúscula, número y símbolo.",
    );
  }
}

async function crearCredencial(contrasena) {
  validarContrasena(contrasena);
  const sal = globalThis.crypto.getRandomValues(new Uint8Array(16));
  return {
    sal: bytesHex(sal),
    hash: await derivarHash(contrasena, sal),
  };
}

function normalizarUsuario(datos, usuarioExistente = {}) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    throw new TypeError("Los datos del usuario deben ser un objeto.");
  }

  const usuario = { ...usuarioExistente };
  for (const campo of CAMPOS_EDITABLES) {
    if (Object.hasOwn(datos, campo)) {
      usuario[campo] = datos[campo];
    }
  }

  usuario.run = String(usuario.run ?? "").trim().toLocaleUpperCase("es");
  usuario.nombre = String(usuario.nombre ?? "").trim();
  usuario.apellido = String(usuario.apellido ?? "").trim();
  usuario.correo = String(usuario.correo ?? "").trim().toLocaleLowerCase("es");
  usuario.telefono = String(usuario.telefono ?? "").trim();
  usuario.fechaNacimiento = String(usuario.fechaNacimiento ?? "").trim();
  usuario.region = String(usuario.region ?? "").trim();
  usuario.comuna = String(usuario.comuna ?? "").trim();
  usuario.direccion = String(usuario.direccion ?? "").trim();

  if (!usuario.run) {
    throw new Error("El RUN del usuario es obligatorio.");
  }
  if (!usuario.nombre || !usuario.apellido) {
    throw new Error("El nombre y apellido del usuario son obligatorios.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(usuario.correo)) {
    throw new Error("El correo del usuario no es válido.");
  }
  if (!ROLES.has(usuario.rol)) {
    throw new Error("El rol debe ser cliente, vendedor o administrador.");
  }

  return usuario;
}

function validarUnicidad(usuarios, usuario, idActual = null) {
  const duplicado = usuarios.find(
    (item) =>
      item.id !== idActual &&
      (item.correo === usuario.correo || item.run === usuario.run),
  );
  if (duplicado) {
    throw new Error("Ya existe un usuario con ese correo o RUN.");
  }
}

export const userService = {
  listar() {
    return leerTodos().map(perfilPublico);
  },

  buscar(id) {
    const usuario = leerTodos().find((item) => item.id === id);
    return usuario ? perfilPublico(usuario) : null;
  },

  async crear(datos) {
    const usuarios = leerTodos();
    const usuario = normalizarUsuario(datos);
    validarUnicidad(usuarios, usuario);

    const credencial = await crearCredencial(datos.contrasena);
    const nuevoUsuario = {
      ...usuario,
      id: globalThis.crypto.randomUUID(),
      credencial,
    };
    guardarLista(CLAVE, [...usuarios, nuevoUsuario]);
    return perfilPublico(nuevoUsuario);
  },

  async actualizar(id, datos) {
    const usuarios = leerTodos();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);
    if (indice < 0) {
      throw new Error(`No existe el usuario ${id}.`);
    }

    const actualizado = normalizarUsuario(datos, usuarios[indice]);
    validarUnicidad(usuarios, actualizado, id);
    const usuarioGuardado = { ...usuarios[indice], ...actualizado, id };
    if (datos.contrasena) {
      usuarioGuardado.credencial = await crearCredencial(datos.contrasena);
    }
    guardarLista(
      CLAVE,
      usuarios.map((usuario, index) =>
        index === indice ? usuarioGuardado : usuario,
      ),
    );
    return perfilPublico(usuarioGuardado);
  },

  async autenticar(correo, contrasena) {
    const correoNormalizado = String(correo ?? "")
      .trim()
      .toLocaleLowerCase("es");
    const usuario = leerTodos().find((item) => item.correo === correoNormalizado);
    if (!usuario?.credencial || typeof contrasena !== "string") {
      return null;
    }

    const hashIngresado = await derivarHash(
      contrasena,
      hexBytes(usuario.credencial.sal),
    );
    const hashEsperado = hexBytes(usuario.credencial.hash);
    const hashActual = hexBytes(hashIngresado);
    const diferencia = hashEsperado.reduce(
      (acumulado, byte, index) => acumulado | (byte ^ hashActual[index]),
      0,
    );
    if (hashEsperado.length !== hashActual.length || diferencia !== 0) {
      return null;
    }

    return perfilPublico(usuario);
  },
};
