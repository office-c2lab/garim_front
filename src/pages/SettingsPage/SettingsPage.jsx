import { Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  monitoringTableBodyClass,
  monitoringTableCellClass,
  monitoringTableClass,
  monitoringTableHeadClass,
  monitoringTableHeaderCellClass,
  monitoringTableHeaderRowClass,
  monitoringTableRowClass,
  monitoringTableScrollClass,
  monitoringTableSurfaceClass,
} from '../../components/monitoring/monitoringTableStyles.js';
import PageLayout from '../../layout/PageLayout.jsx';

const SETTINGS_TABS = [
  { key: 'departments', label: '부서', singular: '부서' },
  { key: 'positions', label: '직책', singular: '직책' },
  { key: 'grades', label: '직급', singular: '직급' },
];

const DEFAULT_MODAL_DRAFT = {
  category: SETTINGS_TABS[0].key,
  name: '',
  description: '',
  enabled: true,
  order: '',
};

const INITIAL_ITEMS = {
  departments: [
    {
      id: 'dept-security',
      name: '보안팀',
      description: '보안 정책 및 시스템 보안을 담당하는 부서',
      enabled: true,
      order: 1,
      updatedAt: '2026-05-29 14:30',
    },
    {
      id: 'dept-dev',
      name: '개발팀',
      description: '제품 개발 및 시스템 운영을 담당하는 부서',
      enabled: true,
      order: 2,
      updatedAt: '2026-05-29 14:30',
    },
    {
      id: 'dept-ops',
      name: '운영팀',
      description: '서비스 운영 및 인프라 관리를 담당하는 부서',
      enabled: true,
      order: 3,
      updatedAt: '2026-05-29 14:30',
    },
    {
      id: 'dept-support',
      name: '경영지원팀',
      description: '경영지원 및 총무 업무를 담당하는 부서',
      enabled: true,
      order: 4,
      updatedAt: '2026-05-20 10:15',
    },
    {
      id: 'dept-hr',
      name: '인사팀',
      description: '채용 및 인사 관리를 담당하는 부서',
      enabled: false,
      order: 5,
      updatedAt: '2026-05-15 09:20',
    },
    {
      id: 'dept-marketing',
      name: '마케팅팀',
      description: '마케팅 전략 및 캠페인을 담당하는 부서',
      enabled: false,
      order: 6,
      updatedAt: '2026-05-15 09:20',
    },
  ],
  positions: [
    {
      id: 'position-lead',
      name: '팀장',
      description: '팀 운영과 구성원 업무 배분을 담당하는 직책',
      enabled: true,
      order: 1,
      updatedAt: '2026-05-29 14:30',
    },
    {
      id: 'position-manager',
      name: '매니저',
      description: '담당 업무의 실행과 보고를 관리하는 직책',
      enabled: true,
      order: 2,
      updatedAt: '2026-05-29 14:30',
    },
    {
      id: 'position-owner',
      name: '담당자',
      description: '업무 실무와 운영 처리를 수행하는 직책',
      enabled: true,
      order: 3,
      updatedAt: '2026-05-22 11:05',
    },
    {
      id: 'position-intern',
      name: '인턴',
      description: '지원 업무와 실무 보조를 수행하는 직책',
      enabled: false,
      order: 4,
      updatedAt: '2026-05-12 16:40',
    },
  ],
  grades: [
    {
      id: 'grade-director',
      name: '이사',
      description: '조직 전략과 주요 의사결정을 담당하는 직급',
      enabled: true,
      order: 1,
      updatedAt: '2026-05-29 14:30',
    },
    {
      id: 'grade-principal',
      name: '책임',
      description: '전문 영역의 리딩과 품질 관리를 담당하는 직급',
      enabled: true,
      order: 2,
      updatedAt: '2026-05-29 14:30',
    },
    {
      id: 'grade-senior',
      name: '선임',
      description: '주요 업무 수행과 실무 개선을 담당하는 직급',
      enabled: true,
      order: 3,
      updatedAt: '2026-05-21 13:10',
    },
    {
      id: 'grade-staff',
      name: '사원',
      description: '기본 업무 수행과 운영 지원을 담당하는 직급',
      enabled: false,
      order: 4,
      updatedAt: '2026-05-11 09:35',
    },
  ],
};

function formatUpdatedAt() {
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}`;
}

function StatusBadge({ enabled }) {
  return (
    <span
      className={`inline-flex h-7 min-w-[3.35rem] items-center justify-center rounded-full px-3 text-[0.78rem] font-bold ${
        enabled ? 'bg-[#E8F8EE] text-[#15924D]' : 'bg-[#F1F3F7] text-[#697386]'
      }`.trim()}
    >
      {enabled ? '사용' : '미사용'}
    </span>
  );
}

function RowActionButton({ children, variant = 'secondary', onClick }) {
  const variantClass =
    variant === 'primary'
      ? 'border-[#4338CA] bg-[#4338CA] text-white shadow-[0_8px_18px_rgba(67,56,202,0.2)] hover:bg-[#3730A3]'
      : 'border-[#DDD6FE] bg-white text-[#4338CA] hover:bg-[#F5F3FF]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 min-w-[3.5rem] items-center justify-center rounded-lg border px-3 text-[0.78rem] font-bold transition ${variantClass}`.trim()}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children, required = false, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-bold text-slate-900">
      {children}
      {required ? <span className="ml-0.5 text-[#E11D48]">*</span> : null}
    </label>
  );
}

function SettingsItemModal({ mode, draft, onChange, onClose, onSubmit, isSubmitDisabled }) {
  const isEditMode = mode === 'edit';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,23,42,0.28)] px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-item-modal-title"
        className="flex max-h-[calc(100vh-3rem)] w-full max-w-[30rem] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 id="settings-item-modal-title" className="text-xl font-bold text-slate-950">
            항목 {isEditMode ? '수정' : '추가'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="monitoring-detail-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-category">분류</FieldLabel>
              <select
                id="settings-item-category"
                value={draft.category}
                onChange={event => onChange({ category: event.target.value })}
                className="h-12 w-full rounded-lg border border-[#DDE3ED] bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#EDE9FE]"
              >
                {SETTINGS_TABS.map(tab => (
                  <option key={tab.key} value={tab.key}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-name" required>
                항목명
              </FieldLabel>
              <input
                id="settings-item-name"
                type="text"
                value={draft.name}
                maxLength={30}
                onChange={event => onChange({ name: event.target.value })}
                placeholder="항목명을 입력하세요."
                className="h-12 w-full rounded-lg border border-[#DDE3ED] bg-white px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#EDE9FE]"
              />
              <span className="text-right text-xs font-semibold text-slate-400">
                {draft.name.length}/30
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-description">설명</FieldLabel>
              <input
                id="settings-item-description"
                type="text"
                value={draft.description}
                maxLength={100}
                onChange={event => onChange({ description: event.target.value })}
                placeholder="설명을 입력하세요. (선택)"
                className="h-12 w-full rounded-lg border border-[#DDE3ED] bg-white px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#EDE9FE]"
              />
              <span className="text-right text-xs font-semibold text-slate-400">
                {draft.description.length}/100
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-enabled">사용 여부</FieldLabel>
              <select
                id="settings-item-enabled"
                value={draft.enabled ? 'enabled' : 'disabled'}
                onChange={event => onChange({ enabled: event.target.value === 'enabled' })}
                className="h-12 w-full rounded-lg border border-[#DDE3ED] bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#EDE9FE]"
              >
                <option value="enabled">사용</option>
                <option value="disabled">미사용</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-order" required>
                정렬 순서
              </FieldLabel>
              <input
                id="settings-item-order"
                type="number"
                min="1"
                inputMode="numeric"
                value={draft.order}
                onChange={event => onChange({ order: event.target.value })}
                placeholder="숫자를 입력하세요."
                className="h-12 w-full rounded-lg border border-[#DDE3ED] bg-white px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#EDE9FE]"
              />
              <span className="text-xs font-semibold text-slate-500">
                낮은 숫자일수록 상단에 표시됩니다.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-lg border border-[#E2E8F0] bg-white text-sm font-bold text-slate-600 shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="h-12 rounded-lg border border-[#5B21E5] bg-[#5B21E5] text-sm font-bold text-white shadow-[0_12px_24px_rgba(91,33,229,0.24)] transition hover:bg-[#4C1D95] disabled:border-[#C7D2FE] disabled:bg-[#C7D2FE]"
          >
            저장
          </button>
        </div>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState(SETTINGS_TABS[0].key);
  const [itemsByTab, setItemsByTab] = useState(INITIAL_ITEMS);
  const [modalState, setModalState] = useState({
    mode: null,
    itemId: null,
    sourceCategory: null,
    draft: DEFAULT_MODAL_DRAFT,
  });

  const selectedItems = useMemo(
    () => [...(itemsByTab[selectedTab] ?? [])].sort((a, b) => a.order - b.order),
    [itemsByTab, selectedTab]
  );
  const isModalOpen = Boolean(modalState.mode);
  const modalOrderNumber = Number(modalState.draft.order);
  const isModalSubmitDisabled =
    !modalState.draft.name.trim() ||
    !modalState.draft.order ||
    !Number.isFinite(modalOrderNumber) ||
    modalOrderNumber < 1;

  const handleSelectTab = key => {
    setSelectedTab(key);
  };

  const getNextOrder = category => {
    const categoryItems = itemsByTab[category] ?? [];
    const maxOrder = categoryItems.reduce((max, item) => Math.max(max, item.order), 0);

    return maxOrder + 1;
  };

  const handleOpenAddModal = () => {
    setModalState({
      mode: 'add',
      itemId: null,
      sourceCategory: selectedTab,
      draft: {
        ...DEFAULT_MODAL_DRAFT,
        category: selectedTab,
        order: String(getNextOrder(selectedTab)),
      },
    });
  };

  const handleOpenEditModal = item => {
    setModalState({
      mode: 'edit',
      itemId: item.id,
      sourceCategory: selectedTab,
      draft: {
        category: selectedTab,
        name: item.name,
        description: item.description,
        enabled: item.enabled,
        order: String(item.order),
      },
    });
  };

  const handleCloseModal = () => {
    setModalState({
      mode: null,
      itemId: null,
      sourceCategory: null,
      draft: DEFAULT_MODAL_DRAFT,
    });
  };

  const handleChangeModalDraft = nextDraft => {
    setModalState(current => ({
      ...current,
      draft: {
        ...current.draft,
        ...nextDraft,
      },
    }));
  };

  const handleSaveModal = () => {
    if (isModalSubmitDisabled) return;

    const { mode, itemId, sourceCategory, draft } = modalState;
    const targetCategory = draft.category;
    const nextItem = {
      id: itemId ?? `${targetCategory}-${Date.now()}`,
      name: draft.name.trim(),
      description: draft.description.trim(),
      enabled: draft.enabled,
      order: Number(draft.order),
      updatedAt: formatUpdatedAt(),
    };

    setItemsByTab(current => ({
      ...current,
      ...(mode === 'edit' && sourceCategory !== targetCategory
        ? {
            [sourceCategory]: current[sourceCategory].filter(item => item.id !== itemId),
          }
        : null),
      [targetCategory]:
        mode === 'edit' && sourceCategory === targetCategory
          ? current[targetCategory].map(item => (item.id === itemId ? nextItem : item))
          : [...current[targetCategory], nextItem],
    }));
    setSelectedTab(targetCategory);
    handleCloseModal();
  };

  const handleToggleEnabled = id => {
    setItemsByTab(current => ({
      ...current,
      [selectedTab]: current[selectedTab].map(item =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
              updatedAt: formatUpdatedAt(),
            }
          : item
      ),
    }));
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pb-3">
        <div className="flex flex-wrap gap-2">
          {SETTINGS_TABS.map(tab => {
            const isActive = tab.key === selectedTab;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelectTab(tab.key)}
                className={`inline-flex h-12 min-w-[8rem] items-center justify-center rounded-lg border px-5 text-sm font-bold transition ${
                  isActive
                    ? 'border-[#5B21E5] bg-[#5B21E5] text-white shadow-[0_14px_30px_rgba(91,33,229,0.25)]'
                    : 'border-[#E4E7F0] bg-white text-slate-600 hover:border-[#C7D2FE] hover:text-[#4338CA]'
                }`.trim()}
                aria-pressed={isActive}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#5B21E5] bg-[#5B21E5] px-5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(91,33,229,0.22)] transition hover:bg-[#4C1D95] active:bg-[#3B0764]"
            >
              <Plus className="h-4 w-4" />
              항목 추가
            </button>
          </div>

          <div className={monitoringTableSurfaceClass}>
            <div className={monitoringTableScrollClass}>
              <table className={`min-w-[920px] ${monitoringTableClass} text-left`}>
                <thead className={monitoringTableHeadClass}>
                  <tr className={monitoringTableHeaderRowClass}>
                    <th className={`${monitoringTableHeaderCellClass} w-[16%]`}>항목명</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[31%]`}>설명</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[12%] text-center`}>
                      사용 여부
                    </th>
                    <th className={`${monitoringTableHeaderCellClass} w-[12%] text-center`}>
                      정렬 순서
                    </th>
                    <th className={`${monitoringTableHeaderCellClass} w-[18%] text-center`}>
                      최종 수정일
                    </th>
                    <th className={`${monitoringTableHeaderCellClass} w-[11%] text-center`}>
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className={monitoringTableBodyClass}>
                  {selectedItems.map((item, index) => {
                    return (
                      <tr
                        key={item.id}
                        className={monitoringTableRowClass({
                          striped: index % 2 === 1,
                        })}
                      >
                        <td className={monitoringTableCellClass(index, 'align-middle')}>
                          <span className="font-bold text-slate-900">{item.name}</span>
                        </td>
                        <td className={monitoringTableCellClass(index, 'align-middle')}>
                          <span className="font-medium text-slate-700">{item.description}</span>
                        </td>
                        <td className={monitoringTableCellClass(index, 'text-center align-middle')}>
                          <StatusBadge enabled={item.enabled} />
                        </td>
                        <td
                          className={monitoringTableCellClass(
                            index,
                            'text-center align-middle font-bold text-slate-700'
                          )}
                        >
                          {item.order}
                        </td>
                        <td
                          className={monitoringTableCellClass(
                            index,
                            'text-center align-middle font-medium text-slate-600'
                          )}
                        >
                          {item.updatedAt}
                        </td>
                        <td className={monitoringTableCellClass(index, 'align-middle')}>
                          <div className="flex justify-center gap-2">
                            <RowActionButton onClick={() => handleOpenEditModal(item)}>
                              수정
                            </RowActionButton>
                            <RowActionButton
                              variant={item.enabled ? 'secondary' : 'primary'}
                              onClick={() => handleToggleEnabled(item.id)}
                            >
                              {item.enabled ? '미사용' : '사용'}
                            </RowActionButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen ? (
        <SettingsItemModal
          mode={modalState.mode}
          draft={modalState.draft}
          onChange={handleChangeModalDraft}
          onClose={handleCloseModal}
          onSubmit={handleSaveModal}
          isSubmitDisabled={isModalSubmitDisabled}
        />
      ) : null}
    </PageLayout>
  );
}
