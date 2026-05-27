import { Eye, LockKeyhole } from 'lucide-react';

import PageLayout from '../../layout/PageLayout.jsx';
import SectionCard from '../../components/SectionCard.jsx';

const accountRows = [
  { label: '이름', value: 'C2lab 관리자', editable: true },
  { label: '이메일', value: 'admin@garim.com', editable: false },
  { label: '권한', value: '관리자', editable: false },
  { label: '최근 로그인', value: '2026-05-27 14:32', editable: false },
  { label: '최근 접속 IP', value: '203.0.113.45', editable: false },
];

function DisabledEditButton() {
  return (
    <span className="inline-flex h-8 items-center justify-center rounded-md bg-[#F1F4F9] px-3 text-xs font-bold text-[#8A93A5]">
      수정 불가
    </span>
  );
}

function AccountEditButton() {
  return (
    <button
      type="button"
      className="inline-flex h-12 items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
    >
      수정하기
    </button>
  );
}

function PasswordField({ label, placeholder, canReveal = true }) {
  return (
    <label className="grid gap-3 lg:grid-cols-[10rem_1fr] lg:items-center">
      <span className="text-sm font-bold text-[#20264D]">{label}</span>
      <div className="relative">
        <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A5]" />
        <input
          type="password"
          placeholder={placeholder}
          className={`h-12 w-full rounded-lg border border-[#DDE4EF] bg-white px-11 text-sm font-semibold text-[#344054] outline-none transition placeholder:text-[#A7B0C0] focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE] ${
            canReveal ? 'pr-12' : 'pr-4'
          }`.trim()}
        />
        {canReveal ? (
          <button
            type="button"
            aria-label={`${label} 보기`}
            className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#5B39D6]"
          >
            <Eye className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </label>
  );
}

export default function MyPage() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <SectionCard className="overflow-hidden">
          <div className="border-b border-[#E7EBF4] px-6 py-5">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#111827]">계정 정보</h2>
          </div>
          <dl>
            {accountRows.map(row => (
              <div
                key={row.label}
                className="grid min-h-[4.6rem] grid-cols-[8rem_1fr_auto] items-center gap-4 border-b border-[#E7EBF4] px-6 last:border-b-0"
              >
                <dt className="text-sm font-bold text-[#20264D]">{row.label}</dt>
                <dd className="text-sm font-semibold text-[#526078]">{row.value}</dd>
                {row.editable ? <AccountEditButton /> : <DisabledEditButton />}
              </div>
            ))}
          </dl>
        </SectionCard>

        <SectionCard className="overflow-hidden">
          <div className="border-b border-[#E7EBF4] px-6 py-5">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#111827]">비밀번호 변경</h2>
          </div>
          <div className="px-6 py-8">
            <div className="space-y-5">
              <PasswordField
                label="현재 비밀번호"
                placeholder="현재 비밀번호를 입력하세요"
                canReveal={false}
              />
              <PasswordField label="새 비밀번호" placeholder="새 비밀번호를 입력하세요" />
              <PasswordField label="새 비밀번호 확인" placeholder="새 비밀번호를 다시 입력하세요" />
            </div>

            <div className="mt-5 flex flex-col gap-5 lg:ml-[10rem] lg:flex-row lg:items-center lg:justify-between">
              <p className="flex items-start gap-2 text-xs font-semibold text-[#64728C]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B39D6]" />
                영문, 숫자, 특수문자를 포함하여 8자 이상 입력해 주세요.
              </p>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#4338CA] bg-[#4338CA] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81] lg:min-w-[11rem]"
              >
                <LockKeyhole className="h-4 w-4" />
                비밀번호 변경
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageLayout>
  );
}
