# Changelog

Todos los cambios importantes de este proyecto se irán registrando aquí.

## [Unreleased]

### Pendiente

- Incorporar filtros por estado de preservación basados en `estado_dump` y `estado_compatibilidad`:
  - Ver solo dumps correctos (`OK`, `OK_con_avisos`).
  - Ver solo dumps fallidos o pendientes.
  - Ver juegos que requieren ajustes o solo funcionan en entorno legacy.
- Añadir el logotipo de la biblioteca (`assets/img/logo-biblioteca.png`) a la interfaz, valorando su ubicación en el espacio disponible de la cabecera o en una futura sección dedicada al HDD.
- Diseñar una sección para catalogar y consultar el contenido del HDD, manteniendo una estructura coherente con la biblioteca de juegos físicos.
- Valorar una variante simplificada del favicon/logotipo para mejorar su legibilidad a tamaños muy reducidos.
- Revisar y ampliar el catálogo real de juegos, portadas, notas y datos técnicos.
- Mejorar progresivamente la experiencia en dispositivos móviles y la navegación mediante teclado.

## [v0.3.2] - 2026-08-21

### Añadido

- Añadido favicon personalizado basado en la identidad visual de la biblioteca.
- Incorporado el recurso `assets/img/logo-biblioteca.png` con fondo transparente, utilizado como favicon.
- Conservada una versión alternativa con fondo blanco (`assets/img/favicon.png`) para posibles usos futuros.
- Añadido contador de resultados bajo el título de la colección, con el formato “Mostrando X de Y juegos”.
- Añadido `aria-live="polite"` al contador para anunciar los cambios de resultados a lectores de pantalla.
- Añadido atajo de teclado `Escape` en el buscador para borrar la consulta y restaurar la vista completa.

### Cambiado

- Renombrada la sección “Juegos de ejemplo” como “Juegos catalogados”.
- Ajustados los márgenes de la cabecera de sección para integrar el contador de resultados.
- Añadido estilo de foco visible al buscador mediante borde de acento y halo suave, mejorando la navegación por teclado.

### Accesibilidad

- Mejorada la información dinámica de resultados para tecnologías de asistencia.
- Mejorada la visibilidad del foco del buscador.

## [v0.3.1] - 2026-08-19

### Añadido
- Añadido contador dinámico del total de juegos en la cabecera.
- Añadido botón para copiar el hash SHA-256 cuando está disponible.
- Añadido truncado de notas a dos líneas con controles `Mostrar más` y `Mostrar menos`.

### Cambiado
- Actualizado el resumen de cabecera para mostrar el total real cargado desde el CSV y mantener 11 plataformas.
- Simplificadas las tarjetas de juego eliminando los campos `Número de discos` y `Estado dump (agr.)`.
- Mejorada la presentación del estado de hash verificado.
- Limpiadas reglas CSS obsoletas del footer y de una media query sin efecto.

### Corregido
- Ajustada la compatibilidad de `line-clamp` en las notas.
  
## [v0.3.0] - 2026-08-19

### Añadido
- Implementados filtros por plataforma (PC, PS1, PS2, PS3, PS4, PSP, GameBoy, GameCube, DS, 3DS, Wii).
- Implementada búsqueda en tiempo real por título y notas.
- Añadido estado vacío con mensaje cuando no hay resultados.
- Añadidas variables de estado centralizado en `ui.js` para filtros y búsqueda.
- Añadido atributo `data-platform` a los botones de filtro en `index.html`.

### Cambiado
- Simplificado y reordenado el esquema de `metadata/catalogo_videojuegos.csv`.
- Eliminadas las columnas `serial`, `tengo_fisico`, `ruta_archivo` y `emulador_usado`.
- Reorganizadas las columnas por identidad, soporte físico, dump, integridad, pruebas y notas.
- Consolidado `emulador_probado` como único campo para registrar el entorno de prueba.
- Reescrito `catalogo.js` para usar el nuevo esquema del CSV y derivar campos compuestos.
- Implementadas funciones de derivación: `derivarEstadoDump`, `derivarHashVerificado`, `derivarEstadoCompatibilidad`, `derivarNotasResumen`.
- Actualizado `ui.js` para usar el modelo de datos unificado y renderizar tarjetas con información derivada.
- Eliminada maqueta estática y footer informativo de `index.html`.
- Input de búsqueda habilitado y conectado a la lógica de filtrado.

### Corregido
- Eliminada lógica obsoleta en `catalogo.js` que causaba errores de referencia.
- Corregida la agrupación de juegos multidisco para evitar duplicados.
- Corregida la detección de separador CSV para usar `;` como estándar del proyecto.

### Notas
- Primera versión funcional con catálogo real: 45 juegos importados con portadas y metadatos completos.
- Los filtros y la búsqueda funcionan de forma acumulativa.
- El estado de dump, hash verificado y compatibilidad se derivan automáticamente del CSV.

## [v0.2.2] - 2026-08-02

### Arreglado

- Problema con CHANGELOG.md en la versión anterior que no se había actualizado correctamente.

## [v0.2.1] - 2026-08-02

### Añadido
- Columna `anio` en el catálogo para mostrar el año de salida junto a la plataforma en las tarjetas de juego.
- Columna `emulador_usado` para reflejar el emulador en el que se han probado los juegos de consola.
- Columna `portada` que enlaza cada juego con un identificador de imagen local en `assets/img/frontpages`.
- Soporte de portadas locales en la interfaz, priorizando imágenes de la colección frente a las portadas aleatorias.

### Cambiado
- Las tarjetas de juego muestran ahora `Plataforma · Año` en la línea de subtítulo.
- Las portadas remotas de ejemplo se sustituyen por imágenes locales basadas en el identificador `portada`.
- Se actualiza el parser CSV para admitir las nuevas columnas y mantener la compatibilidad con el catálogo existente.

## [v0.2.0] - 2026-08-01

### Añadido
- Carga del catálogo real desde `metadata/catalogo_videojuegos.csv` exportado desde LibreOffice.
- Parser CSV en JavaScript adaptado a separador `;` y codificación UTF-8.
- Generación dinámica de tarjetas de juego a partir de los datos del catálogo.
- Cálculo automático de estadísticas de la colección (juegos catalogados, dumps correctos, estados pendientes/fallidos, plataformas visibles).

### Cambiado
- La sección "Juegos de ejemplo" pasa de ser una maqueta estática a utilizar datos reales del catálogo.
- El estado visual de los dumps (`Dump OK`, `Dump fallido`, `Dump pendiente`) se deriva ahora de la columna `estado_dump` según el checklist de preservación.
- El indicador de "Hash verificado" se basa en la columna `hash_verificado` de todos los discos de cada juego.
- Las notas de cada juego se toman directamente de la columna `notas` del catálogo y se muestran en la tarjeta.

### Documentación
- Actualizada la checklist de preservación para alinearla con las columnas actuales del catálogo y el uso en la interfaz.

## [v0.1.3] - 2026-08-01

### Cambiado
- Sustituidos los emojis de los filtros de plataforma por iconos PNG específicos para cada sistema.
- Ajustado el ancho mínimo de las tarjetas de filtro para que nombres de plataforma más largos (como GameCube) se muestren correctamente.

## [v0.1.2] - 2026-08-01

### Añadido
- Resumen compacto en la cabecera con número de juegos y plataformas visibles.
- Imágenes de portada en las tarjetas de juego para reforzar la identificación visual de cada título.
- Indicador de estado de prueba normalizado en las tarjetas (`Pendiente`, `A revisar`, `Fallido`, `Funciona`).

### Cambiado
- Rediseñado el hero principal para presentar la biblioteca como “Biblioteca de juegos” con descripción clara de su propósito.
- Ajustado el placeholder de la barra de búsqueda para indicar búsqueda por título o notas, eliminando la referencia a plataforma.
- Rediseñados los filtros de plataforma como tarjetas compactas con icono representativo.
- Actualizadas las estadísticas iniciales para eliminar la referencia a compatibilidad moderna y mostrar métricas más generales de la colección.
- Unificada la estructura de las tarjetas de juego:
  - Primera línea con el nombre y el estado del dump.
  - Segunda línea con plataforma y año.
  - Portada en bloque propio, seguida de metadatos y notas.
- En tarjetas de PC se mantiene el campo de compatibilidad; en tarjetas de consola se sustituye por el emulador en el que se ha probado el juego.
- Simplificada la presentación del hash para que siga visible como dato clave sin campos redundantes.
- Ajustados estilos de tipografía, espaciados y paneles para mejorar la jerarquía visual general.
- Actualizado `.gitignore` para ignorar archivos temporales de LibreOffice (`.~lock.*#`) generados al editar el catálogo.

### Eliminado
- Eliminada la métrica de “Compatibilidad moderna” de las estadísticas iniciales.
- Eliminados de las tarjetas los campos de estado del soporte y ruta, al no aportar información prioritaria en la vista principal.
- Eliminada la mención a “CD” en la línea de cabecera de las tarjetas, dejando solo plataforma y año.

## [v0.1.1] - 2026-08-01

### Cambiado
- Separación de los estilos en una hoja de estilos externa `assets/css/style.css`.
- Limpieza de `index.html` eliminando el bloque `<style>` embebido y enlazando la hoja de estilos.

## [v0.1.0] - 2026-07-31

### Añadido
- Definición inicial del proyecto como biblioteca web de preservación de videojuegos.
- Primera maqueta estática en HTML para explorar estructura visual y navegación.
- Filtro inicial por plataformas con opción de ver todos los juegos.
- Tarjetas de ejemplo para representar estado de dump, compatibilidad y notas.
- Estructura base del proyecto con carpetas para `assets`, `docs` y `metadata`.

### Documentación
- Se define el propósito del repositorio como parte visual y organizativa del proyecto.
- Se decide mantener fuera del repositorio los dumps, BIOS, ISOs y demás materiales privados.
- Se inicia el registro de versiones mediante este changelog.