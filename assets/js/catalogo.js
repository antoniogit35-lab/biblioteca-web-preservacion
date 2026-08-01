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
  const lineas = textoCSV.trim().split("\n");
  if (lineas.length < 2) return [];

  const separadorLinea0 = lineas[0].includes(";") ? ";" : ",";
  const cabeceras = parsearLineaCSV(lineas[0], separadorLinea0);

  return lineas.slice(1).map(linea => {
    const separador = linea.includes(";") ? ";" : ",";
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
      plataforma: base.plataforma,
      tipo_soporte: base.tipo_soporte,
      num_discos: base.num_discos,
      discos,
      estadoDump: derivarEstadoDump(discos),
      hashVerificado: derivarHashVerificado(discos),
      notasResumen: derivarNotasResumen(discos)
    };

    juegos.push(juego);
  }

  return juegos;
}

// Derivaciones de estado muy sencillas basadas en el CSV actual
function derivarEstadoDump(discos) {
  // estado_dump: OK, OK_con_avisos, fallido, no_intentado (según tu checklist)
  const estados = discos.map(d => normalizarTexto(d.estado_dump));

  if (estados.every(e => e === "ok" || e === "ok_con_avisos")) {
    return "ok"; // Dump OK
  }

  if (estados.some(e => e === "fallido")) {
    return "fallido";
  }

  if (estados.some(e => e === "ok" || e === "ok_con_avisos")) {
    return "parcial";
  }

  // no_intentado o vacío
  return "pendiente";
}

function derivarHashVerificado(discos) {
  // hash_verificado: "Sí"/"No" (con posibles acentos raros)
  return discos.every(d => esSi(d.hash_verificado));
}

function derivarNotasResumen(discos) {
  return discos
    .map(d => d.notas && d.notas.trim())
    .filter(Boolean)
    .join(" | ");
}

function normalizarTexto(valor) {
  if (!valor) return "";
  // Pasamos a string, quitamos comillas y espacios
  let v = String(valor).trim().toLowerCase();

  // Normalizamos acentos rotos típicos de CSV mal codificado
  v = v.replace("á", "a")
       .replace("é", "e")
       .replace("í", "i")
       .replace("ó", "o")
       .replace("ú", "u")
       .replace("�", "i"); // el caracter raro típico en "S�"

  return v;
}

function esSi(valor) {
  const v = normalizarTexto(valor);
  // admite "si", "sí", "s"
  return v === "si" || v === "sí" || v === "s";
}

const juego = {
  titulo: base.titulo,
  plataforma: base.plataforma,
  tipo_soporte: base.tipo_soporte,
  num_discos: base.num_discos,
  discos,
  estadoDump: derivarEstadoDump(discos),
  hashVerificado: derivarHashVerificado(discos),
  notasResumen: derivarNotasResumen(discos)
};