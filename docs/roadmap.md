# Roadmap — Biblioteca de videojuegos

Este roadmap define la evolución prevista de la **biblioteca web** hasta su versión estable `v1.0.0`.

La web y el futuro lanzador portátil para HDD son proyectos separados: esta hoja de ruta cubre únicamente el catálogo, la consulta de datos de preservación y el seguimiento de tareas. La fase de HDD, emuladores portables, BIOS y lanzador Tauri se abordará después de estabilizar la web.

> El contenido de las versiones `x` se decidirá según el uso real de la biblioteca. Las versiones principales describen objetivos, no compromisos rígidos.

---

## v0.3.2 — Pulido visual y experiencia de uso

**Objetivo:** cerrar la fase de interfaz básica y hacer la navegación diaria más clara y cómoda.

### Previsto

- Cambiar el título de sección `Juegos de ejemplo` por `Juegos catalogados`.
- Añadir un contador visible de resultados, por ejemplo: `Mostrando 12 de 45 juegos`.
- Añadir foco visual claro al campo de búsqueda.
- Permitir pulsar `Escape` para borrar la búsqueda activa.
- Mejorar el estado activo y las transiciones de los filtros de plataforma.
- Añadir favicon e identidad visual básica de la página.
- Revisar textos, espaciados y pequeños detalles detectados durante el uso.

### No incluido

- Cambios en el esquema del CSV.
- Nuevos filtros de datos.
- Fichas detalladas por juego.

---

## v0.4.0 — Filtros avanzados de revisión

**Objetivo:** usar la biblioteca como herramienta de troubleshooting y localizar rápidamente juegos que necesitan trabajo.

### Previsto

- Mantener la búsqueda y el filtro actual por plataforma.
- Añadir filtros secundarios desplegables y acumulativos.
- Filtrar por año.
- Filtrar por estado de dump:
  - Todos.
  - OK.
  - Parcial.
  - Pendiente.
  - Fallido.
- Filtrar por estado de compatibilidad en PC:
  - Funciona en sistema actual.
  - Requiere ajustes.
  - Solo entorno legacy.
  - No probado.
- Filtrar juegos de consola según prueba de emulador:
  - Probado.
  - No probado.
- Añadir una acción para limpiar los filtros secundarios.
- Mantener visible el contador de resultados con el estado activo.

### Resultado esperado

Poder responder a preguntas como:

- ¿Qué dumps están fallidos o pendientes?
- ¿Qué juegos de PC requieren ajustes?
- ¿Qué títulos de una plataforma concreta no he probado aún?
- ¿Qué juegos corresponden a un año determinado y siguen pendientes?

---

## v0.4.x — Vista operativa de pendientes

**Objetivo:** convertir los datos existentes en una lista de trabajo priorizable, sin añadir estados redundantes al CSV.

### Previsto

- Añadir una vista o acceso rápido `Pendientes de revisión`.
- Agrupar automáticamente juegos que cumplan una o más condiciones:
  - Dump pendiente, parcial o fallido.
  - Compatibilidad de PC que requiere ajustes, solo funciona en entorno legacy o no ha sido probada.
  - Juegos de consola sin emulador probado registrado.
- Mostrar el motivo por el que cada juego aparece en la lista.
- Permitir abrir la búsqueda filtrada correspondiente desde cada grupo.
- Ajustar textos, criterios y diseño según el uso real tras v0.4.0.

### Resultado esperado

La web debe indicar con claridad qué juego conviene revisar, redumpear, verificar o probar en la próxima sesión de trabajo.

---

## v0.5.0 — Ficha detallada por juego

**Objetivo:** consultar la información completa de un título sin saturar las tarjetas de la cuadrícula principal.

### Previsto

- Abrir una ficha ampliada desde una tarjeta, sin recargar la página.
- Mostrar identidad completa:
  - Título.
  - Plataforma.
  - Año.
  - Portada.
- Mostrar información de preservación:
  - Estado de dump.
  - Fecha de dump.
  - Estado de hash y SHA-256 completo.
- Mostrar información de soporte:
  - Tipo de soporte.
  - Número de discos.
- Mostrar información de ejecución:
  - Compatibilidad para PC.
  - Emulador probado para consolas.
- Mostrar datos por disco en juegos multidisco cuando estén disponibles.
- Mostrar notas completas, sin truncado.
- Añadir controles para cerrar la ficha y, si aporta valor, navegar entre títulos.

### No incluido

- Rutas de archivos privados.
- BIOS.
- Ejecutables de emuladores.
- Lanzamiento de juegos.

Esos datos pertenecen al futuro proyecto privado del HDD.

---

## v0.5.x — Refinamiento de fichas y navegación

**Objetivo:** ajustar la ficha detallada tras usarla con juegos reales y casos multidisco.

### Posibles mejoras

- Mejorar la visualización de juegos con varios discos.
- Añadir mensajes claros para hashes ausentes o no verificados.
- Copiar SHA-256 desde la ficha.
- Mejorar navegación entre juegos de una misma búsqueda o filtro.
- Ajustar la jerarquía visual de notas, fechas y metadatos.
- Corregir problemas de accesibilidad, teclado y móvil detectados durante el uso.

El contenido concreto se decidirá después de utilizar la ficha de v0.5.0.

---

## v0.6.0 — Progreso e informes

**Objetivo:** obtener una visión global de la colección y de las tareas de preservación pendientes.

### Previsto

- Añadir un resumen global de colección:
  - Juegos catalogados.
  - Dumps OK, parciales, pendientes y fallidos.
  - Hashes verificados.
  - Pruebas pendientes.
  - Juegos que requieren ajustes.
- Añadir desglose por plataforma.
- Mostrar una tabla o panel de progreso útil para priorizar trabajo.
- Integrar o enlazar la vista de tareas pendientes.
- Añadir exportación opcional de un informe en CSV o texto para abrir en LibreOffice y revisar fuera de la web.

### Resultado esperado

Poder contestar rápidamente:

- ¿Qué porcentaje de la colección está listo?
- ¿Qué plataforma tiene más trabajo pendiente?
- ¿Qué dumps o pruebas requieren atención primero?
- ¿Qué títulos necesitan troubleshooting?

---

## v1.0.0 — Biblioteca web estable

**Objetivo:** declarar la web completa y estable como catálogo personal de preservación.

### Cierre previsto

- Validar todos los flujos principales:
  - Carga del CSV.
  - Agrupación multidisco.
  - Búsqueda.
  - Filtros combinados.
  - Vista de pendientes.
  - Ficha detallada.
  - Panel de progreso e informes.
- Probar escritorio, ventana estrecha y móvil.
- Corregir errores y detalles encontrados durante el uso real.
- Limpiar código y estilos obsoletos.
- Confirmar el esquema final del CSV y sus convenciones.
- Actualizar README y documentación:
  - Cómo añadir un juego.
  - Cómo añadir una portada.
  - Cómo registrar dump, hash, prueba y notas.
  - Qué archivos no se suben al repositorio.
- Revisar el changelog y publicar la etiqueta `v1.0.0`.

### Alcance final de la web

La biblioteca web debe permitir:

- Registrar y consultar la colección.
- Buscar y filtrar juegos.
- Revisar dumps, hashes, compatibilidad y pruebas.
- Identificar tareas pendientes.
- Consultar fichas completas por juego.
- Ver progreso global y por plataforma.

### Fuera de alcance

La versión `v1.0.0` no incluirá:

- Emuladores portables.
- BIOS.
- Juegos o dumps privados.
- Rutas del HDD.
- Ejecución de emuladores o juegos.
- AutoPlay/Autorun.
- Navegación por mando.
- Carrusel de sistemas.

Esas funciones serán el punto de partida del futuro proyecto separado de **Biblioteca portátil para HDD**.