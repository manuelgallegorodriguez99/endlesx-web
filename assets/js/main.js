/* EndlesX. Animaciones (GSAP + ScrollTrigger)
   Si el usuario prefiere menos movimiento, no se crea ninguna animación
   y la página se ve completa y quieta. */

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// Parte el manifiesto en palabras (el texto sigue en el HTML para buscadores).
function splitWords(el) {
  const nodes = [...el.childNodes];
  el.textContent = "";
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { el.append(part); return; }
        const w = document.createElement("span");
        w.className = "mw";
        w.textContent = part;
        el.append(w);
      });
    } else {
      node.classList.add("mw");
      el.append(node);
    }
  });
  return $$(".mw", el);
}

const nav = $(".nav");
const yellowZones = {};
function setYellow(zone, on) {
  yellowZones[zone] = on;
  nav.classList.toggle("on-yellow", Object.values(yellowZones).some(Boolean));
}

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  const hero = $(".hero");
  const heroX = $("#heroX");
  const tapes = $$("i", heroX);
  const [tapeA, tapeB] = tapes;

  /* 1. Entrada: las letras suben y la X se pega de golpe */
  const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
  intro
    .from(".hero-logo .w span", { yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.05 })
    .from($(".tx-in", heroX), { scale: 1.35, rotation: -12, opacity: 0, duration: 0.5, ease: "back.out(2)" }, 0.35)
    .from(".hero-bottom > *", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.45);

  /* 2. Al bajar: la X se despega del logo y cae con gravedad, rebota,
        sus cintas se ponen horizontales, se estiran hacia los lados
        y crecen hasta llenar la pantalla de amarillo */
  const vh = () => window.innerHeight;
  const tapeW = () => tapeA.offsetWidth;
  const tapeH = () => tapeA.offsetHeight;
  const xCenter = () => heroX.offsetLeft + heroX.offsetWidth / 2;
  const yCenter = () => heroX.offsetTop + heroX.offsetHeight / 2;
  const LAND = 0.84, REST = 0.55; // dónde toca "suelo" y dónde se queda tras el rebote (en alto de pantalla)

  gsap.set(tapeA, { rotation: -52 });
  gsap.set(tapeB, { rotation: 52 });

  const fall = gsap.timeline({
    scrollTrigger: {
      trigger: hero, start: "top top", end: "+=240%", pin: true, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (self) => setYellow("hero", self.isActive && self.progress > 0.9),
      onToggle: (self) => setYellow("hero", self.isActive && self.progress > 0.9),
    },
  });
  fall
    .to(".hero-bottom", { opacity: 0, y: -30, duration: 0.16, ease: "power1.out" }, 0)
    // Cae acelerando, girando un poco
    .to(heroX, { y: () => vh() * LAND - yCenter(), x: () => (hero.clientWidth / 2 - xCenter()) * 0.6, rotation: 24, duration: 0.28, ease: "power2.in" }, 0)
    .to(".hero-logo .w", { opacity: 0.14, duration: 0.14, ease: "none" }, 0.12)
    .set(heroX, { filter: "none" }, 0.28)
    // Rebota hacia arriba y se centra
    .to(heroX, { y: () => vh() * REST - yCenter(), x: () => hero.clientWidth / 2 - xCenter(), rotation: 0, duration: 0.14, ease: "power2.out" }, 0.28)
    .to(".hero-logo .w", { opacity: 0, duration: 0.1, ease: "none" }, 0.32)
    // Las dos cintas se ponen horizontales, una encima de otra
    .to(tapeA, { rotation: 0, y: () => -tapeH() * 0.55, duration: 0.14, ease: "power2.inOut" }, 0.38)
    .to(tapeB, { rotation: 0, y: () => tapeH() * 0.55, duration: 0.14, ease: "power2.inOut" }, 0.38)
    // Se estiran hacia los lados hasta salirse de la pantalla
    .to(tapes, { scaleX: () => (window.innerWidth * 1.6) / tapeW(), duration: 0.2, ease: "power2.inOut" }, 0.52)
    // Y crecen hasta cubrirla entera: pasamos al manifiesto amarillo
    .to(tapeA, { y: () => vh() * (0.25 - REST), scaleY: () => (vh() * 0.62) / tapeH(), duration: 0.24, ease: "power2.inOut" }, 0.74)
    .to(tapeB, { y: () => vh() * (0.75 - REST), scaleY: () => (vh() * 0.62) / tapeH(), duration: 0.24, ease: "power2.inOut" }, 0.74);

  /* 3. Manifiesto: las palabras se encienden al leerlas y "relleno" se tacha */
  const words = splitWords($("#manifesto"));
  gsap.set(words, { opacity: 0.14 });
  gsap.to(words, {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: ".manifesto", start: "top 55%", end: "bottom 75%", scrub: 0.4 },
  });
  const strike = $(".manifesto .strike");
  gsap.fromTo(strike, { "--k": 0 }, {
    "--k": 1, duration: 0.6, ease: "power3.out",
    scrollTrigger: { trigger: strike, start: "top 62%", toggleActions: "play none none reverse" },
  });
  ScrollTrigger.create({
    trigger: ".manifesto", start: "top bottom", end: "bottom 68px", // empieza justo cuando acaba la cabecera, que ya está amarilla
    onToggle: (self) => setYellow("manifesto", self.isActive),
  });

  /* 4. Cómo trabajamos: la cinta se desenrolla hacia abajo */
  gsap.fromTo(".steps-line", { scaleY: 0 }, {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: ".steps", start: "top 70%", end: "bottom 70%", scrub: 0.4 },
  });

  /* 5. Titulares y bloques aparecen al entrar */
  gsap.set("[data-reveal]", { opacity: 0, y: 28 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out", overwrite: true }),
  });

  /* 6. Contacto: la X vuelve volando y se pega otra vez al logo. Sin fin. */
  gsap.fromTo("#endX", { x: () => -window.innerWidth * 0.35, y: () => -window.innerHeight * 0.8, rotation: -160 }, {
    x: 0, y: 0, rotation: 0, ease: "power2.out",
    scrollTrigger: { trigger: ".contact-logo", start: "top bottom", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
  });
});

/* Qué hacemos en escritorio: los carteles pasan en horizontal mientras bajas */
mm.add("(prefers-reduced-motion: no-preference) and (min-width: 900px)", () => {
  const track = $(".svc-track");
  const distance = () => track.offsetWidth - document.documentElement.clientWidth;
  const pan = gsap.to(track, {
    x: () => -distance(), ease: "none",
    scrollTrigger: { trigger: ".services", start: "top top", end: () => "+=" + distance(), pin: true, scrub: 0.8, invalidateOnRefresh: true },
  });
  $$(".card", track).forEach((card) => {
    gsap.from($(".tape", card), {
      scale: 1.6, rotation: -18, opacity: 0, duration: 0.45, ease: "power3.out",
      scrollTrigger: { trigger: card, containerAnimation: pan, start: "left 85%", toggleActions: "play none none reverse" },
    });
  });
});

/* Qué hacemos en móvil: los carteles se apilan y la cinta se pega al entrar */
mm.add("(prefers-reduced-motion: no-preference) and (max-width: 899px)", () => {
  $$(".card").forEach((card) => {
    gsap.from($(".tape", card), {
      scale: 1.6, rotation: -18, opacity: 0, duration: 0.45, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" },
    });
  });
});

// Recalcula posiciones cuando cargan las tipografías (cambian los tamaños).
document.fonts.ready.then(() => ScrollTrigger.refresh());
