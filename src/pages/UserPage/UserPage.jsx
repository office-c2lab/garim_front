import { MoreVertical, Search } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import SectionCard from '../../components/SectionCard.jsx';
import { MonitoringDropdown } from '../../components/monitoring/MonitoringListComponents.jsx';
import PageLayout from '../../layout/PageLayout.jsx';

const initialUsers = [
  {
    id: 1,
    name: '박지훈',
    email: 'jihun.park@garim.co.kr',
    ip: '203.0.113.23',
    department: '기술팀',
    position: '시니어 엔지니어',
    updatedAt: '2025-05-20 14:32',
  },
  {
    id: 2,
    name: '김동석',
    email: 'dongseok.kim@garim.co.kr',
    ip: '203.0.113.45',
    department: '보안팀',
    position: '보안 엔지니어',
    updatedAt: '2025-05-21 09:15',
  },
  {
    id: 3,
    name: '이서연',
    email: 'seoyeon.lee@garim.co.kr',
    ip: '198.51.100.77',
    department: '영업팀',
    position: '세일즈 매니저',
    updatedAt: '2025-05-19 16:45',
  },
  {
    id: 4,
    name: '정우진',
    email: 'woojin.jung@garim.co.kr',
    ip: '203.0.113.99',
    department: '기술팀',
    position: '백엔드 엔지니어',
    updatedAt: '2025-05-18 11:07',
  },
  {
    id: 5,
    name: '최민서',
    email: 'minseo.choi@garim.co.kr',
    ip: '192.0.2.58',
    department: '관리팀',
    position: '관리 매니저',
    updatedAt: '2025-05-17 10:22',
  },
];

const departmentOptions = ['전체 부서', '기술팀', '보안팀', '영업팀', '관리팀'];

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

function UserDetailPanel({ user, onUpdate, onDelete }) {
  return (
    <div className="bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">사용자 상세 설정</h2>
          <p className="mt-1 text-sm text-slate-400">
            선택한 사용자의 기본 정보와 고정 IP를 확인할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2]"
        >
          삭제
        </button>
      </div>

      <div className="grid bg-white xl:grid-cols-[1.05fr_0.95fr]">
        <DetailSection title="기본 정보" className="xl:border-r">
          <DetailField label="사용자명">
            <TextInput value={user.name} onChange={value => onUpdate({ name: value })} />
          </DetailField>
          <DetailField label="이메일">
            <TextInput value={user.email} onChange={value => onUpdate({ email: value })} />
          </DetailField>
          <DetailField label="부서">
            <TextInput value={user.department} onChange={value => onUpdate({ department: value })} />
          </DetailField>
          <DetailField label="직책">
            <TextInput value={user.position} onChange={value => onUpdate({ position: value })} />
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
            className="h-10 min-w-[6.5rem] rounded-md border border-[#D7DDE8] bg-white px-5 text-[13px] font-bold text-[#344054] transition hover:bg-[#F8FAFF]"
          >
            취소
          </button>
          <button
            type="button"
            className="h-10 min-w-[6.5rem] rounded-md border border-[#4338CA] bg-[#4338CA] px-5 text-[13px] font-bold text-white transition hover:bg-[#3730A3]"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserPage() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedId, setSelectedId] = useState(initialUsers[1].id);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState(departmentOptions[0]);

  const selectedUser = users.find(user => user.id === selectedId) ?? users[0];

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return users.filter(user => {
      const matchesQuery = normalizedQuery
        ? [user.name, user.email, user.ip].some(value =>
            value.toLowerCase().includes(normalizedQuery)
          )
        : true;
      const matchesDepartment = department === '전체 부서' || user.department === department;

      return matchesQuery && matchesDepartment;
    });
  }, [department, searchQuery, users]);

  const updateSelectedUser = patch => {
    setUsers(current =>
      current.map(user => (user.id === selectedUser.id ? { ...user, ...patch } : user))
    );
  };

  const handleDeleteSelectedUser = () => {
    setUsers(current => {
      const nextUsers = current.filter(user => user.id !== selectedUser.id);
      setSelectedId(nextUsers[0]?.id ?? null);
      return nextUsers;
    });
  };

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
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full table-fixed text-left">
              <thead className="bg-[#F8FAFC] text-sm font-semibold text-slate-500">
                <tr>
                  <th className="w-12 px-5 py-4" />
                  <th className="w-[16%] px-4 py-4">사용자명</th>
                  <th className="w-[30%] px-4 py-4">이메일</th>
                  <th className="w-[18%] px-4 py-4">IP 주소</th>
                  <th className="w-[15%] px-4 py-4">부서</th>
                  <th className="w-[18%] px-4 py-4">최종 수정일</th>
                  <th className="w-[3rem] px-3 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {filteredUsers.map(user => {
                  const isSelected = user.id === selectedId;

                  return (
                    <Fragment key={user.id}>
                      <tr
                        onClick={() => setSelectedId(current => (current === user.id ? null : user.id))}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-[#F5F3FF]' : 'bg-white hover:bg-slate-50'
                        }`.trim()}
                      >
                        <td className="px-5 py-4 align-middle">
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
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-800">{user.name}</span>
                        </td>
                        <td className="truncate px-4 py-4">{user.email}</td>
                        <td className="px-4 py-4">{user.ip}</td>
                        <td className="px-4 py-4 font-semibold">{user.department}</td>
                        <td className="px-4 py-4">{user.updatedAt}</td>
                        <td className="px-3 py-4">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#64728C] transition hover:bg-white hover:text-[#3528B8]"
                            aria-label={`${user.name} 추가 메뉴`}
                            onClick={event => event.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {isSelected ? (
                        <tr>
                          <td colSpan={7} className="border-t border-slate-200 bg-white p-0">
                            <UserDetailPanel
                              user={selectedUser}
                              onUpdate={updateSelectedUser}
                              onDelete={handleDeleteSelectedUser}
                            />
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

        </SectionCard>
      </div>
    </PageLayout>
  );
}
