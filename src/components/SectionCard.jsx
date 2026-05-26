export default function SectionCard({ children, className = '' }) {
  return (
    <section
      className={`rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${className}`.trim()}
    >
      {children}
    </section>
  );
}
