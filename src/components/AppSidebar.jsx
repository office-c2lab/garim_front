import { useMemo, useState } from 'react';
import searchIcon from '../assets/icons/search.svg';
import RadarBrand from './RadarBrand.jsx';

function ProjectTypeBadge({ type }) {
  return (
    <span className="flex h-[18px] w-[30px] shrink-0 items-center justify-center rounded-full border border-white text-[10px] font-bold text-white">
      {type}
    </span>
  );
}

function MetricBar({ label, value, tone = 'default' }) {
  const filledBlocks = Math.max(0, Math.min(5, Math.round(value / 20)));
  const isUnavailable = tone === 'unavailable';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-white">{label}</span>
        <span className={isUnavailable ? 'text-[#A7AFBF]' : 'text-[#31A4BD]'}>
          {isUnavailable ? '미구현' : `${value}%`}
        </span>
      </div>
      <div className="flex overflow-hidden rounded-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`${label}-${index}`}
            className={`h-2 flex-1 ${
              index < filledBlocks ? 'bg-[#31A4BD]' : isUnavailable ? 'bg-[#4B5160]' : 'bg-white'
            } ${index === 0 ? 'rounded-l-full' : ''} ${index === 4 ? 'rounded-r-full' : ''}`.trim()}
          />
        ))}
      </div>
    </div>
  );
}

export default function AppSidebar({
  projects = [],
  overlayHeader = false,
  showBrand = true,
  activeProjectId,
  onProjectSelect,
  onNavigate,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const sidebarTopPaddingClass = overlayHeader ? 'pt-0' : 'pt-4';
  const brandWrapperClass = overlayHeader
    ? 'flex min-h-[calc(var(--app-header-height)+0.2rem)] items-center justify-center'
    : 'flex justify-center py-1';
  const searchSectionClass = showBrand
    ? overlayHeader
      ? 'pt-1.5 lg:pt-1 xl:pt-2'
      : 'pt-3.5 lg:pt-3 xl:pt-4'
    : 'pt-1';

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return projects;

    return projects.filter(project =>
      [project.name, project.description, project.id].some(value =>
        String(value || '')
          .toLowerCase()
          .includes(normalizedSearch)
      )
    );
  }, [projects, searchTerm]);

  return (
    <aside className="flex h-full w-full overflow-hidden bg-[#0F1214] text-white">
      <div className="flex h-full w-full flex-col px-2.5 lg:px-2.5 xl:px-3.5">
        <div className={`flex min-h-0 flex-1 flex-col pb-3.5 ${sidebarTopPaddingClass}`.trim()}>
          {showBrand ? (
            <div className={brandWrapperClass}>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => onNavigate?.('dashboard')}
              >
                <RadarBrand
                  className="gap-1 lg:gap-1 xl:gap-[0.6rem] 2xl:gap-2"
                  logoClassName="h-[1.65rem] lg:h-[1.55rem] xl:h-[2rem] 2xl:h-[2.25rem]"
                  radarClassName="w-[5.15rem] lg:w-[4.95rem] xl:w-[6.7rem] 2xl:w-[7.4rem]"
                />
              </button>
            </div>
          ) : null}

          

          

          <div className="flex min-h-0 flex-1 pt-2">
            {filteredProjects.length > 0 ? (
              <ul className="hover-scrollbar h-full w-full overflow-y-auto pr-1 text-left">
                {filteredProjects.map(project => {
                  const isActive = activeProjectId === project.id;

                  return (
                    <li
                      key={project.id}
                      className="border-b border-[#9EA2AE] py-0.5 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onProjectSelect?.(project.id);
                          onNavigate?.('project');
                        }}
                        className={`flex h-[34px] w-full items-center gap-1.5 rounded-[8px] px-1.5 text-left transition ${
                          isActive ? 'bg-[#31A4BD]' : 'bg-transparent hover:bg-white/8'
                        }`.trim()}
                      >
                        <ProjectTypeBadge type={project.type || 'URL'} />
                        <span className="min-w-0 flex-1 truncate pr-1 text-[clamp(0.74rem,1.18vw,0.82rem)] font-bold leading-[140%] text-white xl:text-[clamp(0.82rem,1.4vw,0.9rem)]">
                          {project.name}
                        </span>
                        {project.isNew ? (
                          <span className="flex h-[12px] w-[30px] shrink-0 items-center justify-center rounded-[4px] bg-[#B11034] text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                            New
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="text-sm text-[#D2D5DB]">프로젝트 없음</span>
            )}
          </div>

          
        </div>
      </div>
    </aside>
  );
}
