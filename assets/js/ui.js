let todosLosJuegos = [];
let plataformaActiva = "todos";
let terminoBusqueda = "";

async function inicializarBiblioteca() {
  const registrosDiscos = await cargarCatalogoCSV();
  todosLosJuegos = agruparPorJuego(registrosDiscos);

  configurarFiltrosPlataforma();
  configurarBusqueda();
  actualizarVista();
}

function actualizarVista() {
  const juegosFiltrados = filtrarJuegos(
    todosLosJuegos,
    plataformaActiva,
    terminoBusqueda
  );

  actualizarResumenCabecera();
  actualizarContadorResultados(juegosFiltrados);
  actualizarEstadisticas(juegosFiltrados);
  renderizarJuegos(juegosFiltrados);
}

function actualizarResumenCabecera() {
  const contador = document.getElementById("hero-game-count");
  if (!contador) return;

  const cantidad = todosLosJuegos.length;
  contador.textContent = `${cantidad} juego${cantidad === 1 ? "" : "s"}`; // Con esto siempre muestra el total aunque haya filtro
}

function actualizarContadorResultados(juegos) {
  const contador = document.getElementById("results-count");
  if (!contador) return;

  const visibles = juegos.length;
  const total = todosLosJuegos.length;

  contador.textContent =
    `Mostrando ${visibles} de ${total} juego${total === 1 ? "" : "s"}`;
}

function filtrarJuegos(juegos, plataforma, busqueda) {
  const termino = busqueda.trim().toLowerCase();

  return juegos.filter(juego => {
    const coincidePlataforma =
      plataforma === "todos" || juego.plataforma === plataforma;

    const contenidoBuscable = [
      juego.titulo,
      juego.notasResumen
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const coincideBusqueda =
      termino === "" || contenidoBuscable.includes(termino);

    return coincidePlataforma && coincideBusqueda;
  });
}

function configurarFiltrosPlataforma() {
  const botones = document.querySelectorAll("[data-platform]");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      plataformaActiva = boton.dataset.platform;

      botones.forEach(b => b.classList.remove("active"));
      boton.classList.add("active");

      actualizarVista();
    });
  });
}

function configurarBusqueda() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    terminoBusqueda = input.value.trim().toLowerCase();
    actualizarVista();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      terminoBusqueda = "";
      actualizarVista();
      input.focus();
    }
  });
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

  if (juegos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "empty-state";
    mensaje.textContent =
      "No hay juegos que coincidan con la búsqueda o el filtro seleccionado.";

    grid.appendChild(mensaje);
    return;
  }

  juegos.forEach(juego => {
    const card = crearTarjetaJuego(juego);
    grid.appendChild(card);
  });
}

function crearTarjetaJuego(juego) {
  const articulo = document.createElement("article");
  articulo.className = "card";

  const badgeInfo = obtenerBadgeInfo(juego.estadoDump);

  const header = document.createElement("div");
  header.className = "card-header";

  const titleBlock = document.createElement("div");
  titleBlock.className = "title-block";

  const h2 = document.createElement("h2");
  h2.textContent = juego.titulo;

  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  subtitle.textContent = juego.anio
    ? `${juego.plataforma} · ${juego.anio}`
    : juego.plataforma;

  titleBlock.appendChild(h2);
  titleBlock.appendChild(subtitle);

  const badge = document.createElement("span");
  badge.className = `badge ${badgeInfo.clase}`;
  badge.textContent = badgeInfo.texto;

  header.appendChild(titleBlock);
  header.appendChild(badge);

  const coverFrame = document.createElement("div");
  coverFrame.className = "cover-frame";

  const img = document.createElement("img");
  img.className = "cover";
  img.loading = "lazy";
  img.width = 300;
  img.height = 420;
  img.alt = `Portada de ${juego.titulo}`;

  const seed = encodeURIComponent(`${juego.titulo}-${juego.plataforma}`);

  img.src = juego.portada
    ? `assets/img/frontpages/${juego.portada}.png`
    : `https://picsum.photos/seed/${seed}/300/420`;
  

  coverFrame.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "meta";

  const esPC = juego.plataforma === "PC";

  meta.appendChild(crearDatoMeta(
    esPC ? "Compatibilidad" : "Emulador probado",
    esPC
      ? describirCompatibilidad(juego.estadoCompatibilidad)
      : juego.emuladorProbado || "No probado"
  ));

  meta.appendChild(crearDatoHash(juego));

  const notes = crearNotas(juego.notasResumen);

  // Montar tarjeta
  articulo.appendChild(header);
  articulo.appendChild(coverFrame);
  articulo.appendChild(meta);
  articulo.appendChild(notes);

  return articulo;
}

function crearDatoMeta(etiqueta, valor) {
  const contenedor = document.createElement("div");

  const label = document.createElement("span");
  label.textContent = etiqueta;

  contenedor.appendChild(label);
  contenedor.appendChild(document.createTextNode(valor));

  return contenedor;
}

function crearDatoHash(juego){
  const contenedor = document.createElement("div");

  const label = document.createElement("span");
  label.textContent = "Hash verificado";

  const contenido = document.createElement("div");
  contenido.className = "hash-value";
  contenido.appendChild(
    document.createTextNode(juego.hashVerificado ? "Sí" : "No")
  );

  if (juego.hashSha256) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "copy-hash";
    boton.textContent = "Copiar";
    boton.title = "Copiar SHA-256";

    boton.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(juego.hashSha256);
        boton.textContent = "Copiado";
        setTimeout (() => {
          boton.textContent = "Copiar";
        }, 1500);
      } catch (error) {
        console.error("No se pudo copiar el hash", error);
      }
    });

    contenido.appendChild(boton);
  }

  contenedor.appendChild(label);
  contenedor.appendChild(contenido);

  return contenedor;
}

function crearNotas(texto) {
  const notas = document.createElement("div");
  notas.className = "notes";

  const textoNotas = document.createElement("div");
  textoNotas.className = "notes-text";
  textoNotas.textContent =
    texto || "Sin notas aún en el catálogo.";

  notas.appendChild(textoNotas);

  if (texto && texto.length > 90) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "notes-toggle";
    boton.textContent = "Mostrar más";

    boton.addEventListener("click", () => {
      const expandida = notas.classList.toggle("expanded");
      boton.textContent = expandida ? "Mostrar menos" : "Mostrar más";
    });

    notas.appendChild(boton);
  }

  return notas;
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

function describirCompatibilidad(estado) {
  const textos = {
    ok_moderno: "Funciona en sistema actual",
    requiere_ajustes: "Requiere ajustes",
    solo_legacy: "Solo entorno legacy",
    no_probado: "No probado"
  };

  return textos[estado] || "No probado";
}

document.addEventListener("DOMContentLoaded", inicializarBiblioteca);