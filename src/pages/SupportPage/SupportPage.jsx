import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Link,
  Play,
  Plus,
} from 'lucide-react';
import SectionCard from '../../components/SectionCard.jsx';
import PageLayout from '../../layout/PageLayout.jsx';
import garimMoonImage from '../../assets/images/garim_moon.png';

const guideItems = [
  {
    title: '정책 생성 방법',
    description: '정책 등록 및 적용 절차 안내',
    updatedAt: '2026-05-20',
    status: '게시중',
  },
  {
    title: '모니터링 결과 확인 방법',
    description: '허용/마스킹/차단 결과 확인 방법',
    updatedAt: '2026-05-19',
    status: '게시중',
  },
  {
    title: '사용자/IP 설정 방법',
    description: '사용자 정보 및 IP 설정 수정 방법',
    updatedAt: '2026-05-18',
    status: '게시중',
  },
];

const templateItems = [
  {
    name: '정책 등록 양식',
    type: '정책',
    description: '정책 일괄 등록용 양식',
    updatedAt: '2026-05-20',
  },
  {
    name: '사용자 등록 양식',
    type: '사용자/IP',
    description: 'IP별 사용자 정보 등록용',
    updatedAt: '2026-05-19',
  },
  {
    name: '도메인 등록 양식',
    type: '도메인',
    description: '감시 도메인 등록용',
    updatedAt: '2026-05-18',
  },
];

const deployItems = [
  {
    name: '정책 템플릿 배포',
    source: '정책 등록 양식',
    expireAt: '2026-06-20',
    status: '활성',
  },
  {
    name: '사용자 등록 배포',
    source: '사용자 등록 양식',
    expireAt: '2026-06-10',
    status: '활성',
  },
  {
    name: '운영 가이드 배포',
    source: '정책 생성 방법',
    expireAt: '2026-06-15',
    status: '비활성',
  },
];

const setupSteps = [
  ['시스템 요구사항 확인', '완료'],
  ['설치 파일 준비', '완료'],
  ['에이전트 설치', '진행 중'],
  ['정책 연동 및 배포', '대기'],
];

function StatusBadge({ status }) {
  const className =
    status === '활성' || status === '게시중' || status === '완료'
      ? 'border-[#BDEFD1] bg-[#E8F9EF] text-[#1B9A57]'
      : status === '진행 중'
        ? 'border-[#D8DBFF] bg-[#F4F5FF] text-[#5B39D6]'
        : status === '비활성'
          ? 'border-[#FFC8C8] bg-[#FFF0F0] text-[#EF4444]'
          : 'border-slate-200 bg-slate-50 text-slate-500';

  return (
    <span className={`inline-flex h-6 items-center rounded-md border px-2.5 text-[11px] font-bold ${className}`}>
      {status}
    </span>
  );
}

function SupportActionCard({ icon: Icon, title, description, action }) {
  return (
    <SectionCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F1EDFF] text-[#4338CA]">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
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

function GuideStep({ number, icon: Icon, title, description }) {
  return (
    <div className="relative flex min-w-0 items-center gap-4">
      <div className="absolute -top-2 left-12 flex h-6 w-6 items-center justify-center rounded-full bg-[#5B39D6] text-xs font-bold text-white shadow-[0_0_0_5px_rgba(91,57,214,0.12)]">
        {number}
      </div>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#DED9FF] bg-[#F4F1FF] text-[#5B39D6]">
        <Icon className="h-7 w-7" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function SupportTable({ title, actionLabel, children }) {
  return (
    <SectionCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#4338CA] bg-[#4338CA] px-4 text-xs font-bold text-white transition hover:bg-[#3730A3]"
        >
          {actionLabel === '템플릿 추가' ? <Plus className="h-4 w-4" /> : null}
          {actionLabel}
        </button>
      </div>
      {children}
    </SectionCard>
  );
}

export default function SupportPage() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pb-3">
        <section
          className="relative min-h-[17rem] overflow-hidden rounded-[22px] border border-[#20164A] bg-[#080B28] bg-cover bg-center px-7 py-7 text-white shadow-[0_18px_50px_rgba(35,19,90,0.18)] lg:px-9"
          style={{ backgroundImage: `url(${garimMoonImage})` }}
        >
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit rounded-full bg-white/12 px-4 py-1 text-xs font-bold text-[#D8CCFF]">
                AI AGENT SUPPORT
              </span>
              <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-black leading-none tracking-[-0.05em]">
                운영지원
              </h1>
              <p className="mt-5 max-w-[36rem] text-base font-medium text-white/82">
                GARIM 운영에 필요한 사용 가이드, 템플릿, 다운로드 링크를 제공합니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#6D4CFF] bg-[#5B39D6] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(91,57,214,0.32)] transition hover:bg-[#4C2FC0]"
                >
                  <Download className="h-4 w-4" />
                  다운로드 시작
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  <BookOpen className="h-4 w-4" />
                  가이드 보기
                </button>
              </div>
            </div>

            <div className="hidden items-center justify-end lg:flex">
              <div className="w-full max-w-[22rem] space-y-3">
                {setupSteps.map(([label, status]) => (
                  <div
                    key={label}
                    className="flex h-12 items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white backdrop-blur"
                  >
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2
                        className={`h-4 w-4 ${status === '대기' ? 'text-white/45' : 'text-[#34D399]'}`}
                      />
                      {label}
                    </span>
                    <span className={status === '대기' ? 'text-white/55' : 'text-[#86EFAC]'}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionCard className="p-5">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1fr_1fr_1.1fr]">
            <div>
              <h2 className="text-base font-bold text-slate-900">빠른 시작 가이드</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                3단계로 에이전트를 설치하고 운영을 시작하세요.
              </p>
            </div>
            <GuideStep
              number="1"
              icon={Download}
              title="설치 파일 다운로드"
              description="최신 에이전트 설치 파일을 다운로드합니다."
            />
            <GuideStep
              number="2"
              icon={Play}
              title="에이전트 실행"
              description="다운로드한 파일을 실행하여 설치를 완료합니다."
            />
            <GuideStep
              number="3"
              icon={CheckCircle2}
              title="가이드 확인 및 배포"
              description="사용 가이드를 참고하여 정책을 확인하고 배포하세요."
            />
          </div>
        </SectionCard>

        <div className="grid gap-5 xl:grid-cols-3">
          <SupportActionCard
            icon={BookOpen}
            title="사용 가이드"
            description="운영 절차와 기능 사용법을 단계별로 확인할 수 있습니다."
            action="가이드 보기"
          />
          <SupportActionCard
            icon={FileText}
            title="템플릿 관리"
            description="정책, 사용자, 도메인 등록용 템플릿을 관리합니다."
            action="템플릿 보기"
          />
          <SupportActionCard
            icon={Link}
            title="다운로드 URL 배포"
            description="정책 템플릿용 다운로드 링크를 생성하고 공유합니다."
            action="배포 관리"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <SupportTable title="사용 가이드" actionLabel="전체 가이드 보기">
            <table className="w-full table-fixed text-left">
              <thead className="bg-[#F8FAFC] text-sm font-semibold text-slate-500">
                <tr>
                  <th className="w-[42%] px-5 py-4">제목</th>
                  <th className="w-[25%] px-4 py-4">최종 수정일</th>
                  <th className="w-[20%] px-4 py-4">상태</th>
                  <th className="w-[3rem] px-3 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {guideItems.map(item => (
                  <tr key={item.title} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">{item.description}</p>
                    </td>
                    <td className="px-4 py-4">{item.updatedAt}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-3 py-4">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SupportTable>

          <SupportTable title="템플릿 관리" actionLabel="템플릿 추가">
            <table className="w-full table-fixed text-left">
              <thead className="bg-[#F8FAFC] text-sm font-semibold text-slate-500">
                <tr>
                  <th className="w-[34%] px-5 py-4">템플릿명</th>
                  <th className="w-[20%] px-4 py-4">유형</th>
                  <th className="w-[28%] px-4 py-4">최종 수정일</th>
                  <th className="w-[3rem] px-3 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {templateItems.map(item => (
                  <tr key={item.name} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">{item.description}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold">{item.type}</td>
                    <td className="px-4 py-4">{item.updatedAt}</td>
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-[#4338CA] transition hover:bg-[#F5F3FF]"
                        aria-label={`${item.name} 다운로드`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SupportTable>

          <SupportTable title="다운로드 URL 배포" actionLabel="URL 배포 생성">
            <table className="w-full table-fixed text-left">
              <thead className="bg-[#F8FAFC] text-sm font-semibold text-slate-500">
                <tr>
                  <th className="w-[35%] px-5 py-4">배포명</th>
                  <th className="w-[24%] px-4 py-4">만료일</th>
                  <th className="w-[20%] px-4 py-4">상태</th>
                  <th className="w-[4rem] px-3 py-4">URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {deployItems.map(item => (
                  <tr key={item.name} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">{item.source}</p>
                    </td>
                    <td className="px-4 py-4">{item.expireAt}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-[#4338CA] transition hover:bg-[#F5F3FF]"
                          aria-label={`${item.name} 링크 열기`}
                        >
                          <Link className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                          aria-label={`${item.name} 링크 복사`}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SupportTable>
        </div>
      </div>
    </PageLayout>
  );
}
