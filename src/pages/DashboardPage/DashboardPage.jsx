import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
import {
  DateRangePicker,
  MonitoringDropdown,
  MonitoringResetButton,
} from '../../components/monitoring/MonitoringListComponents.jsx';
import { STATUS_COLORS, getStatusTextClassName } from '../../constants/statusColors.js';
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
    color: STATUS_COLORS.allow,
    values: [42, 48, 44, 53, 58, 55, 61],
  },
  {
    key: 'masking',
    label: '마스킹',
    color: STATUS_COLORS.masking,
    values: [98, 112, 105, 139, 168, 152, 156],
  },
  { key: 'block', label: '차단', color: STATUS_COLORS.block, values: [8, 9, 17, 14, 16, 13, 20] },
  {
    key: 'normal',
    label: '정상',
    color: STATUS_COLORS.normal,
    values: [28, 31, 27, 36, 42, 40, 38],
  },
];

const chartLabels = ['12/02', '12/03', '12/04', '12/05', '12/06', '12/07', '12/08'];
const lineChartData = chartLabels.map((date, index) => ({
  date,
  ...Object.fromEntries(chartSeries.map(series => [series.key, series.values[index]])),
}));

const donutSegments = [
  { label: '마스킹', value: 52, count: '652건', color: STATUS_COLORS.masking },
  { label: '허용', value: 24, count: '301건', color: STATUS_COLORS.allow },
  { label: '차단', value: 14, count: '176건', color: STATUS_COLORS.block },
  { label: '정상', value: 10, count: '125건', color: STATUS_COLORS.normal },
];

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createDefaultChartDateRange() {
  const endDate = new Date();
  const startDate = new Date(endDate);

  startDate.setDate(endDate.getDate() - 6);

  return {
    startDate: formatDateValue(startDate),
    endDate: formatDateValue(endDate),
  };
}

const defaultChartDateRange = createDefaultChartDateRange();

const chartFilterDefaults = {
  startDate: defaultChartDateRange.startDate,
  endDate: defaultChartDateRange.endDate,
  service: '전체 서비스',
  policy: '전체 정책',
  user: '전체 사용자',
};

const chartFilters = [
  {
    key: 'service',
    label: '서비스/도메인',
    options: ['전체 서비스', 'ChatGPT', 'Gemini', 'Claude', 'Genspark', 'MS Copilot'],
  },
  {
    key: 'policy',
    label: '정책',
    options: [
      '전체 정책',
      '개인정보 보호 기본 정책',
      '기밀정보 외부 전송 차단 정책',
      '일반 사용 허용 정책',
    ],
  },
  { key: 'user', label: '사용자', options: ['전체 사용자', 'admin', 'user01', 'user02'] },
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
    detail:
      '최근 1시간 동안 차단 처리된 요청이 증가했습니다. 반복되는 서비스와 IP를 확인해 주세요.',
  },
  {
    title: '개인정보 보호 기본 정책',
    detail:
      '개인정보 포함 요청이 마스킹 처리되었습니다. 정책 적용 범위와 예외 필요 여부를 검토해 주세요.',
  },
  {
    title: '프롬프트 경고 허용 정책',
    detail:
      '탐지 후 허용 처리된 요청이 반복되고 있습니다. 사용자 안내 문구와 정책 조건을 확인해 주세요.',
  },
];

function cn(...values) {
  return values.filter(Boolean).join(' ');
}

function ChartTooltipDot({ color }) {
  return <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
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

function ChartFilterSelect({ label, value, options, onChange }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-[0.95rem] font-bold tracking-[-0.02em] text-[#5D687B]">{label}</span>
      <MonitoringDropdown
        value={value}
        onChange={onChange}
        options={options}
        ariaLabel={label}
        widthClass="w-full"
        triggerClassName="h-[46px] border-[#D9DEEA] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.04)] hover:border-[#C7D2FE] hover:bg-[#F8FAFF] active:border-[#A5B4FC] active:bg-[#EEF2FF] focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
      />
    </div>
  );
}

function ChartFilterBar({ filters, onFilterChange, onReset }) {
  return (
    <section className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1.04fr_0.95fr_0.9fr_auto]">
      <DateRangePicker
        label="조회 기간"
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChange={range => {
          onFilterChange('startDate', range.startDate);
          onFilterChange('endDate', range.endDate);
        }}
        widthClass="min-w-0"
        labelClassName="text-[0.95rem] font-bold tracking-[-0.02em] text-[#5D687B]"
        triggerHeightClass="h-[46px]"
      />
      {chartFilters.map(filter => (
        <ChartFilterSelect
          key={filter.key}
          label={filter.label}
          value={filters[filter.key]}
          options={filter.options}
          onChange={value => onFilterChange(filter.key, value)}
        />
      ))}
      <MonitoringResetButton onClick={onReset} />
    </section>
  );
}

function LineChartTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#E5EAF3] bg-white px-3 py-2 text-[0.82rem] font-bold shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
      <div className="mb-1.5 text-[#1F2942]">{label}</div>
      <div className="grid gap-1.5">
        {payload.map(item => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-4 text-[#647089]"
          >
            <span className="flex items-center gap-2">
              <ChartTooltipDot color={item.color} />
              <span>{item.name}</span>
            </span>
            <span className="text-[#1F2942]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ hiddenSeriesKeys }) {
  const visibleSeries = chartSeries.filter(series => !hiddenSeriesKeys.includes(series.key));

  return (
    <div className="relative h-[286px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={lineChartData}
          margin={{ top: 22, right: 18, bottom: 4, left: -8 }}
        >
          <CartesianGrid stroke="#E8EDF7" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71809D', fontSize: 12, fontWeight: 700 }}
            dy={10}
          />
          <YAxis
            domain={[0, 200]}
            ticks={[0, 40, 80, 120, 160, 200]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71809D', fontSize: 12, fontWeight: 700 }}
            width={42}
          />
          <Tooltip cursor={{ stroke: '#D7DDF0', strokeWidth: 1 }} content={<LineChartTooltip />} />
          {visibleSeries.map(series => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={2.8}
              dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF', stroke: series.color }}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#FFFFFF', stroke: series.color }}
              isAnimationActive={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
      {!visibleSeries.length ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold text-[#9AA6BD]">
          표시할 범례를 선택하세요
        </div>
      ) : null}
    </div>
  );
}

function LineChartLegend({ hiddenSeriesKeys, onToggleSeries }) {
  const handleToggleSeries = key => {
    onToggleSeries(key);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {chartSeries.map(series => (
        <LegendToggle
          key={series.key}
          label={series.label}
          color={series.color}
          pressed={!hiddenSeriesKeys.includes(series.key)}
          onClick={() => handleToggleSeries(series.key)}
        />
      ))}
    </div>
  );
}

function LegendToggle({ label, color, pressed, onClick, value, className = '' }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title="표시 전환"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border px-3 text-left text-[0.82rem] font-bold transition hover:border-[#C9D3E8] hover:bg-[#F8FAFF] active:scale-[0.98]',
        pressed
          ? 'border-[#D9E0F1] bg-white text-[#33415B]'
          : 'border-[#E7ECF5] bg-[#F8FAFD] text-[#A5AEC0] opacity-80',
        className
      )}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white transition"
        style={{ backgroundColor: pressed ? color : '#AEB8CA' }}
      />
      <span className="min-w-0 truncate">{label}</span>
      {value ? (
        <span className={cn('shrink-0', pressed ? 'text-[#16213A]' : 'text-[#A5AEC0]')}>
          {value}
        </span>
      ) : null}
    </button>
  );
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const segment = payload[0].payload;

  return (
    <div className="rounded-xl border border-[#E5EAF3] bg-white px-3 py-2 text-[0.82rem] font-bold shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 text-[#1F2942]">
        <ChartTooltipDot color={segment.color} />
        <span>{segment.label}</span>
      </div>
      <div className="mt-1 text-[#647089]">
        {segment.value}% · {segment.count}
      </div>
    </div>
  );
}

function DonutChart({ hiddenSegmentLabels }) {
  const [selectedSegmentLabel, setSelectedSegmentLabel] = useState(null);
  const visibleSegments = donutSegments.filter(
    segment => !hiddenSegmentLabels.includes(segment.label)
  );
  const totalCount = visibleSegments.reduce(
    (sum, segment) => sum + Number(segment.count.replace(/[^\d]/g, '')),
    0
  );
  const selectedSegment = visibleSegments.find(segment => segment.label === selectedSegmentLabel);

  const handleSelectSegment = segment => {
    setSelectedSegmentLabel(current => (current === segment.label ? null : segment.label));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[270px] w-[270px] items-center justify-center">
        <div className="relative h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<DonutTooltip />} />
              <Pie
                data={visibleSegments}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={76}
                outerRadius={118}
                paddingAngle={2}
                cornerRadius={8}
                stroke="none"
                onClick={handleSelectSegment}
              >
                {visibleSegments.map(segment => (
                  <Cell
                    key={segment.label}
                    fill={segment.color}
                    opacity={selectedSegment && selectedSegment.label !== segment.label ? 0.42 : 1}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[0.82rem] font-semibold text-[#55627E]">
              {selectedSegment ? selectedSegment.label : '전체 처리'}
            </span>
            <strong className="mt-1 text-[1.65rem] font-black tracking-[-0.05em] text-[#10182E]">
              {selectedSegment ? selectedSegment.count : `${totalCount.toLocaleString()}건`}
            </strong>
            {selectedSegment ? (
              <span className="mt-1 text-[0.82rem] font-bold text-[#647089]">
                {selectedSegment.value}%
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutChartLegend({ hiddenSegmentLabels, onToggleSegment }) {
  const handleToggleSegment = label => {
    onToggleSegment(label);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {donutSegments.map(segment => (
        <LegendToggle
          key={segment.label}
          label={segment.label}
          color={segment.color}
          pressed={!hiddenSegmentLabels.includes(segment.label)}
          onClick={() => handleToggleSegment(segment.label)}
        />
      ))}
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
  const className = getStatusTextClassName(result);

  return (
    <span className={cn('text-[15px] font-semibold whitespace-nowrap', className)}>{result}</span>
  );
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
  const [chartFilterValues, setChartFilterValues] = useState(chartFilterDefaults);
  const [hiddenLineSeriesKeys, setHiddenLineSeriesKeys] = useState([]);
  const [hiddenDonutSegmentLabels, setHiddenDonutSegmentLabels] = useState([]);

  const handleChartFilterChange = (key, value) => {
    setChartFilterValues(current => ({ ...current, [key]: value }));
  };
  const handleResetChartFilters = () => {
    setChartFilterValues(chartFilterDefaults);
  };
  const handleToggleLineSeries = key => {
    setHiddenLineSeriesKeys(current =>
      current.includes(key) ? current.filter(item => item !== key) : [...current, key]
    );
  };
  const handleToggleDonutSegment = label => {
    setHiddenDonutSegmentLabels(current =>
      current.includes(label) ? current.filter(item => item !== label) : [...current, label]
    );
  };

  return (
    <PageLayout>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {summaryCards.map(card => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <ChartFilterBar
        filters={chartFilterValues}
        onFilterChange={handleChartFilterChange}
        onReset={handleResetChartFilters}
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <DashboardPanel
          title="처리 상태 추이"
          actions={
            <LineChartLegend
              hiddenSeriesKeys={hiddenLineSeriesKeys}
              onToggleSeries={handleToggleLineSeries}
            />
          }
        >
          <LineChart hiddenSeriesKeys={hiddenLineSeriesKeys} />
        </DashboardPanel>
        <DashboardPanel
          title="처리 상태 분포"
          actions={
            <DonutChartLegend
              hiddenSegmentLabels={hiddenDonutSegmentLabels}
              onToggleSegment={handleToggleDonutSegment}
            />
          }
        >
          <DonutChart hiddenSegmentLabels={hiddenDonutSegmentLabels} />
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
