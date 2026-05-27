import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ServiceLogoBadge from '../../components/ServiceLogoBadge.jsx';
import {
  monitoringTableCellClass,
  monitoringTableClass,
  monitoringTableHeadClass,
  monitoringTableHeaderCellClass,
  monitoringTableHeaderRowClass,
  monitoringTableRowClass,
  monitoringTableSurfaceClass,
} from '../../components/monitoring/monitoringTableStyles.js';
import PageLayout from '../../layout/PageLayout.jsx';

const summaryCards = [
  { title: '전체 서비스', value: '24', change: '+6%', trend: 'up' },
  { title: '정책 적용 서비스', value: '18', change: '-3%', trend: 'down' },
  { title: '신규 정책', value: '7', change: '+9%', trend: 'up' },
  { title: '오늘 처리 건수', value: '27.3k', change: '+3%', trend: 'up' },
  { title: '차단 건수', value: '95', change: '-2%', trend: 'down' },
  { title: '보호 대상', value: '621', change: '-1%', trend: 'down' },
];

const chartSeries = [
  {
    key: 'allow',
    label: '허용',
    color: '#F59E0B',
    values: [42, 48, 44, 53, 58, 55, 61],
  },
  {
    key: 'masking',
    label: '마스킹',
    color: '#EAB308',
    values: [98, 112, 105, 139, 168, 152, 156],
  },
  { key: 'block', label: '차단', color: '#FF4B57', values: [8, 9, 17, 14, 16, 13, 20] },
  { key: 'normal', label: '정상', color: '#18A0AE', values: [28, 31, 27, 36, 42, 40, 38] },
];

const chartLabels = ['12/02', '12/03', '12/04', '12/05', '12/06', '12/07', '12/08'];

const donutSegments = [
  { label: '마스킹', value: 52, count: '652건', color: '#EAB308' },
  { label: '허용', value: 24, count: '301건', color: '#F59E0B' },
  { label: '차단', value: 14, count: '176건', color: '#FF6675' },
  { label: '정상', value: 10, count: '125건', color: '#18A0AE' },
];

const serviceStatus = [
  {
    service: 'ChatGPT',
    url: 'https://chatgpt.com/',
    status: 'ON',
    policyRate: '100%',
    detections: '72건',
  },
  {
    service: 'Gemini',
    url: 'https://gemini.google.com/',
    status: 'ON',
    policyRate: '95%',
    detections: '18건',
  },
  {
    service: 'Claude',
    url: 'https://claude.ai/',
    status: 'ON',
    policyRate: '100%',
    detections: '28건',
  },
  {
    service: 'Genspark',
    url: 'https://www.genspark.ai/',
    status: 'OFF',
    policyRate: '88%',
    detections: '14건',
  },
  {
    service: 'MS Copilot',
    url: 'https://copilot.microsoft.com/',
    status: 'ON',
    policyRate: '90%',
    detections: '7건',
  },
];

const recentHistory = [
  {
    time: '2025-12-08 13:45:23',
    service: 'ChatGPT',
    url: 'https://chatgpt.com/',
    result: '마스킹',
    tone: 'warning',
    policy: '개인정보 보호 기본 정책',
  },
  {
    time: '2025-12-08 13:22:11',
    service: 'Claude',
    url: 'https://claude.ai/',
    result: '차단',
    tone: 'danger',
    policy: '기밀정보 외부 전송 차단 정책',
  },
  {
    time: '2025-12-08 13:10:07',
    service: 'Gemini',
    url: 'https://gemini.google.com/',
    result: '허용',
    tone: 'warning',
    policy: '프롬프트 경고 허용 정책',
  },
  {
    time: '2025-12-08 12:55:42',
    service: 'Genspark',
    url: 'https://www.genspark.ai/',
    result: '정상',
    tone: 'success',
    policy: '일반 사용 허용 정책',
  },
  {
    time: '2025-12-08 12:41:09',
    service: 'MS Copilot',
    url: 'https://copilot.microsoft.com/',
    result: '차단',
    tone: 'danger',
    policy: '개인정보 보호 기본 정책',
  },
];

const alerts = [
  {
    title: '기밀정보 외부 전송 차단 정책',
    detail: '최근 1시간 동안 차단 처리된 요청이 증가했습니다. 반복되는 서비스와 IP를 확인해 주세요.',
  },
  {
    title: '개인정보 보호 기본 정책',
    detail: '개인정보 포함 요청이 마스킹 처리되었습니다. 정책 적용 범위와 예외 필요 여부를 검토해 주세요.',
  },
  {
    title: '프롬프트 경고 허용 정책',
    detail: '탐지 후 허용 처리된 요청이 반복되고 있습니다. 사용자 안내 문구와 정책 조건을 확인해 주세요.',
  },
];

function cn(...values) {
  return values.filter(Boolean).join(' ');
}

function DashboardPanel({ title, actions, children, className = '' }) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-[22px] border border-[#E2E8F4] bg-white px-5 py-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] xl:px-6',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.12rem] font-bold tracking-[-0.03em] text-[#11182E] xl:text-[1.18rem]">
          {title}
        </h2>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SummaryCard({ title, value, change, trend }) {
  const isUp = trend === 'up';

  return (
    <article className="rounded-[18px] border border-[#E2E8F4] bg-white px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.96rem] font-semibold text-[#20273D]">{title}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[0.95rem] font-bold',
            isUp ? 'text-[#2BB658]' : 'text-[#FF4B57]'
          )}
        >
          {change}
          {isUp ? '⌃' : '⌄'}
        </span>
      </div>
      <strong className="mt-5 block text-[2.25rem] leading-none font-black tracking-[-0.05em] text-[#0E1731]">
        {value}
      </strong>
    </article>
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
  const [hiddenSeriesKeys, setHiddenSeriesKeys] = useState([]);
  const width = 760;
  const height = 250;
  const paddingX = 54;
  const paddingY = 18;
  const maxValue = 200;
  const gridValues = [0, 40, 80, 120, 160, 200];
  const stepX = (width - paddingX * 2) / (chartLabels.length - 1);
  const visibleSeries = chartSeries.filter(series => !hiddenSeriesKeys.includes(series.key));

  const handleToggleSeries = key => {
    setHiddenSeriesKeys(current =>
      current.includes(key) ? current.filter(item => item !== key) : [...current, key]
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-3 flex flex-wrap items-center justify-end gap-5 text-[0.84rem] font-semibold text-[#65718C]">
        {chartSeries.map(series => (
          <button
            key={series.key}
            type="button"
            onClick={() => handleToggleSeries(series.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition',
              hiddenSeriesKeys.includes(series.key)
                ? 'border-[#E3E8F4] bg-[#F8FAFD] text-[#A0ABC1]'
                : 'border-transparent bg-transparent text-[#65718C]'
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series.color }} />
            <span>{series.label}</span>
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${width} ${height + 34}`} className="min-w-[680px]">
        {gridValues.map(value => {
          const y = height - paddingY - (value / maxValue) * (height - paddingY * 2);

          return (
            <g key={value}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E8EDF7"
                strokeWidth="1"
              />
              <text x="18" y={y + 4} fill="#71809D" fontSize="12" fontWeight="700">
                {value}
              </text>
            </g>
          );
        })}

        {visibleSeries.map(series => (
          <g key={series.key}>
            <polyline
              fill="none"
              stroke={series.color}
              strokeWidth="2.8"
              points={getLinePoints(series.values, width, height, maxValue, paddingX, paddingY)}
            />
            {series.values.map((value, index) => {
              const x = paddingX + stepX * index;
              const y = height - paddingY - (value / maxValue) * (height - paddingY * 2);

              return (
                <g key={`${series.key}-${chartLabels[index]}`}>
                  <circle cx={x} cy={y} r="4" fill="#FFF" stroke={series.color} strokeWidth="2" />
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

        {!visibleSeries.length ? (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            fill="#9AA6BD"
            fontSize="14"
            fontWeight="700"
          >
            표시할 범례를 선택하세요
          </text>
        ) : null}

        {chartLabels.map((label, index) => {
          const x = paddingX + stepX * index;
          return (
            <text
              key={label}
              x={x}
              y={height + 20}
              textAnchor="middle"
              fill="#71809D"
              fontSize="12"
              fontWeight="700"
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
  const [hiddenSegmentLabels, setHiddenSegmentLabels] = useState([]);
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const visibleSegments = donutSegments.filter(
    segment => !hiddenSegmentLabels.includes(segment.label)
  );
  const totalCount = visibleSegments.reduce(
    (sum, segment) => sum + Number(segment.count.replace(/[^\d]/g, '')),
    0
  );

  const handleToggleSegment = label => {
    setHiddenSegmentLabels(current =>
      current.includes(label) ? current.filter(item => item !== label) : [...current, label]
    );
  };

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="mx-auto flex h-[240px] w-[240px] items-center justify-center">
        <div className="relative h-[204px] w-[204px]">
          <svg viewBox="0 0 204 204" className="-rotate-90">
            <circle cx="102" cy="102" r={radius} fill="none" stroke="#EEF2FA" strokeWidth="28" />
            {visibleSegments.map(segment => {
              const dash = (segment.value / 100) * circumference;
              const strokeDasharray = `${dash} ${circumference - dash}`;
              const circleOffset = -offset;
              offset += dash;

              return (
                <circle
                  key={segment.label}
                  cx="102"
                  cy="102"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="28"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={circleOffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[0.98rem] font-semibold text-[#55627E]">전체 처리</span>
            <strong className="mt-2 text-[2.2rem] font-black tracking-[-0.05em] text-[#10182E]">
              {totalCount ? `${totalCount.toLocaleString()}건` : '-'}
            </strong>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-5">
        {donutSegments.map(segment => (
          <button
            key={segment.label}
            type="button"
            onClick={() => handleToggleSegment(segment.label)}
            className={cn(
              'flex w-full items-center justify-between gap-4 rounded-full border px-3 py-2 text-left transition',
              hiddenSegmentLabels.includes(segment.label)
                ? 'border-[#E3E8F4] bg-[#F8FAFD] opacity-55'
                : 'border-transparent bg-transparent'
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-[1rem] font-semibold text-[#33415B]">{segment.label}</span>
            </div>
            <span className="shrink-0 text-[1rem] font-semibold text-[#33415B]">
              {segment.value}% ({segment.count})
            </span>
          </button>
        ))}
        <p className="pt-3 text-[0.92rem] font-semibold text-[#8A96AF]">기준: 최근 7일</p>
      </div>
    </div>
  );
}

function ResultBadge({ tone, children }) {
  const className =
    tone === 'success'
      ? 'bg-[#E9F8EE] text-[#28A45D]'
      : tone === 'warning'
        ? 'bg-[#FFF3E4] text-[#F08E2A]'
        : 'bg-[#FFF0F0] text-[#FF4B57]';

  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-[0.82rem] font-bold', className)}>
      {children}
    </span>
  );
}

function ResultText({ result }) {
  const className =
    result === '정상'
      ? 'text-[#18A0AE]'
      : result === '차단'
        ? 'text-[#FF4D4F]'
        : 'text-[#F59E0B]';

  return <span className={cn('text-[15px] font-semibold whitespace-nowrap', className)}>{result}</span>;
}

function ServiceStatusText({ status }) {
  const isOn = status === 'ON';

  return (
    <span
      className={cn(
        'text-[15px] font-semibold whitespace-nowrap',
        isOn ? 'text-[#4338CA]' : 'text-[#8A93A5]'
      )}
    >
      {status}
    </span>
  );
}

function HeaderLink({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[0.95rem] font-bold text-[#4A57F5] transition hover:text-[#3140df]"
    >
      {children}
    </button>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {summaryCards.map(card => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)]">
        <DashboardPanel title="최근 7일 처리 상태 추이">
          <LineChart />
        </DashboardPanel>
        <DashboardPanel title="처리 상태 분포">
          <DonutChart />
        </DashboardPanel>
      </section>

      <DashboardPanel title="우선 확인 필요 항목">
        <div className="grid gap-4 xl:grid-cols-3">
          {alerts.map(alert => (
            <article
              key={alert.title}
              className="rounded-[18px] border border-[#E7ECF5] bg-[#FCFDFF] px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start">
                <div className="min-w-0">
                  <h3 className="text-[1rem] font-bold text-[#1F2942]">{alert.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-6 text-[#647089]">{alert.detail}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <HeaderLink onClick={() => navigate('/monitoring')}>상세 보기</HeaderLink>
              </div>
            </article>
          ))}
        </div>
      </DashboardPanel>

      <section className="grid gap-5">
        <DashboardPanel
          title="최근 처리 이력"
          actions={
            <HeaderLink onClick={() => navigate('/monitoring')}>전체 처리 이력 보기</HeaderLink>
          }
        >
          <div className={monitoringTableSurfaceClass}>
            <div className="overflow-x-auto">
              <table className={`min-w-[760px] ${monitoringTableClass} text-left`}>
                <thead className={monitoringTableHeadClass}>
                  <tr className={monitoringTableHeaderRowClass}>
                    <th className={monitoringTableHeaderCellClass}>시간</th>
                    <th className={monitoringTableHeaderCellClass}>서비스</th>
                    <th className={monitoringTableHeaderCellClass}>탐지 결과</th>
                    <th className={monitoringTableHeaderCellClass}>탐지된 정책</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHistory.map((row, index) => (
                    <tr
                      key={`${row.time}-${row.service}`}
                      className={monitoringTableRowClass({ striped: index % 2 === 1 })}
                    >
                      <td className={monitoringTableCellClass(index, 'whitespace-nowrap')}>
                        {row.time}
                      </td>
                      <td className={monitoringTableCellClass(index, 'whitespace-nowrap')}>
                        <div className="flex items-center gap-3">
                          <ServiceLogoBadge
                            name={row.service}
                            url={row.url}
                            className="h-7 w-7 rounded-[9px] shadow-none"
                            iconClassName="h-4.5 w-4.5"
                          />
                          <span>{row.service}</span>
                        </div>
                      </td>
                      <td className={monitoringTableCellClass(index)}>
                        <ResultText result={row.result} />
                      </td>
                      <td
                        className={monitoringTableCellClass(
                          index,
                          'whitespace-nowrap text-[#2D3854]'
                        )}
                      >
                        {row.policy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/monitoring')}
              className="inline-flex items-center gap-1 text-[0.96rem] font-bold text-[#4A57F5] transition hover:text-[#3140df]"
            >
              더 보기
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="서비스별 상태"
          actions={<HeaderLink onClick={() => navigate('/domains')}>전체 서비스 보기</HeaderLink>}
        >
          <div className={monitoringTableSurfaceClass}>
            <div className="overflow-x-auto">
              <table className={`min-w-[640px] ${monitoringTableClass} text-left`}>
                <thead className={monitoringTableHeadClass}>
                  <tr className={monitoringTableHeaderRowClass}>
                    <th className={monitoringTableHeaderCellClass}>서비스</th>
                    <th className={monitoringTableHeaderCellClass}>상태</th>
                    <th className={monitoringTableHeaderCellClass}>정책 적용률</th>
                    <th className={monitoringTableHeaderCellClass}>오늘 처리 건수</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceStatus.map((row, index) => (
                    <tr
                      key={row.service}
                      className={monitoringTableRowClass({ striped: index % 2 === 1 })}
                    >
                      <td className={monitoringTableCellClass(index)}>
                        <div className="flex items-center gap-3">
                          <ServiceLogoBadge
                            name={row.service}
                            url={row.url}
                            className="h-7 w-7 rounded-[9px] shadow-none"
                            iconClassName="h-4.5 w-4.5"
                          />
                          <span>{row.service}</span>
                        </div>
                      </td>
                      <td className={monitoringTableCellClass(index)}>
                        <ServiceStatusText status={row.status} />
                      </td>
                      <td className={monitoringTableCellClass(index)}>{row.policyRate}</td>
                      <td className={monitoringTableCellClass(index)}>{row.detections}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardPanel>
      </section>

    </PageLayout>
  );
}
