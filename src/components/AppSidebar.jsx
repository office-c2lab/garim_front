import { useLocation, useNavigate } from 'react-router-dom';

import RadarBrand from './RadarBrand.jsx';

const DEFAULT_NAV_ITEMS = [
  {
    key: 'dashboard',
    label: '대시보드',
    path: '/dashboard',
  },
  {
    key: 'monitoring',
    label: '모니터링',
    path: '/monitoring',
  },
  {
    key: 'policy',
    label: '정책',
    path: '/policies',
  },
  {
    key: 'domain',
    label: '도메인',
    path: '/domains',
  },
];

function getIsActive(pathname, itemPath) {
  if (itemPath === '/dashboard') {
    return pathname === '/' || pathname.startsWith('/dashboard');
  }

  return pathname.startsWith(itemPath);
}

export default function AppSidebar({
  overlayHeader = false,
  showBrand = true,
  navItems = DEFAULT_NAV_ITEMS,
  onNavigate,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarTopPaddingClass = overlayHeader ? 'pt-0' : 'pt-4';

  const brandWrapperClass = overlayHeader
    ? 'flex min-h-[calc(var(--app-header-height)+0.2rem)] items-center justify-center'
    : 'flex justify-center py-1';

  const handleNavigate = path => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-full overflow-hidden bg-[#] text-white">
      <div className="flex h-full w-full flex-col px-3 lg:px-3 xl:px-3.5">
        <div className={`flex min-h-0 flex-1 flex-col pb-4 ${sidebarTopPaddingClass}`.trim()}>
          {showBrand ? (
            <div className={brandWrapperClass}>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => handleNavigate('/dashboard')}
                aria-label="대시보드로 이동"
              >
                <RadarBrand
                  className="gap-1.5 lg:gap-1.5 xl:gap-2"
                  logoClassName="h-[1.75rem] lg:h-[1.7rem] xl:h-[2rem] 2xl:h-[2.2rem]"
                  radarClassName="w-[5.45rem] lg:w-[5.25rem] xl:w-[6.6rem] 2xl:w-[7.2rem]"
                />
              </button>
            </div>
          ) : null}

          <nav className="flex min-h-0 flex-1 pt-4" aria-label="화면 이동 메뉴">
            <ul className="h-full w-full space-y-1.5 text-left">
              {navItems.map(item => {
                const isActive = getIsActive(location.pathname, item.path);

                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.path)}
                      className={`group flex h-[46px] w-full cursor-pointer items-center gap-3 rounded-[14px] px-3.5 text-left transition duration-200 ${
                        isActive
                          ? 'bg-[linear-gradient(180deg,rgba(67,56,202,0.26)_0%,rgba(67,56,202,0.18)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_28px_rgba(10,10,22,0.22)]'
                          : 'bg-transparent text-[#D2D5DB] hover:bg-white/6 hover:text-white'
                      }`.trim()}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="min-w-0 flex-1 truncate text-[clamp(0.88rem,1.18vw,0.95rem)] font-semibold leading-[140%]">
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 flex-none rounded-full transition duration-200 ${
                          isActive
                            ? 'bg-[#4338CA] shadow-[0_0_0_4px_rgba(67,56,202,0.16),0_0_18px_rgba(67,56,202,0.42)]'
                            : 'bg-transparent group-hover:bg-white/20'
                        }`.trim()}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
