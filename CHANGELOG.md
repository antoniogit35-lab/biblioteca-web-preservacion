# Changelog

Todos los cambios importantes de este proyecto se irán registrando aquí.

## [Unreleased]

### Pendiente
- Añadir soporte de portadas por juego usando imágenes locales en `assets/img/frontpages` y un campo dedicado en el catálogo.
- Implementar filtros interactivos por plataforma en la barra superior (PC, PS2, PS3, etc.) conectados a los datos reales.
- Activar la búsqueda por título y notas sobre el catálogo cargado en memoria.
- Incorporar filtros por estado de preservación basados en `estado_dump` y `estado_compatibilidad`:
- Ver solo dumps correctos (`OK`, `OK_con_avisos`).
- Ver solo dumps fallidos o pendientes.
- Ver juegos que requieren ajustes o solo funcionan en entorno legacy.
- Ajustar y pulir pequeños detalles visuales y de copia en la interfaz (versiones 0.3.x).

## [v0.2.1] - YYYY-MM-DD

### Añadido
- Campo de portada por juego en el catálogo (`metadata/catalogo_videojuegos.csv`) para enlazar cada título con su imagen local.
- Soporte de portadas en la interfaz usando imágenes en `assets/img/frontpages`.
- Fallback automático a una portada genérica cuando un juego aún no tenga imagen propia.

### Cambiado
- Las tarjetas de juego dejan de usar portadas aleatorias remotas y pasan a priorizar las imágenes locales de la colección.
- Documentación actualizada para explicar el esquema de nombres de archivo de las portadas y cómo añadir nuevas imágenes al catálogo visual.

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