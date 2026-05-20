import { useState } from 'react';
import { Bot, Braces, CircleHelp, Download, Globe, Info, Plus, Search, Shield } from 'lucide-react';

import PageLayout from '../../layout/PageLayout.jsx';

const policies = [
  {
    id: 'pol_20251208_0001',
    name: '개인정보 보호 정책',
    category: '개인정보',
    services: ['ChatGPT'],
    serviceLabel: 'ChatGPT',
    action: '마스킹 후 전송',
    status: '사용',
    updatedAt: '2025-12-08 13:45',
    description: '사용자 입력 및 첨부에 포함된 개인정보를 탐지하여 마스킹 처리 후 전송합니다.',
    priority: 10,
    detects: [
      '이메일',
      '전화번호',
      '주민등록번호',
      '계좌번호',
      'API Key',
      'Access Token',
      '계약/견적 정보',
    ],
    exceptions: [],
    handling: '마스킹',
    alerts: {
      admin: true,
      log: true,
      warning: true,
    },
  },
  {
    id: 'pol_20251208_0002',
    name: '프롬프트 인젝션 방어 정책',
    category: '보안',
    services: ['전체 서비스'],
    serviceLabel: '전체 서비스',
    action: '차단',
    status: '사용',
    updatedAt: '2025-12-08 10:22',
    description: '시스템 프롬프트 우회, 권한 상승, 규칙 무시 패턴을 탐지해 즉시 차단합니다.',
    priority: 8,
    detects: ['시스템 프롬프트 요청', '인코딩 우회'],
    exceptions: ['역할 우회'],
    handling: '차단',
    alerts: {
      admin: true,
      log: true,
      warning: false,
    },
  },
  {
    id: 'pol_20251207_0003',
    name: '기밀정보 차단 정책',
    category: '기밀정보',
    services: ['사내 AI 챗봇'],
    serviceLabel: '사내 AI 챗봇',
    action: '승인 필요',
    status: '사용',
    updatedAt: '2025-12-07 16:18',
    description: '프로젝트 코드명, 재무 수치, 계약서 초안 등 기밀정보는 관리자 승인 후 처리합니다.',
    priority: 7,
    detects: ['계약/견적 정보'],
    exceptions: [],
    handling: '승인 필요',
    alerts: {
      admin: true,
      log: true,
      warning: true,
    },
  },
  {
    id: 'pol_20251205_0004',
    name: '파일 업로드 검사 정책',
    category: '파일 검사',
    services: ['Claude'],
    serviceLabel: 'Claude',
    action: '차단',
    status: '미사용',
    updatedAt: '2025-12-05 09:41',
    description: '업로드 파일의 민감정보, 실행 코드, 악성 패턴을 검사한 뒤 이상 시 차단합니다.',
    priority: 5,
    detects: ['API Key'],
    exceptions: [],
    handling: '차단',
    alerts: {
      admin: false,
      log: true,
      warning: false,
    },
  },
  {
    id: 'pol_20251204_0005',
    name: '계약/견적 정보 보호 정책',
    category: '기밀정보',
    services: ['전체 서비스'],
    serviceLabel: '전체 서비스',
    action: '마스킹 후 전송',
    status: '사용',
    updatedAt: '2025-12-04 14:03',
    description: '견적 단가, 계약 조건, 미공개 협상 내용은 항목별 마스킹 후 전달합니다.',
    priority: 6,
    detects: ['계약/견적 정보'],
    exceptions: [],
    handling: '마스킹',
    alerts: {
      admin: true,
      log: false,
      warning: true,
    },
  },
  {
    id: 'pol_20251203_0006',
    name: 'API 키 유출 방지 정책',
    category: '보안',
    services: ['개발자 도구', 'Claude'],
    serviceLabel: '개발자 도구, Claude',
    action: '차단',
    status: '사용',
    updatedAt: '2025-12-03 11:27',
    description: '토큰, 키, 비밀값 패턴을 탐지해 외부 서비스 전송을 차단합니다.',
    priority: 9,
    detects: ['API Key', 'Access Token'],
    exceptions: [],
    handling: '차단',
    alerts: {
      admin: true,
      log: true,
      warning: true,
    },
  },
];

const categoryOptions = ['전체 분류', '개인정보', '보안', '기밀정보', '파일 검사'];
const detectionItems = [
  '이메일',
  '전화번호',
  '주민등록번호',
  '계좌번호',
  'API Key',
  'Access Token',
  '계약/견적 정보',
  '시스템 프롬프트 요청',
  '역할 우회',
  '인코딩 우회',
];
const serviceIconMap = {
  ChatGPT: Bot,
  Claude: Bot,
  '사내 AI 챗봇': Bot,
  '전체 서비스': Globe,
  '개발자 도구': Braces,
};

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getCategoryTone(category) {
  switch (category) {
    case '개인정보':
      return 'border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]';
    case '보안':
      return 'border-[#DDD6FE] bg-[#F5F3FF] text-[#5B21B6]';
    case '기밀정보':
      return 'border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]';
    case '파일 검사':
      return 'border-[#BAE6FD] bg-[#ECFEFF] text-[#0F766E]';
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700';
  }
}

function getStatusTone(status) {
  return status === '사용'
    ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
    : 'border-slate-200 bg-slate-100 text-slate-500';
}

function getActionLabel(action) {
  if (action === '마스킹') return '탐지된 항목은 마스킹 처리 후 대상 서비스로 전송됩니다.';
  if (action === '승인 필요') return '탐지된 요청은 관리자 승인 대기열로 이동합니다.';
  if (action === '차단') return '탐지된 요청은 즉시 차단되며 사용자에게 사유가 안내됩니다.';
  return '허용된 요청만 대상 서비스로 전송됩니다.';
}

function ServiceLabel({ services, fallback }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-slate-700">
      {services?.map(service => {
        const Icon = serviceIconMap[service] ?? Shield;
        return (
          <span key={service} className="inline-flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-slate-500" strokeWidth={2} />
            {service}
          </span>
        );
      }) ?? fallback}
    </div>
  );
}

function SectionCard({ children, className = '' }) {
  return (
    <section
      className={joinClasses(
        'rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]',
        className
      )}
    >
      {children}
    </section>
  );
}

function DetailInput({ label, required = false, children, hint }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="ml-1 text-[#EF4444]">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

function ToggleRow({ label, description, checked }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-base font-semibold text-slate-700">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        className={joinClasses(
          'relative h-7 w-12 rounded-full border transition',
          checked ? 'border-[#4338CA] bg-[#4338CA]' : 'border-slate-300 bg-slate-200'
        )}
      >
        <span
          className={joinClasses(
            'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition',
            checked ? 'left-6' : 'left-1'
          )}
        />
      </button>
    </div>
  );
}

export default function PolicyPage() {
  const [selectedId, setSelectedId] = useState(policies[0].id);
  const selectedPolicy = policies.find(policy => policy.id === selectedId) ?? policies[0];

  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pb-3">
        <div className="flex flex-col gap-5 pt-1 xl:flex-row xl:items-center xl:justify-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3]"
            >
              <Plus className="h-4 w-4" />새 정책 추가
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#4338CA] transition hover:border-[#C7D2FE] hover:bg-[#F8FAFF]"
            >
              <Download className="h-4 w-4" />
              정책 템플릿 다운로드
            </button>
          </div>
        </div>

        <SectionCard className="overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative w-full lg:max-w-[10rem]">
                <select className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-600 outline-none transition focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]">
                  {categoryOptions.map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  ▾
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <input
                    type="text"
                    placeholder="정책명 검색"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                  />
                  <Search className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </label>
                <button
                  type="button"
                  className="inline-flex h-12 min-w-[6rem] items-center justify-center rounded-xl bg-[#4338CA] px-5 text-sm font-semibold text-white transition hover:bg-[#3730A3]"
                >
                  검색
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full table-fixed">
              <thead className="bg-[#F8FAFC] text-left text-sm font-semibold text-slate-500">
                <tr>
                  <th className="w-12 px-5 py-4 sm:px-6" />
                  <th className="px-4 py-4">정책명</th>
                  <th className="w-36 px-4 py-4">분류</th>
                  <th className="w-60 px-4 py-4">적용 서비스</th>
                  <th className="w-52 px-4 py-4">조치 방식</th>
                  <th className="w-32 px-4 py-4">사용 여부</th>
                  <th className="w-44 px-4 py-4">최종 수정일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {policies.map(policy => {
                  const isSelected = policy.id === selectedId;

                  return (
                    <tr
                      key={policy.id}
                      className={joinClasses(
                        'cursor-pointer transition',
                        isSelected ? 'bg-[#F5F3FF]' : 'bg-white hover:bg-slate-50'
                      )}
                      onClick={() => setSelectedId(policy.id)}
                    >
                      <td className="px-5 py-4 align-middle sm:px-6">
                        <button
                          type="button"
                          aria-label={`${policy.name} 선택`}
                          className={joinClasses(
                            'flex h-5 w-5 items-center justify-center rounded-full border transition',
                            isSelected ? 'border-[#4338CA]' : 'border-slate-300'
                          )}
                        >
                          <span
                            className={joinClasses(
                              'h-2.5 w-2.5 rounded-full transition',
                              isSelected ? 'bg-[#4338CA]' : 'bg-transparent'
                            )}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-[15px] font-semibold text-slate-800">
                        {policy.name}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={joinClasses(
                            'inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold',
                            getCategoryTone(policy.category)
                          )}
                        >
                          {policy.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <ServiceLabel services={policy.services} fallback={policy.serviceLabel} />
                      </td>
                      <td className="px-4 py-4 text-[15px] font-semibold text-slate-700">
                        {policy.action}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={joinClasses(
                            'inline-flex rounded-md border px-3 py-1 text-xs font-semibold',
                            getStatusTone(policy.status)
                          )}
                        >
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[15px] text-slate-600">{policy.updatedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">선택한 정책 상세</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-slate-500">
                정책 ID: {selectedPolicy.id}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  정책 복제
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2]"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-0 xl:grid-cols-[1.1fr_1fr_0.8fr_0.95fr]">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6 xl:border-r xl:border-b-0">
              <div className="space-y-4">
                <DetailInput label="정책명" required>
                  <input
                    type="text"
                    value={selectedPolicy.name}
                    readOnly
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                  />
                </DetailInput>

                <DetailInput label="적용 서비스" required>
                  <div className="flex min-h-11 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700">
                    <ServiceLabel
                      services={selectedPolicy.services}
                      fallback={selectedPolicy.serviceLabel}
                    />
                    <span className="ml-4 text-slate-300">× | ▾</span>
                  </div>
                </DetailInput>

                <DetailInput label="설명">
                  <textarea
                    value={selectedPolicy.description}
                    readOnly
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none"
                  />
                </DetailInput>

                <DetailInput label="우선순위" hint="숫자가 낮을수록 우선순위가 높습니다.">
                  <div className="relative w-full max-w-[9rem]">
                    <input
                      type="number"
                      value={selectedPolicy.priority}
                      readOnly
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                    />
                  </div>
                </DetailInput>
              </div>
            </div>

            <div className="border-b border-slate-200 px-5 py-5 sm:px-6 xl:border-r xl:border-b-0">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">탐지 항목</h3>
                <CircleHelp className="h-4 w-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {detectionItems.map(item => {
                  const checked = selectedPolicy.detects.includes(item);
                  const muted = selectedPolicy.exceptions.includes(item);

                  return (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className={joinClasses(
                          'h-4 w-4 rounded border-slate-300 accent-[#4338CA]',
                          muted ? 'opacity-50' : ''
                        )}
                      />
                      <span className={muted ? 'text-slate-400' : ''}>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-b border-slate-200 px-5 py-5 sm:px-6 xl:border-r xl:border-b-0">
              <h3 className="mb-4 text-base font-bold text-slate-900">조치 방식</h3>

              <div className="space-y-4">
                {['허용', '마스킹', '승인 필요', '차단'].map(option => (
                  <label
                    key={option}
                    className="flex items-center gap-3 text-sm font-medium text-slate-700"
                  >
                    <input
                      type="radio"
                      name="policy-handling"
                      checked={selectedPolicy.handling === option}
                      readOnly
                      className="h-4 w-4 accent-[#4338CA]"
                    />
                    {option}
                  </label>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-[#D9D6FE] bg-[#F5F3FF] px-4 py-3 text-sm leading-6 text-[#4338CA]">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{getActionLabel(selectedPolicy.handling)}</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <h3 className="mb-6 text-base font-bold text-slate-900">알림/로그 설정</h3>

              <div className="space-y-6">
                <ToggleRow
                  label="관리자 알림"
                  description="정책 위반 시 관리자에게 알림을 전송합니다."
                  checked={selectedPolicy.alerts.admin}
                />
                <ToggleRow
                  label="감사 로그 저장"
                  description="정책 위반 내역을 감사 로그로 저장합니다."
                  checked={selectedPolicy.alerts.log}
                />
                <ToggleRow
                  label="사용자 경고 메시지"
                  description="사용자에게 정책 위반 사유를 안내합니다."
                  checked={selectedPolicy.alerts.warning}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#4338CA] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3]"
            >
              저장
            </button>
          </div>
        </SectionCard>
      </div>
    </PageLayout>
  );
}
