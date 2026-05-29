import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import caretDownIcon from '../../assets/icons/caret_down.svg';
import searchIcon from '../../assets/icons/search-data.svg';
import ServiceLogoBadge from '../ServiceLogoBadge.jsx';
import {
  monitoringTableCellClass,
  monitoringTableClass,
  monitoringTableHeadClass,
  monitoringTableHeaderCellClass,
  monitoringTableHeaderRowClass,
  monitoringTableRowClass,
  monitoringTableScrollClass,
  monitoringTableSurfaceClass,
} from './monitoringTableStyles.js';
import {
  APP_BODY_TEXT_CLASS,
  APP_BUTTON_TEXT_CLASS,
  APP_META_TEXT_CLASS,
  APP_PANEL_TITLE_CLASS,
  APP_SMALL_META_TEXT_CLASS,
} from '../../constants/contentLayout.js';
import { getStatusTextClassName } from '../../constants/statusColors.js';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
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

function compareDateOnly(left, right) {
  const leftDate = new Date(left.getFullYear(), left.getMonth(), left.getDate()).getTime();
  const rightDate = new Date(right.getFullYear(), right.getMonth(), right.getDate()).getTime();

  return leftDate - rightDate;
}

function isDateInRange(date, startDate, endDate) {
  return compareDateOnly(date, startDate) >= 0 && compareDateOnly(date, endDate) <= 0;
}

export function MonitoringActionButton({
  children,
  variant = 'secondary',
  onClick,
  disabled = false,
  widthClass = 'w-[150px] min-w-[120px]',
  heightClass = 'h-9',
}) {
  const primaryButtonClassName =
    'border border-[#4338CA] bg-[#4338CA] text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] hover:bg-[#3730A3] active:bg-[#312E81]';
  const className =
    variant === 'primary'
      ? primaryButtonClassName
      : variant === 'outline'
        ? 'border border-slate-200 bg-white text-[#4338CA] hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
        : variant === 'soft'
          ? 'border border-[#D5E5EE] bg-[#E6F0F5] text-[#2A6F8F]'
          : variant === 'ghost'
            ? 'border border-[#31A4BD]/25 bg-[#31A4BD]/10 text-[#8AD4E4]'
            : primaryButtonClassName;

  const interactionClassName =
    variant === 'outline'
      ? ''
      : disabled
        ? 'cursor-not-allowed opacity-60'
        : 'hover:brightness-[1.02]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex ${heightClass} ${widthClass} items-center justify-center rounded-[10px] px-4 sm:px-6 whitespace-nowrap ${APP_BUTTON_TEXT_CLASS} font-semibold leading-[150%] transition ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${interactionClassName} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export function MonitoringResetButton({
  children = '초기화',
  onClick,
  heightClass = 'h-[46px]',
  widthClass = 'w-fit',
  textClassName = 'text-[0.98rem] font-bold tracking-[-0.02em]',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex ${heightClass} ${widthClass} items-center justify-center gap-2 rounded-[10px] border border-[#D7DEE9] bg-white px-5 ${textClassName} whitespace-nowrap text-[#4A57F5] shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition hover:border-[#BFC7FF] hover:bg-[#F8FAFF] active:scale-[0.98]`.trim()}
    >
      <RotateCcw className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
      {children}
    </button>
  );
}

export function DateRangePicker({
  label,
  startDate,
  endDate,
  onChange,
  widthClass = 'min-w-[190px]',
  labelClassName = 'text-[13px] font-semibold tracking-[-0.01em] text-[#5C6784]',
  triggerHeightClass = 'h-[42px]',
}) {
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseDateString(endDate || startDate));
  const [selectionStep, setSelectionStep] = useState('start');
  const selectedStartDate = parseDateString(startDate);
  const selectedEndDate = parseDateString(endDate || startDate);
  const calendarDays = useMemo(() => createCalendarDays(viewDate), [viewDate]);
  const dateLabel = `${formatDateLabel(startDate)} ~ ${formatDateLabel(endDate)}`;

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

  const handleSelectDate = date => {
    const value = formatDateValue(date);

    if (selectionStep === 'start') {
      onChange({ startDate: value, endDate: value });
      setSelectionStep('end');
      return;
    }

    if (compareDateOnly(date, selectedStartDate) < 0) {
      onChange({ startDate: value, endDate: startDate });
    } else {
      onChange({ startDate, endDate: value });
    }

    setSelectionStep('start');
    setIsOpen(false);
  };

  return (
    <label ref={rootRef} className={`relative flex flex-col gap-2 ${widthClass}`.trim()}>
      <span className={labelClassName}>{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setViewDate(parseDateString(endDate || startDate));
            setSelectionStep('start');
            setIsOpen(open => !open);
          }}
          className={`flex ${triggerHeightClass} w-full cursor-pointer items-center rounded-[10px] border pr-10 pl-4 text-[14px] font-medium text-[#344054] shadow-[0_4px_12px_rgba(15,23,42,0.04)] outline-none transition ${
            isOpen
              ? 'border-[#A5B4FC] bg-[#EEF2FF] ring-4 ring-[#E0E7FF]'
              : 'border-[#D9DEEA] bg-white hover:border-[#C7D2FE] hover:bg-[#F8FAFF] active:border-[#A5B4FC] active:bg-[#EEF2FF] focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]'
          }`.trim()}
        >
          {dateLabel}
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
        <div className="absolute top-[calc(100%+0.5rem)] left-0 z-40 w-[20rem] rounded-[14px] border border-[#E3E7F0] bg-white p-3 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
          <div className="mb-3 rounded-[10px] bg-[#F7F8FC] px-3 py-2 text-[12px] font-semibold text-[#657086]">
            {selectionStep === 'start' ? '시작일을 선택하세요' : '종료일을 선택하세요'}
          </div>
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
              const isStart = isSameDay(date, selectedStartDate);
              const isEnd = isSameDay(date, selectedEndDate);
              const isInRange = isDateInRange(date, selectedStartDate, selectedEndDate);
              const isSelected = isStart || isEnd;

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleSelectDate(date)}
                  className={`flex h-9 cursor-pointer items-center justify-center rounded-[10px] text-[12px] font-medium transition ${
                    isSelected
                      ? 'bg-[#4B35D4] text-white shadow-[0_8px_18px_rgba(75,53,212,0.18)]'
                      : isInRange
                        ? 'bg-[#F0EEFF] text-[#4B35D4]'
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

export function MonitoringCsvActionMenu({
  isOpen,
  onToggle,
  onDownloadClick,
  menuRef,
  buttonWidthClass = 'w-[6.5rem] min-w-[6.5rem] xl:w-[8rem] xl:min-w-[8rem]',
}) {
  return (
    <div ref={menuRef} className="relative">
      <MonitoringActionButton onClick={onToggle} widthClass={buttonWidthClass} heightClass="h-10">
        CSV
      </MonitoringActionButton>

      {isOpen ? (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 z-20 flex min-w-[210px] flex-col gap-2 rounded-xl border border-[#D8E4EC] bg-white p-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <MonitoringActionButton
            onClick={onDownloadClick}
            widthClass="w-full min-w-0"
            heightClass="h-10"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              CSV 다운로드
            </span>
          </MonitoringActionButton>
        </div>
      ) : null}
    </div>
  );
}

export function MonitoringTagChip({ children, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-full sm:w-[108px] sm:min-w-[108px] cursor-pointer items-center justify-center rounded-lg px-4 sm:px-5 ${APP_BUTTON_TEXT_CLASS} font-bold leading-[150%] transition ${
        active
          ? 'bg-[#31A4BD] text-white shadow-[0_0_4px_rgba(90,208,222,0.8)]'
          : 'border border-[#01557D] bg-transparent text-[#014069] hover:bg-[#01557D]/10'
      }`.trim()}
    >
      {children}
    </button>
  );
}

export function MonitoringDropdown({
  value,
  onChange,
  options,
  ariaLabel,
  widthClass = 'w-full sm:w-[220px]',
  triggerClassName = 'h-10 border-[#E6E6E6] bg-white hover:border-[#C7D2FE] hover:bg-[#F8FAFF] active:border-[#A5B4FC] active:bg-[#EEF2FF] focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
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
    <div ref={rootRef} className={`relative ${widthClass}`.trim()}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={`flex w-full cursor-pointer items-center gap-2 rounded-[10px] border pr-2 pl-0 text-left transition ${triggerClassName} ${
          isOpen ? 'border-[#A5B4FC] bg-[#EEF2FF] ring-4 ring-[#E0E7FF]' : ''
        }`.trim()}
        onClick={() => setIsOpen(open => !open)}
      >
        <span
          className={`flex flex-1 items-center px-4 ${APP_BODY_TEXT_CLASS} font-medium leading-5 tracking-[0.01em] text-[#344054]`}
        >
          {value}
        </span>
        <img
          src={caretDownIcon}
          alt=""
          aria-hidden="true"
          className={`h-6 w-6 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`.trim()}
        />
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+0.375rem)] left-0 z-40 w-full rounded-[10px] drop-shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
          <div className="rounded-[10px] border border-[#E5E7EA] bg-white px-0 py-2">
            <div className="flex max-h-[min(16rem,50vh)] flex-col gap-1 overflow-y-auto px-1">
              {options.map(option => {
                const isSelected = option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`flex h-9 w-full cursor-pointer items-center gap-2 px-4 text-left transition ${
                      isSelected
                        ? `h-[42px] rounded-[8px] bg-[#4B35D4] ${APP_BUTTON_TEXT_CLASS} font-semibold leading-[150%] text-white`
                        : `rounded-[8px] bg-white ${APP_BODY_TEXT_CLASS} font-normal leading-5 tracking-[0.01em] text-[#484848] hover:bg-[#F7F8FC]`
                    }`.trim()}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                  >
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MonitoringSearchField({
  value,
  onChange,
  widthClass = 'w-full sm:w-[348px] sm:shrink-0',
}) {
  return (
    <label
      className={`flex h-9 items-center gap-2.5 rounded-[4px] bg-[#F9FBFF] px-3 ${APP_SMALL_META_TEXT_CLASS} text-[#B5B7C0] ${widthClass}`.trim()}
    >
      <img src={searchIcon} alt="" aria-hidden="true" className="h-[22px] w-[25px]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search"
        className={`w-full min-w-0 bg-transparent ${APP_BODY_TEXT_CLASS} text-[#3D3C42] outline-none placeholder:text-[#B5B7C0]`}
      />
    </label>
  );
}

function MonitoringResultChip({ result }) {
  const resultTextClassName = getStatusTextClassName(result);

  return (
    <span
      className={`inline-flex items-center text-[15px] font-semibold whitespace-nowrap ${resultTextClassName}`}
    >
      {result}
    </span>
  );
}

export function MonitoringDataTable({
  rows,
  activeRowId,
  onSelectRow,
  renderExpandedRow,
  selectedRowIds = [],
  onToggleRowSelection,
  onToggleAllRowsSelection,
  rowNumberStart = 1,
  className = '',
  bodyClassName = '',
}) {
  const allRowsSelected = rows.length > 0 && rows.every(row => selectedRowIds.includes(row.id));

  return (
    <div className={`${monitoringTableSurfaceClass} ${className}`.trim()}>
      <div className={monitoringTableScrollClass}>
        <table className={`min-w-[980px] ${monitoringTableClass} xl:min-w-0`}>
          <colgroup>
            <col className="w-[38px]" />
            <col className="w-[40px]" />
            <col className="w-[108px]" />
            <col className="w-[74px]" />
            <col className="w-[172px]" />
            <col className="w-[116px]" />
            <col className="w-[206px]" />
            <col className="w-[128px]" />
            <col className="w-[110px]" />
          </colgroup>
          <thead className={monitoringTableHeadClass}>
            <tr className={monitoringTableHeaderRowClass}>
              <th className={`${monitoringTableHeaderCellClass} px-0 text-center align-middle`}>
                <input
                  type="checkbox"
                  checked={allRowsSelected}
                  onChange={() => onToggleAllRowsSelection?.(rows.map(row => row.id))}
                  aria-label="현재 페이지 전체 선택"
                  className="mx-auto block h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#4338CA]"
                />
              </th>
              <th className={`${monitoringTableHeaderCellClass} px-0 text-center`}>No.</th>
              <th className={`${monitoringTableHeaderCellClass} xl:px-5`}>탐지 일시</th>
              <th className={`${monitoringTableHeaderCellClass} px-3 xl:px-4`}>서비스</th>
              <th className={`${monitoringTableHeaderCellClass} px-3 xl:px-4`}>프롬프트</th>
              <th className={`${monitoringTableHeaderCellClass} px-3 xl:px-4`}>탐지 결과</th>
              <th className={`${monitoringTableHeaderCellClass} px-3 xl:px-4`}>탐지 내용</th>
              <th className={`${monitoringTableHeaderCellClass} px-3 xl:px-4`}>IP</th>
              <th className={`${monitoringTableHeaderCellClass} px-3 xl:px-4`}>사용자명</th>
            </tr>
          </thead>
          <tbody className={bodyClassName}>
            {rows.map((row, index) => {
              const isSelected = activeRowId === row.id;
              const isChecked = selectedRowIds.includes(row.id);
              const isStriped = index % 2 === 1;
              return (
                <Fragment key={row.id}>
                  <tr
                    className={monitoringTableRowClass({
                      selected: isSelected,
                      striped: isStriped,
                      interactive: true,
                    })}
                    onClick={() => onSelectRow(row)}
                  >
                    <td
                      className={monitoringTableCellClass(index, 'px-0 text-center align-middle')}
                      onClick={event => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleRowSelection?.(row.id)}
                        aria-label={`${row.aiType} 행 선택`}
                        className="mx-auto block h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#4338CA]"
                      />
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `px-0 text-center ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#667085]'}`
                      )}
                    >
                      {row.no ?? rowNumberStart + index}
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `xl:px-5 ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#475467]'}`
                      )}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {row.detectedAt}
                      </div>
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `px-3 xl:px-4 ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#475467]'}`
                      )}
                    >
                      <div className="flex items-center justify-center xl:justify-start">
                        <ServiceLogoBadge
                          name={row.aiType}
                          variant="compact"
                          className="h-8 w-8"
                          iconClassName="h-6 w-6"
                        />
                      </div>
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `px-3 xl:px-4 ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`
                      )}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {row.prompt}
                      </div>
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `px-3 xl:px-4 ${isSelected ? 'font-semibold' : ''}`
                      )}
                    >
                      <div className="overflow-hidden">
                        <MonitoringResultChip
                          level={row.level}
                          result={row.displayResult ?? row.result}
                        />
                      </div>
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `px-3 xl:px-4 ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`
                      )}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {row.detectedPolicy ?? row.content}
                      </div>
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `px-3 xl:px-4 ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`
                      )}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {row.userIp}
                      </div>
                    </td>
                    <td
                      className={monitoringTableCellClass(
                        index,
                        `px-3 xl:px-4 ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`
                      )}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {row.userId ?? '-'}
                      </div>
                    </td>
                  </tr>
                  {isSelected && renderExpandedRow ? (
                    <tr>
                      <td colSpan={9} className="border-t border-[#E5EBF5] bg-white px-0 py-0">
                        {renderExpandedRow(row)}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MonitoringDomainTable({ rows, renderLogo, renderToggle, className = '' }) {
  return (
    <div className={`flex min-h-0 w-full flex-col pb-0 ${className}`.trim()}>
      <div className="min-h-0 w-full overflow-x-auto">
        <div className="min-w-[760px] rounded-[22px]">
          <div className="grid h-[46px] w-full grid-cols-[minmax(15rem,1.45fr)_minmax(16rem,2fr)_8rem] items-center rounded-t-[22px] border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-6 text-[14px] font-semibold tracking-[-0.01em] text-[#59627A] lg:px-8">
            <span>서비스</span>
            <span>URL</span>
            <span className="text-center">사용/비사용</span>
          </div>

          <div className="overflow-hidden rounded-b-[22px]">
            {rows.map((row, index) => {
              return (
                <div
                  key={row.id}
                  className={`grid min-h-[66px] w-full grid-cols-[minmax(15rem,1.45fr)_minmax(16rem,2fr)_8rem] items-center bg-white px-6 text-[14px] leading-[150%] text-[#334155] lg:px-8 ${
                    index === 0 ? '' : 'border-t border-[#EEF1F6]'
                  }`.trim()}
                >
                  <div className="flex items-center gap-3 py-3 pr-4">
                    {renderLogo(row)}
                    <div className="truncate font-semibold text-[#1F2A44]">{row.name}</div>
                  </div>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate pr-4 text-[#667085] underline decoration-transparent transition hover:text-[#3F49B5] hover:decoration-[#3F49B5]"
                    title={row.url}
                  >
                    {row.url}
                  </a>
                  <div className="flex justify-center py-3">{renderToggle(row)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
