import {
  Apple,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Rocket,
} from 'lucide-react';
import SectionCard from '../../components/SectionCard.jsx';
import {
  monitoringTableCellClass,
  monitoringTableClass,
  monitoringTableHeadClass,
  monitoringTableHeaderCellClass,
  monitoringTableHeaderRowClass,
  monitoringTableRowClass,
  monitoringTableSurfaceClass,
} from '../../components/monitoring/monitoringTableStyles.js';
import PageLayout from '../../layout/PageLayout.jsx';
import garimMoonImage from '../../assets/images/garim_moon.png';

const installSteps = [
  ['설치 파일 다운로드', '운영 환경에 맞는 설치 파일을 다운로드하세요.', '완료'],
  ['에이전트 설치', '다운로드한 파일을 실행하여 설치를 진행하세요.', '진행 중'],
  ['가이드 확인', '설치 후 운영 가이드를 통해 설정을 완료하세요.', '대기'],
  ['시작하기', 'GARIM을 실행하고 서비스를 이용하세요.', '대기'],
];

const quickSteps = [
  [Download, '설치 파일 다운로드', '운영 환경에 맞는 파일을 다운로드합니다.'],
  [Box, '에이전트 설치', '파일을 실행하여 설치를 진행합니다.'],
  [BookOpen, '가이드 확인', '운영 가이드를 확인하고 설정합니다.'],
  [Rocket, '시작하기', 'GARIM을 실행하고 이용을 시작하세요.'],
];

const guides = [
  ['에이전트 설치 방법', 'Windows, macOS 설치 절차 안내', '2026-05-20'],
  ['로그인 및 초기 설정', '최초 로그인 및 기본 설정 방법', '2026-05-19'],
  ['정책 설정 가이드', '보안 정책 생성 및 배포 방법', '2026-05-18'],
  ['문제 해결 가이드', '일반적인 오류 및 해결 방법', '2026-05-16'],
];

const downloads = [
  ['GARIM 에이전트 (Windows)', 'Windows', 'v1.2.0', '85.4 MB'],
  ['GARIM 에이전트 (macOS)', 'macOS', 'v1.2.0', '92.1 MB'],
  ['사용자 매뉴얼 (PDF)', 'PDF', 'v1.2.0', '12.6 MB'],
  ['빠른 시작 가이드 (PDF)', 'PDF', 'v1.2.0', '2.4 MB'],
];

const faqs = [
  '에이전트 설치가 실패하는 경우 어떻게 하나요?',
  '로그인 정보를 분실했을 때 어떻게 하나요?',
  '정책 변경 사항은 언제 적용되나요?',
  'macOS에서 보안 권한 설정 방법은 무엇인가요?',
  '오프라인 환경에서도 사용 가능한가요?',
];

function StatusLabel({ status }) {
  const className =
    status === '완료'
      ? 'text-[#86EFAC]'
      : status === '진행 중'
        ? 'text-[#A78BFA]'
        : 'text-white/55';

  return <span className={`text-xs font-bold ${className}`}>{status}</span>;
}

function QuickCard({ icon: Icon, title, description, action }) {
  return (
    <SectionCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F1EDFF] text-[#5B39D6]">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#4338CA]"
          >
            {action}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function FileIcon({ type }) {
  if (type === 'Windows') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EAF2FF] text-xs font-black text-[#2563EB]">
        W
      </span>
    );
  }

  if (type === 'macOS') {
    return <Apple className="h-6 w-6 text-slate-900" />;
  }

  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FEE2E2] text-[10px] font-black text-[#DC2626]">
      PDF
    </span>
  );
}

function PanelHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {action ? (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#4338CA]"
        >
          {action}
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export default function DownloadPage() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pb-3">
        <section
          className="relative min-h-[16rem] overflow-hidden rounded-[22px] border border-[#20164A] bg-[#080B28] bg-cover bg-center px-7 py-7 text-white shadow-[0_18px_50px_rgba(35,19,90,0.18)] lg:px-9"
          style={{ backgroundImage: `url(${garimMoonImage})` }}
        >
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_0.48fr]">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit rounded-full bg-white/12 px-4 py-1 text-xs font-bold text-[#D8CCFF]">
                AI AGENT SUPPORT
              </span>
              <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-black leading-none tracking-[-0.05em]">
                운영지원
              </h1>
              <p className="mt-5 max-w-[34rem] text-base font-medium leading-7 text-white/84">
                GARIM 에이전트와 설치 파일, 운영 가이드를 다운로드하고 쉽고 빠르게 시작해 보세요.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#6D4CFF] bg-[#5B39D6] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(91,57,214,0.32)] transition hover:bg-[#4C2FC0]"
                >
                  <Download className="h-4 w-4" />
                  에이전트 다운로드
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  <BookOpen className="h-4 w-4" />
                  설치 가이드 보기
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-[#171331]/82 p-5 backdrop-blur">
                <h2 className="text-sm font-bold text-white">설치 진행 상태</h2>
                <div className="mt-4 space-y-4">
                  {installSteps.map(([title, description, status], index) => (
                    <div key={title} className="grid grid-cols-[1.6rem_1fr_auto] gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${
                          status === '완료'
                            ? 'border-[#8B5CF6] bg-[#2F216C] text-[#A78BFA]'
                            : status === '진행 중'
                              ? 'border-[#A78BFA] bg-[#7C3AED] text-white'
                              : 'border-white/25 text-white/55'
                        }`}
                      >
                        {status === '완료' ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
                      </div>
                      <StatusLabel status={status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionCard className="p-5">
          <div className="grid gap-5 lg:grid-cols-4">
            {quickSteps.map(([Icon, title, description], index) => (
              <div key={title} className="relative flex min-w-0 items-center gap-4">
                <div className="absolute -top-2 left-12 flex h-6 w-6 items-center justify-center rounded-full bg-[#5B39D6] text-xs font-bold text-white shadow-[0_0_0_5px_rgba(91,57,214,0.12)]">
                  {index + 1}
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#DED9FF] bg-[#F4F1FF] text-[#5B39D6]">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-5 xl:grid-cols-3">
          <QuickCard
            icon={BookOpen}
            title="사용 가이드"
            description="설치, 설정, 운영 방법을 단계별로 안내합니다."
            action="가이드 바로가기"
          />
          <QuickCard
            icon={Download}
            title="설치 파일 다운로드"
            description="운영 체제에 맞는 최신 설치 파일을 다운로드하세요."
            action="다운로드 선택"
          />
          <QuickCard
            icon={HelpCircle}
            title="FAQ / 지원"
            description="자주 묻는 질문과 추가 지원 자료를 확인하세요."
            action="지원 센터 바로가기"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <SectionCard className="overflow-hidden">
            <PanelHeader title="사용 가이드" action="전체 보기" />
            <div className="divide-y divide-slate-200">
              {guides.map(([title, description, updatedAt]) => (
                <div
                  key={title}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-5 py-4 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">{title}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{description}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{updatedAt}</span>
                  <ExternalLink className="h-4 w-4 text-[#4338CA]" />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard className="overflow-hidden">
            <PanelHeader title="다운로드" />
            <div className={monitoringTableSurfaceClass}>
              <table className={`${monitoringTableClass} text-left`}>
                <thead className={monitoringTableHeadClass}>
                  <tr className={monitoringTableHeaderRowClass}>
                    <th className={`${monitoringTableHeaderCellClass} w-[42%] px-5`}>파일명</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[18%]`}>버전</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[18%]`}>크기</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[22%]`}>다운로드</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map(([name, type, version, size], index) => (
                    <tr
                      key={name}
                      className={monitoringTableRowClass({ striped: index % 2 === 1 })}
                    >
                      <td className={monitoringTableCellClass(index, 'px-5')}>
                        <div className="flex items-center gap-3">
                          <FileIcon type={type} />
                          <span className="truncate font-bold text-slate-800">{name}</span>
                        </div>
                      </td>
                      <td className={monitoringTableCellClass(index)}>{version}</td>
                      <td className={monitoringTableCellClass(index)}>{size}</td>
                      <td className={monitoringTableCellClass(index)}>
                        <button
                          type="button"
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-[#DED9FF] bg-white px-3 text-xs font-bold text-[#4338CA] transition hover:bg-[#F5F3FF]"
                        >
                          다운로드
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard className="overflow-hidden">
            <PanelHeader title="자주 묻는 질문" action="전체 보기" />
            <div className="divide-y divide-slate-200">
              {faqs.map(question => (
                <button
                  type="button"
                  key={question}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <span>{question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </PageLayout>
  );
}
