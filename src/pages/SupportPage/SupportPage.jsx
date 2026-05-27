import { ChevronUp, Copy, ExternalLink, Info, RefreshCw, Tag, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import SectionCard from '../../components/SectionCard.jsx';
import PageLayout from '../../layout/PageLayout.jsx';
import logoIcon from '../../assets/icons/logo.png';

const DEFAULT_DOWNLOAD_PATH = '/download';
const urlExamples = ['/download', '/guide', '/support/download'];
const initialTemplate = {
  logoSrc: logoIcon,
  companyName: 'GARIM Co., Ltd.',
  companyDescription: 'GARIM은 안전하고 효율적인 IT 환경을 제공하는 기술 기업입니다.',
  adminContact: 'support@garim.com / 02-1234-5678',
};
const modalCancelButtonClass =
  'inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-500 transition hover:bg-slate-50';
const modalPrimaryButtonClass =
  'inline-flex h-11 items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]';

function InfoRow({ label, children }) {
  return (
    <div className="grid min-h-[4rem] grid-cols-[10rem_1fr] items-center border-t border-slate-200 px-6 text-sm sm:grid-cols-[12rem_1fr]">
      <dt className="font-bold text-slate-500">{label}</dt>
      <dd className="font-semibold text-[#64728C]">{children}</dd>
    </div>
  );
}

function OutlineButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
    >
      {children}
    </button>
  );
}

function CardHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-6 py-5">
      <h2 className="text-lg font-bold text-[#20264D]">{title}</h2>
      <OutlineButton onClick={onAction}>{action}</OutlineButton>
    </div>
  );
}

function TemplateEditModal({ template, onClose, onSave }) {
  const [draft, setDraft] = useState(template);

  const updateDraft = (key, value) => {
    setDraft(current => ({ ...current, [key]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(15,23,42,0.42)] px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="템플릿 정보 수정 닫기"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[38rem] overflow-hidden rounded-[14px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)]"
      >
        <div className="flex items-start justify-between border-b border-[#EEF2F7] px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">템플릿 정보 수정</h2>
            <p className="mt-3 text-sm font-semibold text-[#475467]">
              다운로드 페이지에 표시할 회사 정보와 연락처를 설정합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#111827] transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-[6.5rem_1fr] gap-5">
            <label className="pt-3 text-sm font-bold text-[#475467]">로고</label>
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={draft.logoSrc}
                  alt="GARIM"
                  className="h-12 w-12 rounded-xl border border-[#E2E8F0] object-cover"
                />
                <div className="min-w-0">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-[#D6DAE6] bg-white px-4 text-sm font-bold text-[#344054] transition hover:bg-[#F8FAFC]"
                  >
                    변경
                  </button>
                  <p className="mt-2 text-xs font-semibold text-[#667085]">
                    권장 사이즈: 512x512px / PNG, JPG 파일
                  </p>
                </div>
              </div>
            </div>
          </div>

          <label className="grid grid-cols-[6.5rem_1fr] gap-5">
            <span className="pt-3 text-sm font-bold text-[#475467]">회사 정보</span>
            <div className="relative">
              <input
                value={draft.companyName}
                onChange={event => updateDraft('companyName', event.target.value.slice(0, 100))}
                className="h-11 w-full rounded-lg border border-[#DCE3EF] bg-white px-4 pr-16 text-sm font-semibold text-[#475467] outline-none transition focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE]"
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-[#98A2B3]">
                {draft.companyName.length} / 100
              </span>
            </div>
          </label>

          <label className="grid grid-cols-[6.5rem_1fr] gap-5">
            <span className="pt-3 text-sm font-bold text-[#475467]">회사 설명</span>
            <div className="relative">
              <textarea
                value={draft.companyDescription}
                onChange={event =>
                  updateDraft('companyDescription', event.target.value.slice(0, 200))
                }
                className="h-[5.75rem] w-full resize-none rounded-lg border border-[#DCE3EF] bg-white px-4 py-3 pr-16 text-sm font-semibold leading-6 text-[#475467] outline-none transition focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE]"
              />
              <span className="absolute right-4 bottom-3 text-xs font-semibold text-[#98A2B3]">
                {draft.companyDescription.length} / 200
              </span>
            </div>
          </label>

          <label className="grid grid-cols-[6.5rem_1fr] gap-5">
            <span className="pt-3 text-sm font-bold text-[#475467]">관리자 연락처</span>
            <div className="relative">
              <input
                value={draft.adminContact}
                onChange={event => updateDraft('adminContact', event.target.value.slice(0, 100))}
                className="h-11 w-full rounded-lg border border-[#DCE3EF] bg-white px-4 pr-16 text-sm font-semibold text-[#475467] outline-none transition focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE]"
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-[#98A2B3]">
                {draft.adminContact.length} / 100
              </span>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#EEF2F7] px-6 py-5">
          <button type="button" onClick={onClose} className={modalCancelButtonClass}>
            취소
          </button>
          <button type="submit" className={modalPrimaryButtonClass}>
            저장
          </button>
        </div>
      </form>
    </div>
  );
}

function DownloadUrlModal({ currentPath, onClose, onApply }) {
  const [draftPath, setDraftPath] = useState(currentPath);
  const isValid =
    draftPath.startsWith('/') && !draftPath.includes(' ') && draftPath.trim().length > 1;

  const handleSubmit = event => {
    event.preventDefault();
    if (!isValid) return;
    onApply(draftPath);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(15,23,42,0.42)] px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="다운로드 URL 변경 닫기"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[40rem] overflow-hidden rounded-[14px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)]"
      >
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <h2 className="text-lg font-bold leading-tight text-[#111827]">다운로드 URL 변경</h2>
            <p className="mt-3 text-sm font-semibold text-[#475467]">
              사용자가 다운로드 페이지에 접속할 URL 경로를 설정합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#111827] transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex min-h-[3.25rem] items-center gap-5 rounded-lg border border-[#DCE3EF] bg-white px-4">
            <span className="text-sm font-bold text-[#111827]">현재 URL</span>
            <span className="inline-flex h-8 items-center rounded-lg border border-[#EEF2F7] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#475467]">
              {currentPath}
            </span>
          </div>

          <div className="border-t border-[#DCE3EF]" />

          <label className="grid gap-3 md:grid-cols-[7rem_1fr] md:items-start">
            <span className="pt-3 text-sm font-bold text-[#111827]">
              새 URL <span className="text-[#EF4444]">*</span>
            </span>
            <div>
              <div className="relative">
                <input
                  value={draftPath}
                  onChange={event => setDraftPath(event.target.value.slice(0, 100))}
                  autoFocus
                  className="h-11 w-full rounded-lg border border-[#DCE3EF] bg-white px-4 pr-16 text-sm font-semibold text-[#475467] outline-none transition focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE]"
                />
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-[#667085]">
                  {draftPath.length} / 100
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#667085]">
                슬래시(/)로 시작하는 경로만 입력 가능합니다.
              </p>
            </div>
          </label>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#DDD6FE] bg-[#F7F5FF] px-4 py-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE9FE] text-[#4338CA]">
              <Tag className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-[#4338CA]">사용 가능 예시</span>
            <div className="flex flex-wrap gap-2">
              {urlExamples.map(example => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setDraftPath(example)}
                  className="inline-flex h-8 items-center rounded-lg bg-white/70 px-3 text-sm font-semibold text-[#667085] transition hover:bg-white hover:text-[#4338CA]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#DCE3EF] bg-[#F8FAFC] px-4 py-3 text-[#475467]">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Info className="h-4 w-4" />
              유의사항
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm font-semibold leading-6">
              <li>URL은 /로 시작해야 합니다.</li>
              <li>공백은 사용할 수 없습니다.</li>
              <li>이미 사용 중인 경로는 사용할 수 없습니다.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#EEF2F7] px-6 py-5">
          <button type="button" onClick={onClose} className={modalCancelButtonClass}>
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`${modalPrimaryButtonClass} disabled:cursor-not-allowed disabled:border-[#C7C9D9] disabled:bg-[#C7C9D9] disabled:shadow-none`}
          >
            적용
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SupportPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isDownloadUrlModalOpen, setIsDownloadUrlModalOpen] = useState(false);
  const [template, setTemplate] = useState(initialTemplate);
  const [downloadPath, setDownloadPath] = useState(DEFAULT_DOWNLOAD_PATH);
  const [previewKey, setPreviewKey] = useState(0);
  const fullDownloadUrl = useMemo(() => {
    if (typeof window === 'undefined') return downloadPath;
    return `${window.location.origin}${downloadPath}`;
  }, [downloadPath]);

  const handleCopyUrl = async () => {
    await navigator.clipboard?.writeText(fullDownloadUrl);
  };

  const handleSaveTemplate = nextTemplate => {
    setTemplate(nextTemplate);
    setIsTemplateModalOpen(false);
  };

  const handleApplyDownloadPath = nextPath => {
    setDownloadPath(nextPath);
    setPreviewKey(current => current + 1);
    setIsDownloadUrlModalOpen(false);
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 pb-3">
        <SectionCard className="overflow-hidden">
          <CardHeader
            title="템플릿 관리"
            action="수정하기"
            onAction={() => setIsTemplateModalOpen(true)}
          />

          <dl>
            <InfoRow label="로고">
              <div className="flex items-center gap-3">
                <img
                  src={template.logoSrc}
                  alt="GARIM"
                  className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                />
                <span>GARIM</span>
              </div>
            </InfoRow>
            <InfoRow label="회사 정보">{template.companyName}</InfoRow>
            <InfoRow label="회사 설명">{template.companyDescription}</InfoRow>
            <InfoRow label="관리자 연락처">{template.adminContact}</InfoRow>
          </dl>
        </SectionCard>

        <SectionCard className="overflow-hidden">
          <CardHeader
            title="다운로드 URL 관리"
            action="변경하기"
            onAction={() => setIsDownloadUrlModalOpen(true)}
          />

          <div className="px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-500">현재 URL</span>
                  <span className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-5 text-sm font-bold text-[#64728C]">
                    {downloadPath}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-4">
                  <span className="shrink-0 text-sm font-bold text-slate-500">전체 주소</span>
                  <a
                    href={downloadPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-w-0 max-w-full items-center gap-2 text-sm font-bold text-[#4338CA] hover:text-[#3730A3]"
                  >
                    <span className="truncate">{fullDownloadUrl}</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                </div>
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
                  href={downloadPath}
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
                  <span className="text-sm font-bold text-[#475467]">미리보기</span>
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
                  src={downloadPath}
                  title="다운로드 페이지 미리보기"
                  className="h-[28rem] w-full rounded-[10px] border border-[#E2E8F0] bg-white lg:h-[34rem]"
                />
              </div>
            </div>
          ) : null}
        </SectionCard>
      </div>

      {isTemplateModalOpen ? (
        <TemplateEditModal
          template={template}
          onClose={() => setIsTemplateModalOpen(false)}
          onSave={handleSaveTemplate}
        />
      ) : null}

      {isDownloadUrlModalOpen ? (
        <DownloadUrlModal
          currentPath={downloadPath}
          onClose={() => setIsDownloadUrlModalOpen(false)}
          onApply={handleApplyDownloadPath}
        />
      ) : null}
    </PageLayout>
  );
}
