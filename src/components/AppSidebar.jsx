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
    children: [
      { key: 'all', label: '전체', path: '/monitoring' },
      { key: 'allow', label: '허용', path: '/monitoring?status=allow' },
      { key: 'masking', label: '마스킹', path: '/monitoring?status=masking' },
      { key: 'block', label: '차단', path: '/monitoring?status=block' },
    ],
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

function getIsChildActive(location, childPath) {
  const [pathname, search = ''] = childPath.split('?');

  if (location.pathname !== pathname) {
    return false;
  }

  return search ? location.search === `?${search}` : !location.search;
}

export default function AppSidebar({
  overlayHeader = false,
  showBrand = true,
  navItems = DEFAULT_NAV_ITEMS,
  onNavigate,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarTopPaddingClass = overlayHeader ? 'pt-0' : 'pt-0';

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
                const isExpanded = isActive && item.children?.length;

                return (
                  <li key={item.key} className={isExpanded ? 'pb-1' : ''}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.path)}
                      className={`group flex h-[46px] w-full cursor-pointer items-center gap-3 rounded-[14px] px-3.5 text-left transition duration-200 ${
                        isActive
                          ? 'border border-[rgba(67,56,202,0.2)] bg-transparent text-[#4338CA] '
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
                            ? 'bg-[#4338CA] shadow-[0_0_0_4px_rgba(67,56,202,0.12),0_0_18px_rgba(67,56,202,0.2)]'
                            : 'bg-[#D8E0EB] group-hover:bg-[#C7D2FE]'
                        }`.trim()}
                      />
                    </button>
                    {item.children?.length ? (
                      <div
                        className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out ${
                          isExpanded
                            ? 'grid-rows-[1fr] opacity-100 translate-y-0'
                            : 'grid-rows-[0fr] opacity-0 -translate-y-1'
                        }`.trim()}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <ul className="mt-0.5 py-1.5">
                            {item.children.map((child, childIndex) => {
                              const isChildActive = getIsChildActive(location, child.path);
                              const isLastChild = childIndex === item.children.length - 1;

                              return (
                                <li key={child.key} className="relative ml-[22px] pb-2 pl-5 last:pb-0">
                                  <span
                                    aria-hidden="true"
                                    className={`absolute left-0 top-0 w-px bg-[#D9E0F0] ${
                                      isLastChild ? 'h-[18px]' : 'bottom-0'
                                    }`.trim()}
                                  />
                                  <span
                                    aria-hidden="true"
                                    className="absolute left-0 top-[18px] h-px w-5 bg-[#D9E0F0]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleNavigate(child.path)}
                                    className={`flex h-9 w-full items-center rounded-[8px] px-4 text-left text-[clamp(0.82rem,1.05vw,0.9rem)] font-semibold transition duration-200 ${
                                      isChildActive
                                        ? 'bg-[#E8E2FF] text-[#3528B8]'
                                        : 'text-[#64728C] hover:bg-[#F8FAFF] hover:text-[#4338CA]'
                                    }`.trim()}
                                    aria-current={isChildActive ? 'page' : undefined}
                                  >
                                    {child.label}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ) : null}
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
