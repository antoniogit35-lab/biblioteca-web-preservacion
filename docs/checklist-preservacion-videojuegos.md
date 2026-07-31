# Checklist de preservación de discos de videojuegos

## 1. Preparar el disco

1. Comprobar el estado físico del disco: rayas, suciedad, grietas o deformaciones.
2. Si está sucio, limpiarlo suavemente con un paño de microfibra, desde el centro hacia el borde.
3. Insertar el disco en el lector óptico que se vaya a usar.
4. Si el lector lleva mucho tiempo sin usarse, comprobar antes que abre y lee discos con normalidad.

## 2. Crear la imagen con IsoBuster

1. Abrir **IsoBuster**.
2. Seleccionar la unidad del lector donde está insertado el disco.
3. Crear un archivo de imagen del disco completo.
4. Elegir la ruta y el nombre siguiendo el esquema del proyecto.
   - Ejemplo: `D:\PreservacionJuegos\Juegos\PC\Ford Racing 2 (2003)\Ford Racing 2.iso`
5. Usar **ISO** como formato principal cuando sea posible.
6. Si el programa genera también un archivo `.cue`, conservarlo junto al `.iso`.
7. Si aparece un error de sector ilegible:
   - Reintentar una vez si parece un fallo puntual.
   - Si se repite mucho, usar la opción de reemplazar con ceros o detener el intento si el disco o lector están sufriendo demasiado.

## 3. Clasificar el resultado del dump

Rellenar la columna `estado_dump` con uno de estos valores:

- `OK`: dump completado sin errores aparentes.
- `OK_con_avisos`: dump completado, pero con sectores problemáticos, avisos o sustituciones.
- `fallido`: no se pudo completar la imagen.
- `no_intentado`: todavía no se ha intentado el dump.

Añadir en `notas` cualquier detalle importante:

- Mensajes de error.
- Lentitud anormal.
- Sospecha de lector defectuoso.
- Necesidad de reintento con otro lector.

## 4. Rellenar el catálogo

Para cada juego o disco, completar como mínimo:

- `id`
- `titulo`
- `plataforma`
- `tipo_soporte`
- `num_discos`
- `disco_indice`
- `region`
- `serial`
- `tengo_fisico`
- `estado_soporte`
- `dumpeado`
- `ruta_archivo`
- `tamano_bytes`
- `estado_dump`
- `hash_sha256`
- `emulador_probado`
- `estado_compatibilidad`
- `fecha_dump`
- `hash_verificado`
- `notas`

## 5. Guardar el tamaño correcto

En las propiedades del archivo en Windows, anotar **Tamaño** en bytes, no **Tamaño en disco**.

- `Tamaño` = tamaño real del archivo.
- `Tamaño en disco` = espacio ocupado según el sistema de archivos; puede variar según el disco.

## 6. Calcular el hash SHA-256

1. Abrir PowerShell.
2. Ejecutar:

```powershell
Get-FileHash "RUTA_DEL_ARCHIVO.iso" -Algorithm SHA256
```

3. Copiar el valor del campo `Hash`.
4. Pegar ese valor en la columna `hash_sha256`.
5. Cambiar `hash_verificado` a `sí`.

## 7. Probar la ISO

1. Montar la ISO con Windows o con una herramienta de montaje.
2. Abrir el instalador del juego o probar el arranque con la ISO montada.
3. Comprobar si:
   - se instala bien,
   - arranca bien,
   - da errores modernos de compatibilidad,
   - o necesita sistema antiguo / ajustes.

## 8. Clasificar compatibilidad

Rellenar la columna `estado_compatibilidad` con uno de estos valores:

- `OK_moderno`: funciona bien en el Windows actual.
- `requiere_ajustes`: funciona parcialmente o necesita fixes, parches o configuración extra.
- `solo_legacy`: solo funciona bien en un sistema antiguo o máquina virtual.
- `no_probado`: todavía no se ha probado.

En `notas`, escribir el caso concreto.

Ejemplos:

- Error de DRM antiguo en Windows moderno.
- Error de filtro WMA / DirectShow.
- Crash al iniciar una partida.
- Instalación correcta pero ejecución parcial.

## 9. Decidir el estado final del juego

Cuando el juego ya esté dumpeado, hasheado y probado, revisar que tenga:

- archivo de imagen guardado,
- ruta correcta en el catálogo,
- hash SHA-256 anotado,
- `estado_dump` definido,
- `estado_compatibilidad` definido,
- notas claras si hay problemas.

## 10. Hacer copia de seguridad

1. Copiar periódicamente la carpeta principal del proyecto a otro disco.
2. Mantener al menos una copia adicional en un disco distinto.
3. Si un juego es especialmente importante o difícil de leer, priorizar su backup.
4. Repetir comprobación de hash si se quiere verificar integridad tras copiar.

## Resumen rápido

Flujo recomendado para cada disco:

1. Revisar estado físico.
2. Crear imagen con IsoBuster.
3. Rellenar el catálogo.
4. Guardar el tamaño correcto.
5. Calcular SHA-256.
6. Montar y probar la ISO.
7. Marcar `estado_dump` y `estado_compatibilidad`.
8. Añadir notas.
9. Hacer backup.
