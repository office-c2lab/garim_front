export const monitoringTableSurfaceClass =
  'flex min-h-0 w-full flex-col overflow-hidden rounded-[14px] border border-[#ECEFF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]';

export const monitoringTableScrollClass = 'min-h-0 w-full overflow-x-auto xl:overflow-x-hidden';

export const monitoringTableClass = 'w-full table-fixed border-separate border-spacing-0';

export const monitoringTableHeadClass = 'bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)]';

export const monitoringTableHeaderRowClass =
  'text-[14px] font-semibold leading-[1.4] text-[#4A5578] xl:text-[15px]';

export const monitoringTableHeaderCellClass =
  'border-b border-[#E7EBF4] px-4 py-[14px] text-left font-semibold';

export const monitoringTableBodyClass = 'text-[14px] leading-[1.45] text-[#344054] xl:text-[15px]';

export function monitoringTableRowClass({
  selected = false,
  striped = false,
  interactive = false,
} = {}) {
  const baseRowClass = striped ? 'bg-[#FEFEFF]' : 'bg-white';
  const stateClass = selected
    ? 'bg-[#F5F3FF] text-[#20264D]'
    : `${baseRowClass} text-[#344054] hover:bg-slate-50`;

  return `${interactive ? 'cursor-pointer ' : ''}transition ${stateClass}`.trim();
}

export function monitoringTableCellClass(index, className = '') {
  const borderClass = index === 0 ? '' : 'border-t border-[#EEF2F7]';

  return `${borderClass} px-4 py-[13px] ${className}`.trim();
}
