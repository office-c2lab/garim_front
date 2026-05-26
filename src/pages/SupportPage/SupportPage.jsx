import SectionCard from '../../components/SectionCard.jsx';
import PageLayout from '../../layout/PageLayout.jsx';
import logoIcon from '../../assets/icons/logo.png';

function InfoRow({ label, children }) {
  return (
    <div className="grid min-h-[4rem] grid-cols-[10rem_1fr] items-center border-t border-slate-200 px-6 text-sm sm:grid-cols-[12rem_1fr]">
      <dt className="font-bold text-slate-500">{label}</dt>
      <dd className="font-semibold text-[#64728C]">{children}</dd>
    </div>
  );
}

function OutlineButton({ children }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center rounded-lg border border-[#8B5CF6] bg-white px-4 text-sm font-bold text-[#5B39D6] transition hover:bg-[#F5F3FF]"
    >
      {children}
    </button>
  );
}

export default function SupportPage() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-6 pb-3">
        <SectionCard className="overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">템플릿 관리</h2>
            <OutlineButton>수정하기</OutlineButton>
          </div>

          <dl>
            <InfoRow label="로고">
              <div className="flex items-center gap-3">
                <img
                  src={logoIcon}
                  alt="GARIM"
                  className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                />
                <span>GARIM</span>
              </div>
            </InfoRow>
            <InfoRow label="회사 정보">GARIM Co., Ltd.</InfoRow>
            <InfoRow label="회사 설명">
              GARIM은 안전하고 효율적인 IT 환경을 제공하는 기술 기업입니다.
            </InfoRow>
            <InfoRow label="관리자 연락처">support@garim.com / 02-1234-5678</InfoRow>
          </dl>
        </SectionCard>

        <SectionCard className="overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">다운로드 URL 관리</h2>
            <OutlineButton>변경하기</OutlineButton>
          </div>

          <dl>
            <InfoRow label="현재 URL">
              <span className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 text-sm font-bold text-[#64728C]">
                /download
              </span>
            </InfoRow>
          </dl>
        </SectionCard>
      </div>
    </PageLayout>
  );
}
