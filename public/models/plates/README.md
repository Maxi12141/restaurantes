# Plates

Platos 3D usados como base para presentar comida en AR / escena.

## Formato

- Preferido: `.glb` (binario, listo para runtime)
- Alternativa: `.gltf` + texturas embebidas o relativas

## Convenciones

- Origen en el centro del plato, apoyado sobre Y = 0 (cara superior hacia +Y).
- Escala en metros (diámetro típico ~0.22–0.28 m).
- Un mesh principal (o LODs si aplica); materiales PBR (`baseColor`, `normal`, `roughness`, `metalness`).
- Nombre de archivo en `snake_case`, por ejemplo `white_plate.glb`.

## Placeholders

Los `.glb` actuales son marcadores de ruta (no modelos finales).  
Reemplazalos **manteniendo el mismo nombre de archivo** por GLB reales exportados desde Blender, Maya, etc.

- No hace falta cambiar código: `loadModel` usa estas rutas fijas.
- Si el archivo es inválido, vacío o menor a 2 KB, el AR usa el plato procedural de respaldo.
