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

## Modelos

Hay GLB generados (plato lathe + PBR) listos para AR.  
Podés reemplazarlos **manteniendo el mismo nombre** por assets profesionales de Blender/Maya.

- No hace falta cambiar código: `loadModel` usa estas rutas fijas.
- Regenerar los estilizados: `node scripts/generatePlaceholderModels.mjs`
- Si el archivo es inválido o menor a 2 KB, el AR usa el plato procedural de respaldo.
