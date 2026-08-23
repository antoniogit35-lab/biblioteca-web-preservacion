let todosLosJuegos = [];
let plataformaActiva = "todos";
let terminoBusqueda = "";
let ultimoBotonFicha = null;
let filtrosAvanzados = {
  anio: "todos",
  dump: "todos",
  compatibilidad: "todos",
  emulador: "todos",
  hashVerificado: "todos",
  plataformaSecundaria: ""
};

async function inicializarBiblioteca() {
  const registrosDiscos = await cargarCatalogoCSV();
  todosLosJuegos = agruparPorJuego(registrosDiscos);

  configurarFiltrosPlataforma();
  configurarFiltrosAvanzados();
  configurarBusqueda();
  configurarTogglePendientes();
  configurarModalFicha();
  configurarPanelProgreso();
  rellenarFiltroAnios();
  actualizarVista();
}

function configurarTogglePendientes() {
  const panel = document.querySelector(".review-queue");
  const boton = document.getElementById("review-queue-toggle");

  if (!panel || !boton) return;

  boton.addEventListener("click", () => {
    const estaColapsado = panel.classList.toggle("is-collapsed");
    const expandido = !estaColapsado;

    boton.setAttribute("aria-expanded", String(expandido));
    boton.setAttribute(
      "aria-label",
      expandido
        ? "Ocultar pendientes de revisión"
        : "Mostrar pendientes de revisión"
    );
  });
}

function abrirPanelProgreso() {
  const tirador = document.getElementById("progreso-tirador");
  const panel = document.getElementById("panel-progreso");
  const fondo = document.getElementById("progreso-fondo");

  if (!tirador || !panel || !fondo) return;

  panel.classList.add("abierto");
  tirador.classList.add("oculto");
  fondo.hidden = false;

  requestAnimationFrame(() => {
    fondo.classList.add("visible");
  });

  panel.setAttribute("aria-hidden", "false");
  tirador.setAttribute("aria-expanded", "true");
  tirador.setAttribute("aria-label", "Cerrar panel de progreso");
}

function cerrarPanelProgreso() {
  const tirador = document.getElementById("progreso-tirador");
  const panel = document.getElementById("panel-progreso");
  const fondo = document.getElementById("progreso-fondo");

  if (!tirador || !panel || !fondo) return;

  panel.classList.remove("abierto");
  tirador.classList.remove("oculto");
  fondo.classList.remove("visible");

  panel.setAttribute("aria-hidden", "true");
  tirador.setAttribute("aria-expanded", "false");
  tirador.setAttribute("aria-label", "Abrir panel de progreso");

  window.setTimeout(() => {
    if (!panel.classList.contains("abierto")) {
      fondo.hidden = true;
    }
  }, 300);

  tirador.focus();
}

function configurarPanelProgreso() {
  const tirador = document.getElementById("progreso-tirador");
  const cerrar = document.getElementById("progreso-cerrar");
  const fondo = document.getElementById("progreso-fondo");

  if (!tirador || !cerrar || !fondo) return;

  tirador.addEventListener("click", abrirPanelProgreso);
  cerrar.addEventListener("click", cerrarPanelProgreso);
  fondo.addEventListener("click", cerrarPanelProgreso);

  document.addEventListener("keydown", (evento) => {
    const panel = document.getElementById("panel-progreso");

    if (
      evento.key === "Escape" &&
      panel &&
      panel.classList.contains("abierto")
    ) {
      cerrarPanelProgreso();
    }
  });

  document.querySelectorAll("[data-progreso-filtro]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = JSON.parse(boton.dataset.progresoFiltro || "{}");
      abrirFiltroDesdeProgreso(filtro);
    });
  });
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
      const etiquetasPlataforma = {
        consolas_sin_emulador: "Consolas sin emulador probado",
        consolas_con_emulador: "Consolas con emulador probado"
      };

      filtros.push({
        tipo: "plataforma",
        etiqueta: etiquetasPlataforma[plataformaActiva] || plataformaActiva
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

    if (filtrosAvanzados.hashVerificado === "si") {
      filtros.push({
        tipo: "hash",
        etiqueta: "Hash verificado"
      });
    }

    if (filtrosAvanzados.plataformaSecundaria) {
      filtros.push({
        tipo: "plataformaSecundaria",
        etiqueta: filtrosAvanzados.plataformaSecundaria
      });
    }

    return filtros;
  }

  function quitarFiltroActivo(tipo) {
    if (tipo === "plataforma") {
      plataformaActiva = "todos";
      filtrosAvanzados.plataformaSecundaria = "";

      document.querySelectorAll("[data-platform]").forEach((boton) => {
        boton.classList.toggle(
          "active",
          boton.dataset.platform === "todos"
        );
      });
    }

    if (tipo === "plataformaSecundaria") {
      filtrosAvanzados.plataformaSecundaria = "";
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

    if (tipo === "hash") {
      filtrosAvanzados.hashVerificado = "todos";
    }

    actualizarVista();
  }
  actualizarFiltrosActivos();
  actualizarEstadisticas(juegosFiltrados);
  actualizarProgresoColeccion(todosLosJuegos);
  renderizarJuegos(juegosFiltrados);
  renderizarPendientes();
}

function renderizarPendientes() {
  const contenedor = document.getElementById("review-queue-groups");
  if (!contenedor) return;

  const grupos = obtenerGruposPendientes();

  contenedor.innerHTML = "";

  const hayPendientes = grupos.some((grupo) => grupo.juegos.length > 0);

  if (!hayPendientes) {
    const mensaje = document.createElement("p");
    mensaje.className = "review-queue-empty";
    mensaje.textContent = "No hay juegos pendientes de revisión. La colección está al día.";

    contenedor.appendChild(mensaje);
    return;
  }

  grupos.forEach((grupo) => {
    if (grupo.juegos.length === 0) return;

    const tarjeta = document.createElement("article");
    tarjeta.className = `review-queue ${grupo.prioridad}`;

    const cabecera = document.createElement("div");
    cabecera.className = "review-queue-header";

    const titulo = document.createElement("h3");
    titulo.className = "review-queue-title";
    titulo.textContent = grupo.titulo;

    const contador = document.createElement("span");
    contador.className = "review-group-count";
    contador.textContent = grupo.juegos.length;
    contador.setAttribute(
      "aria-label",
      `${grupo.juegos.length} juego${grupo.juegos.length === 1 ? "" : "s"}`
    );

    const descripcion = document.createElement("p");
    descripcion.className = "review-group-description";
    descripcion.textContent = grupo.descripcion;

    const boton = document.createElement("button");
    boton.className = "review-group-action";
    boton.type = "button";
    boton.textContent = "Ver juegos";
    boton.dataset.reviewGroup = grupo.id;
    boton.setAttribute(
      "aria-label",
      `Ver ${grupo.juegos.length} juego${grupo.juegos.length === 1 ? "" : "s"}: ${grupo.titulo}` 
    );

    boton.addEventListener("click", () => {
      abrirGrupoPendiente(grupo.id);
    });

    cabecera.appendChild(titulo);
    cabecera.appendChild(contador);

    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(boton);

    contenedor.appendChild(tarjeta);
  });
}

function obtenerGruposPendientes() {
  return [
    {
      id: "dump-fallido",
      titulo: "Dumps fallidos",
      descripcion: 
        "El proceso de lectura no se completó correctamente. Conviene revisar y repetir el dump.",
      prioridad: "priority-high",
      juegos: todosLosJuegos.filter(
        (juego) => juego.estadoDump === "fallido"
      )
    },
    {
      id: "dump-parcial",
      titulo: "Dumps parciales",
      descripcion:
        "Solo parte del contenido se ha podido procesar. Requiere comprobar los discos pendientes.",
      prioridad: "priority-high",
      juegos: todosLosJuegos.filter(
        (juego) => juego.estadoDump === "parcial"
      )
    },
    {
      id: "dump-pendiente",
      titulo: "Dumps pendientes",
      descripcion:
        "Todavía no se ha hecho un dump completo para estos juegos.",
      prioridad: "priority-medium",
      juegos: todosLosJuegos.filter(
        (juego) => juego.estadoDump === "pendiente"
      )
    },
    {
      id: "dump-avisos",
      titulo: "Dumps con avisos",
      descripcion:
        "El dump terminó, pero registró errores de lectura que podrían afectar al juego.",
      prioridad: "priority-medium",
      juegos: todosLosJuegos.filter(
        (juego) => juego.estadoDump === "avisos"
      )
    },
    {
      id: "pc-ajustes",
      titulo: "PC que requiere ajustes",
      descripcion:
        "Juegos de PC que funcionan con incidencias o necesitan cambios de configuración.",
      prioridad: "priority-review",
      juegos: todosLosJuegos.filter(
        (juego) => 
          juego.plataforma === "PC" &&
          juego.estadoCompatibilidad === "requiere_ajustes"
      )
    },
    {
      id: "pc-legacy",
      titulo: "PC solo en entorno legacy",
      descripcion:
        "Juegos de PC que necesitan un sistema anterior para ejecutarse correctamente.",
      prioridad: "priority-review",
      juegos: todosLosJuegos.filter(
        (juego) => 
          juego.plataforma === "PC" &&
          juego.estadoCompatibilidad === "solo_legacy"
      )
    },
    {
      id: "pc-no-probado",
      titulo: "PC sin prueba de compatibilidad",
      descripcion:
        "Juegos de PC con dump registrado, pero todavía sin una prueba de funcionamiento.",
      prioridad: "priority-review",
      juegos: todosLosJuegos.filter(
        (juego) => 
          juego.plataforma === "PC" &&
          juego.estadoCompatibilidad === "no_probado"
      )
    },
    {
      id: "consola-sin-emulador",
      titulo: "Consolas sin prueba de emulador",
      descripcion:
        "Juegos de consola sin un emulador probado.",
      prioridad: "priority-review",
      juegos: todosLosJuegos.filter(
        (juego) => 
          juego.plataforma !== "PC" &&
          !juego.emuladorProbado
      )
    },
    {
      id: "consola-con-emulador",
      titulo: "Consolas con emulador probado",
      descripcion:
        "Juegos de consola con un emulador ya probado.",
      prioridad: "priority-review",
      juegos: todosLosJuegos.filter(
        (juego) =>
          juego.plataforma !== "PC" &&
          Boolean(juego.emuladorProbado)
      )
    }
  ];
}

function abrirGrupoPendiente(idGrupo) {
  const buscador = document.getElementById("search-input");

  terminoBusqueda = "";
  if (buscador) buscador.value = "";

  plataformaActiva = "todos";

  document.querySelectorAll("[data-platform]").forEach((boton) => {
    boton.classList.toggle(
      "active",
      boton.dataset.platform === "todos"
    );
  });

  filtrosAvanzados = {
    anio: "todos",
    dump: "todos",
    compatibilidad: "todos",
    emulador: "todos",
    hashVerificado: "todos",
    plataformaSecundaria: ""
  };

  const controles = {
    anio: document.getElementById("filter-year"),
    dump: document.getElementById("filter-dump"),
    compatibilidad: document.getElementById("filter-compatibility"),
    emulador: document.getElementById("filter-emulator")
  };

  Object.values(controles).forEach((control) => {
    if (control) control.value = "todos";
  });

  const filtrosPorGrupo = {
    "dump-fallido": { dump: "fallido" },
    "dump-parcial": { dump: "parcial" },
    "dump-pendiente": { dump: "pendiente" },
    "dump-avisos": { dump: "avisos" },
    "pc-ajustes": { plataforma: "PC", compatibilidad: "requiere_ajustes" },
    "pc-legacy": { plataforma: "PC", compatibilidad: "solo_legacy" },
    "pc-no-probado": { plataforma: "PC", compatibilidad: "no_probado" },
    "consola-sin-emulador": { plataforma: "consolas_sin_emulador" },
    "consola-con-emulador": { plataforma: "consolas_con_emulador" }
  };

  const filtro = filtrosPorGrupo[idGrupo];
  if (!filtro) return;

  if (filtro.plataforma) {
    plataformaActiva = filtro.plataforma;

    document.querySelectorAll("[data-platform]").forEach((boton) => {
      boton.classList.toggle(
        "active",
        boton.dataset.platform === plataformaActiva
      );
    });
  }

  if (filtro.dump) {
    filtrosAvanzados.dump = filtro.dump;
    if (controles.dump) controles.dump.value = filtro.dump;
  }

  if (filtro.compatibilidad) {
    filtrosAvanzados.compatibilidad = filtro.compatibilidad;
    if (controles.compatibilidad) {
      controles.compatibilidad.value = filtro.compatibilidad;
    }
  }

  actualizarVista();

  const seccionResultados = document.getElementById("games-grid");

  if (seccionResultados) {
    seccionResultados.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function abrirFiltroDesdeProgreso(filtro = {}) {
  const buscador = document.getElementById("search-input");
  const controles = {
    anio: document.getElementById("filter-year"),
    dump: document.getElementById("filter-dump"),
    compatibilidad: document.getElementById("filter-compatibility"),
    emulador: document.getElementById("filter-emulator")
  };

  terminoBusqueda = "";
  if (buscador) buscador.value = "";

  plataformaActiva = filtro.plataforma || "todos";

  const plataformaSecundaria = filtro.plataformaSecundaria || "";

  filtrosAvanzados = {
    anio: filtro.anio || "todos",
    dump: filtro.dump || "todos",
    compatibilidad: filtro.compatibilidad || "todos",
    emulador: filtro.emulador || "todos",
    hashVerificado: filtro.hashVerificado === true ? "si" : "todos",
    plataformaSecundaria
  };

  Object.entries(controles).forEach(([nombre, control]) => {
    if (control) control.value = filtrosAvanzados[nombre];
  });

  document.querySelectorAll("[data-platform]").forEach((boton) => {
    boton.classList.toggle(
      "active",
      boton.dataset.platform === plataformaActiva
    );
  });

  actualizarVista();
  cerrarPanelProgreso();

  const seccionJuegos = document.getElementById("games-grid");

  if (seccionJuegos) {
    seccionJuegos.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
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
    let coincidePlataforma = true;

    if (plataforma === "todos") {
      coincidePlataforma = true;
    } else if (plataforma === "consolas_sin_emulador") {
      coincidePlataforma =
        juego.plataforma !== "PC" &&
        !juego.emuladorProbado;
    } else if (plataforma === "consolas_con_emulador") {
      coincidePlataforma =
        juego.plataforma !== "PC" &&
        Boolean(juego.emuladorProbado);
    } else {
      coincidePlataforma = juego.plataforma === plataforma;
    }

    const coincidePlataformaSecundaria =
      !filtros.plataformaSecundaria ||
      juego.plataforma === filtros.plataformaSecundaria;

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

    const coincideHash =
      filtros.hashVerificado === "todos" ||
      (filtros.hashVerificado === "si" && juego.hashVerificado);

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
           coincidePlataformaSecundaria &&
           coincideBusqueda && 
           coincideAnio && 
           coincideDump && 
           coincideCompatibilidad && 
           coincideEmulador &&
           coincideHash;
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
        emulador: "todos",
        hashVerificado: "todos",
        plataformaSecundaria: ""
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

function actualizarProgresoColeccion(juegos) {
  const total = juegos.length;

  const dumpsOk = contarJuegos(juegos, (juego) => juego.estadoDump === "ok");
  const dumpsAvisos = contarJuegos(
    juegos,
    (juego) => juego.estadoDump === "avisos"
  );
  const dumpsParciales = contarJuegos(
    juegos,
    (juego) => juego.estadoDump === "parcial"
  );
  const dumpsPendientes = contarJuegos(
    juegos,
    (juego) => juego.estadoDump === "pendiente"
  );
  const dumpsFallidos = contarJuegos(
    juegos,
    (juego) => juego.estadoDump === "fallido"
  );

  const hashesOk = contarJuegos(
    juegos,
    (juego) => juego.hashVerificado
  );

  const juegosPC = juegos.filter((juego) => juego.plataforma === "PC");
  const juegosConsola = juegos.filter((juego) => juego.plataforma !== "PC");

  const pcOk = contarJuegos(
    juegosPC,
    (juego) => juego.estadoCompatibilidad === "ok_moderno"
  );
  const pcLegacy = contarJuegos(
    juegosPC,
    (juego) => juego.estadoCompatibilidad === "solo_legacy"
  );
  const pcAjustes = contarJuegos(
    juegosPC,
    (juego) => juego.estadoCompatibilidad === "requiere_ajustes"
  );
  const pcNoProbados = contarJuegos(
    juegosPC,
    (juego) => juego.estadoCompatibilidad === "no_probado"
  );

  const consolasProbadas = contarJuegos(
    juegosConsola,
    (juego) => Boolean(juego.emuladorProbado)
  );
  const consolasNoProbadas = contarJuegos(
    juegosConsola,
    (juego) => !juego.emuladorProbado
  );

  actualizarTextoProgreso("pg-juegos", total);
  actualizarTextoProgreso("pg-dumps-ok", dumpsOk);
  actualizarTextoProgreso("pg-dumps-avisos", dumpsAvisos);
  actualizarTextoProgreso("pg-dumps-parciales", dumpsParciales);
  actualizarTextoProgreso("pg-dumps-pendientes", dumpsPendientes);
  actualizarTextoProgreso("pg-dumps-fallidos", dumpsFallidos);
  actualizarTextoProgreso("pg-hashes-ok", hashesOk);

  actualizarTextoProgreso(
    "pg-porcentaje-lista",
    formatearPorcentaje(dumpsOk + dumpsAvisos, total)
  );
  actualizarTextoProgreso(
    "pg-porcentaje-hashes",
    formatearPorcentaje(hashesOk, total)
  );

  actualizarTextoProgreso("pg-pc-ok", pcOk);
  actualizarTextoProgreso("pg-pc-legacy", pcLegacy);
  actualizarTextoProgreso("pg-pc-ajustes", pcAjustes);
  actualizarTextoProgreso("pg-pc-noprobar", pcNoProbados);
  actualizarTextoProgreso("pg-consolas-probado", consolasProbadas);
  actualizarTextoProgreso("pg-consolas-noprobar", consolasNoProbadas);

  renderizarTablaPlataformas(juegos);
}

function contarJuegos(juegos, condicion) {
  return juegos.filter(condicion).length;
}

function actualizarTextoProgreso(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

function formatearPorcentaje(parte, total) {
  if (total === 0) return "0%";

  return `${Math.round((parte / total) * 100)}%`;
}

function renderizarTablaPlataformas(juegos) {
  const cuerpoTabla = document.querySelector(
    "#tabla-plataformas tbody"
  );

  if (!cuerpoTabla) return;

  cuerpoTabla.innerHTML = "";

  const plataformas = [...new Set(juegos.map((juego) => juego.plataforma))]
    .sort((a, b) => a.localeCompare(b, "es"));

  plataformas.forEach((plataforma) => {
    const juegosPlataforma = juegos.filter(
      (juego) => juego.plataforma === plataforma
    );

    const esPC = plataforma === "PC";

    const total = juegosPlataforma.length;
    const ok = contarJuegos(
      juegosPlataforma,
      (juego) => juego.estadoDump === "ok"
    );
    const avisos = contarJuegos(
      juegosPlataforma,
      (juego) => juego.estadoDump === "avisos"
    );
    const parcial = contarJuegos(
      juegosPlataforma,
      (juego) => juego.estadoDump === "parcial"
    );
    const pendiente = contarJuegos(
      juegosPlataforma,
      (juego) => juego.estadoDump === "pendiente"
    );
    const fallido = contarJuegos(
      juegosPlataforma,
      (juego) => juego.estadoDump === "fallido"
    );
    const hashesOk = contarJuegos(
      juegosPlataforma,
      (juego) => juego.hashVerificado
    );

    const sinProbar = esPC
      ? contarJuegos(
          juegosPlataforma,
          (juego) => juego.estadoCompatibilidad === "no_probado"
        )
      : contarJuegos(
          juegosPlataforma,
          (juego) => !juego.emuladorProbado
        );

    const requiereAjustes = contarJuegos(
      juegosPlataforma,
      (juego) => juego.estadoCompatibilidad === "requiere_ajustes"
    );

    const soloLegacy = contarJuegos(
      juegosPlataforma,
      (juego) => juego.estadoCompatibilidad === "solo_legacy"
    );

    const fila = document.createElement("tr");

    const celdas = [
      {
        valor: plataforma,
        filtro: { plataforma },
        etiqueta: `Ver todos los juegos de ${plataforma}`,
        permitirCero: true
      },
      {
        valor: total,
        filtro: { plataforma },
        etiqueta: `Ver todos los juegos de ${plataforma}`
      },
      {
        valor: ok,
        filtro: { plataforma, dump: "ok" },
        etiqueta: `Ver juegos de ${plataforma} con dump OK`
      },
      {
        valor: avisos,
        filtro: { plataforma, dump: "avisos" },
        etiqueta: `Ver juegos de ${plataforma} con dump con avisos`
      },
      {
        valor: parcial,
        filtro: { plataforma, dump: "parcial" },
        etiqueta: `Ver juegos de ${plataforma} con dump parcial`
      },
      {
        valor: pendiente,
        filtro: { plataforma, dump: "pendiente" },
        etiqueta: `Ver juegos de ${plataforma} con dump pendiente`
      },
      {
        valor: fallido,
        filtro: { plataforma, dump: "fallido" },
        etiqueta: `Ver juegos de ${plataforma} con dump fallido`
      },
      {
        valor: hashesOk,
        filtro: { plataforma, hashVerificado: true },
        etiqueta: `Ver juegos de ${plataforma} con hash verificado`
      },
      {
        valor: sinProbar,
        filtro: esPC
          ? { plataforma, compatibilidad: "no_probado" }
          : {
              plataforma: "consolas_sin_emulador",
              plataformaSecundaria: plataforma
            },
        etiqueta: esPC
          ? `Ver juegos de PC no probados`
          : `Ver juegos de ${plataforma} sin emulador probado`
      },
      {
        valor: requiereAjustes,
        filtro: { plataforma, compatibilidad: "requiere_ajustes" },
        etiqueta: `Ver juegos de ${plataforma} que requieren ajustes`
      },
      {
        valor: soloLegacy,
        filtro: { plataforma, compatibilidad: "solo_legacy" },
        etiqueta: `Ver juegos de ${plataforma} que requieren entorno legacy`
      }
    ];

    celdas.forEach((celdaInfo) => {
      const celda = document.createElement("td");
      const boton = document.createElement("button");

      boton.type = "button";
      boton.className = "progreso-tabla-boton";
      boton.textContent = celdaInfo.valor;
      boton.setAttribute("aria-label", celdaInfo.etiqueta);

      const debeDesactivarse =
        celdaInfo.valor === 0 && !celdaInfo.permitirCero;

      boton.disabled = debeDesactivarse;

      if (!debeDesactivarse) {
        boton.addEventListener("click", () => {
          abrirFiltroDesdeProgreso(celdaInfo.filtro);
        });
      }

      celda.appendChild(boton);
      fila.appendChild(celda);
    });

    cuerpoTabla.appendChild(fila);
  });
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
  const botonFicha = document.createElement("button");
  botonFicha.type = "button";
  botonFicha.className = "game-detail-button";
  botonFicha.textContent = "Ver ficha";
  botonFicha.setAttribute(
    "aria-label",
    `Ver ficha de ${juego.titulo}`
  );

  botonFicha.addEventListener("click", () => {
  ultimoBotonFicha = botonFicha;
  abrirFichaJuego(juego);
  });

  articulo.appendChild(header);
  articulo.appendChild(coverFrame);
  articulo.appendChild(meta);
  articulo.appendChild(notes);
  articulo.appendChild(botonFicha);

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

function configurarModalFicha() {
  const modal = document.getElementById("game-detail-modal");
  if (!modal) return;

  modal.querySelectorAll("[data-detail-close]").forEach((elemento) => {
    elemento.addEventListener("click", cerrarFichaJuego);
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !modal.hidden) {
      cerrarFichaJuego();
    }
  });
}

function cerrarFichaJuego() {
  const modal = document.getElementById("game-detail-modal");
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  document.body.style.overflow = "";

  if (ultimoBotonFicha) {
    ultimoBotonFicha.focus();
  }

  ultimoBotonFicha = null;
}

function abrirFichaJuego(juego) {
  const modal = document.getElementById("game-detail-modal");
  const contenido = document.getElementById("game-detail-content");

  if (!modal || !contenido) return;

  const badgeInfo = obtenerBadgeInfo(juego.estadoDump);
  const esPC = juego.plataforma === "PC";
  const portada = juego.portada
    ? `assets/img/frontpages/${juego.portada}.png`
    : `https://picsum.photos/seed/${encodeURIComponent(
        `${juego.titulo}-${juego.plataforma}`
      )}/300/420`;

  contenido.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "game-detail-layout";

  const imagen = document.createElement("img");
  imagen.className = "game-detail-cover";
  imagen.src = portada;
  imagen.alt = `Portada de ${juego.titulo}`;
  imagen.width = 300;
  imagen.height = 420;

  const informacion = document.createElement("div");

  const titulo = document.createElement("h2");
  titulo.id = "game-detail-title";
  titulo.className = "game-detail-title";
  titulo.textContent = juego.titulo;

  const subtitulo = document.createElement("p");
  subtitulo.className = "game-detail-subtitle";
  subtitulo.textContent = juego.anio
    ? `${juego.plataforma} · ${juego.anio}`
    : juego.plataforma;

  const badge = document.createElement("span");
  badge.className = `badge ${badgeInfo.clase} game-detail-badge`;
  badge.textContent = badgeInfo.texto;

  const preservacion = crearSeccionFicha(
    "Preservación",
    crearMetadatosFicha([
      ["Estado del dump", badgeInfo.texto],
      ["Fecha de dump", juego.fechaDump || "No registrada"],
      ["Hash verificado", juego.hashVerificado ? "Sí" : "No"],
      ["SHA-256", crearValorHashFicha(juego.hashSha256)]
    ])
  );

  const soporte = crearSeccionFicha(
    "Soporte físico",
    crearMetadatosFicha([
      ["Tipo de soporte", juego.tipo_soporte || "No registrado"],
      [
        "Número de discos",
        `${juego.num_discos || 1} disco${
          Number(juego.num_discos) === 1 ? "" : "s"
        }`
      ]
    ])
  );

  const ejecucion = crearSeccionFicha(
    "Ejecución y pruebas",
    crearMetadatosFicha([
      [
        esPC ? "Compatibilidad" : "Emulador probado",
        esPC
          ? describirCompatibilidad(juego.estadoCompatibilidad)
          : juego.emuladorProbado || "No probado"
      ]
    ])
  );

  const notas = document.createElement("p");
  notas.className = "game-detail-notes";
  notas.textContent =
    juego.notasResumen || "Sin notas registradas para este juego.";

  const seccionNotas = crearSeccionFicha("Notas", notas);

  informacion.appendChild(titulo);
  informacion.appendChild(subtitulo);
  informacion.appendChild(badge);
  informacion.appendChild(preservacion);
  informacion.appendChild(soporte);
  informacion.appendChild(ejecucion);
  informacion.appendChild(seccionNotas);

  if (juego.discos && juego.discos.length > 1) {
    informacion.appendChild(crearSeccionDiscos(juego.discos));
  }

  layout.appendChild(imagen);
  layout.appendChild(informacion);
  contenido.appendChild(layout);

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  const botonCerrar = document.getElementById("game-detail-close");
  if (botonCerrar) botonCerrar.focus();
}

function crearSeccionFicha(titulo, contenido) {
  const seccion = document.createElement("section");
  seccion.className = "game-detail-section";

  const encabezado = document.createElement("h3");
  encabezado.className = "game-detail-section-title";
  encabezado.textContent = titulo;

  seccion.appendChild(encabezado);
  seccion.appendChild(contenido);

  return seccion;
}

function crearValorHashFicha(hash) {
  const valor = document.createElement("code");
  valor.className = "game-detail-hash";
  valor.textContent = hash || "No disponible";
  return valor;
}

function crearMetadatosFicha(datos) {
  const contenedor = document.createElement("div");
  contenedor.className = "game-detail-meta";

  datos.forEach(([etiqueta, valor]) => {
    const item = document.createElement("div");
    item.className = "game-detail-meta-item";

    const label = document.createElement("span");
    label.className = "game-detail-meta-label";
    label.textContent = etiqueta;

    const value = document.createElement("span");
    value.className = "game-detail-meta-value";

    if (valor instanceof Node) {
      value.appendChild(valor);
    } else {
      value.textContent = valor;
    }

    item.appendChild(label);
    item.appendChild(value);
    contenedor.appendChild(item);
  });

  return contenedor;
}

function crearSeccionDiscos(discos) {
  const contenedor = document.createElement("div");
  contenedor.className = "game-detail-discs";

  discos.forEach((disco, indice) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "game-detail-disc";

    const titulo = document.createElement("h4");
    titulo.className = "game-detail-disc-title";
    titulo.textContent = `Disco ${disco.disco_indice || indice + 1}`;

    const metadatos = crearMetadatosFicha([
      ["Estado del dump", disco.estado_dump || "No registrado"],
      ["Fecha de dump", disco.fecha_dump || "No registrada"],
      ["Hash verificado", esSi(disco.hash_verificado) ? "Sí" : "No"],
      ["SHA-256", disco.hash_sha256 || "No disponible"]
    ]);

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(metadatos);
    contenedor.appendChild(tarjeta);
  });

  return crearSeccionFicha("Datos por disco", contenedor);
}

document.addEventListener("DOMContentLoaded", inicializarBiblioteca);