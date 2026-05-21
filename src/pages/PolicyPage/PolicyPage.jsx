import { Fragment, useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, CircleHelp, Info, Plus, Search, X } from 'lucide-react';

import { MonitoringDropdown } from '../../components/monitoring/MonitoringListComponents.jsx';
import caretDownIcon from '../../assets/icons/caret_down.svg';
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
    },
  },
];

const categoryOptions = ['전체 분류', '개인정보', '보안', '기밀정보', '파일 검사'];
const policyCategoryOptions = categoryOptions.filter(option => option !== '전체 분류');
const serviceOptions = ['전체 서비스', 'ChatGPT', 'Claude', '사내 AI 챗봇', '개발자 도구'];
const wizardSteps = ['기본 정보', '탐지 항목', '조치 및 운영 설정', '생성 전 확인'];
const wizardStepDescriptions = {
  1: '정책의 기본 기준 정보를 입력하세요.',
  2: '정책이 탐지해야 할 항목을 선택하세요.',
  3: '조치 방식과 운영 옵션을 선택하세요.',
  4: '입력한 내용을 확인하고 정책을 생성하세요.',
};
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
    name: '',
    category: '개인정보',
    services: ['전체 서비스'],
    serviceLabel: '전체 서비스',
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
    },
  };
}

function getActionLabel(action) {
  if (action === '마스킹') return '탐지된 항목은 마스킹 처리 후 대상 서비스로 전송됩니다.';
  if (action === '승인 필요') return '탐지된 요청은 관리자 승인 대기열로 이동합니다.';
  if (action === '차단') return '탐지된 요청은 즉시 차단되며 사용자에게 사유가 안내됩니다.';
  return '허용된 요청만 대상 서비스로 전송됩니다.';
}

function toPolicyRecord(draftPolicy) {
  const normalizedServices = draftPolicy.services.map(service => service.trim()).filter(Boolean);

  return {
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
}

function ServiceLabel({ services, fallback }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-slate-700">
      {services?.map(service => <span key={service}>{service}</span>) ?? fallback}
    </div>
  );
}

function normalizeSelectedServices(services, nextService) {
  const individualServices = serviceOptions.filter(service => service !== '전체 서비스');

  if (nextService === '전체 서비스') {
    return ['전체 서비스'];
  }

  const currentServices = services.filter(service => service !== '전체 서비스');

  if (currentServices.includes(nextService)) {
    const nextServices = currentServices.filter(service => service !== nextService);
    return nextServices.length ? nextServices : ['전체 서비스'];
  }

  const nextServices = [...currentServices, nextService];

  if (nextServices.length === individualServices.length) {
    return ['전체 서비스'];
  }

  return nextServices;
}

function ServiceMultiSelect({ value, onChange, ariaLabel, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (!event.target.closest('[data-service-multi-select-root]')) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedServices = value.length ? value : ['전체 서비스'];
  const triggerLabel = selectedServices.join(', ');

  return (
    <div data-service-multi-select-root className={joinClasses('relative', className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className={joinClasses(
          'flex h-11 w-full cursor-pointer items-center gap-2 rounded-[10px] border border-slate-200 bg-white pr-2 pl-0 text-left text-sm text-slate-700 outline-none transition hover:border-[#C7D2FE] hover:bg-[#F8FAFF] active:border-[#A5B4FC] active:bg-[#EEF2FF]',
          isOpen ? 'border-[#A5B4FC] bg-[#EEF2FF] ring-4 ring-[#E0E7FF]' : ''
        )}
      >
        <span className="min-w-0 flex-1 truncate px-4">{triggerLabel}</span>
        <img
          src={caretDownIcon}
          alt=""
          aria-hidden="true"
          className={joinClasses('h-6 w-6 shrink-0 transition-transform', isOpen ? 'rotate-180' : '')}
        />
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+0.375rem)] left-0 z-40 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {serviceOptions.map(option => {
              const isSelected = selectedServices.includes(option);

              return (
                <label
                  key={option}
                  className={joinClasses(
                    'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                    isSelected ? 'bg-[#F5F3FF] text-[#4338CA]' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onChange(normalizeSelectedServices(selectedServices, option))}
                    className="h-4 w-4 rounded border-slate-300 accent-[#4338CA]"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
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

function StatusToggleIndicator({ checked, ariaLabel }) {
  return (
    <span
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={joinClasses(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition duration-200',
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
    </span>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-6 py-4">
      {wizardSteps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isComplete = currentStep > stepNumber;

        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={joinClasses(
                  'flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold',
                  isActive || isComplete
                    ? 'bg-[#4F46E5] text-white'
                    : 'bg-slate-100 text-slate-400'
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </span>
              <span
                className={joinClasses(
                  'text-sm font-semibold',
                  isActive ? 'text-[#4338CA]' : isComplete ? 'text-slate-700' : 'text-slate-400'
                )}
              >
                {label}
              </span>
            </div>
            {index < wizardSteps.length - 1 ? (
              <span className="hidden h-px w-6 bg-slate-200 sm:block" aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PolicyDetailPanel({
  draftPolicy,
  handleDeletePolicy,
  handleCancelEdit,
  handleSavePolicy,
  setDraftPolicy,
}) {
  return (
    <div className="overflow-hidden bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">정책 상세 설정</h2>
          <p className="mt-1 text-sm text-slate-400">
            선택한 정책의 세부 정보를 편집하고 구성을 할 수 있습니다.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDeletePolicy}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2]"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1.05fr_1.1fr_0.82fr_0.95fr]">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6 xl:border-r xl:border-b-0">
          <h3 className="mb-4 text-base font-bold text-slate-900">기본 정보</h3>
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

            <DetailInput label="분류" required>
              <MonitoringDropdown
                value={draftPolicy.category}
                onChange={value => setDraftPolicy(current => ({ ...current, category: value }))}
                options={policyCategoryOptions}
                ariaLabel="정책 분류 수정"
                widthClass="w-full"
                triggerClassName="h-11 rounded-lg border-slate-200 bg-white shadow-none"
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
          <h3 className="mb-4 text-base font-bold text-slate-900">적용 서비스 및 탐지 항목</h3>

          <DetailInput label="적용 서비스" required>
            <ServiceMultiSelect
              value={draftPolicy.services}
              onChange={value =>
                setDraftPolicy(current => ({
                  ...current,
                  services: value,
                  serviceLabel: value.join(', '),
                }))
              }
              ariaLabel="적용 서비스 수정"
              className="mb-5"
            />
          </DetailInput>

          <div className="mb-4 flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900">탐지 항목</h4>
            <CircleHelp className="h-4 w-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {detectionItems.map(item => {
              const checked = draftPolicy.detects.includes(item);
              const muted = draftPolicy.exceptions.includes(item);

              return (
                <label key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700">
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
              <label key={option} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="policy-handling"
                  checked={draftPolicy.handling === option}
                  onChange={() => setDraftPolicy(current => ({ ...current, handling: option }))}
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
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-5 sm:px-6">
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
    </div>
  );
}

export default function PolicyPage() {
  const [policyList, setPolicyList] = useState(policies);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftPolicy, setDraftPolicy] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [createDraft, setCreateDraft] = useState(() => createEmptyPolicy());

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

  const selectedPolicy = policyList.find(policy => policy.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedPolicy) {
      setDraftPolicy(null);
      return;
    }

    setDraftPolicy(createPolicyDraft(selectedPolicy));
  }, [selectedPolicy]);

  useEffect(() => {
    if (!selectedId) return;

    const hasSelectedPolicy = filteredPolicies.some(policy => policy.id === selectedId);
    if (!hasSelectedPolicy) {
      setSelectedId(null);
    }
  }, [filteredPolicies, selectedId]);

  useEffect(() => {
    if (!isCreateModalOpen) return undefined;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsCreateModalOpen(false);
        setCreateStep(1);
        setCreateDraft(createEmptyPolicy());
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCreateModalOpen]);

  const handleCreatePolicy = () => {
    setCreateDraft(createEmptyPolicy());
    setCreateStep(1);
    setIsCreateModalOpen(true);
  };

  const handleDeletePolicy = () => {
    if (!selectedPolicy) return;
    const nextPolicies = policyList.filter(policy => policy.id !== selectedPolicy.id);
    setPolicyList(nextPolicies);
    setSelectedId(null);
  };

  const handleSavePolicy = () => {
    if (!draftPolicy) return;
    const savedPolicy = toPolicyRecord(draftPolicy);

    setPolicyList(current =>
      current.map(policy => (policy.id === savedPolicy.id ? savedPolicy : policy))
    );
  };

  const handleCancelEdit = () => {
    setSelectedId(null);
  };

  const handleSelectPolicy = policyId => {
    setSelectedId(current => (current === policyId ? null : policyId));
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setCreateDraft(createEmptyPolicy());
  };

  const handleCreateNext = () => {
    setCreateStep(current => Math.min(current + 1, 4));
  };

  const handleCreatePrev = () => {
    setCreateStep(current => Math.max(current - 1, 1));
  };

  const handleSubmitCreatePolicy = () => {
    const newPolicy = toPolicyRecord(createDraft);
    setPolicyList(current => [newPolicy, ...current]);
    setSelectedId(newPolicy.id);
    setSearchInput('');
    setSearchQuery('');
    setSelectedCategory('전체 분류');
    closeCreateModal();
  };

  const isCreateStepOneValid =
    createDraft.name.trim() &&
    createDraft.category.trim() &&
    createDraft.services.length > 0 &&
    createDraft.priority > 0;
  const isCreateStepTwoValid = createDraft.detects.length > 0;
  const isCreateNextDisabled =
    (createStep === 1 && !isCreateStepOneValid) || (createStep === 2 && !isCreateStepTwoValid);

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
            </div>
          </div>
        </div>

        <SectionCard className="overflow-hidden">
          <div>
            <table className="w-full table-fixed">
              <thead className="bg-[#F8FAFC] text-left text-sm font-semibold text-slate-500">
                <tr>
                  <th className="w-12 px-5 py-4 sm:px-6" />
                  <th className="w-[26%] px-4 py-4">정책명</th>
                  <th className="w-[12%] px-4 py-4">분류</th>
                  <th className="w-[18%] px-4 py-4">적용 서비스</th>
                  <th className="w-[16%] px-4 py-4">조치 방식</th>
                  <th className="w-[10%] px-4 py-4">사용 여부</th>
                  <th className="w-[18%] px-4 py-4">최종 수정일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {filteredPolicies.map(policy => {
                  const isSelected = policy.id === selectedId;

                  return (
                    <Fragment key={policy.id}>
                      <tr
                        className={joinClasses(
                          'cursor-pointer transition',
                          isSelected ? 'bg-[#F5F3FF]' : 'bg-white hover:bg-slate-50'
                        )}
                        onClick={() => handleSelectPolicy(policy.id)}
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
                        <td className="whitespace-nowrap px-4 py-4 text-[15px] font-semibold text-slate-800">
                          {policy.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-[15px] font-semibold text-slate-700">
                          {policy.category}
                        </td>
                        <td className="px-4 py-4">
                          <ServiceLabel services={policy.services} fallback={policy.serviceLabel} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-[15px] font-semibold text-slate-700">
                          {policy.action}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-[15px] font-semibold text-slate-600">
                          <StatusToggleIndicator
                            checked={policy.status === '사용'}
                            ariaLabel={`${policy.name} 사용 여부`}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-[15px] text-slate-600">
                          <div className="flex items-center justify-between gap-3">
                            <span>{policy.updatedAt}</span>
                            {isSelected ? (
                              <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                            )}
                          </div>
                        </td>
                      </tr>
                      {isSelected && selectedPolicy && draftPolicy ? (
                        <tr className="bg-[#FFFFFF]">
                          <td colSpan={7} className="border-t border-[#E6EAF4] px-0 py-0">
                            <PolicyDetailPanel
                              draftPolicy={draftPolicy}
                              handleDeletePolicy={handleDeletePolicy}
                              handleCancelEdit={handleCancelEdit}
                              handleSavePolicy={handleSavePolicy}
                              setDraftPolicy={setDraftPolicy}
                            />
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
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
      </div>

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-[clamp(0.75rem,1.8vw,1.25rem)]">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(15,23,42,0.46)] backdrop-blur-[4px]"
            aria-label="새 정책 생성 닫기"
            onClick={closeCreateModal}
          />

          <div className="relative z-10 col-start-1 row-start-1 flex max-h-[min(82vh,46rem)] w-[min(72vw,52rem)] min-w-[min(92vw,34rem)] self-center flex-col overflow-hidden rounded-[clamp(1.25rem,1.9vw,1.75rem)] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-[clamp(1rem,1.8vw,1.5rem)] py-[clamp(0.9rem,1.6vw,1.25rem)]">
              <div>
                <h2 className="text-[clamp(1.1rem,1.55vw,1.4rem)] font-bold tracking-[-0.03em] text-slate-900">
                  {wizardSteps[createStep - 1]}
                </h2>
                <p className="mt-1 text-[clamp(0.82rem,1vw,0.92rem)] text-slate-500">
                  {wizardStepDescriptions[createStep]}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <StepIndicator currentStep={createStep} />

            <div
              className={joinClasses(
                'modal-scrollbar overflow-y-auto',
                createStep === 1
                  ? 'px-[clamp(1rem,1.8vw,1.5rem)] py-[clamp(0.95rem,1.6vw,1.125rem)]'
                  : 'px-[clamp(1rem,1.8vw,1.5rem)] py-[clamp(1rem,2vw,1.5rem)]'
              )}
            >
              {createStep === 1 ? (
                <div className="space-y-3.5">
                  <div className="grid gap-4">
                    <DetailInput label="정책명" required>
                      <input
                        type="text"
                        value={createDraft.name}
                        onChange={event =>
                          setCreateDraft(current => ({ ...current, name: event.target.value }))
                        }
                        placeholder="정책명을 입력하세요"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                      />
                    </DetailInput>

                    <div className="grid gap-4 md:grid-cols-2">
                      <DetailInput label="분류" required>
                        <MonitoringDropdown
                          value={createDraft.category}
                          onChange={value =>
                            setCreateDraft(current => ({ ...current, category: value }))
                          }
                          options={policyCategoryOptions}
                          ariaLabel="정책 분류"
                          widthClass="w-full"
                          triggerClassName="h-11 rounded-xl border-slate-200 bg-white shadow-none"
                        />
                      </DetailInput>

                      <DetailInput label="적용 서비스" required>
                        <ServiceMultiSelect
                          value={createDraft.services}
                          onChange={value =>
                            setCreateDraft(current => ({
                              ...current,
                              services: value,
                              serviceLabel: value.join(', '),
                            }))
                          }
                          ariaLabel="적용 서비스"
                        />
                      </DetailInput>
                    </div>

                    <DetailInput label="설명">
                      <textarea
                        value={createDraft.description}
                        onChange={event =>
                          setCreateDraft(current => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        rows={2}
                        placeholder="정책 설명을 입력하세요"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                      />
                    </DetailInput>

                    <DetailInput label="우선순위" hint="숫자가 낮을수록 우선순위가 높습니다." required>
                      <div className="w-full max-w-[10rem]">
                        <input
                          type="number"
                          min="1"
                          value={createDraft.priority}
                          onChange={event =>
                            setCreateDraft(current => ({
                              ...current,
                              priority: Number(event.target.value) || 0,
                            }))
                          }
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                        />
                      </div>
                    </DetailInput>
                  </div>
                </div>
              ) : null}

              {createStep === 2 ? (
                <div className="space-y-5">
                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {detectionItems.map(item => {
                      const checked = createDraft.detects.includes(item);

                      return (
                        <label
                          key={item}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[#C7D2FE] hover:bg-[#FAFBFF]"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setCreateDraft(current => ({
                                ...current,
                                detects: checked
                                  ? current.detects.filter(detect => detect !== item)
                                  : [...current.detects, item],
                              }))
                            }
                            className="h-4 w-4 rounded border-slate-300 accent-[#4338CA]"
                          />
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>

                  <p className="text-sm text-slate-400">
                    최소 1개 이상의 탐지 항목을 선택해야 다음 단계로 진행할 수 있습니다.
                  </p>
                </div>
              ) : null}

              {createStep === 3 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <section className="rounded-2xl border border-slate-200 p-5">
                      <h4 className="text-sm font-bold text-slate-900">조치 방식</h4>
                      <div className="mt-4 space-y-4">
                        {['허용', '마스킹', '승인 필요', '차단'].map(option => (
                          <label
                            key={option}
                            className="flex items-center gap-3 text-sm font-medium text-slate-700"
                          >
                            <input
                              type="radio"
                              name="create-policy-handling"
                              checked={createDraft.handling === option}
                              onChange={() =>
                                setCreateDraft(current => ({ ...current, handling: option }))
                              }
                              className="h-4 w-4 accent-[#4338CA]"
                            />
                            {option}
                          </label>
                        ))}
                      </div>

                      <div className="mt-5 rounded-xl border border-[#D9D6FE] bg-[#F5F3FF] px-4 py-3 text-sm leading-6 text-[#4338CA]">
                        <div className="flex items-start gap-2">
                          <Info className="mt-0.5 h-4 w-4 shrink-0" />
                          <p>{getActionLabel(createDraft.handling)}</p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 p-5">
                      <h4 className="text-sm font-bold text-slate-900">정책 운영 설정</h4>
                      <div className="mt-5 space-y-5">
                        <ToggleRow
                          label="정책 사용 여부"
                          description="생성 후 바로 활성화할지 설정합니다."
                          checked={createDraft.status === '사용'}
                          onToggle={() =>
                            setCreateDraft(current => ({
                              ...current,
                              status: current.status === '사용' ? '미사용' : '사용',
                            }))
                          }
                        />
                        <ToggleRow
                          label="관리자 알림"
                          description="위반 탐지 시 관리자에게 알림을 전송합니다."
                          checked={createDraft.alerts.admin}
                          onToggle={() =>
                            setCreateDraft(current => ({
                              ...current,
                              alerts: { ...current.alerts, admin: !current.alerts.admin },
                            }))
                          }
                        />
                      </div>
                    </section>
                  </div>
                </div>
              ) : null}

              {createStep === 4 ? (
                <div className="space-y-5">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="grid border-b border-slate-200 bg-[#FCFCFF] text-sm font-bold text-slate-900 md:grid-cols-[1.15fr_0.95fr_1fr]">
                      <div className="px-5 py-4 md:border-r md:border-slate-200">기본 정보</div>
                      <div className="px-5 py-4 md:border-r md:border-slate-200">탐지 항목</div>
                      <div className="px-5 py-4">조치 및 운영 설정</div>
                    </div>

                    <div className="grid md:grid-cols-[1.15fr_0.95fr_1fr]">
                      <section className="px-5 py-4 md:border-r md:border-slate-200">
                        <dl className="grid gap-3 text-[0.92rem]">
                          <div className="grid grid-cols-[5.25rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">정책명</dt>
                            <dd className="font-semibold text-slate-800">{createDraft.name}</dd>
                          </div>
                          <div className="grid grid-cols-[5.25rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">분류</dt>
                            <dd className="text-slate-700">{createDraft.category}</dd>
                          </div>
                          <div className="grid grid-cols-[5.25rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">적용 서비스</dt>
                            <dd className="text-slate-700">{createDraft.services.join(', ')}</dd>
                          </div>
                          <div className="grid grid-cols-[5.25rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">우선순위</dt>
                            <dd className="text-slate-700">{createDraft.priority}</dd>
                          </div>
                          <div className="grid grid-cols-[5.25rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">설명</dt>
                            <dd className="leading-6 text-slate-700">
                              {createDraft.description || '설명 없음'}
                            </dd>
                          </div>
                        </dl>
                      </section>

                      <section className="border-t border-slate-200 px-5 py-4 md:border-t-0 md:border-r md:border-slate-200">
                        <ul className="space-y-2.5 text-[0.92rem] text-slate-700">
                          {createDraft.detects.map(item => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-[#4338CA]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="border-t border-slate-200 px-5 py-4 md:border-t-0">
                        <dl className="grid gap-3 text-[0.92rem]">
                          <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">조치 방식</dt>
                            <dd className="text-slate-700">{createDraft.handling}</dd>
                          </div>
                          <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">정책 사용 여부</dt>
                            <dd className="text-slate-700">
                              {createDraft.status === '사용' ? 'ON' : 'OFF'}
                            </dd>
                          </div>
                          <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                            <dt className="font-semibold text-slate-400">관리자 알림</dt>
                            <dd className="text-slate-700">
                              {createDraft.alerts.admin ? 'ON' : 'OFF'}
                            </dd>
                          </div>
                        </dl>
                      </section>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div
              className={joinClasses(
                'flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-[clamp(1rem,1.8vw,1.5rem)]',
                createStep === 1
                  ? 'py-[clamp(0.75rem,1.4vw,0.9rem)]'
                  : 'py-[clamp(0.85rem,1.6vw,1rem)]'
              )}
            >
              {createStep > 1 ? (
                <button
                  type="button"
                  onClick={handleCreatePrev}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                >
                  이전
                </button>
              ) : (
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                >
                  취소
                </button>
              )}

              {createStep < 4 ? (
                <button
                  type="button"
                  onClick={handleCreateNext}
                  disabled={isCreateNextDisabled}
                  className={joinClasses(
                    'inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition',
                    isCreateNextDisabled
                      ? 'cursor-not-allowed bg-slate-300'
                      : 'border border-[#4338CA] bg-[#4338CA] shadow-[0_10px_24px_rgba(67,56,202,0.24)] hover:bg-[#3730A3] active:bg-[#312E81]'
                  )}
                >
                  다음
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitCreatePolicy}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
                >
                  정책 생성
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
}
