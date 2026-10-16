
const API_URL = "http://192.168.1.16/asistepro-api";

export type UsuarioAPI = {
  id: string;
  identificacion: string;
  nombre: string;
  correo: string;
  rol: "Estudiante" | "Profesor" | "Administrador";
  estado: "Activo" | "Inactivo";
  iniciales: string;
};

export type RespuestaAPI<T> = {
  correcto: boolean;
  mensaje?: string;
  datos?: T;
};

export async function listarUsuarios(): Promise<UsuarioAPI[]> {
  const respuesta = await fetch(`${API_URL}/usuarios/listar.php`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron consultar los usuarios.");
  }

  const resultado: RespuestaAPI<UsuarioAPI[]> = await respuesta.json();

  if (!resultado.correcto) {
    throw new Error(
      resultado.mensaje || "Error al consultar usuarios.",
    );
  }

  return resultado.datos ?? [];
}

export async function crearUsuario(datos: {
  cedula: string;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: "Estudiante" | "Profesor" | "Administrador";
}) {
  const respuesta = await fetch(`${API_URL}/usuarios/crear.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.correcto) {
    throw new Error(
      resultado.mensaje || "No se pudo registrar el usuario.",
    );
  }

  return resultado;
}


export async function listarAsistencias(): Promise<unknown[]> {
  const respuesta = await fetch(`${API_URL}/asistencias/listar.php`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron consultar las asistencias.");
  }

  const resultado: RespuestaAPI<unknown[]> = await respuesta.json();

  if (!resultado.correcto) {
    throw new Error(resultado.mensaje || "Error al consultar asistencias.");
  }

  return resultado.datos ?? [];
}
