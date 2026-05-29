import { Search } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import SectionCard from '../../components/SectionCard.jsx';
import { MonitoringDropdown } from '../../components/monitoring/MonitoringListComponents.jsx';
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
import {
  usePatchClientMetadataMutation,
  useRegisteredClientsQuery,
} from '../../queries/userManagementQueries.js';

const DEFAULT_DEPARTMENT_OPTION = '전체 부서';

function getFallbackValue(value) {
  return value?.trim() || '-';
}

function normalizeClient(client) {
  return {
    id: String(client.id ?? client.client_id),
    name: client.user_name ?? '',
    email: client.email ?? '',
    ip: client.client_ip ?? '-',
    department: client.department ?? '',
    position: client.position ?? '',
    createdAt: client.time_kst ?? '-',
  };
}

function createUserDraft(user) {
  return {
    name: user.name,
    email: user.email,
    department: user.department,
    position: user.position,
  };
}

function DetailField({ label, children }) {
  return (
    <div className="grid grid-cols-[4.4rem_1fr] items-center gap-3 text-[13px]">
      <span className="font-semibold text-[#5E6A84]">{label}</span>
      {children}
    </div>
  );
}

function TextInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={event => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-[#D7DDE8] bg-white px-3 text-[13px] font-medium text-[#344054] outline-none transition focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
    />
  );
}

function DetailSection({ title, children, className = '' }) {
  return (
    <section className={`border-[#E3E8F2] px-5 py-5 ${className}`.trim()}>
      <h3 className="mb-4 text-[14px] font-bold text-[#23304A]">{title}</h3>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

function UserDetailPanel({ user, onSave, isSaving }) {
  const [draft, setDraft] = useState(() => createUserDraft(user));

  const updateDraft = patch => {
    setDraft(current => ({ ...current, ...patch }));
  };

  const handleCancel = () => {
    setDraft(createUserDraft(user));
  };

  const handleSave = () => {
    onSave(draft);
  };

  return (
    <div className="bg-white">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">사용자 상세 설정</h2>
          <p className="mt-1 text-sm text-slate-400">
            선택한 사용자의 기본 정보와 고정 IP를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="grid bg-white xl:grid-cols-[1.05fr_0.95fr]">
        <DetailSection title="기본 정보" className="xl:border-r">
          <DetailField label="사용자명">
            <TextInput value={draft.name} onChange={value => updateDraft({ name: value })} />
          </DetailField>
          <DetailField label="이메일">
            <TextInput value={draft.email} onChange={value => updateDraft({ email: value })} />
          </DetailField>
          <DetailField label="부서">
            <TextInput
              value={draft.department}
              onChange={value => updateDraft({ department: value })}
            />
          </DetailField>
          <DetailField label="직책">
            <TextInput
              value={draft.position}
              onChange={value => updateDraft({ position: value })}
            />
          </DetailField>
        </DetailSection>

        <DetailSection title="IP 정보" className="border-t xl:border-t-0">
          <DetailField label="고정 IP">
            <div className="flex h-10 cursor-default select-none items-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] font-semibold text-[#344054]">
              {user.ip}
            </div>
          </DetailField>
        </DetailSection>

        <div className="flex justify-end gap-3 border-t border-[#DDE3EF] px-5 py-4 xl:col-span-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-10 min-w-[6.5rem] rounded-md border border-[#D7DDE8] bg-white px-5 text-[13px] font-bold text-[#344054] transition hover:bg-[#F8FAFF]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 min-w-[6.5rem] rounded-md border border-[#4338CA] bg-[#4338CA] px-5 text-[13px] font-bold text-white transition hover:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? '저장 중' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState(DEFAULT_DEPARTMENT_OPTION);
  const { data: clientsData, isError, isFetching, isLoading } = useRegisteredClientsQuery();
  const { mutate: patchClientMetadata, isPending: isSaving } = usePatchClientMetadataMutation();

  const users = useMemo(() => {
    return (clientsData?.clients ?? []).map(normalizeClient);
  }, [clientsData?.clients]);

  const departmentOptions = useMemo(() => {
    const departments = users
      .map(user => user.department.trim())
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index);

    return [DEFAULT_DEPARTMENT_OPTION, ...departments];
  }, [users]);

  const selectedUser = users.find(user => user.id === selectedId) ?? null;

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return users.filter(user => {
      const matchesQuery = normalizedQuery
        ? [user.name, user.email, user.ip].some(value =>
            value.toLowerCase().includes(normalizedQuery)
          )
        : true;
      const matchesDepartment =
        department === DEFAULT_DEPARTMENT_OPTION || user.department === department;

      return matchesQuery && matchesDepartment;
    });
  }, [department, searchQuery, users]);

  const handleSaveSelectedUser = draft => {
    if (!selectedUser) return;

    patchClientMetadata({
      id: selectedUser.id,
      metadata: {
        user_name: draft.name,
        email: draft.email,
        department: draft.department,
        position: draft.position,
      },
    });
  };

  const statusMessage = isError
    ? '사용자 목록을 불러오지 못했습니다.'
    : isLoading
      ? '사용자 목록을 불러오는 중입니다.'
      : isFetching
        ? '사용자 목록을 갱신하는 중입니다.'
        : !filteredUsers.length
          ? '현재 조건에 맞는 사용자가 없습니다.'
          : '';

  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pb-3">
        <div className="flex flex-col gap-4 pt-1">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row">
              <MonitoringDropdown
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
                ariaLabel="전체 부서"
                widthClass="w-full lg:w-[12rem] lg:shrink-0"
                triggerClassName="h-12 rounded-xl border-slate-200 bg-white shadow-none"
              />

              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                    placeholder="사용자명, 이메일, IP 검색"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                  />
                  <Search className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </label>
                <button
                  type="button"
                  onClick={() => setSearchQuery(searchInput)}
                  className="inline-flex h-12 min-w-[6rem] items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
                >
                  검색
                </button>
              </div>
            </div>
          </div>
        </div>

        <SectionCard className="overflow-hidden">
          <div className={monitoringTableSurfaceClass}>
            <div className="overflow-hidden">
              <table className={`${monitoringTableClass} text-left`}>
                <thead className={monitoringTableHeadClass}>
                  <tr className={monitoringTableHeaderRowClass}>
                    <th className={`${monitoringTableHeaderCellClass} w-[4%] px-4`} />
                    <th
                      className={`${monitoringTableHeaderCellClass} w-[15%] whitespace-nowrap px-3`}
                    >
                      IP 주소
                    </th>
                    <th
                      className={`${monitoringTableHeaderCellClass} w-[10%] whitespace-nowrap px-3`}
                    >
                      사용자명
                    </th>
                    <th
                      className={`${monitoringTableHeaderCellClass} w-[26%] whitespace-nowrap px-3`}
                    >
                      이메일
                    </th>
                    <th
                      className={`${monitoringTableHeaderCellClass} w-[10%] whitespace-nowrap px-3`}
                    >
                      부서
                    </th>
                    <th
                      className={`${monitoringTableHeaderCellClass} w-[17%] whitespace-nowrap px-3`}
                    >
                      직책
                    </th>
                    <th
                      className={`${monitoringTableHeaderCellClass} w-[18%] whitespace-nowrap px-3`}
                    >
                      최초 등록일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    const isSelected = user.id === selectedId;

                    return (
                      <Fragment key={user.id}>
                        <tr
                          onClick={() =>
                            setSelectedId(current => (current === user.id ? null : user.id))
                          }
                          className={monitoringTableRowClass({
                            selected: isSelected,
                            striped: index % 2 === 1,
                            interactive: true,
                          })}
                        >
                          <td className={monitoringTableCellClass(index, 'px-4 align-middle')}>
                            <button
                              type="button"
                              aria-label={`${user.name} 선택`}
                              className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                                isSelected ? 'border-[#4338CA]' : 'border-slate-300'
                              }`.trim()}
                            >
                              <span
                                className={`h-2.5 w-2.5 rounded-full transition ${
                                  isSelected ? 'bg-[#4338CA]' : 'bg-transparent'
                                }`.trim()}
                              />
                            </button>
                          </td>
                          <td className={monitoringTableCellClass(index, 'whitespace-nowrap px-3')}>
                            <span className="font-semibold text-slate-800">{user.ip}</span>
                          </td>
                          <td className={monitoringTableCellClass(index, 'whitespace-nowrap px-3')}>
                            {getFallbackValue(user.name)}
                          </td>
                          <td className={monitoringTableCellClass(index, 'whitespace-nowrap px-3')}>
                            <div className="truncate">{getFallbackValue(user.email)}</div>
                          </td>
                          <td
                            className={monitoringTableCellClass(
                              index,
                              'whitespace-nowrap px-3 font-semibold'
                            )}
                          >
                            {getFallbackValue(user.department)}
                          </td>
                          <td className={monitoringTableCellClass(index, 'whitespace-nowrap px-3')}>
                            <div className="truncate">{getFallbackValue(user.position)}</div>
                          </td>
                          <td className={monitoringTableCellClass(index, 'whitespace-nowrap px-3')}>
                            {user.createdAt}
                          </td>
                        </tr>
                        {isSelected ? (
                          <tr>
                            <td colSpan={7} className="border-t border-[#E5EBF5] bg-white p-0">
                              {selectedUser ? (
                                <UserDetailPanel
                                  key={selectedUser.id}
                                  user={selectedUser}
                                  onSave={handleSaveSelectedUser}
                                  isSaving={isSaving}
                                />
                              ) : null}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {statusMessage ? (
              <section className="border-t border-dashed border-[#DCEAF1] px-6 py-4 text-center text-sm text-[#94A3B8]">
                {statusMessage}
              </section>
            ) : null}
          </div>
        </SectionCard>
      </div>
    </PageLayout>
  );
}
