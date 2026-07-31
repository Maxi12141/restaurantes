# Textures

Texturas y mapas PBR reutilizables (no embebidos en un `.glb`).

## Formato

- Color / albedo: `.png`, `.jpg`, `.webp`
- Normal, roughness, metalness, AO, height: mismos formatos o packs ORM
- Opcional comprimido: `.ktx2` / Basis Universal para runtime

## Convenciones

- Agrupar por material o prop: por ejemplo `ceramic/`, `wood/`, `fabric/`.
- Incluir resolución en el nombre si hay variantes: `wood_diffuse_2k.jpg`.
- Preferir potencia de dos (512, 1024, 2048) para mejor compatibilidad en GPU.

## Uso

Cargar desde código con rutas públicas, por ejemplo `/textures/...`. Los mapas ya embebidos en un GLB no hace falta duplicarlos aquí.
