import PageLayout from '../../layout/PageLayout.jsx';

export default function DomainPage() {
  return (
    <PageLayout>
      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(49,164,189,0.2),rgba(255,255,255,0.045))] p-6 shadow-[0_28px_80px_rgba(1,12,28,0.3)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8AD4E4]">Domain</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">도메인</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#D2D5DB] sm:text-base">
          검증 대상 도메인과 연결 상태를 관리하는 화면입니다.
        </p>
      </section>
    </PageLayout>
  );
}
