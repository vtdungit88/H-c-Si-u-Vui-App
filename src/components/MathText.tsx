import React, { useEffect, useMemo, useState } from 'react';
import { segmentMath, toLatex } from '../utils/mathText';

type Katex = { renderToString(tex: string, opts?: Record<string, unknown>): string };
let katexPromise: Promise<Katex> | null = null;
const loadKatex = (): Promise<Katex> => {
  if (!katexPromise) {
    katexPromise = Promise.all([import('katex'), import('katex/dist/katex.min.css')]).then(([m]) => m.default as Katex);
  }
  return katexPromise;
};

/** Renders text with fractions, roots, powers and operators typeset by KaTeX (loaded on demand). */
export const MathText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const segs = useMemo(() => segmentMath(text), [text]);
  const hasMath = segs.some((s) => s.kind === 'math');
  const [katex, setKatex] = useState<Katex | null>(null);
  useEffect(() => {
    if (!hasMath) return;
    let alive = true;
    loadKatex().then((k) => alive && setKatex(k)).catch(() => undefined);
    return () => { alive = false; };
  }, [hasMath]);

  if (!hasMath || !katex) return <span className={className}>{text.replace(/\$([^$]+)\$/g, '$1')}</span>;
  return (
    <span className={className}>
      {segs.map((s, i) => s.kind === 'text'
        ? <React.Fragment key={i}>{s.value}</React.Fragment>
        : <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(s.raw ? s.value : toLatex(s.value), { throwOnError: false, output: 'html', strict: 'ignore', trust: false }) }} />)}
    </span>
  );
};
