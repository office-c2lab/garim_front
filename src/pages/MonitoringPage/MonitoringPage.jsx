import { useEffect, useMemo, useRef, useState } from 'react';
import GlassPagination from '../../components/GlassPagination.jsx';
import {
  MonitoringActionButton,
  MonitoringDataTable,
  MonitoringDropdown,
} from '../../components/monitoring/MonitoringListComponents.jsx';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
  APP_PAGE_TITLE_CLASS,
} from '../../constants/contentLayout.js';

const logs = [
  {
    id: 1,
    detectedAt: '2026-05-20 13:22',
    aiType: 'ChatGPT',
    organization: 'AI 서비스팀',
    prompt: '김철수 / choi.sokim@example.com / 송장 처리 우선순위 요청',
    result: '개인정보 탐지',
    content: '개인정보 탐지 · 이메일 4건 · 사용자 식별자 포함',
    userIp: '211.44.92.110',
    userId: 'ahn@cloudmate.com',
    level: 'danger',
    promptDetail:
      '김철수 / choi.sokim@example.com / 배송지 총주고 수탁건수 / 아이템 / 2,500원\n이영희 / yeonghee@example.com / 회사 공통자료 요청 / 2,500원\n박민수 / ahn77@gmail.com / 내부 정산서 분석 / 협력사 / 1,300원\n최민준 / choi@gmail.com / 내부 문서번호 포함 조회 / 데이터 요청 / 1,900원',
    detectionDetail:
      '이메일 4건과 사용자 식별 가능 정보, 거래 금액, 내부 문서 정보가 함께 포함되었습니다.\n외부 AI 전송 전 개인정보 마스킹 또는 정책 승인 절차가 필요합니다.',
    actionDetail:
      '개인정보가 포함된 프롬프트는 외부 AI 서비스로 전송하기 전 자동 마스킹 처리합니다. 반복 탐지되는 항목은 정책 차단 조건에 추가하고, 관리자 검토 후 예외 처리 여부를 결정합니다.',
  },
  {
    id: 2,
    detectedAt: '2026-05-20 13:17',
    aiType: 'ChatGPT',
    organization: '보안 운영팀',
    prompt: 'CP 2025 Alpha Cloud Lite 계약서 요약 요청',
    result: '기밀정보 탐지',
    content: '기밀정보 탐지 · 내부 계약 문구 포함',
    userIp: '211.44.92.110',
    userId: 'park@cloudmate.com',
    level: 'warning',
    promptDetail: '대외 전달 전 계약서 초안과 내부 검토 메모를 함께 요약 요청했습니다.',
    detectionDetail: '프로젝트 코드명과 내부 계약 조항이 포함되어 기밀정보 탐지로 분류되었습니다.',
    actionDetail: '문서 등급 분류 정책에 따라 사내 승인 절차로 이관하고 외부 전송은 차단합니다.',
  },
  {
    id: 3,
    detectedAt: '2026-05-20 13:10',
    aiType: 'ChatGPT',
    organization: 'AI 서비스팀',
    prompt: 'word 파일 업로드 후 요약 요청',
    result: '정상',
    content: '위험 키워드 없이 정상 요청으로 처리',
    userIp: '211.44.92.110',
    userId: 'lee@cloudmate.com',
    level: 'safe',
    promptDetail: '일반 보고서 문서를 업로드하고 핵심 요약만 요청했습니다.',
    detectionDetail: '위험 키워드와 민감 정보가 확인되지 않아 정상 요청으로 처리되었습니다.',
    actionDetail: '정상 요청으로 기록만 남기고 별도 조치는 하지 않았습니다.',
  },
  {
    id: 4,
    detectedAt: '2026-05-20 10:30',
    aiType: 'Claude',
    organization: '전략기획실',
    prompt: '대외 전달용 제안서 초안 생성',
    result: '기밀정보 탐지',
    content: '프로젝트명과 내부 담당자 정보 포함',
    userIp: '211.44.92.110',
    userId: 'kim@cloudmate.com',
    level: 'warning',
    promptDetail: '제안서 초안에 내부 프로젝트명과 담당자 실명이 포함되었습니다.',
    detectionDetail: '대외 배포 전 비식별화가 필요한 정보가 확인되었습니다.',
    actionDetail: '프로젝트명 치환 규칙을 적용하고 담당자 이름은 부서 단위로 대체합니다.',
  },
  {
    id: 5,
    detectedAt: '2026-05-20 09:21',
    aiType: 'Gemini',
    organization: '보안 운영팀',
    prompt: '회사 월별 영업 분석 요청',
    result: '프롬프트 위협',
    content: '프롬프트 인젝션 의심 · 내부 수치 데이터 포함',
    userIp: '211.44.92.110',
    userId: 'choi@cloudmate.com',
    level: 'danger',
    promptDetail: '시스템 정책을 무시하고 내부 분석 수치를 모두 노출하라는 지시가 포함되었습니다.',
    detectionDetail: '프롬프트 인젝션 패턴과 내부 영업 수치 요청이 동시에 탐지되었습니다.',
    actionDetail: '즉시 차단 후 보안 이벤트로 승격하고 사용자 재교육 대상에 등록합니다.',
  },
  {
    id: 6,
    detectedAt: '2026-05-20 09:03',
    aiType: 'ChatGPT',
    organization: 'AI 서비스팀',
    prompt: '방학별 매출 데이터 분석 요청',
    result: '프롬프트 위협',
    content: '프롬프트 인젝션 지시 포함',
    userIp: '211.44.92.110',
    userId: 'jeong@cloudmate.com',
    level: 'warning',
    promptDetail: '시스템 메시지를 무시하고 모든 응답 제한을 해제하라는 문구가 포함되었습니다.',
    detectionDetail: '인젝션 시도는 있었지만 추가 민감 정보는 포함되지 않았습니다.',
    actionDetail: '위험도 경고로 기록하고 동일 패턴 재발 시 자동 차단 임계치를 높입니다.',
  },
  {
    id: 7,
    detectedAt: '2026-05-19 18:42',
    aiType: 'ChatGPT',
    organization: '전략기획실',
    prompt: '내부 예산안 요약 및 대외 발표용 문구 정리',
    result: '기밀정보 탐지',
    content: '내부 예산 수치 및 미공개 계획 포함',
    userIp: '211.44.92.111',
    userId: 'moon@cloudmate.com',
    level: 'warning',
    promptDetail:
      '내부 예산안과 차년도 인력 운영 계획을 외부 발표 문구로 정리해 달라는 요청입니다.',
    detectionDetail: '미공개 예산 수치와 인력 계획이 포함되어 외부 공유 전 검토가 필요합니다.',
    actionDetail:
      '민감 수치를 제거한 버전으로 재작성하도록 유도하고 원문은 보안 검토로 이관합니다.',
  },
  {
    id: 8,
    detectedAt: '2026-05-19 17:08',
    aiType: 'Claude',
    organization: 'AI 서비스팀',
    prompt: '고객 문의 답변 자동화 문안 생성 요청',
    result: '정상',
    content: '민감 정보 없이 일반 응대 문안 생성',
    userIp: '211.44.92.112',
    userId: 'seo@cloudmate.com',
    level: 'safe',
    promptDetail: '자주 들어오는 배송 지연 문의에 대한 일반 응대 문안을 생성하는 요청입니다.',
    detectionDetail: '개인정보나 기밀 정보 없이 일반 운영 문구만 포함되어 정상 처리되었습니다.',
    actionDetail: '정상 요청으로 기록만 남기고 별도 조치는 하지 않았습니다.',
  },
  {
    id: 9,
    detectedAt: '2026-05-19 16:11',
    aiType: 'Gemini',
    organization: '보안 운영팀',
    prompt: '정책 우회 후 시스템 프롬프트 노출 시도',
    result: '프롬프트 위협',
    content: '시스템 지시 무시 및 내부 규칙 노출 유도',
    userIp: '211.44.92.113',
    userId: 'han@cloudmate.com',
    level: 'danger',
    promptDetail:
      '기존 안전 규칙을 무시하고 시스템 프롬프트 원문을 출력하라는 문구가 포함되었습니다.',
    detectionDetail: '명시적인 프롬프트 인젝션 시도이며 내부 정책 노출 위험이 확인되었습니다.',
    actionDetail: '요청을 즉시 차단하고 보안 이벤트로 분류해 관리자 검토 대상으로 넘깁니다.',
  },
  {
    id: 10,
    detectedAt: '2026-05-19 14:27',
    aiType: 'ChatGPT',
    organization: 'AI 서비스팀',
    prompt: '협력사 계약 이력 정리 요청',
    result: '개인정보 탐지',
    content: '담당자 이름, 이메일, 직통번호 포함',
    userIp: '211.44.92.114',
    userId: 'jang@cloudmate.com',
    level: 'warning',
    promptDetail: '협력사 담당자별 계약 이력과 연락처를 포함해 정리해 달라는 요청입니다.',
    detectionDetail: '이름, 이메일, 직통번호 등 개인정보가 함께 포함되어 탐지되었습니다.',
    actionDetail: '연락처 마스킹 후 다시 요청하도록 안내하고 원본 요청은 저장소에서 격리합니다.',
  },
  {
    id: 11,
    detectedAt: '2026-05-19 11:54',
    aiType: 'Claude',
    organization: '전략기획실',
    prompt: '시장 분석 보고서 요약 요청',
    result: '정상',
    content: '공개 리서치 기반 요약',
    userIp: '211.44.92.115',
    userId: 'yoon@cloudmate.com',
    level: 'safe',
    promptDetail: '공개된 시장 조사 보고서를 기반으로 핵심 트렌드를 요약해 달라는 요청입니다.',
    detectionDetail: '공개 자료만 사용되었고 민감 정보가 확인되지 않아 정상 처리되었습니다.',
    actionDetail: '정상 요청으로 기록만 남기고 별도 조치는 하지 않았습니다.',
  },
];

const resultOptions = ['전체 결과', '정상', '개인정보 탐지', '기밀정보 탐지', '프롬프트 위협'];
const ROWS_PER_PAGE = 10;
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function normalizeLogDateTime(value) {
  return String(value).replace(' ', 'T');
}

function parseDateString(value) {
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLabel(value) {
  if (!value) return '';
  const date = parseDateString(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createCalendarDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let index = 0; index < 42; index += 1) {
    const dayNumber = index - startWeekday + 1;

    if (dayNumber <= 0) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth + dayNumber),
        isCurrentMonth: false,
      });
      continue;
    }

    if (dayNumber > daysInMonth) {
      days.push({
        date: new Date(year, month + 1, dayNumber - daysInMonth),
        isCurrentMonth: false,
      });
      continue;
    }

    days.push({
      date: new Date(year, month, dayNumber),
      isCurrentMonth: true,
    });
  }

  return days;
}

function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function DetailField({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.04em] text-[#8B95A5]">
        {label}
      </label>
      <div className="flex min-h-[46px] items-center rounded-[10px] border border-white/10 bg-[#0B0F14] px-3.5 text-[13px] font-medium text-[#E8EDF5] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        {children}
      </div>
    </div>
  );
}

function DetailBox({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.04em] text-[#8B95A5]">
        {label}
      </label>
      <div className="min-h-[112px] rounded-[12px] border border-white/10 bg-[#0B0F14] px-4 py-3.5 text-[13px] leading-[1.8] text-[#D9E0EA] whitespace-pre-line shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        {children}
      </div>
    </div>
  );
}

function DetailSectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-[15px] font-bold tracking-[0.02em] text-white">{children}</h2>
    </div>
  );
}

function DateRangeField({ label, value, onChange, hideLabel = false }) {
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseDateString(value));
  const selectedDate = parseDateString(value);
  const calendarDays = useMemo(() => createCalendarDays(viewDate), [viewDate]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (!rootRef.current?.contains(event.target)) {
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

  return (
    <label ref={rootRef} className="relative flex min-w-[132px] flex-col gap-2">
      <span
        className={`text-[15px] font-medium text-[#8D99AE] ${hideLabel ? 'opacity-0' : ''}`.trim()}
      >
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setViewDate(parseDateString(value));
            setIsOpen(open => !open);
          }}
          className="flex h-10 w-full cursor-pointer items-center rounded-[8px] border border-[#E5E7EB] bg-white pr-10 pl-3 text-[14px] font-medium text-[#3D4A5C] shadow-[0_1px_2px_rgba(15,23,42,0.06)] outline-none transition hover:border-[#C9D7E0] focus:border-[#5AD0DE] focus:ring-2 focus:ring-[rgba(90,208,222,0.16)]"
        >
          {formatDateLabel(value)}
        </button>
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#8D99AE]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="2.25"
              y="3.25"
              width="11.5"
              height="10.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M5 1.75V4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11 1.75V4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2.5 6H13.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </div>

      {isOpen ? (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 z-40 w-[18rem] rounded-[16px] border border-[#D8E4EC] bg-white p-3 shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setViewDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5C6B7A] transition hover:bg-[#EFF6F9]"
              aria-label="이전 달"
            >
              ‹
            </button>
            <div className="text-[14px] font-bold text-[#2D3C4B]">
              {viewDate.getFullYear()}.{String(viewDate.getMonth() + 1).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={() =>
                setViewDate(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5C6B7A] transition hover:bg-[#EFF6F9]"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#8D99AE]">
            {WEEKDAY_LABELS.map(day => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, isCurrentMonth }) => {
              const isSelected = isSameDay(date, selectedDate);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => {
                    onChange(formatDateValue(date));
                    setIsOpen(false);
                  }}
                  className={`flex h-9 cursor-pointer items-center justify-center rounded-[10px] text-[12px] font-medium transition ${
                    isSelected
                      ? 'bg-[#31A4BD] text-white shadow-[0_8px_18px_rgba(49,164,189,0.24)]'
                      : isCurrentMonth
                        ? 'text-[#314153] hover:bg-[#EFF6F9]'
                        : 'text-[#BCC6D1] hover:bg-[#F6F9FB]'
                  }`.trim()}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </label>
  );
}

export default function MonitoringPage() {
  const [startDate, setStartDate] = useState('2026-05-07');
  const [endDate, setEndDate] = useState('2026-05-20');
  const [selectedResult, setSelectedResult] = useState('전체 결과');
  const [selectedLogId, setSelectedLogId] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(normalizeLogDateTime(log.detectedAt));
      const startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const endBoundary = endDate ? new Date(`${endDate}T23:59:59`) : null;
      const matchesDateRange =
        (!startBoundary || logDate >= startBoundary) && (!endBoundary || logDate <= endBoundary);
      const matchesResult = selectedResult === '전체 결과' || log.result === selectedResult;
      return matchesDateRange && matchesResult;
    });
  }, [endDate, selectedResult, startDate]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ROWS_PER_PAGE));

  const pagedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [currentPage, filteredLogs]);

  return (
    <div
      className={`mx-auto -mb-4 flex h-[calc(100%+1rem)] min-h-0 w-full flex-col ${APP_PAGE_HORIZONTAL_PADDING_CLASS} pt-[clamp(0.75rem,1.5vw,1.5rem)] sm:-mb-5 sm:h-[calc(100%+1.25rem)] lg:-mb-4 lg:h-[calc(100%+1rem)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
    >
      <div
        className={`mx-auto flex h-full min-h-0 w-full flex-col ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
      >
        <div className="mt-[-0.125rem] w-full">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between xl:gap-5">
            <div className="min-w-0">
              <h1
                className={`${APP_PAGE_TITLE_CLASS} font-bold leading-[150%] tracking-[0.5px] text-[#E5E7EA]`.trim()}
              >
                프롬프트 모니터링
              </h1>
            </div>
          </div>

          <div className="mt-4 border-b border-white/10 pb-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-6">
                <div className="flex flex-wrap items-end gap-2.5">
                  <DateRangeField
                    label="조회 기간"
                    value={startDate}
                    onChange={value => {
                      setStartDate(value);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="pb-2 text-[18px] font-medium text-[#8D99AE]">-</span>
                  <DateRangeField
                    label="조회 기간"
                    hideLabel
                    value={endDate}
                    onChange={value => {
                      setEndDate(value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-[15px] font-medium text-[#8D99AE]">검색 조건</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <MonitoringDropdown
                      value={selectedResult}
                      onChange={value => {
                        setSelectedResult(value);
                        setCurrentPage(1);
                      }}
                      options={resultOptions}
                      ariaLabel="탐지 결과"
                      widthClass="w-full sm:w-[156px] sm:shrink-0"
                      triggerClassName="h-10 border-[#E5E7EB] bg-white"
                    />
                    <MonitoringActionButton
                      variant="secondary"
                      heightClass="h-10"
                      widthClass="w-[92px] min-w-[92px]"
                      onClick={() => {
                        setStartDate('2026-05-07');
                        setEndDate('2026-05-20');
                        setSelectedResult('전체 결과');
                        setCurrentPage(1);
                      }}
                    >
                      초기화
                    </MonitoringActionButton>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <MonitoringActionButton
                  variant="secondary"
                  heightClass="h-10"
                  widthClass="w-[140px] min-w-[140px]"
                  onClick={() => {}}
                >
                  CSV 다운로드
                </MonitoringActionButton>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <MonitoringDataTable
            rows={pagedLogs}
            activeRowId={selectedLogId}
            onSelectRow={log => setSelectedLogId(current => (current === log.id ? null : log.id))}
            renderExpandedRow={row => (
              <div className="grid gap-4">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
                  <DetailSectionTitle>상세 내역</DetailSectionTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-medium text-[#8B95A5]">
                      로그 ID {String(row.id).padStart(4, '0')}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <DetailField label="AI 타입">{row.aiType}</DetailField>
                  <DetailField label="관리 조직">{row.organization}</DetailField>
                  <DetailField label="이용자 ID">{row.userId}</DetailField>
                  <DetailField label="탐지 일시">{row.detectedAt}</DetailField>
                </div>

                <DetailBox label="프롬프트">{row.promptDetail}</DetailBox>

                <div className="grid gap-3 xl:grid-cols-[280px_1fr]">
                  <DetailField label="탐지 결과">
                    <span className="font-semibold text-white">{row.result}</span>
                  </DetailField>
                  <DetailField label="이용자 IP">{row.userIp}</DetailField>
                </div>

                <DetailBox label="탐지 내용">{row.detectionDetail}</DetailBox>
                <DetailBox label="조치 내용">{row.actionDetail}</DetailBox>
              </div>
            )}
            className="flex-1"
          />

          <div className="mt-2 shrink-0 pb-0">
            <GlassPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {!filteredLogs.length ? (
          <section className="mt-4 border-t border-dashed border-white/12 px-6 py-12 text-center text-sm text-[#A7AFBF]">
            현재 조건에 맞는 모니터링 로그가 없습니다.
          </section>
        ) : null}
      </div>
    </div>
  );
}
