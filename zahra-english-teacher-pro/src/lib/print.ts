/**
 * Printing / PDF export.
 *
 * We use the browser's native print pipeline (window.print → "Save as PDF").
 * This is 100% local, needs no paid library, and produces high-quality,
 * page-break-aware output. `printHtml` opens a clean standalone document so the
 * app chrome never appears in the printout.
 */

const printStyles = `
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #111; margin: 0; padding: 24px; line-height: 1.5; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 18px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  h3 { font-size: 14px; margin: 12px 0 6px; }
  p { margin: 6px 0; }
  .doc-header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #27744b; padding-bottom: 10px; margin-bottom: 14px; }
  .doc-header .brand { color:#27744b; font-weight:700; }
  .meta { font-size: 12px; color:#444; }
  .fields { display:flex; flex-wrap:wrap; gap:16px; font-size:13px; margin: 10px 0 16px; }
  .fields span { border-bottom:1px solid #999; min-width:120px; padding-bottom:2px; }
  ol.questions { padding-inline-start: 22px; }
  ol.questions > li { margin-bottom: 14px; page-break-inside: avoid; }
  .choices { list-style: upper-alpha; padding-inline-start: 22px; margin-top: 4px; }
  .choices li { margin: 2px 0; }
  .answer { color:#27744b; font-weight:600; }
  .marks { float: right; color:#666; font-size:12px; }
  .note { font-size:12px; color:#666; font-style: italic; }
  table { border-collapse: collapse; width: 100%; font-size: 13px; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: start; }
  th { background:#f0f9f4; }
  .page-break { page-break-before: always; }
  .avoid-break { page-break-inside: avoid; }
  .badge { display:inline-block; background:#f0f9f4; color:#27744b; border-radius:4px; padding:1px 6px; font-size:11px; }
  @page { margin: 1.5cm; }
`;

export function printHtml(title: string, bodyHtml: string) {
  const win = window.open("", "_blank", "width=900,height=1100");
  if (!win) {
    alert("Please allow pop-ups to print or export this document.");
    return;
  }
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(
    title
  )}</title><style>${printStyles}</style></head><body>${bodyHtml}</body></html>`);
  win.document.close();
  win.focus();
  // Give the new document a tick to render before printing.
  setTimeout(() => {
    win.print();
  }, 300);
}

export function docHeader(opts: {
  title: string;
  header: string;
  teacher?: string;
  school?: string;
  className?: string;
  date?: string;
  unit?: string;
  totalMarks?: number | string;
}): string {
  const meta: string[] = [];
  if (opts.teacher) meta.push(`Teacher: ${escapeHtml(opts.teacher)}`);
  if (opts.school) meta.push(escapeHtml(opts.school));
  if (opts.className) meta.push(`Class: ${escapeHtml(opts.className)}`);
  if (opts.unit) meta.push(`Unit: ${escapeHtml(opts.unit)}`);
  if (opts.date) meta.push(`Date: ${escapeHtml(opts.date)}`);
  if (opts.totalMarks !== undefined && opts.totalMarks !== "") meta.push(`Total marks: ${escapeHtml(String(opts.totalMarks))}`);
  return `<div class="doc-header">
    <div>
      <div class="brand">${escapeHtml(opts.header)}</div>
      <h1>${escapeHtml(opts.title)}</h1>
      <div class="meta">${meta.join(" &nbsp;•&nbsp; ")}</div>
    </div>
  </div>`;
}

export function studentFields(): string {
  return `<div class="fields">
    <div>Name: <span></span></div>
    <div>Class: <span></span></div>
    <div>Date: <span></span></div>
  </div>`;
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
