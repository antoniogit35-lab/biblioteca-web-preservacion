# Documentación del catálogo de videojuegos

Este documento describe la estructura y las convenciones del archivo `metadata/catalogo_videojuegos.csv`, que actúa como fuente de datos para la biblioteca web de preservación de videojuegos.

El objetivo es que el catálogo sea:

- Fácil de editar y mantener en LibreOffice.
- Estable y predecible para la interfaz web.
- Coherente con el flujo de preservación definido en la checklist.

---

## 1. Flujo general de trabajo

1. Editar el catálogo principal en LibreOffice Calc (`catalogo_videojuegos.ods`).
2. Completar o actualizar las filas para una tanda de juegos (por ejemplo, 10 títulos).
3. Exportar el catálogo a CSV usando:
   - Separador de campos: `;`
   - Codificación: UTF-8
4. Guardar el CSV resultante como `metadata/catalogo_videojuegos.csv`.
5. Comprobar en la interfaz web que:
   - Las tarjetas se generan correctamente.
   - Estadísticas y estados de dump/hash se reflejan según los datos.
6. Hacer commit de los cambios y crear un tag de versión (`v0.x.y`) según el `CHANGELOG.md`.

El archivo `.ods` se mantiene fuera del control de versiones (según `.gitignore`), y el CSV es la vista pública y consumible por la web.

---

## 2. Formato del archivo CSV

El catálogo se exporta desde LibreOffice con las siguientes opciones:

- **Separador de campos**: `;`
- **Separador de cadena**: `"`
- **Conjunto de caracteres**: `UTF-8`
- **Guardar nombres de columna**: activado

Cada **fila** representa un disco o una unidad de juego (por ejemplo, disco 1 y disco 2 de un mismo título). La interfaz agrupa estas filas por juego para mostrar una única tarjeta por título.

---

## 3. Columnas del catálogo

La cabecera oficial del archivo `metadata/catalogo_videojuegos.csv` es:

```text
id;titulo;anio;plataforma;portada;tipo_soporte;num_discos;disco_indice;region;estado_soporte;dumpeado;estado_dump;fecha_dump;tamano_bytes;hash_verificado;hash_sha256;emulador_probado;estado_compatibilidad;notas
```

### Identidad y presentación

- `id`  
  Identificador único de cada registro físico. Si un juego tiene varios discos, cada disco debe tener un identificador propio.  
  Ejemplos: `COD1-PC-1`, `COD1-PC-2`, `TEKKEN3-PS1`.

- `titulo`  
  Nombre del juego mostrado en la biblioteca web.  
  Ejemplos: `Ford Racing 2`, `Crash Team Racing`, `Tekken 3`.

- `anio`  
  Año de lanzamiento de la edición catalogada.  
  Ejemplo: `1998`.

- `plataforma`  
  Sistema para el que se publicó el juego. Se debe usar un nombre consistente en todo el catálogo.  
  Ejemplos: `PC`, `PS1`, `PS2`, `PS3`, `PS4`, `PSP`, `GameBoy`, `GameCube`, `DS`, `3DS`, `Wii`.

- `portada`  
  Identificador de la portada local. Se corresponde con un archivo PNG en `assets/img/frontpages/`.  
  Ejemplo: `tekken-3` corresponde a `assets/img/frontpages/tekken-3.png`.

  Reglas:
  - Usar minúsculas, números y guiones.
  - No usar espacios, tildes, `ñ` ni caracteres especiales.
  - La extensión `.png` no se escribe en el CSV.

### Soporte físico

- `tipo_soporte`  
  Formato del original físico.  
  Ejemplos: `CD`, `DVD`, `UMD`, `Cartucho`.

- `num_discos`  
  Número total de discos o soportes que forman el juego.  
  Ejemplos: `1`, `2`, `4`.

- `disco_indice`  
  Posición del soporte de la fila dentro del juego.  
  Ejemplos: `1`, `2`.

- `region`  
  Región o edición del soporte, si se conoce.  
  Ejemplos: `Europa`, `USA`, `Japón`.

- `estado_soporte`  
  Estado físico observado antes del dump.  
  Ejemplos: `Perfecto estado`, `Algo rallado`, `Muy dañado`.

### Dump e integridad

- `dumpeado`  
  Indica si se ha realizado un intento de dump.  
  Valores recomendados: `si`, `no`.

- `estado_dump`  
  Resultado del proceso de dump:

  - `OK`: completado sin errores aparentes.
  - `OK_con_avisos`: completado, pero con avisos, sectores problemáticos o sustituciones.
  - `fallido`: no se pudo completar.
  - `no_intentado`: todavía no se ha realizado un intento.

- `fecha_dump`  
  Fecha del último intento de dump.  
  Formato recomendado: `YYYY-MM-DD`.  
  Ejemplo: `2026-08-15`.

- `tamano_bytes`  
  Tamaño real de la imagen resultante, expresado en bytes. No usar “tamaño en disco”.

- `hash_verificado`  
  Indica si se ha calculado y comprobado correctamente el SHA-256.  
  Valores recomendados: `si`, `no`.

- `hash_sha256`  
  Hash SHA-256 de la imagen de preservación.

No se guardan rutas locales, dumps, BIOS, imágenes ni licencias/seriales de activación en el repositorio. Las rutas absolutas dejan de ser válidas al mover el archivo y las claves de producto deben conservarse fuera de Git.

### Pruebas y compatibilidad

- `emulador_probado`  
  Herramienta o entorno utilizado para la prueba.  
  Ejemplos: `DuckStation`, `Dolphin`, `PCSX2`, `Windows 11 / ISO montada`.  
  Puede quedar vacío si aún no se ha probado.

- `estado_compatibilidad`  
  Resultado de la prueba:

  - `OK_moderno`: funciona correctamente en el entorno actual.
  - `requiere_ajustes`: funciona parcialmente o necesita configuración, parches o archivos auxiliares.
  - `solo_legacy`: requiere sistema antiguo, hardware original o máquina virtual.
  - `no_probado`: todavía no se ha probado.

- `notas`  
  Campo libre para registrar incidencias, protección LibCrypt/SBI, comportamiento observado, mensajes de error, lentitud, configuración aplicada o cualquier contexto relevante.

---

## 5. Buenas prácticas al rellenar el catálogo

- Mantener consistentes los valores de `estado_dump` y `estado_compatibilidad` para que los filtros futuros funcionen correctamente.
- Rellenar `anio` siempre que sea posible, sobre todo para juegos con varias versiones.
- Usar `portada` con formato de identificador (`ford-racing-2`, `call-of-duty`) y crear las portadas correspondientes en `assets/img/frontpages`.
- Añadir notas claras en `notas` cuando haya fallos, errores o particularidades importantes.
- Revisar el catálogo con una tanda pequeña de juegos tras exportar a CSV para asegurarse de que la codificación y el separador son correctos.

Para el flujo completo de preservación (preparar disco, crear imagen, calcular hash, probar compatibilidad, etc.), consultar `docs/checklist-preservacion-videojuegos.md`.