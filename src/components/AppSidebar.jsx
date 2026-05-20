import { useLocation, useNavigate } from 'react-router-dom';

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

  const handleNavigate = path => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-full overflow-hidden  border-r border-[#E7ECF5] bg-white text-[#344054] shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
      <div className="flex h-full w-full flex-col px-3 lg:px-3 xl:px-3.5">
        <div className={`flex min-h-0 flex-1 flex-col pb-4 ${sidebarTopPaddingClass}`.trim()}>
          <nav className={`flex min-h-0 flex-1 ${showBrand ? 'pt-4' : 'pt-0'}`.trim()} aria-label="화면 이동 메뉴">
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
                          ? 'border border-[#D9DDF7] bg-[linear-gradient(180deg,#F6F4FF_0%,#EEEAFE_100%)] text-[#312E81] shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
                          : 'border border-transparent bg-transparent text-[#5F6B85] hover:border-[#E7ECF5] hover:bg-[#F8FAFF] hover:text-[#1F2937]'
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
                            ? 'bg-[#4338CA] shadow-[0_0_0_4px_rgba(67,56,202,0.12),0_0_18px_rgba(67,56,202,0.18)]'
                            : 'bg-[#D8E0EB] group-hover:bg-[#C7D2FE]'
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
