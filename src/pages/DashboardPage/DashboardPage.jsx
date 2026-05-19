import PageLayout from '../../layout/PageLayout';

function DashboardCard({ title, value, description }) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/6 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <p className="text-sm text-[#9EA2AE]">{title}</p>
      <strong className="mt-3 block text-3xl font-black tracking-tight text-white">{value}</strong>
      <p className="mt-2 text-sm leading-6 text-[#D2D5DB]">{description}</p>
    </article>
  );
}

export default function DashboardPage() {
  return (
    <PageLayout>
      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(49,164,189,0.22),rgba(255,255,255,0.05))] p-6 shadow-[0_28px_80px_rgba(1,12,28,0.3)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8AD4E4]">
          Dashboard
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
          대시보드
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#D2D5DB] sm:text-base">
          전체 운영 상태와 주요 지표를 한눈에 확인하는 화면입니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="전체 상태" value="정상" description="현재 서비스 상태를 요약합니다." />
        <DashboardCard title="모니터링 항목" value="24" description="수집 중인 항목 수입니다." />
        <DashboardCard title="활성 정책" value="8" description="현재 적용 중인 정책 수입니다." />
      </section>
    </PageLayout>
  );
}