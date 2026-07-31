# Biblioteca web de preservación de videojuegos

Proyecto personal para organizar una biblioteca local de preservación de videojuegos.

El objetivo de esta web es servir como interfaz visual para consultar el catálogo personal de juegos, plataformas, estados de preservación, compatibilidad y notas, partiendo de metadatos propios y sin incluir en el repositorio copias de discos, BIOS ni otros archivos privados.

## Objetivos del proyecto

- Tener una biblioteca local clara y fácil de consultar.
- Filtrar por plataforma desde la interfaz principal.
- Conectar la web con un catálogo en CSV/ODS alojado en `metadata/`.
- Registrar la evolución del proyecto mediante changelog y control de versiones.
- Mantener fuera del repositorio el material privado de preservación (BIOS, dumps, ISOs, backups).

## Estructura actual

```txt
biblioteca-web/
├── index.html
├── assets/
│   ├── css/
│   ├── img/
│   └── js/
├── docs/
├── metadata/
├── CHANGELOG.md
├── README.md
└── .gitignore
```

## Plataformas iniciales

- PC
- PS1
- PS2
- PS3
- PS4
- PSP
- GameBoy
- GameCube
- DS
- 3DS
- Wii

## Notas

- Este repositorio versiona la parte visual y documental del proyecto.
- Los archivos privados de preservación deben mantenerse fuera de esta carpeta o excluidos del control de versiones.
- El catálogo y la web evolucionarán por versiones incrementales (`v0.x`) mientras se define la maqueta y la lógica.
