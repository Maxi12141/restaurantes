# HDRI

Mapas de entorno de alto rango dinámico para iluminación y reflejos (IBL).

## Formato

- Preferido: `.hdr` (Radiance) o `.exr`
- Runtime Three.js: a menudo se convierte / usa con `RGBELoader` o equivalentes de `@react-three/drei` (`Environment`, `useEnvironment`).

## Convenciones

- Iluminación de restaurante / estudio suave; evitar HDRIs demasiado contrastados si la comida se ve quemada.
- Resolución típica web: 1k–2k; 4k solo si el peso lo permite.
- Nombre descriptivo en `snake_case`, por ejemplo `studio_soft.hdr`, `restaurant_warm.hdr`.

## Notas

No mezclar aquí texturas de materiales; esas van en `public/textures/`.
