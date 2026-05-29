import {
  CircleCheck,
  Download,
  FileDown,
  FileArchive,
  Folder,
  Globe2,
  Info,
  Mail,
  MousePointerClick,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Settings,
  Trash2,
  TriangleAlert,
  MessageSquare,
} from 'lucide-react';
import garimMoonImage from '../../assets/images/garim_moon.png';
import garimLogo from '../../assets/icons/GARIM.png';
import logoIcon from '../../assets/icons/logo.png';
import packIcon from '../../assets/images/pac.png';
import { useWindowsSetupDownloadMutation } from '../../queries/downloadQueries.js';
import { useSupportSettingsStore } from '../../stores/supportSettingsStore.js';

const quickSteps = [
  [FileDown, '압축 파일 다운로드', '최신 압축 파일을 다운로드합니다.'],
  [MousePointerClick, '압축 해제 및 파일 실행', '다운로드한 압축 파일을 실행합니다.'],
  [CircleCheck, '적용 확인', '설정 또는 정책 적용 상태를 확인합니다.'],
  [Rocket, '사용 시작', '적용이 완료된 후 서비스를 이용합니다.'],
];

const installSteps = [
  [Download, '팩 파일 다운로드', 'garim-windows-setup.zip\n파일을 다운로드합니다.'],
  [FileArchive, '압축 해제', '다운로드한 zip 파일의\n압축을 풉니다.'],
  [
    MousePointerClick,
    '설치 파일 실행',
    '압축을 푼 폴더 안에서\ngarim-start.cmd 파일을 실행합니다.',
  ],
  [ShieldCheck, '보안 확인 허용', 'Windows 보안 확인 창이나\n인증서 설치 확인 창을 허용합니다.'],
  [RefreshCw, 'AI 서비스 종료', 'AI 서비스 웹페이지나 앱을\n완전히 종료합니다.'],
  [Rocket, '다시 접속', '브라우저 또는 앱을 다시 실행하고\nAI 서비스에 접속합니다.'],
];

const deleteSteps = [
  [Folder, '설치 폴더 열기', '압축을 풀었던\ngarim-windows-setup 폴더를 엽니다.'],
  [Trash2, '삭제 파일 실행', 'garim-delete.cmd\n파일을 실행합니다.'],
  [ShieldCheck, '보안 확인 허용', 'Windows 보안 확인 창 내용을\n확인한 뒤 허용합니다.'],
  [RefreshCw, 'AI 서비스 종료', 'AI 서비스 웹페이지나 앱을\n완전히 종료합니다.'],
  [Rocket, '다시 실행', '브라우저 또는 앱을\n다시 실행합니다.'],
];

const cautionItems = [
  ['파일 구성 유지', '파일 이름을 바꾸거나\n일부 파일만 따로 옮기지 마세요.'],
  [
    '같은 폴더에서 실행',
    'garim-start.cmd, enable.ps1,\ngarim-delete.cmd, disable.ps1은 같은 폴더에 있어야 합니다.',
  ],
  [
    'AI 서비스 완전 재실행',
    '설치 또는 삭제 후에는 AI 서비스 탭이나 앱을\n완전히 껐다가 다시 켜야 합니다.',
  ],
  [
    '인증서 확인 창',
    '인증서 설치 확인 창이 뜨는 것은 정상입니다.\n보안 정책 검사를 위해 필요한 절차입니다.',
  ],
];

const verifyItems = [
  [Globe2, '서비스 접속이 정상적으로 가능한지 확인'],
  [Settings, '정책 또는 설정이 정상 반영되었는지 확인'],
  [TriangleAlert, '오류 메시지가 표시되지 않는지 확인'],
  [MessageSquare, '문제가 발생하면 관리자에게 문의'],
];

function Section({ children, className = '', ...props }) {
  return (
    <section
      className={`scroll-mt-28 rounded-[18px] border border-[#E5EAF3] bg-white p-8 shadow-[0_16px_42px_rgba(15,23,42,0.07)] ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="max-w-[52rem]">
      <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-slate-900">{title}</h2>
      <p className="mt-3 text-base font-semibold leading-7 text-[#526078]">{description}</p>
    </div>
  );
}

function StepCard({ icon, number, title, description }) {
  const Icon = icon;

  return (
    <div className="relative flex min-h-[13rem] flex-col items-center justify-center rounded-[14px] border border-[#E3E8F2] bg-white px-6 py-6 text-center shadow-[0_12px_28px_rgba(15,23,42,0.07)]">
      <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#5B39D6] text-sm font-black text-white shadow-[0_8px_18px_rgba(91,57,214,0.22)]">
        {number}
      </span>
      <Icon className="h-12 w-12 text-[#5B39D6]" />
      <div className="mt-5 min-h-[5rem]">
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#526078]">{description}</p>
      </div>
    </div>
  );
}

function CompactGuideCard({ icon, number, title, description }) {
  const Icon = icon;

  return (
    <div className="relative flex min-h-[10.75rem] flex-col items-center justify-center rounded-[10px] border border-[#E3E8F2] bg-white px-4 py-5 text-center shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
      <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#5B39D6] text-xs font-black text-white shadow-[0_8px_16px_rgba(91,57,214,0.2)]">
        {number}
      </span>
      <Icon className="h-9 w-9 text-[#5B39D6]" strokeWidth={2.2} />
      <div className="mt-4">
        <h3 className="text-sm font-black leading-5 text-slate-900">{title}</h3>
        <p className="mt-2 whitespace-pre-line text-xs font-semibold leading-5 text-[#526078]">
          {description}
        </p>
      </div>
    </div>
  );
}

function GuideNotice({ children }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#DED7FF] bg-[#F5F1FF] px-5 py-3 text-sm font-semibold leading-6 text-[#6C4FE0]">
      <Info className="mt-0.5 h-5 w-5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export default function DownloadPage() {
  const template = useSupportSettingsStore(state => state.template);
  const { mutate: requestWindowsSetupDownload, isPending: isDownloadPending } =
    useWindowsSetupDownloadMutation();

  const handleDownloadClick = () => {
    requestWindowsSetupDownload();
  };

  return (
    <main className="min-h-screen bg-[#F3F6FA] text-[#111827]">
      <header className="sticky top-0 z-30 h-[4.5rem] bg-black">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="" className="h-8 w-8 rounded-md object-cover" />
            <img src={garimLogo} alt="GARIM" className="h-8 w-auto" />
          </div>
          <nav className="hidden items-center gap-10 text-sm font-bold text-white md:flex">
            <a href="#pack-download" className="transition hover:text-[#C4B5FD]">
              다운로드 가이드
            </a>
            <a href="#apply" className="transition hover:text-[#C4B5FD]">
              적용 방법
            </a>
            <a href="#contact" className="transition hover:text-[#C4B5FD]">
              문의하기
            </a>
          </nav>
        </div>
      </header>

      <section
        className="relative flex min-h-[25rem] items-center justify-center overflow-hidden bg-[#080B28] bg-cover px-6 text-white"
        style={{
          backgroundImage: `url(${garimMoonImage})`,
          backgroundPosition: 'center bottom',
        }}
      >
        
        <div className="relative z-10 mx-auto max-w-[820px] text-center">
          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight tracking-[-0.02em]">
            운영지원
          </h1>
          <p className="mx-auto mt-6 max-w-[42rem] text-xl font-semibold leading-8 ">
            GARIM 적용에 필요한 압축 파일을 다운로드하고 실행 및 적용 방법을 확인해 주세요.
          </p>
          <button
            type="button"
            onClick={handleDownloadClick}
            disabled={isDownloadPending}
            className="mt-9 inline-flex h-16 items-center justify-center gap-3 rounded-xl border border-[#6D4CFF] bg-[#5B39D6] px-12 text-lg font-black text-white shadow-[0_18px_36px_rgba(91,57,214,0.34)] transition hover:bg-[#4C2FC0]"
          >
            <Download className="h-6 w-6" />
            {isDownloadPending ? '다운로드 준비 중' : '압축 파일 다운로드'}
          </button>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-8 py-12">
        <section id="guide" className="scroll-mt-28">
          <SectionHeader title="빠른 시작" description="4단계만 따라하면 쉽게 적용할 수 있어요." />
          <div className="mt-6 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {quickSteps.map(([Icon, title, description], index) => (
              <StepCard
                key={title}
                icon={Icon}
                number={index + 1}
                title={title}
                description={description}
              />
            ))}
          </div>
        </section>

        <Section id="pack-download">
          <SectionHeader
            title="압축 파일 다운로드"
            description={
              <>
                GARIM 적용에 필요한 최신 압축 파일을 다운로드하세요.
                <br />
                관리자가 안내한 환경에 맞는 파일을 선택해 실행해 주세요.
              </>
            }
          />

          <div className="mt-8 rounded-xl border border-[#DDE4EF] bg-white p-6">
            <div className="grid gap-6 lg:grid-cols-[10rem_1fr_auto] lg:items-center">
              <img src={packIcon} alt="" className="h-40 w-40 object-contain" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="break-all text-[clamp(1.35rem,3vw,2rem)] font-black tracking-[-0.03em] text-slate-900">
                    garim-windows-setup.zip
                  </h3>
                  <span className="rounded-md border border-[#E3E8F2] bg-white px-3 py-1 text-xs font-black text-[#526078]">
                    최신 버전
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold text-[#64728C]">
                  <span>버전 v0.1.0</span>
                  <span>업데이트 2026.05.28</span>
                  <span>파일 형식 .zip</span>
                  <span>크기 3KB</span>
                </div>
                <p className="mt-6 text-base font-semibold text-[#526078]">
                  GARIM 정책 및 환경 설정 적용을 위한 압축 파일입니다.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-4 lg:min-w-[14rem]">
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  disabled={isDownloadPending}
                  className="inline-flex h-16 items-center justify-center gap-3 rounded-xl border border-[#5B39D6] bg-[#5B39D6] px-8 text-lg font-black text-white shadow-[0_14px_30px_rgba(91,57,214,0.24)] transition hover:bg-[#4C2FC0]"
                >
                  <Download className="h-5 w-5" />
                  {isDownloadPending ? '다운로드 준비 중' : '압축 파일 다운로드'}
                </button>
                <span className="text-center text-base font-black text-[#526078]">3KB</span>
              </div>
            </div>
          </div>
        </Section>

        <Section id="apply">
          <SectionHeader
            title="설치 안내"
            description="다운로드한 압축 파일을 실행한 뒤 안내에 따라 GARIM 설정을 적용해 주세요."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {installSteps.map(([Icon, title, description], index) => (
              <CompactGuideCard
                key={title}
                icon={Icon}
                number={index + 1}
                title={title}
                description={description}
              />
            ))}
          </div>

          <GuideNotice>
            설치 후에는 관련 대상 AI 서비스 접속이 회사 보안 프록시를 통해 연결되며, 정책에 따라
            일부 요청은 허용·차단·기록될 수 있습니다.
          </GuideNotice>
        </Section>

        <Section>
          <SectionHeader
            title="주의사항"
            description="설치 또는 삭제를 진행하기 전에 아래 내용을 확인해 주세요."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {cautionItems.map(([title, description]) => (
              <div
                key={title}
                className="flex min-h-[5.75rem] items-start gap-4 rounded-[10px] border border-[#E3E8F2] bg-[#FAFBFF] px-5 py-4"
              >
                <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-[#5B39D6]" />
                <div className="min-w-0">
                  <p className="text-base font-black text-slate-900">{title}</p>
                  <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-6 text-[#526078]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <SectionHeader
            title="삭제 안내"
            description="GARIM 적용을 해제해야 하는 경우 아래 순서대로 진행해 주세요."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deleteSteps.map(([Icon, title, description], index) => (
              <CompactGuideCard
                key={title}
                icon={Icon}
                number={index + 1}
                title={title}
                description={description}
              />
            ))}
          </div>

          <GuideNotice>삭제 후에는 설정된 PAC 프록시와 설치된 인증서가 제거됩니다.</GuideNotice>
        </Section>

        <Section>
          <SectionHeader
            title="적용 후 확인 방법"
            description="적용이 완료되면 아래 항목을 확인해 주세요."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {verifyItems.map(([icon, text]) => {
              const Icon = icon;

              return (
                <div key={text} className="flex items-center gap-4 border-l border-[#E3E8F2] px-5">
                  <Icon className="h-11 w-11 shrink-0 text-[#5B39D6]" />
                  <p className="text-base font-bold leading-7 text-[#344054]">{text}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="contact">
          <SectionHeader
            title="문제가 발생했나요?"
            description="압축 파일 다운로드, 실행 또는 적용 중 문제가 발생하면 관리자에게 문의해 주세요."
          />
          <div className="mt-8 grid overflow-hidden rounded-xl border border-[#E3E8F2] bg-white lg:grid-cols-[1.3fr_1fr_1fr]">
            <div className="flex items-center gap-5 px-10 py-7">
              <img src={template.logoSrc} alt="" className="h-20 w-20 shrink-0 object-contain" />
              <div>
                <p className="text-base font-black text-slate-900">{template.companyName}</p>
                <p className="mt-2 text-base font-bold leading-7 text-[#526078]">
                  {template.companyDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 border-t border-[#E3E8F2] px-10 py-7 lg:border-l lg:border-t-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F1FF] text-[#5B39D6]">
                <Mail className="h-8 w-8" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">이메일</p>
                <p className="mt-2 text-base font-bold text-[#526078]">{template.adminEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 border-t border-[#E3E8F2] px-10 py-7 lg:border-l lg:border-t-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F1FF] text-[#5B39D6]">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">전화</p>
                <p className="mt-2 text-base font-bold text-[#526078]">{template.adminPhone}</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <footer className="mt-2 bg-[#101722]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-8 py-8 text-sm font-semibold text-white/62 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={logoIcon} alt="" className="h-7 w-7 rounded-md object-cover" />
              <img src={garimLogo} alt="GARIM" className="h-7 w-auto" />
            </div>
            <span>GARIM은 안전하고 효율적인 IT 환경을 제공하는 기술 기업입니다.</span>
          </div>
          <span>© 2026 GARIM Co., Ltd. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
