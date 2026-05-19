import { useMemo, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from './constants/contentLayout.js';

const demoProjects = [
  {
    id: 'project-garim-1',
    name: 'GARIM 메인 대시보드',
    type: 'URL',
    description: '브랜드 소개 페이지',
    isNew: true,
  },
  {
    id: 'project-garim-2',
    name: 'API 문서 허브',
    type: 'API',
    description: '백엔드 연동 문서',
  },
  {
    id: 'project-garim-3',
    name: '운영 리포트',
    type: 'URL',
    description: '팀별 진행 현황',
  },
];



function DashboardCard({ title, value, description }) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/6 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <p className="text-sm text-[#9EA2AE]">{title}</p>
      <strong className="mt-3 block text-3xl font-black tracking-tight text-white">{value}</strong>
      <p className="mt-2 text-sm leading-6 text-[#D2D5DB]">{description}</p>
    </article>
  );
}

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState(demoProjects[0].id);
  const activeProject = useMemo(
    () => demoProjects.find(project => project.id === activeProjectId) ?? demoProjects[0],
    [activeProjectId]
  );

  return (
    <AppShell
      projects={demoProjects}
      
      activeProjectId={activeProjectId}
      onProjectSelect={setActiveProjectId}
    >
      <div
        className={`mx-auto w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS}  pb-[clamp(2rem,4vw,3rem)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
      >
        <div
          className={`mx-auto flex min-h-full w-full flex-col gap-6 pt-5 sm:pt-8  ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
        >
          <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(49,164,189,0.22),rgba(255,255,255,0.05))] p-6 shadow-[0_28px_80px_rgba(1,12,28,0.3)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8AD4E4]">
              App Shell
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              `radar_front` 내부 영역 기준까지 같은 방식으로 맞췄습니다.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#D2D5DB] sm:text-base">
              본문은 이제 `radar_front` 페이지들과 같은 outer/inner width, 상단 여백, 하단 여백
              규칙을 그대로 사용합니다.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard
              title="선택된 프로젝트"
              value={activeProject.name}
              description="사이드바 선택 상태와 본문 카드가 같은 기준선 안에서 정렬됩니다."
            />
            <DashboardCard
              title="프로젝트 타입"
              value={activeProject.type}
              description="헤더 액션 영역과 메인 콘텐츠가 같은 내부 폭 상수를 사용합니다."
            />
            <DashboardCard
              title="상태"
              value={activeProject.isNew ? 'NEW' : 'READY'}
              description="페이지 콘텐츠도 원본처럼 페이지 컴포넌트에서 직접 크기와 여백을 잡습니다."
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <article className="rounded-[24px] border border-white/10 bg-[#11161D]/90 p-6">
              <h2 className="text-xl font-bold text-white">레이아웃 메모</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#D2D5DB]">
                <p>앱 셸은 프레임만 담당하고, 실제 내부 폭은 각 페이지가 직접 설정합니다.</p>
                <p>현재 메인 화면은 `DashboardPage`와 같은 상단 시작 위치와 본문 폭을 따릅니다.</p>
                <p>
                  다른 페이지를 추가할 때도 같은 상수 조합으로 맞추면 내부 영역이 동일하게
                  유지됩니다.
                </p>
              </div>
            </article>

            <article className="rounded-[24px] border border-white/10 bg-white/6 p-6">
              <h2 className="text-xl font-bold text-white">다음 연결 포인트</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#D2D5DB]">
                <p>`demoProjects`를 실제 API 응답으로 교체</p>
                <p>페이지별 래퍼를 분리해 `DashboardPage`, `SettingsPage`처럼 공통화</p>
                <p>라우터 연결 후에도 같은 본문 폭 상수를 그대로 재사용</p>
              </div>
            </article>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
