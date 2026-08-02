# Roadmap del proyecto de biblioteca de videojuegos

Este documento recoge la visión general y las etapas previstas para el proyecto de biblioteca web de preservación de videojuegos. Sirve como guía de evolución, complementando el detalle de cambios que se registra en `CHANGELOG.md`.

---

## 1. Objetivo general

El objetivo del proyecto es construir una biblioteca web que:

- Organice y muestre la colección física de videojuegos.
- Refleje el estado real de preservación (dump, hash, compatibilidad, notas).
- Se alimente de un catálogo editable en LibreOffice y exportado a CSV.
- Permita explorar la colección de forma cómoda por plataforma, estado y notas.

---

## 2. Estado actual (línea 0)

### v0.1.x – Maqueta estática

- Definición inicial del proyecto como biblioteca web de preservación de videojuegos.
- Primera maqueta estática en HTML/CSS para explorar estructura visual y navegación.
- Filtros iniciales por plataformas y tarjetas de ejemplo sin conexión a datos reales.
- Estructura base del proyecto con carpetas para `assets`, `docs` y `metadata`.

### v0.2.0 – Conexión con el catálogo CSV

- Carga del catálogo real desde `metadata/catalogo_videojuegos.csv` exportado desde LibreOffice.
- Parser CSV en JavaScript adaptado a separador `;` y codificación UTF-8.
- Generación dinámica de tarjetas de juego a partir de los datos del catálogo.
- Cálculo automático de estadísticas de la colección (juegos catalogados, dumps correctos, estados pendientes/fallidos, plataformas visibles).

### v0.2.1 – Enriquecimiento visual y de datos

- Añadidas las columnas `anio`, `emulador_usado` y `portada` al catálogo.
- Tarjetas visuales muestran `Plataforma · Año` en el subtítulo.
- Portadas locales por juego en `assets/img/frontpages`, enlazadas mediante el identificador `portada`.
- La interfaz prioriza imágenes locales frente a portadas genéricas remotas.

---

## 3. Próximas versiones

### v0.3.0 – Filtros por plataforma y búsqueda

Objetivo: mejorar la exploración básica de la colección.

- Conectar los botones de plataforma (PC, PS2, PS3, PSP, GameCube, DS, etc.) con el catálogo real.
- Permitir filtrar la vista para mostrar solo los juegos de una plataforma concreta.
- Activar la búsqueda en la barra superior:
  - Búsqueda por título.
  - Búsqueda por texto en notas (comentarios de dump, DRM, errores WMA, etc.).
- Mantener las estadísticas actualizadas según el filtro/búsqueda activa.

### v0.3.x – Detalles y refinamientos

Objetivo: pulir la experiencia antes de añadir filtros avanzados.

- Ajustes de tipografía, espaciados y jerarquía visual en tarjetas y paneles.
- Refinar textos en la interfaz (mensajes de estado, labels, copia de ayuda).
- Pequeños refactors en el código JavaScript (`catalogo.js`, `ui.js`) para mejorar legibilidad y mantenimiento.
- Añadir métricas o contadores adicionales si se ve necesario (por ejemplo, juegos por estado de compatibilidad).

---

## 4. v0.4.0 – Filtros por estado de preservación

Objetivo: permitir consultas más específicas sobre el estado de preservación.

Basado en la checklist de preservación y en las columnas `estado_dump` y `estado_compatibilidad`.

Funciones previstas:

- Filtros por estado de dump:
  - Ver solo dumps correctos (`OK`, `OK_con_avisos`).
  - Ver solo dumps fallidos (`fallido`).
  - Ver dumps pendientes (`no_intentado`).

- Filtros por compatibilidad:
  - Juegos que funcionan bien en el sistema moderno (`OK_moderno`).
  - Juegos que requieren ajustes (`requiere_ajustes`).
  - Juegos que solo funcionan bien en entorno legacy (`solo_legacy`).
  - Juegos aún no probados (`no_probado`).

- Combinación de filtros de plataforma + estado de preservación para explorar casos concretos (por ejemplo, “juegos de PS2 con dump OK pero solo legacy”).

---

## 5. Posibles evoluciones futuras

Estas ideas no tienen versión asignada todavía, pero se consideran para etapas posteriores:

- Vista detallada por juego:
  - Mostrar todos los discos asociados.
  - Ver hashes y rutas por disco.
  - Historial de pruebas y compatibilidad más completo.

- Exportaciones y reporting:
  - Generación de listados filtrados (por plataforma, estado de dump, compatibilidad).
  - Posibles exportaciones adicionales en formatos distintos (por ejemplo, JSON para integraciones).

- Integraciones de preservación:
  - Enlazar notas con documentación externa (artículos, hilos, etc.) cuando haya casos complejos.
  - Añadir referencias a herramientas usadas (IsoBuster, emuladores concretos).

---

## 6. Relación con el changelog y tags

- Cada versión estable del roadmap se materializa en el `CHANGELOG.md` con un bloque detallado de cambios.
- Se crea un tag de Git (`v0.2.0`, `v0.2.1`, `v0.3.0`, etc.) para marcar el estado del repositorio asociado a cada versión.
- Este `docs/roadmap.md` sirve como vista de alto nivel; el `CHANGELOG.md` recoge el detalle de implementación y fixes concretos.