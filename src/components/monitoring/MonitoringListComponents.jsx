import { useEffect, useRef, useState } from 'react';
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
      ? 'bg-[#5AD0DE] text-white shadow-[0_0_4px_rgba(90,208,222,0.8)]'
      : variant === 'soft'
        ? 'border border-[#D5E5EE] bg-[#E6F0F5] text-[#2A6F8F]'
        : variant === 'ghost'
          ? 'border border-[#31A4BD]/25 bg-[#31A4BD]/10 text-[#8AD4E4]'
          : 'bg-[#026E92] text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex ${heightClass} ${widthClass} items-center justify-center rounded-lg px-4 sm:px-6 whitespace-nowrap ${APP_BUTTON_TEXT_CLASS} font-bold leading-[150%] transition ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:brightness-110'
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
        className={`flex w-full items-center gap-2 rounded-[4px] border pr-2 pl-0 text-left ${triggerClassName}`.trim()}
        onClick={() => setIsOpen(open => !open)}
      >
        <span
          className={`flex flex-1 items-center px-4 ${APP_BODY_TEXT_CLASS} font-normal leading-5 tracking-[0.01em] text-[#737373]`}
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
        <div className="absolute top-[calc(100%+0.375rem)] left-0 z-40 w-full rounded-[4px] drop-shadow-[4px_4px_20px_rgba(0,0,0,0.25)]">
          <div className="rounded-[4px] border border-[#E5E7EA] bg-white px-0 py-2">
            <div className="flex max-h-[min(16rem,50vh)] flex-col gap-1 overflow-y-auto px-1">
              {options.map(option => {
                const isSelected = option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`flex h-9 w-full items-center gap-2 px-4 text-left transition ${
                      isSelected
                        ? `h-[42px] rounded-[4px] bg-[#5AD0DE] ${APP_BUTTON_TEXT_CLASS} font-bold leading-[150%] text-white`
                        : `rounded-[4px] bg-white ${APP_BODY_TEXT_CLASS} font-normal leading-5 tracking-[0.01em] text-[#484848] hover:bg-[#F3F9FB]`
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
  if (level === 'safe') {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-white">
        <span className="h-2 w-2 rounded-full bg-[#31A4BD]" />
        {result}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-bold text-white">
      <span className={level === 'danger' ? 'text-[#FF8A8A]' : 'text-[#F4C56A]'}>▲</span>
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
    <div className={`flex min-h-0 w-full flex-col pb-0 ${className}`.trim()}>
      <div className="min-h-0 w-full overflow-hidden">
        <div className="flex min-h-0 w-full flex-col overflow-visible">
          <div
            className={`grid h-[44px] w-full grid-cols-[7rem_5rem_minmax(8.5rem,1.15fr)_7rem_minmax(9.5rem,1.25fr)_7rem_8rem] items-center rounded-t-[16px] bg-white/20 px-2.5 text-[clamp(0.88rem,1vw,1rem)] font-bold leading-[140%] text-white lg:grid-cols-[7.5rem_5.5rem_minmax(10rem,1.2fr)_7.5rem_minmax(10.5rem,1.3fr)_7.5rem_8.5rem] lg:px-3.5 xl:grid-cols-[8rem_6rem_minmax(11rem,1.25fr)_8rem_minmax(11.5rem,1.35fr)_8rem_9rem] xl:px-5`.trim()}
          >
            <span>탐지 일시</span>
            <span>AI 타입</span>
            <span>프롬프트</span>
            <span>탐지 결과</span>
            <span>탐지 내용</span>
            <span>이용자 IP</span>
            <span>이용자 ID</span>
          </div>

          <div
            className={`mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 ${bodyClassName}`.trim()}
          >
            {rows.map((row, index) => {
              const isSelected = activeRowId === row.id;
              const isStriped = index % 2 === 1;
              const baseRowClass = isStriped ? 'bg-white/20' : 'bg-[#0F1214]';

              return (
                <div key={row.id} className="w-full overflow-visible">
                  <div
                    className={`rounded-lg transition ${
                      isSelected
                        ? 'border border-[#026E92] bg-[#026E92] text-white shadow-[0_10px_24px_rgba(2,110,146,0.3)]'
                        : `${baseRowClass} border border-white text-white hover:-translate-y-px hover:border-[#5AD0DE] hover:bg-[rgba(90,208,222,0.2)] hover:text-[#5AD0DE]`
                    }`.trim()}
                  >
                    <button
                      type="button"
                      className={`grid h-[45px] w-full cursor-pointer grid-cols-[7rem_5rem_minmax(8.5rem,1.15fr)_7rem_minmax(9.5rem,1.25fr)_7rem_8rem] items-center rounded-lg px-3 text-left text-[clamp(0.76rem,0.82vw,0.86rem)] leading-[150%] text-white ${
                        isSelected ? 'font-bold' : 'font-normal hover:text-[#5AD0DE]'
                      } lg:grid-cols-[7.5rem_5.5rem_minmax(10rem,1.2fr)_7.5rem_minmax(10.5rem,1.3fr)_7.5rem_8.5rem] lg:px-4 xl:grid-cols-[8rem_6rem_minmax(11rem,1.25fr)_8rem_minmax(11.5rem,1.35fr)_8rem_9rem] xl:px-6`.trim()}
                      onClick={() => onSelectRow(row)}
                    >
                      <span className="truncate pr-2">{row.detectedAt}</span>
                      <span className="truncate pr-2">{row.aiType}</span>
                      <span className="truncate pr-2 xl:pr-3">{row.prompt}</span>
                      <span className="truncate pr-2">
                        <MonitoringResultChip level={row.level} result={row.result} />
                      </span>
                      <span className="truncate pr-2 xl:pr-3">{row.content}</span>
                      <span className="truncate pr-2">{row.userIp}</span>
                      <span className="truncate">{row.userId}</span>
                    </button>
                  </div>

                  {isSelected && renderExpandedRow ? (
                    <div className="mt-2 rounded-[16px] border border-[#026E92]/60 bg-[#11161D] px-4 py-4 lg:px-5">
                      {renderExpandedRow(row)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
