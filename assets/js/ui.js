async function inicializarBiblioteca() {
  const registrosDiscos = await cargarCatalogoCSV();
  const juegos = agruparPorJuego(registrosDiscos);

  actualizarEstadisticas(juegos);
  renderizarJuegos(juegos);
  // Más adelante: activar filtros, búsqueda, etc.
}

function actualizarEstadisticas(juegos) {
  const totalJuegos = juegos.length;
  const dumpsOk = juegos.filter(j => j.estadoDump === "ok").length;
  const pendientesOFallidos = juegos.filter(j =>
    j.estadoDump === "pendiente" || j.estadoDump === "fallido"
  ).length;
  const plataformas = new Set(juegos.map(j => j.plataforma));

  const statGames = document.getElementById("stat-games");
  const statDumpsOk = document.getElementById("stat-dumps-ok");
  const statDumpsPending = document.getElementById("stat-dumps-pending");
  const statPlatforms = document.getElementById("stat-platforms");

  if (statGames) statGames.textContent = totalJuegos;
  if (statDumpsOk) statDumpsOk.textContent = dumpsOk;
  if (statDumpsPending) statDumpsPending.textContent = pendientesOFallidos;
  if (statPlatforms) statPlatforms.textContent = plataformas.size;
}

function renderizarJuegos(juegos) {
  const grid = document.getElementById("games-grid");
  if (!grid) return;

  grid.innerHTML = "";

  juegos.forEach(juego => {
    const card = crearTarjetaJuego(juego);
    grid.appendChild(card);
  });
}

function crearTarjetaJuego(juego) {
  const artículo = document.createElement("article");
  artículo.className = "card";

  const estadoDump = juego.estadoDump; // "ok" | "pendiente" | "fallido" | "parcial"
  const badgeInfo = obtenerBadgeInfo(estadoDump);

  // Header
  const header = document.createElement("div");
  header.className = "card-header";

  const titleBlock = document.createElement("div");
  titleBlock.className = "title-block";

  const h2 = document.createElement("h2");
  h2.textContent = juego.titulo;

  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  // De momento no tenemos año en el CSV, así que mostramos solo plataforma
  subtitle.textContent = `${juego.plataforma}`;

  titleBlock.appendChild(h2);
  titleBlock.appendChild(subtitle);

  const badge = document.createElement("span");
  badge.className = `badge ${badgeInfo.clase}`;
  badge.textContent = badgeInfo.texto;

  header.appendChild(titleBlock);
  header.appendChild(badge);

  // Portada (placeholder por ahora)
  const coverFrame = document.createElement("div");
  coverFrame.className = "cover-frame";

  const img = document.createElement("img");
  img.className = "cover";
  img.loading = "lazy";
  img.width = 300;
  img.height = 420;
  img.alt = `Portada de ${juego.titulo}`;

  // Mientras no tengas una columna de portada en el CSV, usamos picsum
  const seed = encodeURIComponent(`${juego.titulo}-${juego.plataforma}`);
  img.src = `https://picsum.photos/seed/${seed}/300/420`;

  coverFrame.appendChild(img);

  // Meta: datos técnicos básicos derivados del CSV
  const meta = document.createElement("div");
  meta.className = "meta";

  const m1 = document.createElement("div");
  const m1Label = document.createElement("span");
  m1Label.textContent = "Tipo de soporte";
  m1.appendChild(m1Label);
  m1.appendChild(document.createTextNode(juego.tipo_soporte || "N/A"));

  const m2 = document.createElement("div");
  const m2Label = document.createElement("span");
  m2Label.textContent = "Número de discos";
  m2.appendChild(m2Label);
  m2.appendChild(document.createTextNode(String(juego.num_discos || juego.discos.length)));

  const m3 = document.createElement("div");
  const m3Label = document.createElement("span");
  m3Label.textContent = "Hash verificado";
  m3.appendChild(m3Label);
  m3.appendChild(document.createTextNode(juego.hashVerificado ? "Sí" : "No"));

  const m4 = document.createElement("div");
  const m4Label = document.createElement("span");
  m4Label.textContent = "Estado dump (agr.)";
  m4.appendChild(m4Label);
  m4.appendChild(document.createTextNode(describirEstadoDump(juego.estadoDump)));

  meta.appendChild(m1);
  meta.appendChild(m2);
  meta.appendChild(m3);
  meta.appendChild(m4);

  // Notas
  const notes = document.createElement("div");
  notes.className = "notes";
  notes.textContent =
    juego.notasResumen ||
    "Sin notas aún en el catálogo. Añádelas en el CSV/ODS para verlas aquí.";

  // Montar tarjeta
  artículo.appendChild(header);
  artículo.appendChild(coverFrame);
  artículo.appendChild(meta);
  artículo.appendChild(notes);

  return artículo;
}

function obtenerBadgeInfo(estadoDump) {
  switch (estadoDump) {
    case "ok":
      return { clase: "badge-ok", texto: "Dump OK" };
    case "fallido":
      return { clase: "badge-danger", texto: "Dump fallido" };
    case "parcial":
      return { clase: "badge-warn", texto: "Dump parcial" };
    case "pendiente":
    default:
      return { clase: "badge-warn", texto: "Dump pendiente" };
  }
}

function describirEstadoDump(estadoDump) {
  switch (estadoDump) {
    case "ok": return "Todos los discos dumpeados correctamente";
    case "fallido": return "Algún disco con problemas o errores";
    case "parcial": return "Algunos discos dumpeados, otros pendientes";
    case "pendiente":
    default: return "Dump aún no iniciado";
  }
}

document.addEventListener("DOMContentLoaded", inicializarBiblioteca);