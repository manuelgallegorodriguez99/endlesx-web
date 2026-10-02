# EndlesX. Web

Web de una página que explica qué hace EndlesX (no es un portfolio). Sigue la guía de marca
de `../03-Manual-de-Marca/`.

## Stack
HTML + CSS + JS estáticos, con **GSAP 3.15 + ScrollTrigger** (en `assets/js/`, sin CDN).
Sin build: se puede subir tal cual a Netlify, Vercel, GitHub Pages o cualquier hosting.

**Por qué:** es una sola página sin panel ni base de datos; todo el peso está en las animaciones
de scroll y en que cargue rápido. Next.js no aportaría nada aquí.

## Ver en local
Las fuentes no cargan abriendo el archivo con doble clic (`file://`), hay que servirlo:

```bash
cd 04-Sitio-Web && python3 -m http.server 8765
# abrir http://127.0.0.1:8765
```

## Secciones y animaciones (`assets/js/main.js`)
1. **Cabecera.** Al cargar, las letras suben y la X se pega de golpe. Al bajar (sección fijada):
   la X se despega del logo, cae con gravedad, rebota, sus dos cintas se ponen horizontales,
   se estiran hacia los lados y crecen hasta llenar la pantalla de amarillo.
2. **Manifiesto (amarillo).** Las palabras se encienden según se lee y "relleno" se tacha.
3. **Qué hacemos.** Cinco carteles pegados con cinta que pasan en horizontal (escritorio) o se
   apilan (móvil, menos de 900 px). La cinta de cada cartel se pega al aparecer.
4. **Cómo trabajamos.** Una cinta amarilla se desenrolla junto a los cuatro pasos.
5. **Contacto: "¿Hablamos?".** Botón "Reservar llamada". La X vuelve volando y se pega al logo
   final. Sin fin.

La web no muestra precios (decisión de Manuel): todo se cierra en una llamada.

El menú se pone amarillo (y la X negra) mientras el fondo es amarillo.
Con "reducir movimiento" activado en el sistema no se crea ninguna animación: todo se ve quieto.

## Pendiente (TODO en el código)
- Enlace real del botón "Reservar llamada" (Calendly, Cal.com o `tel:`); de momento apunta a `#contacto` (no hace nada).
- Fotos reales en las tarjetas de Vídeo y Web (ahora son de muestra, `assets/img/`).
- Enlaces a redes en el pie.
- `og:image` y dominio.
- Los textos de "Cómo trabajamos" (Escuchamos / Proponemos / Hacemos / Seguimos) son una
  propuesta: revisar que describen cómo trabaja Manuel de verdad.
