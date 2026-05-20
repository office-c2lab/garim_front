import { useEffect, useMemo, useState } from 'react';
import { CircleHelp, Download, Info, Plus, Search } from 'lucide-react';

import { MonitoringDropdown } from '../../components/monitoring/MonitoringListComponents.jsx';
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

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function createPolicyDraft(policy) {
  return {
    ...policy,
    services: [...policy.services],
    detects: [...policy.detects],
    exceptions: [...policy.exceptions],
    alerts: { ...policy.alerts },
  };
}

function createEmptyPolicy() {
  const timestamp = Date.now();

  return {
    id: `pol_${timestamp}`,
    name: '새 정책',
    category: '개인정보',
    services: ['ChatGPT'],
    serviceLabel: 'ChatGPT',
    action: '마스킹 후 전송',
    status: '사용',
    updatedAt: '2026-05-20 15:30',
    description: '',
    priority: 10,
    detects: [],
    exceptions: [],
    handling: '마스킹',
    alerts: {
      admin: true,
      log: true,
      warning: true,
    },
  };
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
      {services?.map(service => <span key={service}>{service}</span>) ?? fallback}
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

function ToggleRow({ label, description, checked, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-base font-semibold text-slate-700">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        onClick={onToggle}
        className={joinClasses(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition duration-200 hover:brightness-[1.04]',
          checked
            ? 'border-[#5B4BD7] bg-[#5B4BD7] shadow-[0_8px_18px_rgba(91,75,215,0.28)]'
            : 'border-[#D5CFF5] bg-[#C8BDEB]'
        )}
      >
        <span
          className={joinClasses(
            'h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(15,18,20,0.18)] transition duration-200',
            checked ? 'translate-x-[1.35rem]' : 'translate-x-[0.15rem]'
          )}
        />
      </button>
    </div>
  );
}

export default function PolicyPage() {
  const [policyList, setPolicyList] = useState(policies);
  const [selectedId, setSelectedId] = useState(policies[0].id);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftPolicy, setDraftPolicy] = useState(() => createPolicyDraft(policies[0]));

  const filteredPolicies = useMemo(() => {
    return policyList.filter(policy => {
      const matchesCategory =
        selectedCategory === '전체 분류' ? true : policy.category === selectedCategory;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = normalizedQuery
        ? policy.name.toLowerCase().includes(normalizedQuery)
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [policyList, searchQuery, selectedCategory]);

  const selectedPolicy = policyList.find(policy => policy.id === selectedId) ?? policyList[0];

  useEffect(() => {
    if (!selectedPolicy) return;
    setDraftPolicy(createPolicyDraft(selectedPolicy));
  }, [selectedPolicy]);

  useEffect(() => {
    if (!filteredPolicies.length) return;
    const hasSelectedPolicy = filteredPolicies.some(policy => policy.id === selectedId);
    if (!hasSelectedPolicy) {
      setSelectedId(filteredPolicies[0].id);
    }
  }, [filteredPolicies, selectedId]);

  const handleDownloadTemplate = () => {
    const template = [
      '정책명,분류,적용 서비스,조치 방식,사용 여부,우선순위',
      '새 정책,개인정보,ChatGPT,마스킹,사용,10',
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'policy-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreatePolicy = () => {
    const newPolicy = createEmptyPolicy();
    setPolicyList(current => [newPolicy, ...current]);
    setSelectedId(newPolicy.id);
    setSearchInput('');
    setSearchQuery('');
    setSelectedCategory('전체 분류');
  };

  const handleClonePolicy = () => {
    if (!selectedPolicy) return;
    const clonedPolicy = createPolicyDraft(selectedPolicy);
    clonedPolicy.id = `pol_${Date.now()}`;
    clonedPolicy.name = `${selectedPolicy.name} 복제본`;
    clonedPolicy.updatedAt = '2026-05-20 15:30';
    setPolicyList(current => [clonedPolicy, ...current]);
    setSelectedId(clonedPolicy.id);
  };

  const handleDeletePolicy = () => {
    if (!selectedPolicy) return;
    const nextPolicies = policyList.filter(policy => policy.id !== selectedPolicy.id);
    setPolicyList(nextPolicies);
    if (nextPolicies.length) {
      setSelectedId(nextPolicies[0].id);
    }
  };

  const handleSavePolicy = () => {
    if (!draftPolicy) return;
    const normalizedServices = draftPolicy.services
      .map(service => service.trim())
      .filter(Boolean);
    const savedPolicy = {
      ...draftPolicy,
      services: normalizedServices,
      serviceLabel: normalizedServices.join(', '),
      action:
        draftPolicy.handling === '허용'
          ? '허용'
          : draftPolicy.handling === '마스킹'
            ? '마스킹 후 전송'
            : draftPolicy.handling,
      updatedAt: '2026-05-20 15:30',
    };

    setPolicyList(current =>
      current.map(policy => (policy.id === savedPolicy.id ? savedPolicy : policy))
    );
  };

  const handleCancelEdit = () => {
    if (!selectedPolicy) return;
    setDraftPolicy(createPolicyDraft(selectedPolicy));
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pb-3">
        <div className="flex flex-col gap-4 pt-1">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row">
              <MonitoringDropdown
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                ariaLabel="전체 분류"
                widthClass="w-full lg:w-[12rem] lg:shrink-0"
                triggerClassName="h-12 rounded-xl border-slate-200 bg-white shadow-none"
              />

              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                    placeholder="정책명 검색"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                  />
                  <Search className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </label>
                <button
                  type="button"
                  onClick={() => setSearchQuery(searchInput)}
                  className="inline-flex h-12 min-w-[6rem] items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
                >
                  검색
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCreatePolicy}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
              >
                <Plus className="h-4 w-4" />새 정책 추가
              </button>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#4338CA] transition hover:border-[#C7D2FE] hover:bg-[#F8FAFF]"
              >
                <Download className="h-4 w-4" />
                정책 템플릿 다운로드
              </button>
            </div>
          </div>
        </div>

        <SectionCard className="overflow-hidden">
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
                {filteredPolicies.map(policy => {
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
                      <td className="px-4 py-4 text-[15px] font-semibold text-slate-700">
                        {policy.category}
                      </td>
                      <td className="px-4 py-4">
                        <ServiceLabel services={policy.services} fallback={policy.serviceLabel} />
                      </td>
                      <td className="px-4 py-4 text-[15px] font-semibold text-slate-700">
                        {policy.action}
                      </td>
                      <td className="px-4 py-4 text-[15px] font-semibold text-slate-600">
                        {policy.status}
                      </td>
                      <td className="px-4 py-4 text-[15px] text-slate-600">{policy.updatedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filteredPolicies.length ? (
              <div className="px-6 py-12 text-center text-sm text-slate-400">
                검색 조건에 맞는 정책이 없습니다.
              </div>
            ) : null}
          </div>
        </SectionCard>

        {selectedPolicy ? (
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
                  onClick={handleClonePolicy}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  정책 복제
                </button>
                <button
                  type="button"
                  onClick={handleDeletePolicy}
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
                    value={draftPolicy.name}
                    onChange={event =>
                      setDraftPolicy(current => ({ ...current, name: event.target.value }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                  />
                </DetailInput>

                <DetailInput label="적용 서비스" required>
                  <input
                    type="text"
                    value={draftPolicy.services.join(', ')}
                    onChange={event =>
                      setDraftPolicy(current => ({
                        ...current,
                        services: event.target.value
                          .split(',')
                          .map(service => service.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                  />
                </DetailInput>

                <DetailInput label="설명">
                  <textarea
                    value={draftPolicy.description}
                    onChange={event =>
                      setDraftPolicy(current => ({ ...current, description: event.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none"
                  />
                </DetailInput>

                <DetailInput label="우선순위" hint="숫자가 낮을수록 우선순위가 높습니다.">
                  <div className="relative w-full max-w-[9rem]">
                    <input
                      type="number"
                      value={draftPolicy.priority}
                      onChange={event =>
                        setDraftPolicy(current => ({
                          ...current,
                          priority: Number(event.target.value) || 0,
                        }))
                      }
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
                  const checked = draftPolicy.detects.includes(item);
                  const muted = draftPolicy.exceptions.includes(item);

                  return (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setDraftPolicy(current => ({
                            ...current,
                            detects: checked
                              ? current.detects.filter(detect => detect !== item)
                              : [...current.detects, item],
                          }))
                        }
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
                      checked={draftPolicy.handling === option}
                      onChange={() =>
                        setDraftPolicy(current => ({
                          ...current,
                          handling: option,
                        }))
                      }
                      className="h-4 w-4 accent-[#4338CA]"
                    />
                    {option}
                  </label>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-[#D9D6FE] bg-[#F5F3FF] px-4 py-3 text-sm leading-6 text-[#4338CA]">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{getActionLabel(draftPolicy.handling)}</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <h3 className="mb-6 text-base font-bold text-slate-900">정책 운영 설정</h3>

              <div className="space-y-6">
                <ToggleRow
                  label="정책 사용 여부"
                  description="선택한 정책의 활성화 상태를 확인합니다."
                  checked={draftPolicy.status === '사용'}
                  onToggle={() =>
                    setDraftPolicy(current => ({
                      ...current,
                      status: current.status === '사용' ? '미사용' : '사용',
                    }))
                  }
                />
                <ToggleRow
                  label="관리자 알림"
                  description="정책 위반 시 관리자에게 알림을 전송합니다."
                  checked={draftPolicy.alerts.admin}
                  onToggle={() =>
                    setDraftPolicy(current => ({
                      ...current,
                      alerts: { ...current.alerts, admin: !current.alerts.admin },
                    }))
                  }
                />
                <ToggleRow
                  label="감사 로그 저장"
                  description="정책 위반 내역을 감사 로그로 저장합니다."
                  checked={draftPolicy.alerts.log}
                  onToggle={() =>
                    setDraftPolicy(current => ({
                      ...current,
                      alerts: { ...current.alerts, log: !current.alerts.log },
                    }))
                  }
                />
                <ToggleRow
                  label="사용자 경고 메시지"
                  description="사용자에게 정책 위반 사유를 안내합니다."
                  checked={draftPolicy.alerts.warning}
                  onToggle={() =>
                    setDraftPolicy(current => ({
                      ...current,
                      alerts: { ...current.alerts, warning: !current.alerts.warning },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSavePolicy}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
            >
              저장
            </button>
          </div>
        </SectionCard>
        ) : null}
      </div>
    </PageLayout>
  );
}
