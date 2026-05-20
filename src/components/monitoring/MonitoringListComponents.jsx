import { Fragment, useEffect, useRef, useState } from 'react';
import caretDownIcon from '../../assets/icons/caret_down.svg';
import searchIcon from '../../assets/icons/search-data.svg';
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
  const className =
    variant === 'primary'
      ? 'border border-[#4B35D4] bg-[#4B35D4] text-white shadow-[0_8px_18px_rgba(75,53,212,0.18)]'
      : variant === 'outline'
        ? 'border border-[#6C5CE7] bg-white text-[#4B35D4]'
        : variant === 'soft'
          ? 'border border-[#D5E5EE] bg-[#E6F0F5] text-[#2A6F8F]'
          : variant === 'ghost'
            ? 'border border-[#31A4BD]/25 bg-[#31A4BD]/10 text-[#8AD4E4]'
            : 'border border-[#4B35D4] bg-[#4B35D4] text-white shadow-[0_8px_18px_rgba(75,53,212,0.18)]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex ${heightClass} ${widthClass} items-center justify-center rounded-[10px] px-4 sm:px-6 whitespace-nowrap ${APP_BUTTON_TEXT_CLASS} font-semibold leading-[150%] transition ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:brightness-[1.02]'
      } ${className}`.trim()}
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
            CSV 다운로드
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
  triggerClassName = 'h-10 border-[#E6E6E6] bg-white',
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
        className={`flex w-full cursor-pointer items-center gap-2 rounded-[10px] border pr-2 pl-0 text-left ${triggerClassName}`.trim()}
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
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold whitespace-nowrap text-[#344054]">
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
  className = '',
  bodyClassName = '',
}) {
  return (
    <div
      className={`flex min-h-0 w-full flex-col overflow-hidden rounded-[14px] border border-[#ECEFF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${className}`.trim()}
    >
      <div className="min-h-0 w-full overflow-x-auto">
        <table className="min-w-[1260px] w-full table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-[106px]" />
            <col className="w-[84px]" />
            <col className="w-[300px]" />
            <col className="w-[148px]" />
            <col />
            <col className="w-[124px]" />
            <col className="w-[170px]" />
          </colgroup>
          <thead className="bg-white">
            <tr className="text-[12px] font-semibold leading-[1.4] text-[#4A5578]">
              <th className="border-b border-[#EEF1F6] px-5 py-[14px] text-left font-semibold">탐지 일시</th>
              <th className="border-b border-[#EEF1F6] px-4 py-[14px] text-left font-semibold">AI 타입</th>
              <th className="border-b border-[#EEF1F6] px-4 py-[14px] text-left font-semibold">프롬프트</th>
              <th className="border-b border-[#EEF1F6] px-4 py-[14px] text-left font-semibold">탐지 결과</th>
              <th className="border-b border-[#EEF1F6] px-4 py-[14px] text-left font-semibold">탐지 내용</th>
              <th className="border-b border-[#EEF1F6] px-4 py-[14px] text-left font-semibold">이용자 IP</th>
              <th className="border-b border-[#EEF1F6] px-4 py-[14px] text-left font-semibold">이용자 ID</th>
            </tr>
          </thead>
          <tbody className={bodyClassName}>
            {rows.map((row, index) => {
              const isSelected = activeRowId === row.id;
              const isStriped = index % 2 === 1;
              const baseRowClass = isStriped ? 'bg-[#FEFEFF]' : 'bg-white';
              const rowClassName = isSelected
                ? 'bg-[#F7F6FF] text-[#20264D] shadow-[inset_0_0_0_2px_rgba(115,103,255,0.9)]'
                : `${baseRowClass} text-[#344054] hover:bg-[#FAF9FF]`;

              const cellBorderClass = index === 0 ? '' : 'border-t border-[#EEF2F7]';

              return (
                <Fragment key={row.id}>
                  <tr
                    className={`cursor-pointer transition ${rowClassName}`.trim()}
                    onClick={() => onSelectRow(row)}
                  >
                    <td
                      className={`${cellBorderClass} px-5 py-[13px] text-[12.5px] leading-[1.45] ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#475467]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.detectedAt}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-4 py-[13px] text-[12.5px] leading-[1.45] ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#475467]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.aiType}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-4 py-[13px] text-[12.5px] leading-[1.45] ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.prompt}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-4 py-[13px] text-[12.5px] leading-[1.45] ${isSelected ? 'font-semibold' : ''}`.trim()}
                    >
                      <div className="overflow-hidden">
                        <MonitoringResultChip level={row.level} result={row.result} />
                      </div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-4 py-[13px] text-[12.5px] leading-[1.45] ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.content}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-4 py-[13px] text-[12.5px] leading-[1.45] ${isSelected ? 'font-semibold text-[#353E73]' : 'text-[#475467]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.userIp}</div>
                    </td>
                    <td
                      className={`${cellBorderClass} px-4 py-[13px] text-[12.5px] leading-[1.45] ${isSelected ? 'font-semibold text-[#252B5C]' : 'text-[#2E3363]'}`.trim()}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{row.userId}</div>
                    </td>
                  </tr>
                  {isSelected && renderExpandedRow ? (
                    <tr>
                      <td colSpan={7} className="border-t border-[#E5EBF5] bg-[#FBFCFF] px-4 py-4 lg:px-5">
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
          <div className="grid h-[40px] w-full grid-cols-[6.5rem_minmax(9rem,1.1fr)_minmax(16rem,2fr)_8rem] items-center rounded-t-[22px] border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-6 text-[13px] font-semibold tracking-[-0.01em] text-[#59627A] lg:px-8">
            <span className="pl-2">Logo</span>
            <span>이름</span>
            <span>URL</span>
            <span className="text-center">사용/비사용</span>
          </div>

          <div className="overflow-hidden rounded-b-[22px]">
            {rows.map((row, index) => {
              return (
                <div
                  key={row.id}
                  className={`grid min-h-[66px] w-full grid-cols-[6.5rem_minmax(9rem,1.1fr)_minmax(16rem,2fr)_8rem] items-center bg-white px-6 text-[14px] leading-[150%] text-[#334155] lg:px-8 ${
                    index === 0 ? '' : 'border-t border-[#EEF1F6]'
                  }`.trim()}
                >
                  <div className="py-3 pl-1">{renderLogo(row)}</div>
                  <div className="truncate pr-4 font-semibold text-[#1F2A44]">{row.name}</div>
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
