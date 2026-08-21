async function cargarCatalogoCSV() {
  const respuesta = await fetch("metadata/catalogo_videojuegos.csv");
  if (!respuesta.ok) {
    console.error("No se pudo cargar el catálogo CSV");
    return [];
  }

  const textoCSV = await respuesta.text();
  return parsearCSV(textoCSV);
}

function parsearCSV(textoCSV) {
  const lineas = textoCSV.trim().split(/\r?\n/);
  if (lineas.length < 2) return [];

  const separador = ";";
  const cabeceras = parsearLineaCSV(lineas[0], separador);

  return lineas.slice(1).map(linea => {
    const valores = parsearLineaCSV(linea, separador);
    const registro = {};

    cabeceras.forEach((nombreColumna, indice) => {
      registro[nombreColumna] = valores[indice] ?? "";
    });

    registro.num_discos = Number(registro.num_discos) || 1;
    registro.disco_indice = Number(registro.disco_indice) || 1;

    return registro;
  });
}

// Parser de UNA línea: respeta comillas y comas dentro de comillas
function parsearLineaCSV(linea, separador) {
  const resultado = [];
  let actual = "";
  let dentroComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];

    if (c === '"') {
      if (dentroComillas && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else {
        dentroComillas = !dentroComillas;
      }
    } else if (c === separador && !dentroComillas) {
      resultado.push(actual.trim());
      actual = "";
    } else {
      actual += c;
    }
  }

  resultado.push(actual.trim());
  return resultado;
}

// Agrupa filas (discos) en juegos básicos para la UI
function agruparPorJuego(registrosDiscos) {
  const mapa = new Map();

  for (const registro of registrosDiscos) {
    const clave = `${registro.titulo}::${registro.plataforma}`;
    if (!mapa.has(clave)) {
      mapa.set(clave, []);
    }
    mapa.get(clave).push(registro);
  }

  const juegos = [];

  for (const [, discos] of mapa.entries()) {
    const base = discos[0];

    const juego = {
      titulo: base.titulo,
      anio: base.anio || "",
      plataforma: base.plataforma,
      portada: base.portada || "",
      tipo_soporte: base.tipo_soporte,
      num_discos: base.num_discos,
      discos,

      estadoDump: derivarEstadoDump(discos),
      fechaDump: derivarFechaDump(discos),
      hashVerificado: derivarHashVerificado(discos),
      hashSha256: derivarHashSha256(discos),

      emuladorProbado: derivarCampoComun(discos, "emulador_probado"),
      estadoCompatibilidad: derivarEstadoCompatibilidad(discos),
      notasResumen: derivarNotasResumen(discos)
    };

    juegos.push(juego);
  }

  return juegos;
}

function derivarEstadoDump(discos) {
  const estados = discos.map((disco) =>
    normalizarTexto(disco.estado_dump)
  );

  if (estados.some((estado) => estado === "fallido")) {
    return "fallido";
  }

  if (estados.some((estado) => estado === "ok_con_avisos")) {
    return "avisos";
  }

  if (estados.some((estado) => estado === "ok")) {
    return estados.every((estado) => estado === "ok")
      ? "ok"
      : "parcial";
  }

  return "pendiente";
}

function derivarHashVerificado(discos) {
  return discos.every(d => esSi(d.hash_verificado));
}

function derivarCampoComun(discos, campo) {
  const valores = discos
    .map(disco => (disco[campo] || "").trim())
    .filter(Boolean);

  if (valores.length === 0) return "";

  return valores[0];
}

function derivarFechaDump(discos) {
  const fechas = discos
    .map(disco => (disco.fecha_dump || "").trim())
    .filter(Boolean)
    .sort();

  return fechas.at(-1) || "";
}

function derivarHashSha256(discos) {
  const hashes = discos
    .map(disco => (disco.hash_sha256 || "").trim())
    .filter(Boolean);

  return hashes.length === 1 ? hashes[0] : "";
}

function derivarEstadoCompatibilidad(discos) {
  const estados = discos
    .map(disco => normalizarTexto(disco.estado_compatibilidad))
    .filter(Boolean);

  if (estados.includes("solo_legacy")) return "solo_legacy";
  if (estados.includes("requiere_ajustes")) return "requiere_ajustes";
  if (estados.includes("no_probado")) return "no_probado";
  if (estados.includes("ok_moderno")) return "ok_moderno";

  return "no_probado";
}

function derivarNotasResumen(discos) {
  return discos
    .map(d => d.notas && d.notas.trim())
    .filter(Boolean)
    .join(" | ");
}

function normalizarTexto(valor) {
  return String(valor || "").trim().toLowerCase();
}

function esSi(valor) {
  return normalizarTexto(valor) === "si";
}