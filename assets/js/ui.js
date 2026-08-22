let todosLosJuegos = [];
let plataformaActiva = "todos";
let terminoBusqueda = "";
let filtrosAvanzados = {
  anio: "todos",
  dump: "todos",
  compatibilidad: "todos",
  emulador: "todos"
};

async function inicializarBiblioteca() {
  const registrosDiscos = await cargarCatalogoCSV();
  todosLosJuegos = agruparPorJuego(registrosDiscos);

  configurarFiltrosPlataforma();
  configurarFiltrosAvanzados();
  configurarBusqueda();
  rellenarFiltroAnios();
  actualizarVista();
}

function actualizarVista() {
  const juegosFiltrados = filtrarJuegos(
    todosLosJuegos,
    plataformaActiva,
    terminoBusqueda,
    filtrosAvanzados
  );

  juegosFiltrados.sort((a,b) =>
    a.titulo.localeCompare(b.titulo, "es", {
      sensitivity: "base"
    })
  );

  actualizarResumenCabecera();
  actualizarContadorResultados(juegosFiltrados);

  function actualizarFiltrosActivos() {
    const contenedor = document.getElementById("active-filters");
    if (!contenedor) return;

    const filtros = obtenerFiltrosActivos();

    contenedor.innerHTML = "";

    if (filtros.length === 0) {
      contenedor.hidden = true;
      return;
    }

    contenedor.hidden = false;

    const etiqueta = document.createElement("span");
    etiqueta.className = "active-filters-label";
    etiqueta.textContent = "Filtros activos:";
    contenedor.appendChild(etiqueta);

    filtros.forEach((filtro) => {
      const chip = document.createElement("button");
      chip.className = "active-filter-chip";
      chip.type = "button";
      chip.dataset.filterType = filtro.tipo;
      chip.textContent = `${filtro.etiqueta} ×`;

      chip.setAttribute(
        "aria-label",
        `Quitar filtro: ${filtro.etiqueta}`
      );

      chip.addEventListener("click", () => {
        quitarFiltroActivo(filtro.tipo);
      });

      contenedor.appendChild(chip);
    });
  }

  function obtenerFiltrosActivos() {
    const filtros = [];

    if (plataformaActiva !== "todos") {
      filtros.push({
        tipo: "plataforma",
        etiqueta: plataformaActiva
      });
    }

    if (terminoBusqueda) {
      filtros.push({
        tipo: "busqueda",
        etiqueta: `Búsqueda: ${terminoBusqueda}`
      });
    }

    if (filtrosAvanzados.anio !== "todos") {
      filtros.push({
        tipo: "anio",
        etiqueta: filtrosAvanzados.anio
      });
    }

    if (filtrosAvanzados.dump !== "todos") {
      const etiquetasDump = {
        ok: "Dump OK",
        avisos: "Dump OK con avisos",
        parcial: "Dump parcial",
        pendiente: "Dump pendiente",
        fallido: "Dump fallido"
      };

      filtros.push({
        tipo: "dump",
        etiqueta: etiquetasDump[filtrosAvanzados.dump]
      });
    }

    if (filtrosAvanzados.compatibilidad !== "todos") {
      const etiquetasCompatibilidad = {
        ok_moderno: "Funciona en sistema actual",
        requiere_ajustes: "Requiere ajustes",
        solo_legacy: "Solo entorno legacy",
        no_probado: "No probado"
      };

      filtros.push({
        tipo: "compatibilidad",
        etiqueta: etiquetasCompatibilidad[filtrosAvanzados.compatibilidad]
      });
    }

    if (filtrosAvanzados.emulador !== "todos") {
      filtros.push({
        tipo: "emulador",
        etiqueta:
          filtrosAvanzados.emulador === "probado"
            ? "Emulador probado"
            : "Emulador no probado"
      });
    }

    return filtros;
  }

  function quitarFiltroActivo(tipo) {
    if (tipo === "plataforma") {
      plataformaActiva = "todos";

      document.querySelectorAll("[data-platform]").forEach((boton) => {
        boton.classList.toggle(
          "active",
          boton.dataset.platform === "todos"
        );
      });
    }

    if (tipo === "busqueda") {
      terminoBusqueda = "";

      const buscador = document.getElementById("search-input");
      if (buscador) buscador.value = "";
    }

    if (tipo === "anio") {
      filtrosAvanzados.anio = "todos";

      const selector = document.getElementById("filter-year");
      if (selector) selector.value = "todos";
    }

    if (tipo === "dump") {
      filtrosAvanzados.dump = "todos";

      const selector = document.getElementById("filter-dump");
      if (selector) selector.value = "todos";
    }

    if (tipo === "compatibilidad") {
      filtrosAvanzados.compatibilidad = "todos";

      const selector = document.getElementById("filter-compatibility");
      if (selector) selector.value = "todos";
    }

    if (tipo === "emulador") {
      filtrosAvanzados.emulador = "todos";

      const selector = document.getElementById("filter-emulator");
      if (selector) selector.value = "todos";
    }

    actualizarVista();
  }
  actualizarFiltrosActivos();
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

function filtrarJuegos(juegos, plataforma, busqueda, filtros) {
  const termino = busqueda.trim().toLowerCase();

  return juegos.filter(juego => {
    const coincidePlataforma =
      plataforma === "todos" || juego.plataforma === plataforma;

    const coincideAnio =
      filtros.anio === "todos" || juego.anio === filtros.anio;

    const coincideDump =
      filtros.dump === "todos" || juego.estadoDump === filtros.dump;

    const coincideCompatibilidad =
      filtros.compatibilidad === "todos" ||
      juego.estadoCompatibilidad === filtros.compatibilidad;

    const tieneEmuladorProbado = Boolean(juego.emuladorProbado);

    const coincideEmulador =
      filtros.emulador === "todos" ||
      (filtros.emulador === "probado" && tieneEmuladorProbado) ||
      (filtros.emulador === "no_probado" && !tieneEmuladorProbado);

    const contenidoBuscable = [
      juego.titulo,
      juego.notasResumen
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const coincideBusqueda =
      termino === "" || contenidoBuscable.includes(termino);

    return coincidePlataforma && 
           coincideBusqueda && 
           coincideAnio && 
           coincideDump && 
           coincideCompatibilidad && 
           coincideEmulador
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

function configurarFiltrosAvanzados() {
  const controles = {
    anio: document.getElementById("filter-year"),
    dump: document.getElementById("filter-dump"),
    compatibilidad: document.getElementById("filter-compatibility"),
    emulador: document.getElementById("filter-emulator")
  };

  Object.entries(controles).forEach(([nombre, control]) => {
    if (!control) return;

    control.addEventListener("change", () => {
      filtrosAvanzados[nombre] = control.value;
      actualizarVista();
    });
  });

  const botonLimpiar = document.getElementById("clear-advanced-filters");

  if (botonLimpiar) {
    botonLimpiar.addEventListener("click", () => {
      filtrosAvanzados = {
        anio: "todos",
        dump: "todos",
        compatibilidad: "todos",
        emulador: "todos"
      };

      Object.values(controles).forEach((control) => {
        if (control) control.value = "todos";
      });

      actualizarVista();
    });
  }
}

function rellenarFiltroAnios() {
  const selector = document.getElementById("filter-year");
  if (!selector) return;

  const anios = [...new Set(todosLosJuegos.map((juego) => juego.anio))]
    .filter(Boolean)
    .sort((a, b) => Number(b) - Number(a));

  anios.forEach((anio) => {
    const opcion = document.createElement("option");
    opcion.value = anio;
    opcion.textContent = anio;
    selector.appendChild(opcion);
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
    case "avisos":
      return { clase: "badge-warn", texto: "Dump OK con avisos"}; 
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