import { Download } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from '../../constants/contentLayout.js';
import { getStatusTextClassName as getStatusColorClassName } from '../../constants/statusColors.js';
import { useMonitoringEventsQuery } from '../../queries/monitoringQueries.js';

const policyOptions = ['전체 정책', '일반 사용 허용 정책', '개인정보 보호 기본 정책'];
const ROWS_PER_PAGE = 11;
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function normalizeMonitoringEvent(event, index) {
  if (event.detectedAt) {
    return event;
  }

  const result = event.status ?? '정상';
  const isNormal = result === '정상';
  const prompt = event.input ?? '-';
  const answer = event.ai_response ?? '-';

  return {
    id: event.no ?? `${event.time_kst ?? 'event'}-${index}`,
    detectedAt: event.time_kst ?? '-',
    aiType: event.service ?? '-',
    organization: '-',
    prompt,
    result,
    content: isNormal ? '위험 키워드 없이 정상 요청으로 처리' : `${result} 처리된 요청`,
    userIp: event.client_ip ?? '-',
    userId: '-',
    level: isNormal ? 'safe' : 'danger',
    promptDetail: prompt,
    answerDetail: answer,
    detectionDetail: isNormal
      ? '위험 키워드와 민감 정보가 확인되지 않아 정상 요청으로 처리되었습니다.'
      : `${result} 정책에 의해 요청이 처리되었습니다.`,
    actionDetail: answer,
  };
}

function createDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date(endDate);

  startDate.setDate(endDate.getDate() - 13);

  return {
    startDate: formatDateValue(startDate),
    endDate: formatDateValue(endDate),
  };
}

function getLogStatusCategory(log) {
  const result = log.result ?? log.status;
  const actionDetail = log.actionDetail ?? '';

  if (result === '정상') return 'normal';
  if (result === '허용') return 'allow';
  if (result === '마스킹') return 'masking';
  if (result === '차단') return 'block';

  if (actionDetail.includes('경고로 기록')) return 'allow';

  if (
    result === '개인정보 탐지' ||
    actionDetail.includes('마스킹') ||
    actionDetail.includes('치환') ||
    actionDetail.includes('대체') ||
    actionDetail.includes('제거한 버전')
  ) {
    return 'masking';
  }

  return 'block';
}

function getStatusLabel(row) {
  const statusCategory = getLogStatusCategory(row);

  if (statusCategory === 'allow') return '허용';
  if (statusCategory === 'masking') return '마스킹';
  if (statusCategory === 'block') return '차단';
  return '정상';
}

function getDetectedPolicyName(row) {
  return getLogStatusCategory(row) === 'normal' ? '일반 사용 허용 정책' : '개인정보 보호 기본 정책';
}

function getStatusTextClassName(row) {
  return getStatusColorClassName(getLogStatusCategory(row));
}

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

function buildAnswerDetail(row) {
  if (row.answerDetail) {
    return row.answerDetail;
  }

  if (getLogStatusCategory(row) === 'allow') {
    return '위험 패턴은 탐지되었지만 정책상 차단 대상은 아니어서 사용자에게 답변을 전달했습니다. 해당 요청은 경고 로그로만 기록됩니다.';
  }

  if (row.result === '정상') {
    return '요청한 내용에 대한 답변이 정상 생성되었습니다. 민감 정보가 포함되지 않아 별도 마스킹 없이 사용자에게 전달되었습니다.';
  }

  if (row.result === '개인정보 탐지') {
    return '개인정보가 포함되어 원문 기반 답변 생성을 보류했습니다. 개인정보를 마스킹한 뒤 다시 요청하도록 사용자에게 안내했습니다.';
  }

  if (row.result === '기밀정보 탐지') {
    return '기밀정보 보호 정책에 따라 답변 생성을 제한했습니다. 관리자 승인 전까지 외부 AI 응답은 사용자에게 전달되지 않습니다.';
  }

  if (row.result === '프롬프트 위협') {
    return '보안 정책상 해당 요청에는 답변하지 않았습니다. 시스템 지시 우회 시도가 탐지되어 차단 안내만 사용자에게 표시했습니다.';
  }

  return '민감 정보 또는 보안 위험이 확인되어 답변 생성을 차단했습니다. 안전한 입력으로 다시 요청하도록 안내했습니다.';
}

function buildDetailContext(row) {
  const statusCategory = getLogStatusCategory(row);
  const detectionDetail = row.detectionDetail ?? '탐지 근거 상세 정보가 아직 제공되지 않았습니다.';
  const actionDetail = row.actionDetail ?? '조치 상세 정보가 아직 제공되지 않았습니다.';

  return {
    policyName: getDetectedPolicyName(row),
    actionStatus:
      statusCategory === 'allow'
        ? '허용 처리'
        : statusCategory === 'masking'
          ? '마스킹 처리'
          : statusCategory === 'block'
            ? '차단 처리'
            : '정상 처리',
    policyItems: [getDetectedPolicyName(row)],
    answerDetail: buildAnswerDetail(row),
    evidenceLines: detectionDetail
      .split('\n')
      .map(line => line.replaceAll('·', '').trim())
      .filter(Boolean),
    actionLines: actionDetail
      .split('. ')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => (line.endsWith('.') ? line : `${line}.`)),
  };
}

function DetailSectionLabel({ children }) {
  return <div className="text-[13px] font-bold tracking-[-0.01em] text-[#4A57D1]">{children}</div>;
}

function DetailHeader({ row }) {
  const detail = buildDetailContext(row);
  const statusTextClassName = getStatusTextClassName(row);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-[15px] font-bold tracking-[-0.02em] text-[#1F2555]">상세 내역</div>
        <span className="h-3 w-px bg-[#D7DDE8]" />
        <span className={`text-[13px] font-semibold tracking-[-0.01em] ${statusTextClassName}`}>
          {detail.actionStatus}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DetailSectionLabel>탐지 내용</DetailSectionLabel>
        <DetailChipList items={detail.policyItems} />
      </div>
    </div>
  );
}

function DetailSummaryItem({ label, value, valueClassName = '' }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-[#7C86A7]">{label}</p>
      <p
        className={`truncate pt-1 text-[13px] font-semibold tracking-[-0.01em] text-[#2E3A59] ${valueClassName}`.trim()}
      >
        {value}
      </p>
    </div>
  );
}

function DetailPanel({ title, children }) {
  return (
    <section className="min-h-[128px] px-5 py-5">
      <div className="pb-4">
        <DetailSectionLabel>{title}</DetailSectionLabel>
      </div>
      <div>{children}</div>
    </section>
  );
}

function DetailPanelText({ children, subtle = false }) {
  return (
    <div
      className={`text-[12.5px] leading-[1.7] whitespace-pre-line ${
        subtle ? 'text-[#5B6686]' : 'text-[#2F3A56]'
      }`.trim()}
    >
      {children}
    </div>
  );
}

function DetailBulletList({ items }) {
  return (
    <ul className="space-y-1.5 text-[12.5px] leading-[1.65] text-[#2F3A56]">
      {items.map(item => (
        <li key={item} className="flex gap-2">
          <span className="mt-[7px] h-1 w-1 rounded-full bg-[#6A5AE0]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DetailChipList({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <span
          key={item}
          className="inline-flex h-7 items-center rounded-full border border-[#D6D9FF] bg-[#F6F7FF] px-4 text-[11px] font-semibold text-[#6658DF]"
        >
          {item}
        </span>
      ))}
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
        className={`text-[13px] font-semibold tracking-[-0.01em] text-[#5C6784] ${hideLabel ? 'opacity-0' : ''}`.trim()}
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
          className={`flex h-[42px] w-full cursor-pointer items-center rounded-[10px] border pr-10 pl-4 text-[14px] font-medium text-[#344054] shadow-[0_4px_12px_rgba(15,23,42,0.04)] outline-none transition ${
            isOpen
              ? 'border-[#A5B4FC] bg-[#EEF2FF] ring-4 ring-[#E0E7FF]'
              : 'border-[#D9DEEA] bg-white hover:border-[#C7D2FE] hover:bg-[#F8FAFF] active:border-[#A5B4FC] active:bg-[#EEF2FF] focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]'
          }`.trim()}
        >
          {formatDateLabel(value)}
        </button>
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#667085]">
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
        <div className="absolute top-[calc(100%+0.5rem)] left-0 z-40 w-[18rem] rounded-[14px] border border-[#E3E7F0] bg-white p-3 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setViewDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5C6B7A] transition hover:bg-[#F3F5FB]"
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
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5C6B7A] transition hover:bg-[#F3F5FB]"
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
                      ? 'bg-[#4B35D4] text-white shadow-[0_8px_18px_rgba(75,53,212,0.18)]'
                      : isCurrentMonth
                        ? 'text-[#314153] hover:bg-[#F3F5FB]'
                        : 'text-[#BCC6D1] hover:bg-[#F6F8FC]'
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

export function MonitoringLogView({
  useStatusFilter = false,
  emptyMessage = '현재 조건에 맞는 모니터링 로그가 없습니다.',
}) {
  const [searchParams] = useSearchParams();
  const defaultDateRange = useMemo(() => createDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [selectedPolicy, setSelectedPolicy] = useState('전체 정책');
  const [selectedLogId, setSelectedLogId] = useState();
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const statusFilter = useStatusFilter ? (searchParams.get('status') ?? 'all') : 'all';
  const {
    data: monitoringData,
    isError,
    isFetching,
    isLoading,
  } = useMonitoringEventsQuery({
    statusFilter,
  });

  const monitoringLogs = useMemo(() => {
    if (isError) return [];

    return (monitoringData?.events ?? []).map(normalizeMonitoringEvent);
  }, [isError, monitoringData?.events]);

  const filteredLogs = useMemo(() => {
    return monitoringLogs.filter(log => {
      const logDate = new Date(normalizeLogDateTime(log.detectedAt));
      const startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const endBoundary = endDate ? new Date(`${endDate}T23:59:59`) : null;
      const matchesDateRange =
        (!startBoundary || logDate >= startBoundary) && (!endBoundary || logDate <= endBoundary);
      const matchesPolicy =
        selectedPolicy === '전체 정책' || getDetectedPolicyName(log) === selectedPolicy;
      const logStatusCategory = getLogStatusCategory(log);
      const matchesStatus = !useStatusFilter
        ? true
        : statusFilter === 'all'
          ? true
          : statusFilter === logStatusCategory;
      return matchesDateRange && matchesPolicy && matchesStatus;
    });
  }, [endDate, monitoringLogs, selectedPolicy, startDate, statusFilter, useStatusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ROWS_PER_PAGE));

  const pagedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ROWS_PER_PAGE).map(log => ({
      ...log,
      displayResult: getStatusLabel(log),
      detectedPolicy: buildDetailContext(log).policyName,
    }));
  }, [currentPage, filteredLogs]);

  const statusMessage = isError
    ? '모니터링 데이터를 불러오지 못했습니다.'
    : isLoading
      ? '모니터링 데이터를 불러오는 중입니다.'
      : isFetching
        ? '모니터링 데이터를 갱신하는 중입니다.'
        : !filteredLogs.length
          ? emptyMessage
          : '';

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  }, [statusFilter]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleToggleRowSelection = rowId => {
    setSelectedRowIds(current =>
      current.includes(rowId) ? current.filter(id => id !== rowId) : [...current, rowId]
    );
  };

  const handleToggleAllRowsSelection = rowIds => {
    setSelectedRowIds(current => {
      const allSelected = rowIds.every(id => current.includes(id));

      if (allSelected) {
        return current.filter(id => !rowIds.includes(id));
      }

      return [...new Set([...current, ...rowIds])];
    });
  };

  const handleSelectLog = log => {
    setSelectedLogId(current => {
      const isClosing = current === log.id;

      setSelectedRowIds(selectedCurrent => {
        if (isClosing) {
          return selectedCurrent.filter(id => id !== log.id);
        }

        return selectedCurrent.includes(log.id) ? selectedCurrent : [...selectedCurrent, log.id];
      });

      return isClosing ? null : log.id;
    });
  };

  return (
    <div
      className={`mx-auto -mb-4 flex h-[calc(100%+1rem)] min-h-0 w-full flex-col ${APP_PAGE_HORIZONTAL_PADDING_CLASS} pt-[clamp(0.75rem,1.5vw,1.5rem)] sm:-mb-5 sm:h-[calc(100%+1.25rem)] lg:-mb-4 lg:h-[calc(100%+1rem)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
    >
      <div
        className={`mx-auto flex h-full min-h-0 w-full flex-col ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
      >
        <div className="mt-[-0.125rem] w-full">
          <div className="mt-1">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:gap-5">
                <div className="flex flex-wrap items-end gap-2.5">
                  <DateRangeField
                    label="조회 기간"
                    value={startDate}
                    onChange={value => {
                      setStartDate(value);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="pb-[9px] text-[18px] font-medium text-[#98A2B3]">-</span>
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
                  <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#5C6784]">
                    검색 조건
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <MonitoringDropdown
                      value={selectedPolicy}
                      onChange={value => {
                        setSelectedPolicy(value);
                        setCurrentPage(1);
                      }}
                      options={policyOptions}
                      ariaLabel="탐지된 정책"
                      widthClass="w-full sm:w-auto sm:min-w-[260px]"
                      triggerClassName="h-[42px] border-[#D9DEEA] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                    />
                    <MonitoringActionButton
                      variant="outline"
                      heightClass="h-[42px]"
                      widthClass="w-[94px] min-w-[94px]"
                      onClick={() => {
                        setStartDate(defaultDateRange.startDate);
                        setEndDate(defaultDateRange.endDate);
                        setSelectedPolicy('전체 정책');
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
                  variant="primary"
                  heightClass="h-[42px]"
                  widthClass="w-[152px] min-w-[152px]"
                  onClick={() => {}}
                >
                  <span className="inline-flex items-center gap-2">
                    <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                    CSV 다운로드
                  </span>
                </MonitoringActionButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <MonitoringDataTable
            rows={pagedLogs}
            activeRowId={selectedLogId}
            selectedRowIds={selectedRowIds}
            onToggleRowSelection={handleToggleRowSelection}
            onToggleAllRowsSelection={handleToggleAllRowsSelection}
            rowNumberStart={(currentPage - 1) * ROWS_PER_PAGE + 1}
            onSelectRow={handleSelectLog}
            renderExpandedRow={row => {
              const detail = buildDetailContext(row);

              return (
                <div className="grid gap-0">
                  <div className="px-5 py-5">
                    <DetailHeader row={row} />
                  </div>

                  <section className="border-t border-[#E7EBF5] bg-white">
                    <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-5">
                      <div className="px-4 py-4">
                        <DetailSummaryItem label="탐지 일시" value={row.detectedAt} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-t-0 md:border-l md:border-[#E7EBF5]">
                        <DetailSummaryItem label="서비스" value={row.aiType} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 xl:border-t-0 xl:border-l xl:border-[#E7EBF5]">
                        <DetailSummaryItem
                          label="처리 상태"
                          value={detail.actionStatus}
                          valueClassName={getStatusTextClassName(row)}
                        />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-t md:border-[#E7EBF5] xl:border-t-0 xl:border-l xl:border-[#E7EBF5]">
                        <DetailSummaryItem label="최종 정책" value={detail.policyName} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-l md:border-[#E7EBF5] xl:border-t-0">
                        <DetailSummaryItem label="IP" value={row.userIp} />
                      </div>
                    </div>
                  </section>

                  <section className="border-t border-[#E7EBF5] bg-white">
                    <div className="grid lg:grid-cols-2">
                      <div className="border-b border-[#E7EBF5] lg:border-r lg:border-[#E7EBF5]">
                        <DetailPanel title="원본 프롬프트">
                          <DetailPanelText>{row.promptDetail}</DetailPanelText>
                        </DetailPanel>
                      </div>
                      <div className="border-b border-[#E7EBF5]">
                        <DetailPanel title="답변">
                          <DetailPanelText>{detail.answerDetail}</DetailPanelText>
                        </DetailPanel>
                      </div>
                      <div className="lg:border-r lg:border-[#E7EBF5]">
                        <DetailPanel title="탐지 근거">
                          <DetailBulletList items={detail.evidenceLines} />
                        </DetailPanel>
                      </div>
                      <div>
                        <DetailPanel title="조치 내용">
                          <DetailBulletList items={detail.actionLines} />
                        </DetailPanel>
                      </div>
                    </div>
                  </section>
                </div>
              );
            }}
            className="flex-1"
          />

          {statusMessage ? (
            <section className="mt-2 shrink-0 rounded-[10px] border border-[#E3E8F2] bg-[#FAFBFF] px-6 py-4 text-center text-[13px] font-semibold text-[#526078]">
              {statusMessage}
            </section>
          ) : null}

          <div className="mt-2 shrink-0 pb-0">
            <GlassPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonitoringPage() {
  return <MonitoringLogView useStatusFilter />;
}
