/**
 * Splits a plain Vietnamese sentence into text and maths segments so only the formula parts
 * (fractions, powers, roots, ×, ÷, ≤ …) are typeset by KaTeX. Everything else stays normal text.
 * Explicit LaTeX can be written as $...$ .
 */
export type MathSeg = { kind: 'text'; value: string } | { kind: 'math'; value: string; raw?: boolean };

const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n', '⁻': '-' };
const SUP_RE = /[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁻]+/g;

export function toLatex(src: string): string {
  let s = src;
  s = s.replace(SUP_RE, (m) => `^{${[...m].map((c) => SUP[c]).join('')}}`);
  s = s.replace(/√\s*\(([^()]*)\)/g, '\\sqrt{$1}').replace(/√\s*([A-Za-z0-9.]+(?:\^\{[^}]*\})?)/g, '\\sqrt{$1}');
  s = s.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, '\\frac{$1}{$2}');
  // numbers or single letters only, so units such as km/h are left alone
  const ATOM = '(?:\\d+(?:\\.\\d+)?|[A-Za-z])(?:\\^\\{[^}]*\\})?';
  s = s.replace(new RegExp(`(-?${ATOM})\\s*/\\s*(${ATOM})(?![A-Za-z0-9])`, 'g'), '\\frac{$1}{$2}');
  s = s.replace(/(?<![\\A-Za-z])[A-Za-z]{2,}(?![A-Za-z{])/g, '\\text{$&}'); // units / words stay upright
  s = s.replace(/\^(-?\d+|[A-Za-z])/g, '^{$1}');
  return s.replace(/×/g, '\\times ').replace(/·/g, '\\cdot ').replace(/÷/g, '\\div ').replace(/≤/g, '\\le ').replace(/≥/g, '\\ge ').replace(/≠/g, '\\ne ')
    .replace(/−/g, '-').replace(/π/g, '\\pi ').replace(/°/g, '^{\\circ}').replace(/∞/g, '\\infty ').replace(/%/g, '\\%');
}

const TRIGGER = /√|[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]|\^|(?:\d|\b[A-Za-z]|\))\s*\/\s*(?:\d|[A-Za-z]\b|\()|[×÷·≤≥≠π°]/;
// a whitespace-separated token that can belong to a formula
const MATHY = /^[A-Za-z0-9.,π√−\-+*/=<>≤≥≠×÷·^⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁻°%()[\]]+$/;
const isSingleWord = (t: string) => /^[A-Za-z]{2,}$/.test(t);

export function segmentMath(input: string): MathSeg[] {
  const out: MathSeg[] = [];
  const push = (kind: 'text' | 'math', value: string) => {
    if (!value) return;
    const last = out[out.length - 1];
    if (last && last.kind === 'text' && kind === 'text') last.value += value; else out.push({ kind, value } as MathSeg);
  };
  // explicit $...$ first
  const parts = input.split(/(\$[^$]+\$)/g);
  for (const part of parts) {
    if (/^\$[^$]+\$$/.test(part)) { out.push({ kind: 'math', value: part.slice(1, -1), raw: true }); continue; }
    const tokens = part.split(/(\s+)/); // keep whitespace tokens
    let run: string[] = [];
    const flush = () => {
      if (!run.length) return;
      const text = run.join('');
      const trimmed = text.replace(/\s+$/, '');
      const tail = text.slice(trimmed.length);
      const prev = out[out.length - 1];
      const isDate = prev?.kind === 'text' && /(ngày|tháng)\s*$/i.test(prev.value);
      if (TRIGGER.test(trimmed) && !isDate) { out.push({ kind: 'math', value: trimmed }); push('text', tail); } else push('text', text);
      run = [];
    };
    for (const tok of tokens) {
      if (/^\s+$/.test(tok)) { if (run.length) run.push(tok); else push('text', tok); continue; }
      const m = tok.match(/^(.*?)([.,;:?!]*)$/)!; // peel trailing punctuation
      const core = m[1], punct = m[2];
      if (core && !isSingleWord(core) && MATHY.test(core) && !/^[.,]+$/.test(core)) {
        run.push(core);
        if (punct) { flush(); push('text', punct); }
      } else {
        flush();
        push('text', tok);
      }
    }
    flush();
  }
  return out;
}
