# Foods

Modelos 3D de platos / comidas para colocar sobre el plato en AR.

## Formato

- Preferido: `.glb`
- Alternativa: `.gltf` con assets asociados

## Convenciones

- Origen centrado en la base del alimento (donde apoya sobre el plato), +Y hacia arriba.
- Escala en metros, coherente con los platos de `models/plates/`.
- Optimizar para web/móvil: geometría razonable, texturas comprimidas (KTX2 / WebP si el pipeline lo permite).
- Nombre de archivo en `snake_case`, por ejemplo `burger.glb`, `milanesa.glb`.

## Modelos

Hay GLB generados (burger, milanesa, pasta, pizza) listos para AR.  
Sustituilos **sin cambiar el nombre** por modelos profesionales cuando los tengas.

- No hace falta tocar código: las rutas en `foodModels.ts` ya apuntan aquí.
- Regenerar los estilizados: `node scripts/generatePlaceholderModels.mjs`
- Si el archivo es inválido o menor a 2 KB, el AR usa la comida procedural de respaldo.
