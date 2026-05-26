import { Fragment, useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import caretDownIcon from '../../assets/icons/caret_down.svg';
import searchIcon from '../../assets/icons/search-data.svg';
import ServiceLogoBadge from '../ServiceLogoBadge.jsx';
import {
  APP_BODY_TEXT_CLASS,
  APP_BUTTON_TEXT_CLASS,
  APP_META_TEXT_CLASS,
  APP_PANEL_TITLE_CLASS,
  APP_SMALL_META_TEXT_CLASS,
} from '../../constants/contentLayout.js';

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
    variant === 'outline' ? '' : disabled ? 'cursor-not-allowed opacity-60' : 'hover:brightness-[1.02]';

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
  triggerClassName =
    'h-10 border-[#E6E6E6] bg-white hover:border-[#C7D2FE] hover:bg-[#F8FAFF] active:border-[#A5B4FC] active:bg-[#EEF2FF] focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]',
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

function MonitoringResultChip({ level, result }) {
  const styles =
    level === 'safe'
      ? {
          icon: 'text-[#18A0AE]',
        }
      : level === 'danger'
        ? {
            icon: 'text-[#FF4D4F]',
          }
        : {
            icon: 'text-[#F59E0B]',
          };

  return (
    <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap text-[#344054]">
      <span className={styles.icon}>
        {level === 'safe' ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" fill="currentColor" fillOpacity="0.14" />
            <path
              d="M4.35 7.2 6.1 8.95 9.7 5.35"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1.6 12.2 11.2a.6.6 0 0 1-.53.9H2.33a.6.6 0 0 1-.53-.9L7 1.6Z"
              fill="currentColor"
              fillOpacity="0.16"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M7 4.6v3.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="7" cy="9.75" r=".8" fill="currentColor" />
          </svg>
        )}
      </span>
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
    <div
      className={`flex min-h-0 w-full flex-col overflow-hidden rounded-[14px] border border-[#ECEFF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${className}`.trim()}
    >
      <div className="min-h-0 w-full overflow-x-auto xl:overflow-x-hidden">
        <table className="min-w-[918px] w-full table-fixed border-separate border-spacing-0 xl:min-w-0">
          <colgroup>
            <col className="w-[38px]" />
            <col className="w-[40px]" />
            <col className="w-[108px]" />
            <col className="w-[74px]" />
            <col className="w-[220px]" />
            <col className="w-[116px]" />
            <col className="w-[206px]" />
            <col className="w-[128px]" />
          </colgroup>
          <thead className="bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)]">
            <tr className="text-[14px] font-semibold leading-[1.4] text-[#4A5578] xl:text-[15px]">
              <th className="border-b border-[#E7EBF4] px-0 py-[14px] text-center align-middle font-semibold">
                <input
                  type="checkbox"
                  checked={allRowsSelected}
                  onChange={() => onToggleAllRowsSelection?.(rows.map(row => row.id))}
                  aria-label="현재 페이지 전체 선택"
                  className="mx-auto block h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#4338CA]"
                />
              </th>
              <th className="border-b border-[#E7EBF4] px-0 py-[14px] text-center font-semibold">No.</th>
              <th className="border-b border-[#E7EBF4] px-4 py-[14px] text-left font-semibold xl:px-5">탐지 일시</th>
              <th className="border-b border-[#E7EBF4] px-3 py-[14px] text-left font-semibold xl:px-4">서비스</th>
              <th className="border-b border-[#E7EBF4] px-3 py-[14px] text-left font-semibold xl:px-4">프롬프트</th>
              <th className="border-b border-[#E7EBF4] px-3 py-[14px] text-left font-semibold xl:px-4">탐지 결과</th>
              <th className="border-b border-[#E7EBF4] px-3 py-[14px] text-left font-semibold xl:px-4">탐지 내용</th>
              <th className="border-b border-[#E7EBF4] px-3 py-[14px] text-left font-semibold xl:px-4">IP</th>
            </tr>
          </thead>
          <tbody className={bodyClassName}>
            {rows.map((row, index) => {
              const isSelected = activeRowId === row.id;
              const isChecked = selectedRowIds.includes(row.id);
              const isStriped = index % 2 === 1;
              const baseRowClass = isStriped ? 'bg-[#FEFEFF]' : 'bg-white';
              const rowClassName = isSelected
                ? 'bg-[#F5F3FF] text-[#20264D]'
                : `${baseRowClass} text-[#344054] hover:bg-slate-50`;

              const cellBorderClass = index === 0 ? '' : 'border-t border-[#EEF2F7]';

              return (
                <Fragment key={row.id}>
                  <tr
                    className={`cursor-pointer transition ${rowClassName}`.trim()}
                    onClick={() => onSelectRow(row)}
                  >
                    <td
                      className={`${cellBorderClass} px-0 py-[13px] text-center align-middle`.trim()}
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
                      className={`${cellBorderClass} px-0 py-[13px] text-center text-[14px] leading-[1.45] xl:text-[15px] ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#667085]'}`.trim()}
                    >
                      {rowNumberStart + index}
                    </td>
                    <td
                      className={`${cellBorderClass} px-4 py-[13px] text-[14px] leading-[1.45] xl:px-5 xl:text-[15px] ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#475467]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.detectedAt}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-3 py-[13px] text-[14px] leading-[1.45] xl:px-4 xl:text-[15px] ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#475467]'}`.trim()}
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
                      className={`${cellBorderClass} px-3 py-[13px] text-[14px] leading-[1.45] xl:px-4 xl:text-[15px] ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.prompt}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-3 py-[13px] text-[14px] leading-[1.45] xl:px-4 xl:text-[15px] ${isSelected ? 'font-semibold' : ''}`.trim()}
                    >
                      <div className="overflow-hidden">
                        <MonitoringResultChip level={row.level} result={row.result} />
                      </div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-3 py-[13px] text-[14px] leading-[1.45] xl:px-4 xl:text-[15px] ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.content}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-3 py-[13px] text-[14px] leading-[1.45] xl:px-4 xl:text-[15px] ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.userIp}</div>
                    </td>
                  </tr>
                  {isSelected && renderExpandedRow ? (
                    <tr>
                      <td colSpan={8} className="border-t border-[#E5EBF5] bg-white px-0 py-0">
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
