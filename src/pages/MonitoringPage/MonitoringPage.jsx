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
  {
    id: 12,
    detectedAt: '2026-05-19 10:46',
    aiType: 'MS Copilot',
    organization: '재무기획팀',
    prompt: '분기 손익 보고서 초안 검토 요청',
    result: '기밀정보 탐지',
    content: '내부 실적 수치 및 미공개 전망 포함',
    userIp: '211.44.92.116',
    userId: 'lim@cloudmate.com',
    level: 'warning',
    promptDetail: '분기 손익 보고서 초안과 내부 전망 수치를 바탕으로 요약 검토를 요청했습니다.',
    detectionDetail: '미공개 재무 수치와 향후 전망 정보가 포함되어 기밀정보 탐지로 분류되었습니다.',
    actionDetail: '재무 정보 보호 정책에 따라 승인 대기열로 이관하고 외부 전송은 보류합니다.',
  },
  {
    id: 13,
    detectedAt: '2026-05-19 09:38',
    aiType: 'ChatGPT',
    organization: '고객성공팀',
    prompt: '고객 상담 이력 기반 응대 문안 추천',
    result: '개인정보 탐지',
    content: '고객 이름, 휴대전화, 주문번호 포함',
    userIp: '211.44.92.117',
    userId: 'oh@cloudmate.com',
    level: 'warning',
    promptDetail: '상담 이력에 포함된 고객 이름, 연락처, 주문번호를 기반으로 응대 문안을 추천해 달라는 요청입니다.',
    detectionDetail: '이름과 연락처, 주문 식별 정보가 함께 포함되어 개인정보 탐지로 처리되었습니다.',
    actionDetail: '개인 식별 정보는 마스킹한 뒤 재요청하도록 안내하고 원문은 격리 저장합니다.',
  },
  {
    id: 14,
    detectedAt: '2026-05-19 08:57',
    aiType: 'Gemini',
    organization: '플랫폼개발팀',
    prompt: '운영 비밀키 포함 설정 파일 문제 원인 분석',
    result: 'API Key 노출 시도',
    content: '비밀키 패턴 및 운영 설정값 포함',
    userIp: '211.44.92.118',
    userId: 'song@cloudmate.com',
    level: 'danger',
    promptDetail: '운영 환경 설정 파일 일부와 함께 장애 원인 분석을 요청했고 비밀키 패턴이 포함되었습니다.',
    detectionDetail: 'API Key 및 운영 민감 설정값이 함께 탐지되어 즉시 차단 대상으로 분류되었습니다.',
    actionDetail: '비밀값을 제거한 샘플로 재작성하도록 유도하고 보안 이벤트로 등록해 추적합니다.',
  },
];

const resultOptions = ['전체 결과', '허용', '마스킹', '차단', '정상'];
const ROWS_PER_PAGE = 11;
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function getLogStatusCategory(log) {
  if (log.result === '정상') return 'normal';

  if (log.actionDetail.includes('경고로 기록')) return 'allow';

  if (
    log.result === '개인정보 탐지' ||
    log.actionDetail.includes('마스킹') ||
    log.actionDetail.includes('치환') ||
    log.actionDetail.includes('대체') ||
    log.actionDetail.includes('제거한 버전')
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

function getStatusTextClassName(row) {
  const statusCategory = getLogStatusCategory(row);

  if (statusCategory === 'normal') return 'text-[#18A0AE]';
  if (statusCategory === 'block') return 'text-[#FF4D4F]';
  return 'text-[#F59E0B]';
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

  return {
    policyName: statusCategory === 'normal' ? '일반 사용 허용 정책' : '개인정보 보호 기본 정책',
    actionStatus:
      statusCategory === 'allow'
        ? '허용 처리'
        : statusCategory === 'masking'
          ? '마스킹 처리'
          : statusCategory === 'block'
            ? '차단 처리'
            : '정상 처리',
    policyItems: [statusCategory === 'normal' ? '일반 사용 허용 정책' : '개인정보 보호 기본 정책'],
    answerDetail: buildAnswerDetail(row),
    evidenceLines: row.detectionDetail
      .split('\n')
      .map(line => line.replaceAll('·', '').trim())
      .filter(Boolean),
    actionLines: row.actionDetail
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
        <div className="text-[15px] font-bold tracking-[-0.02em] text-[#1F2555]">
          상세 내역
        </div>
        <span className="h-3 w-px bg-[#D7DDE8]" />
        <span className={`text-[13px] font-semibold tracking-[-0.01em] ${statusTextClassName}`}>
          {detail.actionStatus}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DetailSectionLabel>걸린 정책</DetailSectionLabel>
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
  const [startDate, setStartDate] = useState('2026-05-07');
  const [endDate, setEndDate] = useState('2026-05-20');
  const [selectedResult, setSelectedResult] = useState('전체 결과');
  const [selectedLogId, setSelectedLogId] = useState();
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const statusFilter = useStatusFilter ? (searchParams.get('status') ?? 'all') : 'all';

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(normalizeLogDateTime(log.detectedAt));
      const startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const endBoundary = endDate ? new Date(`${endDate}T23:59:59`) : null;
      const matchesDateRange =
        (!startBoundary || logDate >= startBoundary) && (!endBoundary || logDate <= endBoundary);
      const matchesResult =
        selectedResult === '전체 결과' || getStatusLabel(log) === selectedResult;
      const logStatusCategory = getLogStatusCategory(log);
      const matchesStatus =
        !useStatusFilter
          ? true
          : statusFilter === 'all'
            ? true
            : statusFilter === logStatusCategory;
      return matchesDateRange && matchesResult && matchesStatus;
    });
  }, [endDate, selectedResult, startDate, statusFilter, useStatusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ROWS_PER_PAGE));

  const pagedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ROWS_PER_PAGE).map(log => ({
      ...log,
      displayResult: getStatusLabel(log),
    }));
  }, [currentPage, filteredLogs]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  }, [statusFilter]);

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
                      value={selectedResult}
                      onChange={value => {
                        setSelectedResult(value);
                        setCurrentPage(1);
                      }}
                      options={resultOptions}
                      ariaLabel="탐지 결과"
                      widthClass="w-full sm:w-[172px] sm:shrink-0"
                      triggerClassName="h-[42px] border-[#D9DEEA] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                    />
                    <MonitoringActionButton
                      variant="outline"
                      heightClass="h-[42px]"
                      widthClass="w-[94px] min-w-[94px]"
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

          <div className="mt-2 shrink-0 pb-0">
            <GlassPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {!filteredLogs.length ? (
          <section className="mt-4 border-t border-dashed border-[#DCEAF1] px-6 py-12 text-center text-sm text-[#94A3B8]">
            {emptyMessage}
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default function MonitoringPage() {
  return <MonitoringLogView useStatusFilter />;
}
