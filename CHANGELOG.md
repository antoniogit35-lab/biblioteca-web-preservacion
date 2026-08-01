# Changelog

Todos los cambios importantes de este proyecto se irán registrando aquí.

## [Unreleased]

### Pendiente
- Separar scripts del HTML principal.
- Conectar la interfaz con los datos reales del catálogo.

## [v0.1.2] - 2026-08-01

### Añadido
- Resumen compacto en la cabecera con número de juegos y plataformas visibles.
- Imágenes de portada en las tarjetas de juego para reforzar la identificación visual de cada título.
- Indicador de estado de prueba normalizado en las tarjetas (`Pendiente`, `A revisar`, `Fallido`, `Funciona`).

### Cambiado
- Rediseñado el hero principal para presentar la biblioteca como “Biblioteca de juegos” con descripción clara de su propósito.
- Ajustado el placeholder de la barra de búsqueda para indicar búsqueda por título o notas, eliminando la referencia a plataforma.
- Rediseñados los filtros de plataforma como tarjetas compactas con icono representativo (ratón para PC y mandos para consolas).
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