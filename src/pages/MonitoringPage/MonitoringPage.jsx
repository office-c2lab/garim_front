import PageLayout from '../../layout/PageLayout.jsx';

const logs = [
  {
    id: 1,
    detectedAt: '2025-12-08 13:22',
    aiType: 'ChatGPT',
    prompt: '김철수 / choi.sokim@example.com / 송장 처리 우선순위 요청',
    result: '개인정보 탐지',
    content: '개인정보 탐지 · 이메일 4건 · 사용자 식별자 포함',
    userIp: '211.44.92.110',
    userId: 'ahn@cloudmate.com',
    level: 'danger',
  },
  {
    id: 2,
    detectedAt: '2025-12-08 13:17',
    aiType: 'ChatGPT',
    prompt: 'CP 2025 Alpha Cloud Lite 계약서 요약 요청',
    result: '기밀정보 탐지',
    content: '기밀정보 탐지 · 내부 계약 문구 포함',
    userIp: '211.44.92.110',
    userId: 'park@cloudmate.com',
    level: 'warning',
  },
  {
    id: 3,
    detectedAt: '2025-12-08 13:10',
    aiType: 'ChatGPT',
    prompt: 'word 파일 업로드 후 요약 요청',
    result: '정상',
    content: '위험 키워드 없이 정상 요청으로 처리',
    userIp: '211.44.92.110',
    userId: 'lee@cloudmate.com',
    level: 'safe',
  },
  {
    id: 4,
    detectedAt: '2025-12-08 10:30',
    aiType: 'ChatGPT',
    prompt: '대외 전달용 제안서 초안 생성',
    result: '기밀정보 탐지',
    content: '프로젝트명과 내부 담당자 정보 포함',
    userIp: '211.44.92.110',
    userId: 'kim@cloudmate.com',
    level: 'warning',
  },
  {
    id: 5,
    detectedAt: '2025-12-08 09:21',
    aiType: 'ChatGPT',
    prompt: '회사 월별 영업 분석 요청',
    result: '프롬프트 위협',
    content: '프롬프트 인젝션 의심 · 내부 수치 데이터 포함',
    userIp: '211.44.92.110',
    userId: 'choi@cloudmate.com',
    level: 'danger',
  },
  {
    id: 6,
    detectedAt: '2025-12-08 09:03',
    aiType: 'ChatGPT',
    prompt: '방학별 매출 데이터 분석 요청',
    result: '프롬프트 위협',
    content: '프롬프트 인젝션 지시 포함',
    userIp: '211.44.92.110',
    userId: 'jeong@cloudmate.com',
    level: 'warning',
  },
];

const selectedLog = logs[0];

function RiskMark({ level }) {
  if (level === 'safe') {
    return <span className="font-semibold text-[#31A4BD]">정상</span>;
  }

  return (
    <span className={level === 'danger' ? 'text-[#FF8A8A]' : 'text-[#F4C56A]'}>
      ▲
    </span>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] font-semibold text-[#8B95A5]">
        {label}
      </label>
      <div className="flex min-h-[32px] items-center rounded-[6px] border border-white/10 bg-[#0B0F14] px-3 text-[12px] text-[#D9E0EA]">
        {children}
      </div>
    </div>
  );
}

function TextBox({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] font-semibold text-[#8B95A5]">
        {label}
      </label>
      <div className="min-h-[62px] rounded-[6px] border border-white/10 bg-[#0B0F14] px-3 py-2 text-[12px] leading-[1.65] text-[#D9E0EA]">
        {children}
      </div>
    </div>
  );
}

export default function MonitoringPage() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-[180px_110px]">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8B95A5]">
                관리 조직
              </label>
              <select className="h-[32px] w-full rounded-[6px] border border-white/10 bg-[#0B0F14] px-2.5 text-[12px] text-[#D9E0EA] outline-none">
                <option>전체</option>
                <option>AI 서비스팀</option>
                <option>보안 운영팀</option>
              </select>
            </div>

            <button
              type="button"
              className="mt-auto h-[32px] cursor-pointer rounded-[6px] bg-[#31A4BD] px-5 text-[12px] font-bold text-white transition hover:bg-[#3CB6D1]"
            >
              조회
            </button>
          </div>

          <button
            type="button"
            className="h-[32px] cursor-pointer rounded-[6px] border border-[#31A4BD]/25 bg-[#31A4BD]/10 px-3 text-[11px] font-bold text-[#8AD4E4] transition hover:bg-[#31A4BD]/16"
          >
            프롬프트 이력 다운로드
          </button>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] table-fixed text-left text-[11px]">
              <thead className="bg-[#252B37] text-[#AEB7C6]">
                <tr>
                  <th className="w-[112px] px-2.5 py-2.5 font-bold">탐지 일시</th>
                  <th className="w-[76px] px-2.5 py-2.5 font-bold">AI 타입</th>
                  <th className="px-2.5 py-2.5 font-bold">프롬프트</th>
                  <th className="w-[104px] px-2.5 py-2.5 font-bold">탐지 결과</th>
                  <th className="px-2.5 py-2.5 font-bold">탐지 내용</th>
                  <th className="w-[94px] px-2.5 py-2.5 font-bold">이용자 IP</th>
                  <th className="w-[148px] px-2.5 py-2.5 font-bold">이용자 ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/8 bg-[#121720] text-[#D9E0EA]">
                {logs.map(log => (
                  <tr
                    key={log.id}
                    className={`cursor-pointer transition hover:bg-white/[0.045] ${
                      log.id === selectedLog.id ? 'bg-[#31A4BD]/10' : ''
                    }`}
                  >
                    <td className="px-2.5 py-2.5 text-[#AEB7C6]">{log.detectedAt}</td>
                    <td className="px-2.5 py-2.5">{log.aiType}</td>
                    <td className="truncate px-2.5 py-2.5 text-white">{log.prompt}</td>
                    <td className="px-2.5 py-2.5 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <RiskMark level={log.level} />
                        {log.result}
                      </span>
                    </td>
                    <td className="truncate px-2.5 py-2.5">{log.content}</td>
                    <td className="px-2.5 py-2.5">{log.userIp}</td>
                    <td className="truncate px-2.5 py-2.5">{log.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-[3px] rounded-full bg-[#2B3340]">
          <div className="h-full w-1/2 rounded-full bg-[#6B7280]" />
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          <Field label="AI 타입">{selectedLog.aiType}</Field>
          <Field label="이용자 ID">{selectedLog.userId}</Field>
          <Field label="이용자 IP">{selectedLog.userIp}</Field>
          <Field label="탐지 일시">{selectedLog.detectedAt}</Field>
        </div>

        <TextBox label="프롬프트">
          김철수 / choi.sokim@example.com / 배송지 총주고 수탁건수 / 아이템 / 2,500원
          <br />
          이영희 / yeonghee@example.com / 회사 공통자료 요청 / 2,500원
          <br />
          박민수 / ahn77@gmail.com / 내부 정산서 분석 / 협력사 / 1,300원
          <br />
          최민준 / choi@gmail.com / 내부 문서번호 포함 조회 / 데이터 요청 / 1,900원
        </TextBox>

        <div className="grid gap-2 md:grid-cols-[280px_1fr]">
          <Field label="탐지 결과">
            <span className="font-bold text-[#FF9C9C]">{selectedLog.result}</span>
          </Field>
        </div>

        <TextBox label="탐지 내용">
          <p className="font-bold text-[#F4D58A]">▲ 개인정보 탐지</p>
          <p>
            - 이메일 4건: choi.sokim@example.com, yeonghee.lee@example.com,
            ahn77@gmail.com, choi@gmail.com
          </p>
          <p>- 사용자 식별 가능 정보와 거래 금액, 내부 문서 정보가 함께 포함되었습니다.</p>
          <p>- 외부 AI 전송 전 개인정보 마스킹 또는 정책 승인 절차가 필요합니다.</p>
        </TextBox>

        <TextBox label="조치 내용">
          개인정보가 포함된 프롬프트는 외부 AI 서비스로 전송하기 전 자동 마스킹 처리합니다.
          반복 탐지되는 항목은 정책 차단 조건에 추가하고, 관리자 검토 후 예외 처리 여부를
          결정합니다.
        </TextBox>
      </div>
    </PageLayout>
  );
}