import { Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassPagination from '../../components/GlassPagination.jsx';
import {
  DateRangePicker,
  MonitoringActionButton,
  MonitoringDataTable,
  MonitoringDropdown,
  MonitoringResetButton,
} from '../../components/monitoring/MonitoringListComponents.jsx';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../../constants/contentLayout.js';
import { getStatusTextClassName as getStatusColorClassName } from '../../constants/statusColors.js';
import { useMonitoringEventsQuery } from '../../queries/monitoringQueries.js';

const policyOptions = ['전체 정책', '일반 사용 허용 정책', '개인정보 보호 기본 정책'];
const ALL_USERS_OPTION = '전체 사용자';
const ROWS_PER_PAGE = 10;

function normalizeMonitoringEvent(event, index) {
  if (event.detectedAt) {
    return event;
  }

  const result = event.status ?? '정상';
  const isNormal = result === '정상';
  const prompt = event.input ?? '-';
  const answer = event.ai_response ?? '-';
  const userName =
    event.username ?? event.user_name ?? event.user ?? event.user_id ?? event.userId ?? '-';

  return {
    id: event.no ?? `${event.time_kst ?? 'event'}-${index}`,
    no: event.no ?? index + 1,
    detectedAt: event.time_kst ?? '-',
    aiType: event.service ?? '-',
    organization: '-',
    prompt,
    result,
    content: isNormal ? '위험 키워드 없이 정상 요청으로 처리' : `${result} 처리된 요청`,
    userIp: event.client_ip ?? '-',
    userId: userName,
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

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
    <section className="min-h-[128px] min-w-0 px-5 py-5">
      <div className="pb-4">
        <DetailSectionLabel>{title}</DetailSectionLabel>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function DetailPanelText({ children, subtle = false }) {
  return (
    <div
      className={`monitoring-detail-scroll max-h-[220px] min-w-0 overflow-y-auto rounded-md border border-[#EEF1FB] bg-[#FCFDFF] px-3 py-2 text-[12.5px] leading-[1.7] whitespace-pre-wrap break-words [overflow-wrap:anywhere] ${
        subtle ? 'text-[#5B6686]' : 'text-[#2F3A56]'
      }`.trim()}
    >
      {children}
    </div>
  );
}

function DetailBulletList({ items }) {
  return (
    <ul className="monitoring-detail-scroll max-h-[220px] min-w-0 space-y-1.5 overflow-y-auto rounded-md border border-[#EEF1FB] bg-[#FCFDFF] px-3 py-2 text-[12.5px] leading-[1.65] text-[#2F3A56]">
      {items.map(item => (
        <li key={item} className="flex min-w-0 gap-2">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#6A5AE0]" />
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item}</span>
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

export function MonitoringLogView({
  useStatusFilter = false,
  emptyMessage = '현재 조건에 맞는 모니터링 로그가 없습니다.',
}) {
  const [searchParams] = useSearchParams();
  const defaultDateRange = useMemo(() => createDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [selectedPolicy, setSelectedPolicy] = useState('전체 정책');
  const [selectedUser, setSelectedUser] = useState(ALL_USERS_OPTION);
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

  const userOptions = useMemo(() => {
    const users = monitoringLogs
      .map(log => log.userId)
      .filter(user => user && user !== '-')
      .sort((left, right) => left.localeCompare(right, 'ko'));

    return [ALL_USERS_OPTION, ...new Set(users)];
  }, [monitoringLogs]);

  const filteredLogs = useMemo(() => {
    return monitoringLogs.filter(log => {
      const logDate = new Date(normalizeLogDateTime(log.detectedAt));
      const startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const endBoundary = endDate ? new Date(`${endDate}T23:59:59`) : null;
      const matchesDateRange =
        (!startBoundary || logDate >= startBoundary) && (!endBoundary || logDate <= endBoundary);
      const matchesPolicy =
        selectedPolicy === '전체 정책' || getDetectedPolicyName(log) === selectedPolicy;
      const matchesUser = selectedUser === ALL_USERS_OPTION || log.userId === selectedUser;
      const logStatusCategory = getLogStatusCategory(log);
      const matchesStatus = !useStatusFilter
        ? true
        : statusFilter === 'all'
          ? true
          : statusFilter === logStatusCategory;
      return matchesDateRange && matchesPolicy && matchesUser && matchesStatus;
    });
  }, [
    endDate,
    monitoringLogs,
    selectedPolicy,
    selectedUser,
    startDate,
    statusFilter,
    useStatusFilter,
  ]);

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
                  <DateRangePicker
                    label="조회 기간"
                    startDate={startDate}
                    endDate={endDate}
                    onChange={range => {
                      setStartDate(range.startDate);
                      setEndDate(range.endDate);
                      setCurrentPage(1);
                    }}
                    widthClass="w-full sm:w-[190px] sm:min-w-[190px]"
                  />
                </div>

                <div className="flex flex-wrap items-end gap-2.5">
                  <div className="flex flex-col gap-2">
                    <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#5C6784]">
                      정책
                    </p>
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
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#5C6784]">
                      사용자
                    </p>
                    <MonitoringDropdown
                      value={selectedUser}
                      onChange={value => {
                        setSelectedUser(value);
                        setCurrentPage(1);
                      }}
                      options={userOptions}
                      ariaLabel="사용자"
                      widthClass="w-full sm:w-auto sm:min-w-[180px]"
                      triggerClassName="h-[42px] border-[#D9DEEA] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[13px] font-semibold tracking-[-0.01em] text-transparent">
                      초기화
                    </p>
                    <MonitoringResetButton
                      heightClass="h-[42px]"
                      widthClass="w-[106px] min-w-[106px]"
                      textClassName="text-[14px] font-semibold tracking-[0.01em]"
                      onClick={() => {
                        setStartDate(defaultDateRange.startDate);
                        setEndDate(defaultDateRange.endDate);
                        setSelectedPolicy('전체 정책');
                        setSelectedUser(ALL_USERS_OPTION);
                        setCurrentPage(1);
                      }}
                    />
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
                    <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-6">
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
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-l md:border-[#E7EBF5] xl:border-t-0">
                        <DetailSummaryItem label="사용자명" value={row.userId ?? '-'} />
                      </div>
                    </div>
                  </section>

                  <section className="border-t border-[#E7EBF5] bg-white">
                    <div className="grid lg:grid-cols-2">
                      <div className="min-w-0 border-b border-[#E7EBF5] lg:border-r lg:border-[#E7EBF5]">
                        <DetailPanel title="원본 프롬프트">
                          <DetailPanelText>{row.promptDetail}</DetailPanelText>
                        </DetailPanel>
                      </div>
                      <div className="min-w-0 border-b border-[#E7EBF5]">
                        <DetailPanel title="답변">
                          <DetailPanelText>{detail.answerDetail}</DetailPanelText>
                        </DetailPanel>
                      </div>
                      <div className="min-w-0 lg:border-r lg:border-[#E7EBF5]">
                        <DetailPanel title="탐지 근거">
                          <DetailBulletList items={detail.evidenceLines} />
                        </DetailPanel>
                      </div>
                      <div className="min-w-0">
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
            <section className="mt-2 shrink-0 border-t border-dashed border-[#DCEAF1] px-6 py-4 text-center text-sm text-[#94A3B8]">
              {statusMessage}
            </section>
          ) : null}

          <div className="mt-4 shrink-0 pb-0">
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
