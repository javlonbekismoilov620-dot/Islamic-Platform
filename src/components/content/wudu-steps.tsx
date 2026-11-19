/** Tahorat bosqichlari — minimal chiziqli rasmlar bilan (original piktogrammalar). */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const Drop = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path d={`M${x} ${y} c ${-3 * s} ${4 * s} ${-4 * s} ${6 * s} ${-4 * s} ${8 * s} a ${4 * s} ${4 * s} 0 0 0 ${8 * s} 0 c 0 ${-2 * s} ${-1 * s} ${-4 * s} ${-4 * s} ${-8 * s} Z`} fill="var(--primary)" fillOpacity="0.18" stroke="var(--primary)" strokeWidth={1.6} />
);

const PICS: Record<string, React.ReactNode> = {
  niyat: (<g {...S}><path d="M32 50 C18 41 12 33 12 25 a10 10 0 0 1 20 -4 a10 10 0 0 1 20 4 c0 8 -6 16 -20 25 Z" /><path d="M46 10 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="var(--gold)" stroke="var(--gold)" strokeWidth={1} /></g>),
  qol: (<g {...S}><path d="M14 48 v-14 c0-3 2-5 4-5 s4 2 4 5 v-14 c0-2 1.5-3.5 3.5-3.5 S29 18 29 20 v12" /><path d="M22 30 v-12 M29 30 v-14 c0-2 1.5-3.5 3.5-3.5" /><path d="M14 48 c2 6 8 8 14 8 s12-3 14-9 l6-14 c1-2 0-4-2-4.5 -2-.5-3.5 1-4.5 3 L39 38" /><Drop x={48} y={10} /><Drop x={40} y={6} s={0.7} /></g>),
  ogiz: (<g {...S}><path d="M14 18 c10-8 26-8 36 2 4 4 4 10 0 14 -4 4-4 10 0 14 -10 8-26 8-36 0" /><path d="M24 33 c4 3 12 3 16 0" /><Drop x={50} y={14} /></g>),
  burun: (<g {...S}><path d="M34 8 c-2 10 -6 20 -12 28 -3 4 0 8 5 8 h8" /><path d="M28 44 c2 3 6 3 8 0" /><Drop x={46} y={26} /></g>),
  yuz: (<g {...S}><ellipse cx="32" cy="32" rx="16" ry="22" /><path d="M26 28 h.01 M38 28 h.01" strokeWidth={3.5} /><path d="M27 42 c3 2 7 2 10 0" /><Drop x={54} y={14} /><Drop x={12} y={40} s={0.8} /></g>),
  bilak: (<g {...S}><path d="M8 40 h20 l14 -14 c3-3 7-3 9 0 2 3 1 6-2 8 L36 46 c-2 2-4 3-7 3 H8" /><circle cx="28" cy="44" r="3" stroke="var(--gold)" /><Drop x={50} y={10} /><Drop x={40} y={6} s={0.7} /></g>),
  bosh: (<g {...S}><path d="M18 52 v-10 c-5-4-8-10-8-16 a22 22 0 0 1 44 0 c0 6-3 12-8 16 v10" /><path d="M20 14 c6-6 18-6 24 0" stroke="var(--primary)" /><path d="M14 26 c-2 0-4 2-3 5 M50 26 c2 0 4 2 3 5" /></g>),
  oyoq: (<g {...S}><path d="M22 8 v26 c0 6-2 10-6 14 -3 3-1 8 4 8 h26 c4 0 6-3 4-6 -3-5-10-6-14-10 -3-3-4-6-4-10 V8" /><circle cx="34" cy="34" r="2.5" stroke="var(--gold)" /><Drop x={50} y={20} /></g>),
};

const STEPS = [
  { pic: "niyat", t: "Niyat va «Bismillāh»", d: "Qalbdan niyat qiling va Allohning nomi bilan boshlang.", r: "sunnat" },
  { pic: "qol", t: "Qoʻllarni yuvish", d: "Bilaklargacha uch marta, barmoqlar orasini ham.", r: "sunnat" },
  { pic: "ogiz", t: "Ogʻizni chayish", d: "Uch marta; roʻzador boʻlmasangiz, gʻargʻara qiling.", r: "sunnat" },
  { pic: "burun", t: "Burunni chayish", d: "Oʻng qoʻl bilan suv tortib, chap qoʻl bilan qoqing — uch marta.", r: "sunnat" },
  { pic: "yuz", t: "Yuzni yuvish", d: "Peshonadan iyak ostigacha, quloqdan quloqqacha — uch marta.", r: "farz" },
  { pic: "bilak", t: "Qoʻllarni tirsak bilan", d: "Avval oʻng, soʻng chap qoʻl, tirsaklar bilan birga — uch martadan.", r: "farz" },
  { pic: "bosh", t: "Boshga mash", d: "Boshning toʻrtdan biriga mash farz; butun boshga, quloq va boʻyinga — sunnat/mustahab.", r: "farz" },
  { pic: "oyoq", t: "Oyoqlarni toʻpiq bilan", d: "Avval oʻng, soʻng chap oyoq, toʻpiqlar bilan — uch martadan.", r: "farz" },
];

const RTONE: Record<string, string> = { farz: "bg-danger-soft text-danger", sunnat: "bg-primary-soft text-primary" };

export function WuduSteps() {
  return (
    <figure className="my-8">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.pic} className="card glass flex flex-col items-center p-4 text-center">
            <span className="mb-1 self-start text-xs font-semibold text-gold tabular-nums">{i + 1}</span>
            <svg viewBox="0 0 64 64" width="72" height="72" className="text-fg-2" aria-hidden>{PICS[s.pic]}</svg>
            <span className="mt-2 text-[0.92rem] leading-tight font-semibold text-fg">{s.t}</span>
            <span className="mt-1 text-xs leading-snug text-muted">{s.d}</span>
            <span className={`mt-2 rounded-full px-2 py-0.5 text-[0.68rem] font-medium ${RTONE[s.r]}`}>{s.r === "farz" ? "Farz" : "Sunnat"}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-center text-xs text-muted">Tahorat bosqichlari (Hanafiy mazhabi). Belgilar — farz yoki sunnat ekanini koʻrsatadi.</figcaption>
    </figure>
  );
}
