import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import questionIcon from '../assets/icons/question.svg';
import questionWhiteIcon from '../assets/icons/question-white.svg';
import settingIcon from '../assets/icons/setting.svg';
import settingWhiteIcon from '../assets/icons/setting-white.svg';
import userIcon from '../assets/icons/user.svg';
import userWhiteIcon from '../assets/icons/user-white.svg';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../constants/contentLayout.js';
import RadarBrand from './RadarBrand.jsx';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/monitoring': 'Prompt Monitoring',
  '/policies': 'Policy Management',
  '/domains': 'Domains',
};

const PAGE_DESCRIPTIONS = {
  '/dashboard': 'GARIM 서비스 현황과 주요 탐지 현황을 한눈에 확인할 수 있습니다.',
  '/monitoring': '프롬프트 이력과 탐지 결과를 조회하고 이상 징후를 확인할 수 있습니다.',
  '/policies': '정책을 관리하고 서비스별 적용 기준을 설정할 수 있습니다.',
  '/domains': '외부 AI 서비스 도메인을 관리하고 사용 여부를 설정할 수 있습니다.',
};

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

function UserMenu({ onClose }) {
  return (
    <div className="absolute top-[calc(100%+8px)] right-0 z-30 w-36 overflow-hidden rounded-xl border border-[#E4E7F2] bg-white shadow-[0_18px_48px_rgba(11,18,32,0.18)]">
      <button
        type="button"
        className="flex h-11 w-full items-center justify-center text-sm font-semibold text-[#4338CA] transition hover:bg-[#F6F4FF]"
        onClick={onClose}
      >
        내 계정
      </button>
      <button
        type="button"
        className="flex h-11 w-full items-center justify-center border-t border-[#E9EAF4] text-sm font-semibold text-[#4338CA] transition hover:bg-[#F6F4FF]"
        onClick={onClose}
      >
        로그아웃
      </button>
    </div>
  );
}

export default function AppHeader({ onMenuClick, isSidebarOpen = false }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'GARIM';
  const pageDescription = PAGE_DESCRIPTIONS[location.pathname] ?? '';

  useEffect(() => {
    if (!isUserMenuOpen) return undefined;

    const handlePointerDown = event => {
      if (!menuRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

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
          <HeaderIconButton
            label="설정"
            tooltip="설정"
            className="group active:bg-[#4338CA] active:text-white"
            hoverClassName="hover:bg-[#4338CA] hover:text-white"
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
          <HeaderIconButton
            label="도움말"
            tooltip="가이드페이지"
            className="group active:bg-[#4338CA] active:text-white"
            hoverClassName="hover:bg-[#4338CA] hover:text-white"
          >
            <img
              src={questionIcon}
              alt=""
              aria-hidden="true"
              className="h-[18px] w-[12px] transition-opacity group-hover:opacity-0 group-active:opacity-0"
            />
            <img
              src={questionWhiteIcon}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute h-[18px] w-[12px] opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100"
            />
          </HeaderIconButton>
          <div ref={menuRef} className="relative">
            <HeaderIconButton
              label="사용자 메뉴"
              tooltip="프로필"
              className="group"
              hoverClassName="hover:bg-[#4338CA] hover:text-white"
              isActive={isUserMenuOpen}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsUserMenuOpen(open => !open)}
            >
              <img
                src={userIcon}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 m-auto h-[19px] w-auto transition-opacity ${
                  isUserMenuOpen
                    ? 'opacity-0'
                    : 'opacity-100 group-hover:opacity-0 group-active:opacity-0'
                }`.trim()}
              />
              <img
                src={userWhiteIcon}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 m-auto h-[19px] w-auto transition-opacity ${
                  isUserMenuOpen
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100 group-active:opacity-100'
                }`.trim()}
              />
            </HeaderIconButton>
            {isUserMenuOpen ? <UserMenu onClose={() => setIsUserMenuOpen(false)} /> : null}
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
              <div className="flex shrink-0 items-center gap-3 xl:gap-4">
                <p className="hidden text-[0.88rem] font-semibold text-white xl:block">
                  <span className="text-[#8F7CFF]">C2lab</span> 님 반갑습니다.
                </p>
                <HeaderIconButton
                  label="설정"
                  tooltip="설정"
                  className="group active:bg-[#4338CA] active:text-white"
                  hoverClassName="hover:bg-[#4338CA] hover:text-white"
                >
                  <img
                    src={settingIcon}
                    alt=""
                    aria-hidden="true"
                    className={`h-[16px] w-[16px] lg:h-[15px] lg:w-[15px] xl:h-[17px] xl:w-[17px] transition-opacity group-hover:opacity-0 group-active:opacity-0`.trim()}
                  />
                  <img
                    src={settingWhiteIcon}
                    alt=""
                    aria-hidden="true"
                    className={`pointer-events-none absolute h-[16px] w-[16px] lg:h-[15px] lg:w-[15px] xl:h-[17px] xl:w-[17px] opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100`.trim()}
                  />
                </HeaderIconButton>
                <HeaderIconButton
                  label="도움말"
                  tooltip="가이드페이지"
                  className="group active:bg-[#4338CA] active:text-white"
                  hoverClassName="hover:bg-[#4338CA] hover:text-white"
                >
                  <img
                    src={questionIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-[20px] w-[13px] lg:h-[18px] lg:w-[12px] xl:h-[22px] xl:w-[14px] transition-opacity group-hover:opacity-0 group-active:opacity-0"
                  />
                  <img
                    src={questionWhiteIcon}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute h-[20px] w-[13px] lg:h-[18px] lg:w-[12px] xl:h-[22px] xl:w-[14px] opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100"
                  />
                </HeaderIconButton>
                <div ref={menuRef} className="relative">
                  <HeaderIconButton
                    label="사용자 메뉴"
                    tooltip="프로필"
                    className="group"
                    hoverClassName="hover:bg-[#4338CA] hover:text-white"
                    isActive={isUserMenuOpen}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsUserMenuOpen(open => !open)}
                  >
                    <img
                      src={userIcon}
                      alt=""
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 m-auto h-[21px] w-auto lg:h-[19px] xl:h-[23px] transition-opacity ${
                        isUserMenuOpen
                          ? 'opacity-0'
                          : 'opacity-100 group-hover:opacity-0 group-active:opacity-0'
                      }`.trim()}
                    />
                    <img
                      src={userWhiteIcon}
                      alt=""
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 m-auto h-[21px] w-auto lg:h-[19px] xl:h-[23px] transition-opacity ${
                        isUserMenuOpen
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100 group-active:opacity-100'
                      }`.trim()}
                    />
                  </HeaderIconButton>
                  {isUserMenuOpen ? <UserMenu onClose={() => setIsUserMenuOpen(false)} /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
