import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import settingIcon from '../assets/icons/setting.svg';
import settingWhiteIcon from '../assets/icons/setting-white.svg';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../constants/contentLayout.js';
import RadarBrand from './RadarBrand.jsx';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/monitoring': 'Prompt Monitoring',
  '/users': 'User Management',
  '/policies': 'Policy Management',
  '/domains': 'Domains',
  '/support': 'Operation Support',
  '/download': 'Download',
};

const PAGE_DESCRIPTIONS = {
  '/dashboard': 'GARIM 서비스 현황과 주요 탐지 현황을 한눈에 확인할 수 있습니다.',
  '/monitoring': '프롬프트 처리 이력 전체와 상태별 모니터링 결과를 확인할 수 있습니다.',
  '/users': '사용자별 접근 권한과 IP 기반 보안 설정을 관리할 수 있습니다.',
  '/policies': '정책을 관리하고 서비스별 적용 기준을 설정할 수 있습니다.',
  '/domains': '외부 AI 서비스 도메인을 관리하고 사용 여부를 설정할 수 있습니다.',
  '/support': '운영 가이드, 템플릿, 배포 URL을 관리할 수 있습니다.',
  '/download': 'GARIM 에이전트와 운영 가이드 파일을 다운로드할 수 있습니다.',
};

const PENDING_FEATURE_MESSAGE = '아직 구현 안 되었습니다.';

function HeaderIconButton({
  label,
  tooltip = label,
  className = '',
  hoverClassName = 'hover:bg-white hover:text-[#7B8090]',
  isActive = false,
  onClick,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={tooltip}
      onClick={onClick}
      className={`group relative flex h-[31px] w-[31px] cursor-pointer items-center justify-center rounded-full transition lg:h-[30px] lg:w-[30px] xl:h-[34px] xl:w-[34px] ${
        isActive ? 'bg-[#4338CA] text-white' : `bg-[#F3F4F6] text-[#9EA2AE] ${hoverClassName}`
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

function FilledBellIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2.75a5.25 5.25 0 0 0-5.25 5.25v1.13c0 .92-.24 1.83-.69 2.63l-1.07 1.88A2.25 2.25 0 0 0 6.94 17h10.12a2.25 2.25 0 0 0 1.95-3.36l-1.07-1.88a5.38 5.38 0 0 1-.69-2.63V8A5.25 5.25 0 0 0 12 2.75Zm0 18.5a2.63 2.63 0 0 0 2.47-1.75H9.53A2.63 2.63 0 0 0 12 21.25Z" />
    </svg>
  );
}

function HeaderPopover({ children, className = 'w-36' }) {
  return (
    <div
      className={`absolute top-[calc(100%+8px)] right-0 z-30 overflow-hidden rounded-xl border border-[#E4E7F2] bg-white shadow-[0_18px_48px_rgba(11,18,32,0.18)] ${className}`.trim()}
    >
      {children}
    </div>
  );
}

function UserMenu({ onClose }) {
  return (
    <HeaderPopover>
      <button
        type="button"
        className="flex h-11 w-full items-center justify-center text-sm font-semibold text-[#4338CA] transition hover:bg-[#F6F4FF]"
        onClick={onClose}
      >
        내 계정
      </button>
    </HeaderPopover>
  );
}

function PendingFeatureMenu() {
  return (
    <HeaderPopover className="w-44">
      <div className="flex min-h-11 items-center justify-center px-4 py-3 text-center text-sm font-semibold text-[#4338CA]">
        {PENDING_FEATURE_MESSAGE}
      </div>
    </HeaderPopover>
  );
}

export default function AppHeader({ onMenuClick, isSidebarOpen = false }) {
  const [openPopover, setOpenPopover] = useState(null);
  const popoverRootRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'GARIM';
  const pageDescription = PAGE_DESCRIPTIONS[location.pathname] ?? '';
  const userName = 'C2lab';

  useEffect(() => {
    if (!openPopover) return undefined;

    const handlePointerDown = event => {
      if (!event.target.closest('[data-header-popover-root="true"]')) {
        setOpenPopover(null);
      }
    };

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setOpenPopover(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPopover]);

  const togglePopover = key => {
    setOpenPopover(current => (current === key ? null : key));
  };

  const handleLogout = () => {
    setOpenPopover(null);
    navigate('/login');
  };

  return (
    <header className="w-full bg-[#1A1A1A]">
      <div className="flex h-[var(--app-header-height)] items-center justify-between px-3 sm:px-4 lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={isSidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar-drawer"
            onClick={onMenuClick}
            className={`flex h-10 items-center rounded-full border px-4 transition ${
              isSidebarOpen ? 'border-white/25 bg-white/12' : 'border-white/15 bg-white/6'
            }`.trim()}
          >
            <RadarBrand
              className="gap-1.5"
              logoClassName="h-[1.4rem]"
              radarClassName="w-[5.3rem]"
            />
          </button>
          <h1 className="truncate text-[1rem] font-bold tracking-[-0.03em] text-white">
            {pageTitle}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <div ref={popoverRootRef} className="relative" data-header-popover-root="true">
            <button
              type="button"
              className="flex h-9 items-center rounded-full px-3 text-[0.82rem] font-semibold text-white/82 transition hover:bg-white/8 hover:text-white"
              aria-expanded={openPopover === 'user'}
              aria-haspopup="menu"
              onClick={() => togglePopover('user')}
            >
              <span className="text-[#8F7CFF]">{userName}</span>
              <span className="pl-1 text-white/82">님 반갑습니다.</span>
            </button>
            {openPopover === 'user' ? <UserMenu onClose={() => setOpenPopover(null)} /> : null}
          </div>
          <div className="relative" data-header-popover-root="true">
            <HeaderIconButton
              label="알람"
              tooltip=""
              className="group active:bg-[#4338CA] active:text-white"
              hoverClassName="hover:bg-[#4338CA] hover:text-white"
              isActive={openPopover === 'alarm'}
              onClick={() => togglePopover('alarm')}
            >
              <FilledBellIcon className="h-[17px] w-[17px] lg:h-[18px] lg:w-[18px]" />
            </HeaderIconButton>
            {openPopover === 'alarm' ? <PendingFeatureMenu /> : null}
          </div>
          <div className="relative" data-header-popover-root="true">
            <HeaderIconButton
              label="설정"
              tooltip=""
              className="group active:bg-[#4338CA] active:text-white"
              hoverClassName="hover:bg-[#4338CA] hover:text-white"
              isActive={openPopover === 'setting'}
              onClick={() => togglePopover('setting')}
            >
              <img
                src={settingIcon}
                alt=""
                aria-hidden="true"
                className="h-[15px] w-[15px] transition-opacity group-hover:opacity-0 group-active:opacity-0"
              />
              <img
                src={settingWhiteIcon}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute h-[15px] w-[15px] opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100"
              />
            </HeaderIconButton>
            {openPopover === 'setting' ? <PendingFeatureMenu /> : null}
          </div>
          <div className="relative" data-header-popover-root="true">
            <HeaderIconButton
              label="로그아웃"
              tooltip=""
              className="group active:bg-[#4338CA] active:text-white"
              hoverClassName="hover:bg-[#4338CA] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-[15px] w-[15px] stroke-[2.1] lg:h-[16px] lg:w-[16px]" />
            </HeaderIconButton>
          </div>
        </div>
      </div>

      <div className="hidden h-[var(--app-header-height)] lg:flex">
        <div className="flex h-full w-[var(--app-sidebar-width)] items-center justify-center px-3 lg:px-3 xl:px-3.5">
          <button
            type="button"
            className="shrink-0 cursor-pointer"
            onClick={() => navigate('/dashboard')}
            aria-label="대시보드로 이동"
          >
            <RadarBrand
              className="gap-1.5 lg:gap-1.5 xl:gap-2"
              logoClassName="h-[1.9rem] lg:h-[1.8rem] xl:h-[2.05rem] 2xl:h-[2.2rem]"
              radarClassName="w-[6rem] lg:w-[5.8rem] xl:w-[6.7rem] 2xl:w-[7.15rem]"
            />
          </button>
        </div>

        <div className="h-full min-w-0 flex-1 lg:px-5 xl:px-5 2xl:px-5">
          <div
            className={`mx-auto flex h-full w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS} ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
          >
            <div
              className={`mx-auto flex w-full items-center justify-between gap-4 xl:gap-1.5 ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
            >
              <div className="flex min-w-0 items-center gap-3 pr-4">
                <h1 className="shrink-0 text-[clamp(1.1rem,1.5vw,1.45rem)] font-bold tracking-[-0.035em] text-white">
                  {pageTitle}
                </h1>
                {pageDescription ? (
                  <p className="min-w-0 truncate text-[0.88rem] font-medium text-white/58">
                    {pageDescription}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-4 xl:gap-5">
                <div className="relative" data-header-popover-root="true">
                  <button
                    type="button"
                    className={`hidden h-9 items-center rounded-full px-3 text-[0.88rem] font-semibold transition xl:flex ${
                      openPopover === 'user'
                        ? 'bg-white/10 text-white'
                        : 'text-white/82 hover:bg-white/8 hover:text-white'
                    }`.trim()}
                    aria-expanded={openPopover === 'user'}
                    aria-haspopup="menu"
                    onClick={() => togglePopover('user')}
                  >
                    <span className="text-[#8F7CFF]">{userName}</span>
                    <span className="pl-1 text-white/82">님 반갑습니다.</span>
                  </button>
                  {openPopover === 'user' ? <UserMenu onClose={() => setOpenPopover(null)} /> : null}
                </div>

                <div className="flex items-center gap-1 xl:gap-1.5">
                  <div className="relative" data-header-popover-root="true">
                    <HeaderIconButton
                      label="알람"
                      tooltip=""
                      className="group active:bg-[#4338CA] active:text-white"
                      hoverClassName="hover:bg-[#4338CA] hover:text-white"
                      isActive={openPopover === 'alarm'}
                      onClick={() => togglePopover('alarm')}
                    >
                      <FilledBellIcon className="h-[21px] w-[21px] lg:h-[20px] lg:w-[20px] xl:h-[22px] xl:w-[22px]" />
                    </HeaderIconButton>
                    {openPopover === 'alarm' ? <PendingFeatureMenu /> : null}
                  </div>

                  <div className="relative" data-header-popover-root="true">
                    <HeaderIconButton
                      label="설정"
                      tooltip=""
                      className="group active:bg-[#4338CA] active:text-white"
                      hoverClassName="hover:bg-[#4338CA] hover:text-white"
                      isActive={openPopover === 'setting'}
                      onClick={() => togglePopover('setting')}
                    >
                      <img
                        src={settingIcon}
                        alt=""
                        aria-hidden="true"
                        className="h-[16px] w-[16px] transition-opacity group-hover:opacity-0 group-active:opacity-0 lg:h-[15px] lg:w-[15px] xl:h-[17px] xl:w-[17px]"
                      />
                      <img
                        src={settingWhiteIcon}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute h-[16px] w-[16px] opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100 lg:h-[15px] lg:w-[15px] xl:h-[17px] xl:w-[17px]"
                      />
                    </HeaderIconButton>
                    {openPopover === 'setting' ? <PendingFeatureMenu /> : null}
                  </div>

                  <div className="relative" data-header-popover-root="true">
                    <HeaderIconButton
                      label="로그아웃"
                      tooltip=""
                      className="group active:bg-[#4338CA] active:text-white"
                      hoverClassName="hover:bg-[#4338CA] hover:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-[16px] w-[16px] stroke-[4] lg:h-[15px] lg:w-[15px] xl:h-[17px] xl:w-[17px]" />
                    </HeaderIconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
