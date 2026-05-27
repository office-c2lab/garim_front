import { ChevronUp, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

import SectionCard from '../../components/SectionCard.jsx';
import PageLayout from '../../layout/PageLayout.jsx';
import logoIcon from '../../assets/icons/logo.png';

const DOWNLOAD_PATH = '/download';

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
      className="inline-flex h-12 items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
    >
      {children}
    </button>
  );
}

function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-6 py-5">
      <h2 className="text-lg font-bold text-[#20264D]">{title}</h2>
      <OutlineButton>{action}</OutlineButton>
    </div>
  );
}

export default function SupportPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const fullDownloadUrl = useMemo(() => {
    if (typeof window === 'undefined') return DOWNLOAD_PATH;
    return `${window.location.origin}${DOWNLOAD_PATH}`;
  }, []);

  const handleCopyUrl = async () => {
    await navigator.clipboard?.writeText(fullDownloadUrl);
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 pb-3">
        <SectionCard className="overflow-hidden">
          <CardHeader title="템플릿 관리" action="수정하기" />

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
          <CardHeader title="다운로드 URL 관리" action="변경하기" />

          <div className="px-6 py-5">
            <div className="grid gap-4 xl:grid-cols-[10rem_minmax(0,1fr)_auto] xl:items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-500">현재 URL</span>
                <span className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-5 text-sm font-bold text-[#64728C]">
                  {DOWNLOAD_PATH}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-500">전체 주소</p>
                <a
                  href={DOWNLOAD_PATH}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex max-w-full items-center gap-2 text-sm font-bold text-[#4338CA] hover:text-[#3730A3]"
                >
                  <span className="truncate">{fullDownloadUrl}</span>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(current => !current)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
                >
                  {isPreviewOpen ? '미리보기 접기' : '미리보기 열기'}
                  <ChevronUp
                    className={`h-4 w-4 transition ${isPreviewOpen ? '' : 'rotate-180'}`.trim()}
                  />
                </button>
                <a
                  href={DOWNLOAD_PATH}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#344054] shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                >
                  새 탭에서 열기
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#344054] shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                >
                  URL 복사
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          {isPreviewOpen ? (
            <div className="border-t border-[#E7EBF4] bg-white">
              <div className="px-6 py-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#475467]">미리보기: {DOWNLOAD_PATH}</span>
                  <button
                    type="button"
                    onClick={() => setPreviewKey(current => current + 1)}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold text-[#4338CA] transition hover:bg-[#EEF2FF]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    새로고침
                  </button>
                </div>
                <iframe
                  key={previewKey}
                  src={DOWNLOAD_PATH}
                  title="다운로드 페이지 미리보기"
                  className="h-[28rem] w-full rounded-[10px] border border-[#E2E8F0] bg-white lg:h-[34rem]"
                />
              </div>
            </div>
          ) : null}
        </SectionCard>
      </div>
    </PageLayout>
  );
}
