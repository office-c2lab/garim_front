import { useState } from 'react';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../../constants/contentLayout.js';
import { MonitoringDomainTable } from '../../components/monitoring/MonitoringListComponents.jsx';

const initialDomains = [
  {
    id: 1,
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    enabled: true,
  },
  {
    id: 2,
    name: 'HyperCLOVA X',
    url: 'https://clova-x.naver.com/',
    enabled: false,
  },
  {
    id: 3,
    name: 'Claude',
    url: 'https://claude.ai/',
    enabled: false,
  },
  {
    id: 4,
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    enabled: false,
  },
  {
    id: 5,
    name: 'MS Copilot',
    url: 'https://copilot.microsoft.com/',
    enabled: false,
  },
];

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function getFaviconUrl(url) {
  const hostname = getHostname(url);
  if (!hostname) return '';
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
}

function LogoBadge({ name, url }) {
  const [hasImageError, setHasImageError] = useState(false);
  const faviconUrl = getFaviconUrl(url);
  const label = name.trim().charAt(0).toUpperCase() || '?';

  if (!faviconUrl || hasImageError) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D5E5EE] bg-[linear-gradient(135deg,#EFF7FB,#D8ECF4)] text-sm font-black text-[#026E92] shadow-[0_10px_24px_rgba(4,41,58,0.08)]">
        {label}
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D5E5EE] bg-white shadow-[0_10px_24px_rgba(4,41,58,0.08)]">
      <img
        src={faviconUrl}
        alt={`${name} favicon`}
        className="h-7 w-7 rounded-md object-contain"
        loading="lazy"
        onError={() => setHasImageError(true)}
      />
    </div>
  );
}

function DomainToggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition duration-200 ${
        checked
          ? 'border-[#5B4BD7] bg-[#5B4BD7] shadow-[0_8px_18px_rgba(91,75,215,0.28)]'
          : 'border-[#D5CFF5] bg-[#C8BDEB]'
      }`.trim()}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(15,18,20,0.18)] transition duration-200 ${
          checked ? 'translate-x-[1.35rem]' : 'translate-x-[0.15rem]'
        }`.trim()}
      />
    </button>
  );
}

export default function DomainPage() {
  const [domains, setDomains] = useState(initialDomains);

  const handleToggle = id => {
    setDomains(current =>
      current.map(domain => (domain.id === id ? { ...domain, enabled: !domain.enabled } : domain))
    );
  };

  const handleRefresh = () => {
    setDomains(initialDomains);
  };

  return (
    <div
      className={`mx-auto w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS} pb-[clamp(2rem,4vw,3rem)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
    >
      <div
        className={`mx-auto flex min-h-full w-full flex-col gap-5 pt-5 sm:gap-6 sm:pt-8 ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
      >
        <section className="flex justify-end">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E3E7F2] bg-white px-4 text-sm font-medium text-[#667085] shadow-[0_8px_24px_rgba(16,24,40,0.06)] transition hover:border-[#CDD5E8] hover:text-[#344054]"
          >
            <span aria-hidden="true" className="text-base leading-none">
              ↻
            </span>
            새로고침
          </button>
        </section>

        <section className="rounded-[22px] border border-[#E6EAF4] bg-[radial-gradient(circle_at_top,#FFFFFF_0%,#FBFCFF_72%,#F6F8FD_100%)] p-0 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <MonitoringDomainTable
            rows={domains}
            renderLogo={domain => <LogoBadge name={domain.name} url={domain.url} />}
            renderToggle={domain => (
              <DomainToggle
                checked={domain.enabled}
                onChange={() => handleToggle(domain.id)}
                ariaLabel={`${domain.name} 사용 여부`}
              />
            )}
          />
        </section>
      </div>
    </div>
  );
}
