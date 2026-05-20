import { useNavigate } from 'react-router-dom';

import PageLayout from '../../layout/PageLayout.jsx';

const summaryCards = [
  {
    title: '전체 서비스',
    value: '24',
    note: '3 서비스 증가 (전일 대비)',
    trend: 'up',
  },
  {
    title: '정책 적용 서비스',
    value: '18',
    note: '75% 적용률',
    trend: 'neutral',
  },
  {
    title: '오늘 탐지 건수',
    value: '156',
    note: '12% (전일 178건)',
    trend: 'down',
  },
  {
    title: '차단 건수',
    value: '42',
    note: '5% (전일 44건)',
    trend: 'down',
  },
];

const chartSeries = [
  {
    key: 'personal',
    label: '개인정보 탐지',
    color: '#4A4DF0',
    values: [98, 112, 105, 139, 168, 152, 156],
  },
  {
    key: 'corporate',
    label: '기업정보 탐지',
    color: '#27AE60',
    values: [28, 31, 27, 36, 42, 40, 38],
  },
  {
    key: 'prompt',
    label: '프롬프트 위협',
    color: '#FF5B5B',
    values: [8, 9, 17, 14, 16, 13, 20],
  },
];

const chartLabels = ['12/02', '12/03', '12/04', '12/05', '12/06', '12/07', '12/08'];

const donutSegments = [
  { label: '개인정보', value: 52, count: '652건', color: '#6772F6' },
  { label: '기업정보', value: 24, count: '301건', color: '#7FD7A2' },
  { label: '프롬프트 위험', value: 14, count: '176건', color: '#FF7E86' },
  { label: '정상', value: 10, count: '125건', color: '#C9D0E0' },
];

const serviceStatus = [
  {
    service: 'ChatGPT',
    status: '정상',
    statusTone: 'success',
    policyRate: '100%',
    detections: '72건',
  },
  {
    service: 'Claude',
    status: '정상',
    statusTone: 'success',
    policyRate: '100%',
    detections: '28건',
  },
  {
    service: '사내 AI 챗봇',
    status: '주의',
    statusTone: 'warning',
    policyRate: '80%',
    detections: '34건',
  },
  {
    service: '개발자 도구',
    status: '검토 필요',
    statusTone: 'review',
    policyRate: '60%',
    detections: '22건',
  },
];

const recentHistory = [
  {
    time: '2025-12-08 13:45:23',
    service: 'ChatGPT',
    result: '개인정보 탐지',
    tone: 'danger',
    detail: '주민등록번호 포함 입력 감지',
  },
  {
    time: '2025-12-08 13:22:11',
    service: 'Claude',
    result: '기업정보 탐지',
    tone: 'warning',
    detail: '사내 문서 내용 입력 감지',
  },
  {
    time: '2025-12-08 12:58:04',
    service: '사내 AI 챗봇',
    result: '프롬프트 위협',
    tone: 'danger',
    detail: '프롬프트 인젝션 시도 탐지',
  },
  {
    time: '2025-12-08 12:31:47',
    service: '개발자 도구',
    result: '정상',
    tone: 'success',
    detail: '정상 요청 처리',
  },
  {
    time: '2025-12-08 11:59:12',
    service: 'ChatGPT',
    result: '기업정보 탐지',
    tone: 'warning',
    detail: '소스코드 포함 입력 감지',
  },
];

const alerts = [
  {
    title: 'API Key 노출 시도',
    tone: 'danger',
    tag: '높음',
    detail: '외부 채널을 통한 API Key 입력 시도가 5회 탐지되었습니다.',
  },
  {
    title: '프롬프트 인젝션 의심',
    tone: 'warning',
    tag: '중간',
    detail: '프롬프트 인젝션 패턴이 18회 탐지되었습니다.',
  },
  {
    title: '주민등록번호 포함 입력',
    tone: 'warning',
    tag: '중간',
    detail: '주민등록번호가 포함된 입력이 7회 탐지되었습니다.',
  },
];

function cn(...values) {
  return values.filter(Boolean).join(' ');
}

function StatCard({ title, value, note, trend }) {
  const trendClassName =
    trend === 'up' ? 'text-[#1EA862]' : trend === 'down' ? 'text-[#1EA862]' : 'text-[#5F6B85]';
  const trendSymbol = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '';

  return (
    <article className="rounded-[18px] border border-[#E7ECF5] bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
      <div className="min-w-0">
        <p className="text-[0.95rem] font-semibold text-[#3C4358]">{title}</p>
        <strong className="mt-2 block text-[2rem] leading-none font-black tracking-[-0.04em] text-[#141B34]">
          {value}
        </strong>
        <p className={cn('mt-3 text-[0.9rem] font-semibold', trendClassName)}>
          {trendSymbol ? `${trendSymbol} ` : ''}
          {note}
        </p>
      </div>
    </article>
  );
}

function DashboardPanel({ title, actions, children, className = '' }) {
  return (
    <section
      className={cn(
        'rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[1.2rem] font-bold tracking-[-0.03em] text-[#1C2440]">{title}</h2>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function getLinePoints(values, width, height, maxValue, paddingX, paddingY) {
  const stepX = (width - paddingX * 2) / (values.length - 1);
  const drawableHeight = height - paddingY * 2;

  return values
    .map((value, index) => {
      const x = paddingX + stepX * index;
      const y = height - paddingY - (value / maxValue) * drawableHeight;
      return `${x},${y}`;
    })
    .join(' ');
}

function LineChart() {
  const width = 760;
  const height = 260;
  const paddingX = 54;
  const paddingY = 24;
  const maxValue = 200;
  const gridValues = [0, 40, 80, 120, 160, 200];
  const stepX = (width - paddingX * 2) / (chartLabels.length - 1);

  return (
    <div className="overflow-x-auto">
      <div className="mb-3 flex flex-wrap items-center justify-end gap-5 text-[0.85rem] font-semibold text-[#5B6480]">
        {chartSeries.map(series => (
          <div key={series.key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: series.color }}
              aria-hidden="true"
            />
            <span>{series.label}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${width} ${height + 34}`} className="min-w-[700px]">
        {gridValues.map(value => {
          const y = height - paddingY - (value / maxValue) * (height - paddingY * 2);
          return (
            <g key={value}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E6EBF5"
                strokeWidth="1"
              />
              <text x="18" y={y + 4} fill="#6D7893" fontSize="12" fontWeight="600">
                {value}
              </text>
            </g>
          );
        })}

        {chartSeries.map(series => (
          <g key={series.key}>
            <polyline
              fill="none"
              stroke={series.color}
              strokeWidth="2.5"
              points={getLinePoints(series.values, width, height, maxValue, paddingX, paddingY)}
            />
            {series.values.map((value, index) => {
              const x = paddingX + stepX * index;
              const y = height - paddingY - (value / maxValue) * (height - paddingY * 2);

              return (
                <g key={`${series.key}-${chartLabels[index]}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#FFFFFF"
                    stroke={series.color}
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill={series.color}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        {chartLabels.map((label, index) => {
          const x = paddingX + stepX * index;
          return (
            <text
              key={label}
              x={x}
              y={height + 20}
              textAnchor="middle"
              fill="#6D7893"
              fontSize="12"
              fontWeight="600"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function DonutChart() {
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="mx-auto flex h-[230px] w-[230px] items-center justify-center">
        <div className="relative h-[190px] w-[190px]">
          <svg viewBox="0 0 190 190" className="-rotate-90">
            <circle cx="95" cy="95" r={radius} fill="none" stroke="#EEF2F8" strokeWidth="26" />
            {donutSegments.map(segment => {
              const dash = (segment.value / 100) * circumference;
              const strokeDasharray = `${dash} ${circumference - dash}`;
              const circleOffset = -offset;
              offset += dash;

              return (
                <circle
                  key={segment.label}
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="26"
                  strokeLinecap="butt"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={circleOffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[0.9rem] font-semibold text-[#5C6784]">전체 탐지</span>
            <strong className="mt-1 text-[2rem] font-black tracking-[-0.05em] text-[#141B34]">
              1,254건
            </strong>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {donutSegments.map(segment => (
          <div key={segment.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="text-[0.95rem] font-semibold text-[#46506A]">{segment.label}</span>
            </div>
            <span className="text-[0.95rem] font-semibold text-[#46506A]">
              {segment.value}% ({segment.count})
            </span>
          </div>
        ))}
        <p className="pt-3 text-[0.86rem] font-semibold text-[#8390A8]">기준: 최근 7일</p>
      </div>
    </div>
  );
}

function StatusBadge({ tone, children }) {
  const className =
    tone === 'success'
      ? 'bg-[#E9F8EE] text-[#1D9C55]'
      : tone === 'warning'
        ? 'bg-[#FFF1DE] text-[#F08A22]'
        : tone === 'review'
          ? 'bg-[#EAF1FF] text-[#4674ED]'
          : 'bg-[#FFF1F1] text-[#F04444]';

  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-[0.8rem] font-bold', className)}>
      {children}
    </span>
  );
}

function TableFooterLink({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center text-[0.92rem] font-bold text-[#5366E8] transition hover:text-[#3649cb]"
    >
      {children}
    </button>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(card => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <DashboardPanel title="최근 7일 탐지 추이">
          <LineChart />
        </DashboardPanel>
        <DashboardPanel title="탐지 유형 분포">
          <DonutChart />
        </DashboardPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardPanel
          title="서비스별 상태"
          actions={<TableFooterLink onClick={() => navigate('/domains')}>전체 서비스 보기</TableFooterLink>}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-[0.88rem] font-bold text-[#66718D]">
                  <th className="rounded-l-[12px] bg-[#F4F6FB] px-4 py-3">서비스</th>
                  <th className="bg-[#F4F6FB] px-4 py-3">상태</th>
                  <th className="bg-[#F4F6FB] px-4 py-3">정책 적용률</th>
                  <th className="rounded-r-[12px] bg-[#F4F6FB] px-4 py-3">오늘 탐지 건수</th>
                </tr>
              </thead>
              <tbody>
                {serviceStatus.map(row => {
                  return (
                    <tr key={row.service} className="text-[0.95rem] font-semibold text-[#2B344C]">
                      <td className="rounded-l-[12px] border-y border-l border-[#EDF1F7] bg-white px-4 py-3">
                        {row.service}
                      </td>
                      <td className="border-y border-[#EDF1F7] bg-white px-4 py-3">
                        <StatusBadge tone={row.statusTone}>{row.status}</StatusBadge>
                      </td>
                      <td className="border-y border-[#EDF1F7] bg-white px-4 py-3">
                        {row.policyRate}
                      </td>
                      <td className="rounded-r-[12px] border-y border-r border-[#EDF1F7] bg-white px-4 py-3">
                        {row.detections}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="최근 탐지 이력"
          actions={
            <TableFooterLink onClick={() => navigate('/monitoring')}>전체 탐지 이력 보기</TableFooterLink>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-[0.88rem] font-bold text-[#66718D]">
                  <th className="rounded-l-[12px] bg-[#F4F6FB] px-4 py-3">시간</th>
                  <th className="bg-[#F4F6FB] px-4 py-3">서비스</th>
                  <th className="bg-[#F4F6FB] px-4 py-3">탐지 결과</th>
                  <th className="rounded-r-[12px] bg-[#F4F6FB] px-4 py-3">탐지 내용</th>
                </tr>
              </thead>
              <tbody>
                {recentHistory.map(row => (
                  <tr
                    key={`${row.time}-${row.service}`}
                    className="text-[0.92rem] font-semibold text-[#2B344C]"
                  >
                    <td className="rounded-l-[12px] border-y border-l border-[#EDF1F7] bg-white px-4 py-3 whitespace-nowrap">
                      {row.time}
                    </td>
                    <td className="border-y border-[#EDF1F7] bg-white px-4 py-3 whitespace-nowrap">
                      {row.service}
                    </td>
                    <td className="border-y border-[#EDF1F7] bg-white px-4 py-3">
                      <StatusBadge tone={row.tone}>{row.result}</StatusBadge>
                    </td>
                    <td className="rounded-r-[12px] border-y border-r border-[#EDF1F7] bg-white px-4 py-3 whitespace-nowrap">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel title="우선 확인 필요 항목">
        <div className="grid gap-4 xl:grid-cols-3">
          {alerts.map(alert => {
            const toneClassName =
              alert.tone === 'danger'
                ? 'bg-[#FFF3F3] text-[#F04444]'
                : 'bg-[#FFF8EB] text-[#F0A22E]';

            return (
              <article
                key={alert.title}
                className="rounded-[18px] border border-[#E7ECF5] bg-[#FCFDFF] px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[1rem] font-bold text-[#1F2942]">{alert.title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-6 text-[#647089]">{alert.detail}</p>
                  </div>
                  <StatusBadge tone={alert.tone}>{alert.tag}</StatusBadge>
                </div>
                <div className="mt-4 flex justify-end">
                  <TableFooterLink onClick={() => navigate('/monitoring')}>상세 보기</TableFooterLink>
                </div>
              </article>
            );
          })}
        </div>
      </DashboardPanel>
    </PageLayout>
  );
}
