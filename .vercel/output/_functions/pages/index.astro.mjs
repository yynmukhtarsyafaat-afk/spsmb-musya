import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B3-YyRDz.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_BnJKYAEo.mjs';
import { Sparkles, BookOpen, GraduationCap, ArrowRight, ShieldCheck, Users, MapPin, Phone, Mail, Zap } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Beranda", "description": "Platform pendaftaran resmi Yayasan Mukhtar Syafa'at." }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<nav class="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border supports-[backdrop-filter]:bg-white/60"> <div class="max-w-7xl mx-auto px-6 lg:px-12"> <div class="flex justify-between h-20 items-center"> <div class="flex items-center gap-3"> <img src="/logo.png" alt="Logo Yayasan Mukhtar Syafa'at" class="w-12 h-12 object-contain"> <div class="leading-none"> <span class="block font-bold text-foreground tracking-tight text-lg">MUKHTAR SYAFA'AT</span> <span class="block text-[10px] font-medium text-primary uppercase tracking-widest">Yayasan Pendidikan</span> </div> </div> <div class="hidden md:flex gap-10 text-[12px] font-semibold text-muted-foreground"> <a href="/" class="hover:text-primary transition-colors">Beranda</a> <a href="/informasi-pendaftaran" class="hover:text-primary transition-colors">Informasi Pendaftaran</a> <a href="/cek-status" class="hover:text-primary transition-colors">Cek Status</a> <a href="#unit" class="hover:text-primary transition-colors">Unit Pendidikan</a> </div> <a href="/daftar" class="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-[12px] font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95">
Daftar Sekarang
</a> </div> </div> </nav>  <section id="beranda" class="pt-28 pb-12 bg-white overflow-hidden flex items-center"> <div class="max-w-7xl mx-auto px-6 lg:px-12"> <div class="text-center max-w-4xl mx-auto"> <div class="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-primary text-[11px] font-bold uppercase tracking-widest mb-6 border border-border"> ${renderComponent($$result2, "Sparkles", Sparkles, { "className": "h-3.5 w-3.5" })} Penerimaan Santri Baru 2025/2026
</div> <h1 class="text-4xl lg:text-6xl font-serif text-foreground leading-[1.1] mb-6">
SPSMB <span class="italic text-primary">Yayasan Mukhtar Syafa'at</span> Blokagung
</h1> <p class="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
Sistem Penerimaan Santri dan Murid Baru. Platform
                    pendaftaran digital satu pintu yang mengutamakan kemudahan
                    dan pelayanan terbaik.
</p> <div class="flex flex-col sm:flex-row justify-center gap-4 mb-10"> <a href="/daftar" class="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center">
Daftar Sekarang
</a> <a href="#unit" class="bg-card text-primary border border-border px-8 py-4 rounded-2xl font-bold hover:bg-secondary transition-all flex items-center justify-center">
Informasi Lengkap
</a> </div> </div> </div> </section>  <section id="unit" class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-6 lg:px-12"> <div class="mb-10 text-center lg:text-left"> <span class="text-primary font-bold uppercase tracking-[0.2em] text-[12px] mb-2 block">Lembaga Kami</span> <h2 class="text-4xl lg:text-5xl font-serif text-foreground">
Unit Pendidikan
</h2> </div>  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"> <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300"> ${renderComponent($$result2, "BookOpen", BookOpen, { "className": "h-7 w-7" })} </div> <div class="mb-4"> <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-3">
Putra
</span> <h3 class="text-2xl font-serif text-emerald-950 mb-2">
PP. M. Syafa'at 1
</h3> <p class="text-muted-foreground text-sm leading-relaxed">
Pondok pesantren putra dengan fokus pendalaman kitab
                            kuning dan tahfidz.
</p> </div> </div> <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"> <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300"> ${renderComponent($$result2, "BookOpen", BookOpen, { "className": "h-7 w-7" })} </div> <div class="mb-4"> <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-3">
Putra
</span> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
PP. M. Syafa'at 2
</h3> <p class="text-muted-foreground text-sm leading-relaxed">
Unit pendidikan pesantren putra dengan fasilitas
                            asrama modern.
</p> </div> </div> <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"> <div class="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300"> ${renderComponent($$result2, "BookOpen", BookOpen, { "className": "h-7 w-7" })} </div> <div class="mb-4"> <span class="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold uppercase tracking-widest mb-3">
Putri
</span> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
PP. M. Syafa'at 1
</h3> <p class="text-muted-foreground text-sm leading-relaxed">
Pondok pesantren putri dengan bimbingan intensif
                            keagamaan.
</p> </div> </div> <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"> <div class="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300"> ${renderComponent($$result2, "BookOpen", BookOpen, { "className": "h-7 w-7" })} </div> <div class="mb-4"> <span class="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold uppercase tracking-widest mb-3">
Putri
</span> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
PP. M. Syafa'at 2
</h3> <p class="text-muted-foreground text-sm leading-relaxed">
Unit pendidikan pesantren putri dengan lingkungan
                            yang asri dan kondusif.
</p> </div> </div>  <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"> <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 relative z-10"> ${renderComponent($$result2, "GraduationCap", GraduationCap, { "className": "h-7 w-7" })} </div> <div class="relative z-10"> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
MA Unggulan
</h3> <p class="text-muted-foreground text-sm leading-relaxed mb-4">
Madrasah Aliyah berprestasi dengan integrasi
                            kurikulum pesantren dan nasional.
</p> <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
Selengkapnya ${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "h-3.5 w-3.5" })} </span> </div> <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-50"></div> </div> <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"> <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 relative z-10"> ${renderComponent($$result2, "BookOpen", BookOpen, { "className": "h-7 w-7" })} </div> <div class="relative z-10"> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
SMK Unggulan
</h3> <p class="text-muted-foreground text-sm leading-relaxed mb-4">
Sekolah Menengah Kejuruan siap kerja dengan
                            kompetensi unggul dan mandiri.
</p> <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
Selengkapnya ${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "h-3.5 w-3.5" })} </span> </div> <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-50"></div> </div> <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"> <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 relative z-10"> ${renderComponent($$result2, "ShieldCheck", ShieldCheck, { "className": "h-7 w-7" })} </div> <div class="relative z-10"> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
MTs Unggulan
</h3> <p class="text-muted-foreground text-sm leading-relaxed mb-4">
Madrasah Tsanawiyah dengan kurikulum terpadu untuk
                            pembentukan karakter.
</p> <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
Selengkapnya ${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "h-3.5 w-3.5" })} </span> </div> <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-50"></div> </div> <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"> <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 relative z-10"> ${renderComponent($$result2, "ShieldCheck", ShieldCheck, { "className": "h-7 w-7" })} </div> <div class="relative z-10"> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
SMP Unggulan
</h3> <p class="text-muted-foreground text-sm leading-relaxed mb-4">
Sekolah Menengah Pertama berbasis pesantren dengan
                            standar pendidikan berkualitas.
</p> <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
Selengkapnya ${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "h-3.5 w-3.5" })} </span> </div> <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-50"></div> </div> <div class="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"> <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 relative z-10"> ${renderComponent($$result2, "Users", Users, { "className": "h-7 w-7" })} </div> <div class="relative z-10"> <h3 class="text-2xl font-serif text-emerald-900 mb-2">
TK/PAUD/KB
</h3> <p class="text-muted-foreground text-sm leading-relaxed mb-4">
Pendidikan usia dini Mukhtar Syafa'at dengan
                            pendekatan bermain dan belajar.
</p> <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
Selengkapnya ${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "h-3.5 w-3.5" })} </span> </div> <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-50"></div> </div> </div> </div> </section>  <section id="alur" class="py-16 bg-secondary/30"> <div class="max-w-7xl mx-auto px-6 lg:px-12"> <div class="text-center mb-10"> <h2 class="text-4xl font-serif text-emerald-950 mb-4">
Prosedur Pendaftaran
</h2> <p class="text-muted-foreground">
Langkah mudah untuk menjadi bagian dari keluarga besar kami.
</p> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> <div class="p-8 rounded-[2rem] border border-border flex flex-col justify-between h-56 transition-all hover:scale-[1.02] cursor-default bg-white hover:shadow-lg"> <span class="text-4xl font-serif italic text-emerald-100">01</span> <div> <h3 class="text-xl font-serif mb-2 text-emerald-950">
Pendaftaran Online
</h3> <p class="text-sm text-muted-foreground">
Isi formulir melalui portal ini.
</p> </div> </div> <div class="p-8 rounded-[2rem] border border-border flex flex-col justify-between h-56 transition-all hover:scale-[1.02] cursor-default bg-white hover:shadow-lg"> <span class="text-4xl font-serif italic text-emerald-100">02</span> <div> <h3 class="text-xl font-serif mb-2 text-emerald-950">
Verifikasi Berkas
</h3> <p class="text-sm text-muted-foreground">
Tim kami akan memeriksa kelengkapan.
</p> </div> </div> <div class="p-8 rounded-[2rem] border border-border flex flex-col justify-between h-56 transition-all hover:scale-[1.02] cursor-default bg-primary text-white shadow-xl shadow-emerald-200"> <span class="text-4xl font-serif italic text-white/40">03</span> <div> <h3 class="text-xl font-serif mb-2">
Konfirmasi Pendaftaran
</h3> <p class="text-sm text-white/70">
Cek status dan validasi data.
</p> </div> </div> <div class="p-8 rounded-[2rem] border border-border flex flex-col justify-between h-56 transition-all hover:scale-[1.02] cursor-default bg-white hover:shadow-lg"> <span class="text-4xl font-serif italic text-emerald-100">04</span> <div> <h3 class="text-xl font-serif mb-2 text-emerald-950">
Hasil & Daftar Ulang
</h3> <p class="text-sm text-muted-foreground">
Pengumuman dan administrasi akhir.
</p> </div> </div> </div> </div> </section>  <footer class="bg-white pt-16 pb-8 border-t border-border"> <div class="max-w-7xl mx-auto px-6 lg:px-12"> <div class="flex flex-col md:flex-row justify-between items-start mb-10 gap-10"> <div class="max-w-sm"> <div class="flex items-center gap-3 mb-8"> <img src="/logo.png" alt="Logo Yayasan Mukhtar Syafa'at" class="w-12 h-12 object-contain"> <span class="font-bold text-emerald-900 tracking-tight text-xl uppercase">Mukhtar Syafa'at</span> </div> <p class="text-muted-foreground font-serif italic text-lg leading-relaxed">
Mencetak generasi yang unggul secara intelektual dan
                        berakar pada nilai-nilai luhur pesantren.
</p> </div> <div class="grid grid-cols-2 gap-16"> <div class="space-y-6"> <h4 class="text-[11px] font-black text-emerald-900 uppercase tracking-widest">
Informasi
</h4> <div class="flex flex-col gap-4 text-muted-foreground text-sm"> <a href="#" class="hover:text-primary">Tentang Yayasan</a> <a href="#" class="hover:text-primary">Berita & Acara</a> <a href="#" class="hover:text-primary">Kontak Media</a> </div> </div> <div class="space-y-6"> <h4 class="text-[11px] font-black text-emerald-900 uppercase tracking-widest">
Kontak
</h4> <div class="flex flex-col gap-4 text-muted-foreground text-sm"> <span class="flex items-start gap-2">${renderComponent($$result2, "MapPin", MapPin, { "className": "h-3.5 w-3.5 mt-1 shrink-0" })} <span class="max-w-[200px]">JL. KH. Mukhtar Syafa'at, Kec. Tegalsari,
                                    Kab. Banyuwangi, Jawa Timur</span></span> <span class="flex items-center gap-2">${renderComponent($$result2, "Phone", Phone, { "className": "h-3.5 w-3.5" })} (0333) 4460475</span> <span class="flex items-center gap-2">${renderComponent($$result2, "Mail", Mail, { "className": "h-3.5 w-3.5" })} yynmukhtarsyafaat@gmail.com</span> </div> </div> </div> </div> <div class="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"> <p class="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">
&copy; 2025 Yayasan Mukhtar Syafa'at Blokagung • Banyuwangi
</p> <div class="flex gap-6"> <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-emerald-400 hover:text-emerald-600 cursor-pointer transition-colors"> ${renderComponent($$result2, "Zap", Zap, { "className": "h-3.5 w-3.5" })} </div> <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-emerald-400 hover:text-emerald-600 cursor-pointer transition-colors"> ${renderComponent($$result2, "ShieldCheck", ShieldCheck, { "className": "h-3.5 w-3.5" })} </div> </div> </div> </div> </footer> ` })}`;
}, "C:/SPSMB/spsmb-astro/src/pages/index.astro", void 0);

const $$file = "C:/SPSMB/spsmb-astro/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
