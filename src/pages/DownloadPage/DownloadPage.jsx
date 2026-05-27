import {
  Check,
  CircleCheck,
  Download,
  FileDown,
  Globe2,
  Mail,
  MousePointerClick,
  Rocket,
  Settings,
  TriangleAlert,
  MessageSquare,
} from 'lucide-react';
import garimMoonImage from '../../assets/images/garim_moon.png';
import garimLogo from '../../assets/icons/GARIM.png';
import logoIcon from '../../assets/icons/logo.png';
import packIcon from '../../assets/images/pac.png';
import { useSupportSettingsStore } from '../../stores/supportSettingsStore.js';

const quickSteps = [
  [FileDown, '팩 파일 다운로드', '최신 팩 파일을 다운로드합니다.'],
  [MousePointerClick, '파일 실행', '다운로드한 팩 파일을 실행합니다.'],
  [CircleCheck, '적용 확인', '설정 또는 정책 적용 상태를 확인합니다.'],
  [Rocket, '사용 시작', '적용이 완료된 후 서비스를 이용합니다.'],
];

const applySteps = [
  [Download, '1. 파일 다운로드', '상단의 팩 파일 다운로드 버튼을 클릭해 파일을 저장합니다.'],
  [MousePointerClick, '2. 파일 실행', '다운로드한 팩 파일을 실행합니다. 보안 경고가 표시되면 관리자의 안내에 따라 진행합니다.'],
  [Settings, '3. 적용 진행', '실행 화면에서 적용 대상과 설정 정보를 확인한 뒤 적용을 진행합니다.'],
  [Check, '4. 적용 완료 확인', '적용이 완료되면 정상 적용 여부를 확인합니다.'],
];

const checklist = [
  '관리자에게 안내받은 팩 파일인지 확인해 주세요.',
  '이미 적용 중인 설정이 있다면 중복 적용 여부를 확인해 주세요.',
  '신뢰할 수 있는 환경에서 실행해 주세요.',
  '실행 중 브라우저나 프로그램을 종료하지 마세요.',
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
      className={`scroll-mt-28 rounded-[18px] border border-[#E5EAF3] bg-white shadow-[0_16px_42px_rgba(15,23,42,0.07)] ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}

function StepCard({ icon: Icon, number, title, description }) {
  return (
    <div className="relative flex min-h-[13.5rem] flex-col items-center justify-center rounded-[14px] border border-[#E3E8F2] bg-white px-6 py-6 text-center shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#5B39D6] text-sm font-black text-white">
        {number}
      </span>
      <Icon className="h-12 w-12 text-[#5B39D6]" />
      <h3 className="mt-5 text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-[#526078]">{description}</p>
    </div>
  );
}

function ApplyCard({ icon: Icon, title, description }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E3E8F2] bg-white">
      <div className="flex h-40 items-center justify-center bg-[linear-gradient(180deg,#F8FAFF_0%,#F1F5FB_100%)] text-[#5B39D6]">
        <Icon className="h-16 w-16" />
      </div>
      <div className="px-5 py-5">
        <h3 className="text-base font-black text-slate-900">{title}</h3>
        <p className="mt-3 text-sm font-medium leading-6 text-[#526078]">{description}</p>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  const template = useSupportSettingsStore(state => state.template);

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
        className="relative flex min-h-[25rem] items-center justify-center overflow-hidden bg-[#080B28] bg-cover bg-center px-6 text-white"
        style={{ backgroundImage: `url(${garimMoonImage})` }}
      >
        <div className="absolute inset-0 bg-black/18" />
        <div className="relative z-10 mx-auto max-w-[820px] text-center">
          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight tracking-[-0.02em]">
          운영지원
          </h1>
          <p className="mx-auto mt-6 max-w-[42rem] text-xl font-semibold leading-8 text-white/88">
          GARIM 적용에 필요한 팩 파일을 다운로드하고 실행 및 적용 방법을 확인해 주세요.
          </p>
          <button
            type="button"
            className="mt-9 inline-flex h-16 items-center justify-center gap-3 rounded-xl border border-[#6D4CFF] bg-[#5B39D6] px-12 text-lg font-black text-white shadow-[0_18px_36px_rgba(91,57,214,0.34)] transition hover:bg-[#4C2FC0]"
          >
            <Download className="h-6 w-6" />
            팩 파일 다운로드
          </button>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-8 py-10">
        <section id="guide">
          <div>
            <h2 className="text-2xl font-black text-slate-900">빠른 시작</h2>
            <p className="mt-3 text-base font-semibold leading-7 text-[#526078]">
              4단계만 따라하면 쉽게 적용할 수 있어요.
            </p>
          </div>
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

        <Section id="pack-download" className="p-8">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-900">팩 파일 다운로드</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-[#526078]">
              GARIM 적용에 필요한 최신 팩 파일을 다운로드하세요. <br />관리자가 안내한 환경에 맞는 파일을 선택해 실행해 주세요.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-[#DDE4EF] bg-white p-6">
            <div className="grid gap-6 lg:grid-cols-[10rem_1fr_auto] lg:items-center">
              <img src={packIcon} alt="" className="h-40 w-40 object-contain" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-3xl font-black tracking-[-0.04em] text-slate-900">GARIM Pack</h3>
                  <span className="rounded-md border border-[#E3E8F2] bg-white px-3 py-1 text-xs font-black text-[#526078]">
                    최신 버전
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold text-[#64728C]">
                  <span>버전 v1.2.0</span>
                  <span>업데이트 2026.05.20</span>
                  <span>파일 형식 .pack</span>
                  <span>크기 85.4MB</span>
                </div>
                <p className="mt-6 text-base font-semibold text-[#526078]">
                  GARIM 정책 및 환경 설정 적용을 위한 팩 파일입니다.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-4 lg:min-w-[14rem]">
                <button
                  type="button"
                  className="inline-flex h-16 items-center justify-center gap-3 rounded-xl border border-[#5B39D6] bg-[#5B39D6] px-8 text-lg font-black text-white shadow-[0_14px_30px_rgba(91,57,214,0.24)] transition hover:bg-[#4C2FC0]"
                >
                  <Download className="h-5 w-5" />
                  팩 파일 다운로드
                </button>
                <span className="text-center text-base font-black text-[#526078]">85.4MB</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center rounded-lg border border-[#E3E8F2] bg-[#FAFBFF] px-5 py-4 text-sm font-semibold text-[#526078]">
            다운로드가 시작되지 않는다면?
            <button type="button" className="mx-1 font-black text-[#5B39D6]">
              여기
            </button>
            를 클릭하여 다시 시도해 주세요.
          </div>
        </Section>

        <Section id="apply" className="p-8">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-900">실행 및 적용 방법</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-[#526078]">
              다운로드한 팩 파일을 실행한 뒤 안내에 따라 GARIM 설정을 적용합니다.
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {applySteps.map(([Icon, title, description]) => (
              <ApplyCard key={title} icon={Icon} title={title} description={description} />
            ))}
          </div>
        </Section>

        <Section className="p-8">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-900">적용 전 확인사항</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-[#526078]">
              팩 파일을 실행하기 전에 아래 내용을 확인해 주세요.
            </p>
          </div>
          <div className="mt-8 grid gap-5 rounded-xl border border-[#E3E8F2] bg-[#FAFBFF] p-6 md:grid-cols-2">
            {checklist.map(item => (
              <div key={item} className="flex items-start gap-3 text-base font-bold leading-7 text-[#344054]">
                <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-[#5B39D6]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section className="p-8">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-900">적용 후 확인 방법</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-[#526078]">
              적용이 완료되면 아래 항목을 확인해 주세요.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {verifyItems.map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-4 border-l border-[#E3E8F2] px-5">
                <Icon className="h-11 w-11 shrink-0 text-[#5B39D6]" />
                <p className="text-base font-bold leading-7 text-[#344054]">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" className="p-8">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-900">문제가 발생했나요?</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-[#526078]">
              팩 파일 다운로드, 실행 또는 적용 중 문제가 발생하면 관리자에게 문의해 주세요.
            </p>
          </div>
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
