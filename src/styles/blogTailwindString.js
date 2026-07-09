// Auto-generated Tailwind utility CSS for the Blog pages.
// Scoped under `.blog-page-root` so nothing leaks into the rest of the site.
// Covers EVERY utility class used across Hero, Filters, BlogCard, BlogGrid,
// Layout1–4, Blog listing page, and BlogDetails page.

export const blogTailwindCss = `
/* ─── Google Font: Inter ─── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ─── Root scope ─── */
.blog-page-root {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  --color-brand: #00A4C4;
  --color-brand-dark: #001F3F;
}
.blog-page-root *, .blog-page-root *::before, .blog-page-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.blog-page-root img { max-width: 100%; }
.blog-page-root a { text-decoration: none; color: inherit; }
.blog-page-root button { cursor: pointer; border: none; background: none; font-family: inherit; }
.blog-page-root input { font-family: inherit; }
.blog-page-root ul { list-style: none; }

/* Fix global overrides from common.sass */
body:not(.dark-mode) .blog-page-root h1,
body:not(.dark-mode) .blog-page-root h2,
body:not(.dark-mode) .blog-page-root h3,
body:not(.dark-mode) .blog-page-root h4,
body:not(.dark-mode) .blog-page-root h5,
body:not(.dark-mode) .blog-page-root h6,
body:not(.dark-mode) .blog-page-root p,
body:not(.dark-mode) .blog-page-root label,
body:not(.dark-mode) .blog-page-root strong,
body:not(.dark-mode) .blog-page-root em,
body:not(.dark-mode) .blog-page-root li,
body:not(.dark-mode) .blog-page-root span,
body:not(.dark-mode) .blog-page-root a {
  color: inherit !important;
}

/* ─── DISPLAY ─── */
.blog-page-root .flex { display: flex; }
.blog-page-root .inline-flex { display: inline-flex; }
.blog-page-root .grid { display: grid; }
.blog-page-root .block { display: block; }
.blog-page-root .hidden { display: none; }
.blog-page-root .inline { display: inline; }

/* ─── FLEX ─── */
.blog-page-root .flex-col { flex-direction: column; }
.blog-page-root .flex-row { flex-direction: row; }
.blog-page-root .flex-row-reverse { flex-direction: row-reverse; }
.blog-page-root .flex-wrap { flex-wrap: wrap; }
.blog-page-root .flex-1 { flex: 1 1 0%; }
.blog-page-root .flex-shrink-0 { flex-shrink: 0; }
.blog-page-root .items-center { align-items: center; }
.blog-page-root .items-start { align-items: start; }
.blog-page-root .items-end { align-items: end; }
.blog-page-root .justify-center { justify-content: center; }
.blog-page-root .justify-between { justify-content: space-between; }
.blog-page-root .justify-start { justify-content: flex-start; }
.blog-page-root .justify-end { justify-content: flex-end; }
.blog-page-root .self-start { align-self: flex-start; }
.blog-page-root .self-center { align-self: center; }

/* ─── GRID ─── */
.blog-page-root .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.blog-page-root .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.blog-page-root .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.blog-page-root .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.blog-page-root .grid-cols-\\[1fr_2fr\\] { grid-template-columns: 1fr 2fr; }

/* ─── GAP ─── */
.blog-page-root .gap-1 { gap: 0.25rem; }
.blog-page-root .gap-1\\.5 { gap: 0.375rem; }
.blog-page-root .gap-2 { gap: 0.5rem; }
.blog-page-root .gap-3 { gap: 0.75rem; }
.blog-page-root .gap-4 { gap: 1rem; }
.blog-page-root .gap-6 { gap: 1.5rem; }
.blog-page-root .gap-8 { gap: 2rem; }
.blog-page-root .gap-10 { gap: 2.5rem; }
.blog-page-root .gap-12 { gap: 3rem; }
.blog-page-root .gap-16 { gap: 4rem; }
.blog-page-root .gap-20 { gap: 5rem; }
.blog-page-root .gap-x-8 { column-gap: 2rem; }
.blog-page-root .gap-y-16 { row-gap: 4rem; }

/* ─── SPACE ─── */
.blog-page-root .space-y-6 > * + * { margin-top: 1.5rem; }
.blog-page-root .space-y-12 > * + * { margin-top: 3rem; }
.blog-page-root .space-y-16 > * + * { margin-top: 4rem; }
.blog-page-root .space-y-32 > * + * { margin-top: 8rem; }

/* ─── POSITION ─── */
.blog-page-root .relative { position: relative; }
.blog-page-root .absolute { position: absolute; }
.blog-page-root .fixed { position: fixed; }
.blog-page-root .sticky { position: sticky; }
.blog-page-root .static { position: static; }
.blog-page-root .inset-0 { inset: 0; }
.blog-page-root .top-0 { top: 0; }
.blog-page-root .top-2 { top: 0.5rem; }
.blog-page-root .top-4 { top: 1rem; }
.blog-page-root .top-5 { top: 1.25rem; }
.blog-page-root .top-6 { top: 1.5rem; }
.blog-page-root .top-8 { top: 2rem; }
.blog-page-root .top-10 { top: 2.5rem; }
.blog-page-root .top-1\\/2 { top: 50%; }
.blog-page-root .bottom-0 { bottom: 0; }
.blog-page-root .bottom-4 { bottom: 1rem; }
.blog-page-root .bottom-5 { bottom: 1.25rem; }
.blog-page-root .bottom-6 { bottom: 1.5rem; }
.blog-page-root .bottom-10 { bottom: 2.5rem; }
.blog-page-root .left-0 { left: 0; }
.blog-page-root .left-4 { left: 1rem; }
.blog-page-root .left-5 { left: 1.25rem; }
.blog-page-root .left-6 { left: 1.5rem; }
.blog-page-root .left-8 { left: 2rem; }
.blog-page-root .left-10 { left: 2.5rem; }
.blog-page-root .left-1\\/2 { left: 50%; }
.blog-page-root .left-\\[10\\%\\] { left: 10%; }
.blog-page-root .right-0 { right: 0; }
.blog-page-root .right-4 { right: 1rem; }
.blog-page-root .right-8 { right: 2rem; }
.blog-page-root .right-auto { right: auto; }
.blog-page-root .right-\\[5\\%\\] { right: 5%; }
.blog-page-root .-bottom-4 { bottom: -1rem; }
.blog-page-root .-bottom-6 { bottom: -1.5rem; }
.blog-page-root .-right-6 { right: -1.5rem; }
.blog-page-root .-top-6 { top: -1.5rem; }
.blog-page-root .-left-6 { left: -1.5rem; }

/* ─── WIDTH ─── */
.blog-page-root .w-full { width: 100%; }
.blog-page-root .w-auto { width: auto; }
.blog-page-root .w-1 { width: 0.25rem; }
.blog-page-root .w-1\\.5 { width: 0.375rem; }
.blog-page-root .w-4 { width: 1rem; }
.blog-page-root .w-8 { width: 2rem; }
.blog-page-root .w-9 { width: 2.25rem; }
.blog-page-root .w-10 { width: 2.5rem; }
.blog-page-root .w-12 { width: 3rem; }
.blog-page-root .w-px { width: 1px; }
.blog-page-root .w-\\[45\\%\\] { width: 45%; }
.blog-page-root .w-\\[55\\%\\] { width: 55%; }
.blog-page-root .w-\\[60\\%\\] { width: 60%; }
.blog-page-root .w-\\[80\\%\\] { width: 80%; }
.blog-page-root .w-\\[180px\\] { width: 180px; }
.blog-page-root .w-\\[220px\\] { width: 220px; }

/* ─── HEIGHT ─── */
.blog-page-root .h-full { height: 100%; }
.blog-page-root .h-1 { height: 0.25rem; }
.blog-page-root .h-1\\.5 { height: 0.375rem; }
.blog-page-root .h-4 { height: 1rem; }
.blog-page-root .h-8 { height: 2rem; }
.blog-page-root .h-10 { height: 2.5rem; }
.blog-page-root .h-12 { height: 3rem; }
.blog-page-root .h-16 { height: 4rem; }
.blog-page-root .h-24 { height: 6rem; }
.blog-page-root .h-32 { height: 8rem; }
.blog-page-root .h-48 { height: 12rem; }
.blog-page-root .h-56 { height: 14rem; }
.blog-page-root .h-60 { height: 15rem; }
.blog-page-root .h-64 { height: 16rem; }
.blog-page-root .h-px { height: 1px; }
.blog-page-root .h-screen { height: 100vh; }
.blog-page-root .h-\\[2px\\] { height: 2px; }
.blog-page-root .h-\\[40\\%\\] { height: 40%; }
.blog-page-root .h-\\[45\\%\\] { height: 45%; }
.blog-page-root .h-\\[55\\%\\] { height: 55%; }
.blog-page-root .h-\\[80\\%\\] { height: 80%; }
.blog-page-root .h-\\[100px\\] { height: 100px; }
.blog-page-root .h-\\[140px\\] { height: 140px; }
.blog-page-root .h-\\[240px\\] { height: 240px; }
.blog-page-root .h-\\[260px\\] { height: 260px; }
.blog-page-root .h-\\[280px\\] { height: 280px; }
.blog-page-root .h-\\[300px\\] { height: 300px; }
.blog-page-root .h-\\[320px\\] { height: 320px; }
.blog-page-root .h-\\[340px\\] { height: 340px; }
.blog-page-root .h-\\[380px\\] { height: 380px; }
.blog-page-root .h-\\[400px\\] { height: 400px; }
.blog-page-root .h-\\[500px\\] { height: 500px; }
.blog-page-root .h-\\[600px\\] { height: 600px; }

/* ─── MIN/MAX WIDTH ─── */
.blog-page-root .min-w-max { min-width: max-content; }
.blog-page-root .min-w-\\[150px\\] { min-width: 150px; }
.blog-page-root .max-w-md { max-width: 28rem; }
.blog-page-root .max-w-lg { max-width: 32rem; }
.blog-page-root .max-w-xl { max-width: 36rem; }
.blog-page-root .max-w-2xl { max-width: 42rem; }
.blog-page-root .max-w-3xl { max-width: 48rem; }
.blog-page-root .max-w-6xl { max-width: 72rem; }
.blog-page-root .max-w-7xl { max-width: 80rem; }
.blog-page-root .max-w-\\[360px\\] { max-width: 360px; }
.blog-page-root .max-w-\\[400px\\] { max-width: 400px; }
.blog-page-root .max-w-\\[800px\\] { max-width: 800px; }
.blog-page-root .max-w-\\[900px\\] { max-width: 900px; }
.blog-page-root .max-w-\\[1000px\\] { max-width: 1000px; }
.blog-page-root .max-w-\\[1200px\\] { max-width: 1200px; }
.blog-page-root .max-w-\\[1400px\\] { max-width: 1400px; }

/* ─── MIN HEIGHT ─── */
.blog-page-root .min-h-screen { min-height: 100vh; }
.blog-page-root .min-h-full { min-height: 100%; }
.blog-page-root .min-h-\\[450px\\] { min-height: 450px; }
.blog-page-root .min-h-\\[600px\\] { min-height: 600px; }

/* ─── PADDING ─── */
.blog-page-root .p-1 { padding: 0.25rem; }
.blog-page-root .p-1\\.5 { padding: 0.375rem; }
.blog-page-root .p-2 { padding: 0.5rem; }
.blog-page-root .p-3 { padding: 0.75rem; }
.blog-page-root .p-4 { padding: 1rem; }
.blog-page-root .p-6 { padding: 1.5rem; }
.blog-page-root .p-8 { padding: 2rem; }
.blog-page-root .p-10 { padding: 2.5rem; }
.blog-page-root .p-12 { padding: 3rem; }
.blog-page-root .p-14 { padding: 3.5rem; }
.blog-page-root .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.blog-page-root .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.blog-page-root .px-4 { padding-left: 1rem; padding-right: 1rem; }
.blog-page-root .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.blog-page-root .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.blog-page-root .px-8 { padding-left: 2rem; padding-right: 2rem; }
.blog-page-root .px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
.blog-page-root .px-12 { padding-left: 3rem; padding-right: 3rem; }
.blog-page-root .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.blog-page-root .py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.blog-page-root .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.blog-page-root .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.blog-page-root .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.blog-page-root .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.blog-page-root .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
.blog-page-root .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
.blog-page-root .pt-2 { padding-top: 0.5rem; }
.blog-page-root .pt-4 { padding-top: 1rem; }
.blog-page-root .pt-6 { padding-top: 1.5rem; }
.blog-page-root .pt-12 { padding-top: 3rem; }
.blog-page-root .pt-16 { padding-top: 4rem; }
.blog-page-root .pt-24 { padding-top: 6rem; }
.blog-page-root .pb-4 { padding-bottom: 1rem; }
.blog-page-root .pb-12 { padding-bottom: 3rem; }
.blog-page-root .pb-16 { padding-bottom: 4rem; }
.blog-page-root .pb-20 { padding-bottom: 5rem; }
.blog-page-root .pl-6 { padding-left: 1.5rem; }
.blog-page-root .pl-8 { padding-left: 2rem; }
.blog-page-root .pr-12 { padding-right: 3rem; }

/* ─── MARGIN ─── */
.blog-page-root .m-auto { margin: auto; }
.blog-page-root .mx-auto { margin-left: auto; margin-right: auto; }
.blog-page-root .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
.blog-page-root .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
.blog-page-root .mb-1 { margin-bottom: 0.25rem; }
.blog-page-root .mb-2 { margin-bottom: 0.5rem; }
.blog-page-root .mb-3 { margin-bottom: 0.75rem; }
.blog-page-root .mb-4 { margin-bottom: 1rem; }
.blog-page-root .mb-6 { margin-bottom: 1.5rem; }
.blog-page-root .mb-8 { margin-bottom: 2rem; }
.blog-page-root .mb-10 { margin-bottom: 2.5rem; }
.blog-page-root .mb-12 { margin-bottom: 3rem; }
.blog-page-root .mb-16 { margin-bottom: 4rem; }
.blog-page-root .mb-20 { margin-bottom: 5rem; }
.blog-page-root .mb-24 { margin-bottom: 6rem; }
.blog-page-root .mt-2 { margin-top: 0.5rem; }
.blog-page-root .mt-4 { margin-top: 1rem; }
.blog-page-root .mt-6 { margin-top: 1.5rem; }
.blog-page-root .mt-8 { margin-top: 2rem; }
.blog-page-root .mt-12 { margin-top: 3rem; }
.blog-page-root .mt-16 { margin-top: 4rem; }
.blog-page-root .mt-24 { margin-top: 6rem; }
.blog-page-root .mt-auto { margin-top: auto; }
.blog-page-root .ml-auto { margin-left: auto; }
.blog-page-root .-mt-10 { margin-top: -2.5rem; }

/* ─── TYPOGRAPHY ─── */
.blog-page-root .text-xs { font-size: 0.75rem; line-height: 1rem; }
.blog-page-root .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.blog-page-root .text-base { font-size: 1rem; line-height: 1.5rem; }
.blog-page-root .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.blog-page-root .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.blog-page-root .text-2xl { font-size: 1.5rem; line-height: 2rem; }
.blog-page-root .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.blog-page-root .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.blog-page-root .text-5xl { font-size: 3rem; line-height: 1; }
.blog-page-root .text-6xl { font-size: 3.75rem; line-height: 1; }
.blog-page-root .text-\\[10px\\] { font-size: 10px; }
.blog-page-root .text-\\[28px\\] { font-size: 28px; }
.blog-page-root .text-\\[64px\\] { font-size: 64px; }
.blog-page-root .text-\\[72px\\] { font-size: 72px; }
.blog-page-root .text-\\[80px\\] { font-size: 80px; }
.blog-page-root .text-\\[clamp\\(2\\.5rem\\,7vw\\,6\\.5rem\\)\\] { font-size: clamp(2.5rem,7vw,6.5rem); }
.blog-page-root .text-\\[clamp\\(3rem\\,10vw\\,9rem\\)\\] { font-size: clamp(3rem,10vw,9rem); }
.blog-page-root .font-light { font-weight: 300; }
.blog-page-root .font-normal { font-weight: 400; }
.blog-page-root .font-medium { font-weight: 500; }
.blog-page-root .font-semibold { font-weight: 600; }
.blog-page-root .font-bold { font-weight: 700; }
.blog-page-root .font-extrabold { font-weight: 800; }
.blog-page-root .font-black { font-weight: 900; }
.blog-page-root .italic { font-style: italic; }
.blog-page-root .uppercase { text-transform: uppercase; }
.blog-page-root .tracking-tight { letter-spacing: -0.025em; }
.blog-page-root .tracking-tighter { letter-spacing: -0.05em; }
.blog-page-root .tracking-wider { letter-spacing: 0.05em; }
.blog-page-root .tracking-widest { letter-spacing: 0.1em; }
.blog-page-root .leading-none { line-height: 1; }
.blog-page-root .leading-tight { line-height: 1.25; }
.blog-page-root .leading-snug { line-height: 1.375; }
.blog-page-root .leading-normal { line-height: 1.5; }
.blog-page-root .leading-relaxed { line-height: 1.625; }
.blog-page-root .leading-\\[1\\] { line-height: 1; }
.blog-page-root .leading-\\[1\\.05\\] { line-height: 1.05; }
.blog-page-root .leading-\\[1\\.1\\] { line-height: 1.1; }
.blog-page-root .text-center { text-align: center; }
.blog-page-root .text-left { text-align: left; }
.blog-page-root .text-right { text-align: right; }
.blog-page-root .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.blog-page-root .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }

/* ─── TEXT COLORS ─── */
.blog-page-root .text-white { color: #ffffff; }
.blog-page-root .text-black { color: #000000; }
.blog-page-root .text-gray-200 { color: #e5e7eb; }
.blog-page-root .text-gray-300 { color: #d1d5db; }
.blog-page-root .text-gray-400 { color: #9ca3af; }
.blog-page-root .text-gray-500 { color: #6b7280; }
.blog-page-root .text-gray-600 { color: #4b5563; }
.blog-page-root .text-gray-700 { color: #374151; }
.blog-page-root .text-cyan-200 { color: #a5f3fc; }
.blog-page-root .text-cyan-400 { color: #22d3ee; }
.blog-page-root .text-\\[\\#00A4C4\\] { color: #00A4C4; }
.blog-page-root .text-\\[\\#001F3F\\] { color: #001F3F; }
.blog-page-root .text-\\[var\\(--color-brand\\)\\] { color: var(--color-brand); }
.blog-page-root .text-\\[var\\(--color-brand-dark\\)\\] { color: var(--color-brand-dark); }
.blog-page-root .text-white\\/90 { color: rgba(255,255,255,0.9); }

/* ─── BACKGROUND COLORS ─── */
.blog-page-root .bg-white { background-color: #ffffff; }
.blog-page-root .bg-black { background-color: #000000; }
.blog-page-root .bg-transparent { background-color: transparent; }
.blog-page-root .bg-gray-50 { background-color: #f9fafb; }
.blog-page-root .bg-gray-100 { background-color: #f3f4f6; }
.blog-page-root .bg-cyan-50 { background-color: #ecfeff; }
.blog-page-root .bg-cyan-200 { background-color: #a5f3fc; }
.blog-page-root .bg-\\[\\#00A4C4\\] { background-color: #00A4C4; }
.blog-page-root .bg-\\[\\#001F3F\\] { background-color: #001F3F; }
.blog-page-root .bg-\\[\\#F8FCFD\\] { background-color: #F8FCFD; }
.blog-page-root .bg-\\[var\\(--color-brand\\)\\] { background-color: var(--color-brand); }
.blog-page-root .bg-\\[var\\(--color-brand-dark\\)\\] { background-color: var(--color-brand-dark); }
.blog-page-root .bg-white\\/80 { background-color: rgba(255,255,255,0.8); }
.blog-page-root .bg-white\\/90 { background-color: rgba(255,255,255,0.9); }
.blog-page-root .bg-black\\/10 { background-color: rgba(0,0,0,0.1); }
.blog-page-root .bg-black\\/40 { background-color: rgba(0,0,0,0.4); }
.blog-page-root .bg-\\[\\#00A4C4\\]\\/10 { background-color: rgba(0,164,196,0.1); }

/* ─── GRADIENTS ─── */
.blog-page-root .bg-gradient-to-t { background-image: linear-gradient(to top, var(--tw-gradient-stops)); }
.blog-page-root .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
.blog-page-root .from-white { --tw-gradient-from: #fff; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(255,255,255,0)); }
.blog-page-root .from-black\\/80 { --tw-gradient-from: rgba(0,0,0,0.8); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0,0,0,0)); }
.blog-page-root .via-black\\/40 { --tw-gradient-stops: var(--tw-gradient-from), rgba(0,0,0,0.4), var(--tw-gradient-to, rgba(0,0,0,0)); }
.blog-page-root .via-transparent { --tw-gradient-stops: var(--tw-gradient-from), transparent, var(--tw-gradient-to, transparent); }
.blog-page-root .to-black\\/20 { --tw-gradient-to: rgba(0,0,0,0.2); }
.blog-page-root .to-transparent { --tw-gradient-to: transparent; }

/* ─── BORDERS ─── */
.blog-page-root .border { border-width: 1px; border-style: solid; }
.blog-page-root .border-2 { border-width: 2px; border-style: solid; }
.blog-page-root .border-4 { border-width: 4px; border-style: solid; }
.blog-page-root .border-\\[2px\\] { border-width: 2px; border-style: solid; }
.blog-page-root .border-\\[4px\\] { border-width: 4px; border-style: solid; }
.blog-page-root .border-\\[6px\\] { border-width: 6px; border-style: solid; }
.blog-page-root .border-t { border-top-width: 1px; border-top-style: solid; }
.blog-page-root .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
.blog-page-root .border-l { border-left-width: 1px; border-left-style: solid; }
.blog-page-root .border-r { border-right-width: 1px; border-right-style: solid; }
.blog-page-root .border-l-4 { border-left-width: 4px; border-left-style: solid; }
.blog-page-root .border-dashed { border-style: dashed; }
.blog-page-root .border-white { border-color: #ffffff; }
.blog-page-root .border-gray-50 { border-color: #f9fafb; }
.blog-page-root .border-gray-100 { border-color: #f3f4f6; }
.blog-page-root .border-gray-200 { border-color: #e5e7eb; }
.blog-page-root .border-gray-500\\/50 { border-color: rgba(107,114,128,0.5); }
.blog-page-root .border-white\\/50 { border-color: rgba(255,255,255,0.5); }
.blog-page-root .border-\\[\\#00A4C4\\] { border-color: #00A4C4; }
.blog-page-root .border-\\[var\\(--color-brand\\)\\] { border-color: var(--color-brand); }

/* ─── BORDER RADIUS ─── */
.blog-page-root .rounded { border-radius: 0.25rem; }
.blog-page-root .rounded-lg { border-radius: 0.5rem; }
.blog-page-root .rounded-xl { border-radius: 0.75rem; }
.blog-page-root .rounded-2xl { border-radius: 1rem; }
.blog-page-root .rounded-3xl { border-radius: 1.5rem; }
.blog-page-root .rounded-full { border-radius: 9999px; }
.blog-page-root .rounded-\\[24px\\] { border-radius: 24px; }
.blog-page-root .rounded-\\[30px\\] { border-radius: 30px; }
.blog-page-root .rounded-\\[32px\\] { border-radius: 32px; }
.blog-page-root .rounded-\\[40px\\] { border-radius: 40px; }
.blog-page-root .rounded-\\[60px\\] { border-radius: 60px; }
.blog-page-root .rounded-t-\\[100px\\] { border-top-left-radius: 100px; border-top-right-radius: 100px; }
.blog-page-root .rounded-b-3xl { border-bottom-left-radius: 1.5rem; border-bottom-right-radius: 1.5rem; }
.blog-page-root .rounded-bl-\\[60px\\] { border-bottom-left-radius: 60px; }
/* Complex border-radius values - handled via inline styles */

/* ─── OVERFLOW ─── */
.blog-page-root .overflow-hidden { overflow: hidden; }
.blog-page-root .overflow-x-hidden { overflow-x: hidden; }
.blog-page-root .overflow-x-auto { overflow-x: auto; }
.blog-page-root .overflow-y-auto { overflow-y: auto; }

/* ─── OBJECT FIT ─── */
.blog-page-root .object-cover { object-fit: cover; }
.blog-page-root .object-center { object-position: center; }

/* ─── Z-INDEX ─── */
.blog-page-root .z-0 { z-index: 0; }
.blog-page-root .z-10 { z-index: 10; }
.blog-page-root .z-20 { z-index: 20; }
.blog-page-root .z-30 { z-index: 30; }
.blog-page-root .z-\\[100\\] { z-index: 100; }
.blog-page-root .-z-10 { z-index: -10; }

/* ─── OPACITY ─── */
.blog-page-root .opacity-20 { opacity: 0.2; }
.blog-page-root .opacity-40 { opacity: 0.4; }
.blog-page-root .opacity-60 { opacity: 0.6; }
.blog-page-root .opacity-80 { opacity: 0.8; }
.blog-page-root .opacity-90 { opacity: 0.9; }

/* ─── SHADOWS ─── */
.blog-page-root .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
.blog-page-root .shadow { box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); }
.blog-page-root .shadow-md { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
.blog-page-root .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); }
.blog-page-root .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); }
.blog-page-root .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.blog-page-root .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.05); }
.blog-page-root .shadow-\\[0_8px_30px_rgb\\(0\\,0\\,0\\,0\\.06\\)\\] { box-shadow: 0 8px 30px rgb(0,0,0,0.06); }
.blog-page-root .shadow-\\[0_20px_60px_-15px_rgba\\(0\\,164\\,196\\,0\\.05\\)\\] { box-shadow: 0 20px 60px -15px rgba(0,164,196,0.05); }

/* ─── BACKDROP ─── */
.blog-page-root .backdrop-blur { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.blog-page-root .backdrop-blur-sm { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
.blog-page-root .backdrop-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }

/* ─── TRANSFORMS ─── */
.blog-page-root .translate-x-1 { transform: translateX(0.25rem); }
.blog-page-root .-translate-x-1\\/2 { transform: translateX(-50%); }
.blog-page-root .-translate-y-1\\/2 { transform: translateY(-50%); }
.blog-page-root .translate-y-\\[30\\%\\] { transform: translateY(30%); }
.blog-page-root .rotate-6 { transform: rotate(6deg); }
.blog-page-root .rotate-12 { transform: rotate(12deg); }
.blog-page-root .rotate-180 { transform: rotate(180deg); }
.blog-page-root .scale-105 { transform: scale(1.05); }
.blog-page-root .scale-110 { transform: scale(1.1); }
.blog-page-root .transform { transform: var(--tw-transform); }

/* ─── TRANSITIONS ─── */
.blog-page-root .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; }
.blog-page-root .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; }
.blog-page-root .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; }
.blog-page-root .duration-300 { transition-duration: 300ms; }
.blog-page-root .duration-500 { transition-duration: 500ms; }
.blog-page-root .duration-700 { transition-duration: 700ms; }
.blog-page-root .duration-1000 { transition-duration: 1000ms; }
.blog-page-root .duration-\\[20s\\] { transition-duration: 20s; }

/* ─── CURSOR ─── */
.blog-page-root .cursor-pointer { cursor: pointer; }
.blog-page-root .pointer-events-none { pointer-events: none; }
.blog-page-root .pointer-events-auto { pointer-events: auto; }
.blog-page-root .whitespace-nowrap { white-space: nowrap; }

/* ─── ANIMATION ─── */
@keyframes blog-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.blog-page-root .animate-spin { animation: blog-spin 1s linear infinite; }

/* ─── FOCUS ─── */
.blog-page-root .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.blog-page-root .focus\\:border-\\[var\\(--color-brand\\)\\]:focus { border-color: var(--color-brand); }
.blog-page-root .focus\\:border-\\[\\#00A4C4\\]:focus { border-color: #00A4C4; }

/* ─── HOVER ─── */
.blog-page-root .hover\\:bg-cyan-600:hover { background-color: #0891b2; }
.blog-page-root .hover\\:bg-\\[\\#00A4C4\\]:hover { background-color: #00A4C4; }
.blog-page-root .hover\\:bg-\\[var\\(--color-brand-dark\\)\\]:hover { background-color: var(--color-brand-dark); }
.blog-page-root .hover\\:bg-white:hover { background-color: #ffffff; }
.blog-page-root .hover\\:bg-gray-100:hover { background-color: #f3f4f6; }
.blog-page-root .hover\\:text-white:hover { color: #ffffff; }
.blog-page-root .hover\\:text-\\[var\\(--color-brand\\)\\]:hover { color: var(--color-brand); }
.blog-page-root .hover\\:text-\\[\\#00A4C4\\]:hover { color: #00A4C4; }
.blog-page-root .hover\\:text-\\[var\\(--color-brand-dark\\)\\]:hover { color: var(--color-brand-dark); }
.blog-page-root .hover\\:border-\\[var\\(--color-brand\\)\\]:hover { border-color: var(--color-brand); }
.blog-page-root .hover\\:border-\\[\\#00A4C4\\]:hover { border-color: #00A4C4; }
.blog-page-root .hover\\:border-gray-300:hover { border-color: #d1d5db; }
.blog-page-root .hover\\:border-white:hover { border-color: #ffffff; }
.blog-page-root .hover\\:scale-105:hover { transform: scale(1.05); }
.blog-page-root .hover\\:scale-110:hover { transform: scale(1.1); }
.blog-page-root .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); }
.blog-page-root .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
.blog-page-root .hover\\:gap-4:hover { gap: 1rem; }
.blog-page-root .hover\\:-translate-y-1:hover { transform: translateY(-0.25rem); }
.blog-page-root .hover\\:bg-white\\/95:hover { background-color: rgba(255,255,255,0.95); }
.blog-page-root .hover\\:text-\\[var\\(--color-brand-dark\\)\\]:hover { color: var(--color-brand-dark); }

/* ─── GROUP HOVER ─── */
.blog-page-root .group:hover .group-hover\\:scale-105 { transform: scale(1.05); }
.blog-page-root .group:hover .group-hover\\:scale-110 { transform: scale(1.1); }
.blog-page-root .group:hover .group-hover\\:translate-x-1 { transform: translateX(0.25rem); }
.blog-page-root .group:hover .group-hover\\:text-\\[var\\(--color-brand\\)\\] { color: var(--color-brand); }
.blog-page-root .group:hover .group-hover\\:text-\\[\\#00A4C4\\] { color: #00A4C4; }
.blog-page-root .group:hover .group-hover\\:bg-\\[var\\(--color-brand-dark\\)\\] { background-color: var(--color-brand-dark); }
.blog-page-root .group:hover .group-hover\\:bg-\\[\\#00A4C4\\] { background-color: #00A4C4; }
.blog-page-root .group:hover .group-hover\\:bg-black\\/0 { background-color: rgba(0,0,0,0); }

/* ─── SM BREAKPOINT (≥640px) ─── */
@media (min-width: 640px) {
  .blog-page-root .sm\\:h-\\[500px\\] { height: 500px; }
  .blog-page-root .sm\\:flex-row { flex-direction: row; }
  .blog-page-root .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .blog-page-root .sm\\:items-center { align-items: center; }
  .blog-page-root .sm\\:gap-2 { gap: 0.5rem; }
  .blog-page-root .sm\\:block { display: block; }
  .blog-page-root .sm\\:hidden { display: none; }
  .blog-page-root .sm\\:border-l { border-left-width: 1px; border-left-style: solid; }
  .blog-page-root .sm\\:pl-6 { padding-left: 1.5rem; }
}

/* ─── MD BREAKPOINT (≥768px) ─── */
@media (min-width: 768px) {
  .blog-page-root .md\\:flex-row { flex-direction: row; }
  .blog-page-root .md\\:flex-row-reverse { flex-direction: row-reverse; }
  .blog-page-root .md\\:items-center { align-items: center; }
  .blog-page-root .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .blog-page-root .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .blog-page-root .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .blog-page-root .md\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .blog-page-root .md\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .blog-page-root .md\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
  .blog-page-root .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .blog-page-root .md\\:text-5xl { font-size: 3rem; line-height: 1; }
  .blog-page-root .md\\:text-6xl { font-size: 3.75rem; line-height: 1; }
  .blog-page-root .md\\:text-\\[28px\\] { font-size: 28px; }
  .blog-page-root .md\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .blog-page-root .md\\:px-12 { padding-left: 3rem; padding-right: 3rem; }
  .blog-page-root .md\\:p-12 { padding: 3rem; }
  .blog-page-root .md\\:p-14 { padding: 3.5rem; }
  .blog-page-root .md\\:gap-6 { gap: 1.5rem; }
  .blog-page-root .md\\:h-\\[140px\\] { height: 140px; }
  .blog-page-root .md\\:h-\\[320px\\] { height: 320px; }
  .blog-page-root .md\\:h-\\[400px\\] { height: 400px; }
  .blog-page-root .md\\:h-\\[500px\\] { height: 500px; }
  .blog-page-root .md\\:w-64 { width: 16rem; }
  .blog-page-root .md\\:w-auto { width: auto; }
  .blog-page-root .md\\:w-\\[220px\\] { width: 220px; }
  .blog-page-root .md\\:text-left { text-align: left; }
  .blog-page-root .md\\:text-center { text-align: center; }
  .blog-page-root .md\\:block { display: block; }
  .blog-page-root .md\\:flex { display: flex; }
  .blog-page-root .md\\:hidden { display: none; }
  .blog-page-root .md\\:pt-32 { padding-top: 8rem; }
}

/* ─── LG BREAKPOINT (≥1024px) ─── */
@media (min-width: 1024px) {
  .blog-page-root .lg\\:flex { display: flex; }
  .blog-page-root .lg\\:grid { display: grid; }
  .blog-page-root .lg\\:block { display: block; }
  .blog-page-root .lg\\:hidden { display: none; }
  .blog-page-root .lg\\:flex-row { flex-direction: row; }
  .blog-page-root .lg\\:flex-row-reverse { flex-direction: row-reverse; }
  .blog-page-root .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .blog-page-root .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .blog-page-root .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .blog-page-root .lg\\:grid-cols-\\[1fr_2fr\\] { grid-template-columns: 1fr 2fr; }
  .blog-page-root .lg\\:gap-12 { gap: 3rem; }
  .blog-page-root .lg\\:gap-20 { gap: 5rem; }
  .blog-page-root .lg\\:w-\\[40\\%\\] { width: 40%; }
  .blog-page-root .lg\\:w-\\[45\\%\\] { width: 45%; }
  .blog-page-root .lg\\:w-\\[55\\%\\] { width: 55%; }
  .blog-page-root .lg\\:w-\\[60\\%\\] { width: 60%; }
  .blog-page-root .lg\\:w-1\\/2 { width: 50%; }
  .blog-page-root .lg\\:h-\\[45\\%\\] { height: 45%; }
  .blog-page-root .lg\\:h-\\[80\\%\\] { height: 80%; }
  .blog-page-root .lg\\:h-\\[500px\\] { height: 500px; }
  .blog-page-root .lg\\:h-\\[600px\\] { height: 600px; }
  .blog-page-root .lg\\:text-\\[64px\\] { font-size: 64px; }
  .blog-page-root .lg\\:text-\\[72px\\] { font-size: 72px; }
  .blog-page-root .lg\\:text-\\[80px\\] { font-size: 80px; }
  .blog-page-root .lg\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .blog-page-root .lg\\:text-left { text-align: left; }
  .blog-page-root .lg\\:text-right { text-align: right; }
  .blog-page-root .lg\\:px-12 { padding-left: 3rem; padding-right: 3rem; }
  .blog-page-root .lg\\:p-10 { padding: 2.5rem; }
  .blog-page-root .lg\\:p-12 { padding: 3rem; }
  .blog-page-root .lg\\:pl-16 { padding-left: 4rem; }
  .blog-page-root .lg\\:pr-16 { padding-right: 4rem; }
  .blog-page-root .lg\\:pt-0 { padding-top: 0; }
  .blog-page-root .lg\\:pt-24 { padding-top: 6rem; }
  .blog-page-root .lg\\:top-0 { top: 0; }
  .blog-page-root .lg\\:top-10 { top: 2.5rem; }
  .blog-page-root .lg\\:left-0 { left: 0; }
  .blog-page-root .lg\\:left-auto { left: auto; }
  .blog-page-root .lg\\:left-1\\/2 { left: 50%; }
  .blog-page-root .lg\\:right-0 { right: 0; }
  .blog-page-root .lg\\:right-4 { right: 1rem; }
  .blog-page-root .lg\\:mt-0 { margin-top: 0; }
  .blog-page-root .lg\\:mt-8 { margin-top: 2rem; }
  .blog-page-root .lg\\:mb-0 { margin-bottom: 0; }
  .blog-page-root .lg\\:border-\\[6px\\] { border-width: 6px; border-style: solid; }
  .blog-page-root .lg\\:rounded-\\[40px\\] { border-radius: 40px; }
  .blog-page-root .lg\\:rounded-\\[60px\\] { border-radius: 60px; }
  .blog-page-root .lg\\:w-80 { width: 20rem; }
  .blog-page-root .lg\\:w-auto { width: auto; }
}

/* ─── XL BREAKPOINT (≥1280px) ─── */
@media (min-width: 1280px) {
  .blog-page-root .xl\\:flex-row { flex-direction: row; }
  .blog-page-root .xl\\:items-center { align-items: center; }
  .blog-page-root .xl\\:border-t-0 { border-top-width: 0; }
  .blog-page-root .xl\\:border-l { border-left-width: 1px; border-left-style: solid; }
  .blog-page-root .xl\\:pt-0 { padding-top: 0; }
  .blog-page-root .xl\\:pl-8 { padding-left: 2rem; }
  .blog-page-root .xl\\:mt-0 { margin-top: 0; }
  .blog-page-root .xl\\:justify-end { justify-content: flex-end; }
  .blog-page-root .xl\\:w-auto { width: auto; }
}
`;
