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

## Placeholders

Los `.glb` vacíos son marcadores de ruta. Sustitúyelos por modelos profesionales sin cambiar el nombre si el código ya los referencia.
