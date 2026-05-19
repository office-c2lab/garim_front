import { useEffect, useState } from 'react';
import AppHeader from './AppHeader.jsx';
import AppSidebar from './AppSidebar.jsx';

export default function AppShell({
  children,
  projects = [],
  activeProjectId,
  onProjectSelect,
  onNavigate,
  showBrand = true,
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) return undefined;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen]);

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#0F1214] text-white lg:h-screen"
      style={{
        '--app-header-height': 'clamp(2.75rem, 3.9vw, 3.6rem)',
        '--app-sidebar-width': 'clamp(9.75rem, 12.8vw, 12.25rem)',
        '--app-sidebar-mobile-width': 'min(68vw, 12.5rem)',
      }}
    >
      <div className="h-full w-full overflow-hidden">
        <div className="fixed inset-x-0 top-0 z-30">
          <AppHeader
            isSidebarOpen={isMobileSidebarOpen}
            onMenuClick={() => setIsMobileSidebarOpen(open => !open)}
          />
        </div>

        <div className="fixed top-0 left-0 bottom-0 z-40 hidden w-[var(--app-sidebar-width)] lg:block">
          <AppSidebar
            projects={projects}
            overlayHeader
            showBrand={showBrand}
            activeProjectId={activeProjectId}
            onProjectSelect={onProjectSelect}
            onNavigate={onNavigate}
          />
        </div>

        <div
          className={`fixed inset-0 z-50 transition lg:hidden ${
            isMobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`.trim()}
          aria-hidden={!isMobileSidebarOpen}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-[rgba(2,10,24,0.58)] backdrop-blur-[3px] transition ${
              isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`.trim()}
            aria-label="사이드바 닫기"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div
            id="app-sidebar-drawer"
            className={`absolute top-0 left-0 bottom-0 w-[var(--app-sidebar-mobile-width)] max-w-full border-r border-white/10 bg-[#0F1214] shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`.trim()}
          >
            <AppSidebar
              projects={projects}

              overlayHeader
              showBrand={showBrand}
              activeProjectId={activeProjectId}
              onProjectSelect={projectId => {
                onProjectSelect?.(projectId);
                setIsMobileSidebarOpen(false);
              }}
              onNavigate={target => {
                onNavigate?.(target);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>

        <section className="fixed top-[var(--app-header-height)] right-0 bottom-0 left-0 overflow-hidden border-t border-[#FFFFFF] bg-[#0F1214] lg:left-[var(--app-sidebar-width)] lg:rounded-tl-[24px] lg:border-l lg:border-[#FFFFFF]">
          <div className="hover-scrollbar relative h-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full bg-[radial-gradient(circle_at_top,rgba(49,164,189,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-4">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
