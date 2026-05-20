import { useMemo, useState } from 'react';
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
];

const resultOptions = ['전체 결과', '정상', '개인정보 탐지', '기밀정보 탐지', '프롬프트 위협'];

function normalizeLogDateTime(value) {
  return String(value).replace(' ', 'T');
}

function DetailField({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] font-semibold text-[#8B95A5]">{label}</label>
      <div className="flex min-h-[42px] items-center rounded-[8px] border border-white/10 bg-[#0B0F14] px-3 text-[13px] text-[#D9E0EA]">
        {children}
      </div>
    </div>
  );
}

function DetailBox({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] font-semibold text-[#8B95A5]">{label}</label>
      <div className="min-h-[96px] rounded-[10px] border border-white/10 bg-[#0B0F14] px-4 py-3 text-[13px] leading-[1.75] text-[#D9E0EA] whitespace-pre-line">
        {children}
      </div>
    </div>
  );
}

function DateRangeField({ label, value, onChange, hideLabel = false }) {
  return (
    <label className="flex min-w-[132px] flex-col gap-2">
      <span
        className={`text-[15px] font-medium text-[#8D99AE] ${hideLabel ? 'opacity-0' : ''}`.trim()}
      >
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={event => onChange(event.target.value)}
        className="h-10 rounded-[8px] border border-[#8D99AE] bg-white px-3 text-[15px] text-[#3D4A5C] shadow-[0_1px_2px_rgba(15,23,42,0.06)] outline-none transition focus:border-[#5AD0DE]"
      />
    </label>
  );
}

export default function MonitoringPage() {
  const [startDate, setStartDate] = useState('2026-05-07');
  const [endDate, setEndDate] = useState('2026-05-20');
  const [selectedResult, setSelectedResult] = useState('전체 결과');
  const [selectedLogId, setSelectedLogId] = useState(logs[0].id);
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

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / 4));

  const pagedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * 4;
    return filteredLogs.slice(startIndex, startIndex + 4);
  }, [currentPage, filteredLogs]);

  const selectedLog = useMemo(() => {
    return pagedLogs.find(log => log.id === selectedLogId) ?? filteredLogs[0] ?? null;
  }, [filteredLogs, pagedLogs, selectedLogId]);

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
            activeRowId={selectedLog?.id ?? null}
            onSelectRow={log => setSelectedLogId(log.id)}
            className="flex-1"
            bodyClassName="max-h-[420px]"
          />

          <div className="mt-2 shrink-0 pb-0">
            <GlassPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {selectedLog ? (
          <section className="mt-4 grid gap-4 border-t border-white/10 pt-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <DetailField label="AI 타입">{selectedLog.aiType}</DetailField>
              <DetailField label="관리 조직">{selectedLog.organization}</DetailField>
              <DetailField label="이용자 ID">{selectedLog.userId}</DetailField>
              <DetailField label="탐지 일시">{selectedLog.detectedAt}</DetailField>
            </div>

            <DetailBox label="프롬프트">{selectedLog.promptDetail}</DetailBox>

            <div className="grid gap-3 xl:grid-cols-[280px_1fr]">
              <DetailField label="탐지 결과">
                <span
                  className={`font-bold ${
                    selectedLog.level === 'danger'
                      ? 'text-[#FF9C9C]'
                      : selectedLog.level === 'warning'
                        ? 'text-[#F4D58A]'
                        : 'text-[#8AD4E4]'
                  }`.trim()}
                >
                  {selectedLog.result}
                </span>
              </DetailField>
              <DetailField label="이용자 IP">{selectedLog.userIp}</DetailField>
            </div>

            <DetailBox label="탐지 내용">{selectedLog.detectionDetail}</DetailBox>
            <DetailBox label="조치 내용">{selectedLog.actionDetail}</DetailBox>
          </section>
        ) : (
          <section className="mt-4 border-t border-dashed border-white/12 px-6 py-12 text-center text-sm text-[#A7AFBF]">
            현재 조건에 맞는 모니터링 로그가 없습니다.
          </section>
        )}
      </div>
    </div>
  );
}
