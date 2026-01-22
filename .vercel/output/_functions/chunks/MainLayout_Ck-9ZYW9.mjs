import { e as createComponent, g as addAttribute, l as renderHead, n as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_B3-YyRDz.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const {
    title,
    description = "Sistem Penerimaan Santri dan Murid Baru - Yayasan Mukhtar Syafa'at Blokagung"
  } = Astro2.props;
  return renderTemplate`<html lang="id"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"><title>${title} | SPSMB Yayasan Mukhtar Syafa'at</title>${renderHead()}</head> <body class="min-h-screen bg-background font-sans antialiased" style="font-family: 'Public Sans', sans-serif;"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/SPSMB/spsmb-astro/src/layouts/MainLayout.astro", void 0);

export { $$MainLayout as $ };
