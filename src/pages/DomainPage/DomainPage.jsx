import { useState } from 'react';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
  APP_PAGE_TITLE_CLASS,
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
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition ${
        checked
          ? 'border-[#31A4BD] bg-[#31A4BD] shadow-[0_0_0_3px_rgba(49,164,189,0.14)]'
          : 'border-[#D0D7E2] bg-[#DCE2E9]'
      }`.trim()}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(15,18,20,0.18)] transition ${
          checked ? 'translate-x-[1.2rem]' : 'translate-x-[0.1rem]'
        }`.trim()}
      />
    </button>
  );
}

export default function DomainPage() {
  const [domains, setDomains] = useState(initialDomains);

  const handleToggle = id => {
    setDomains(current =>
      current.map(domain =>
        domain.id === id ? { ...domain, enabled: !domain.enabled } : domain,
      ),
    );
  };

  return (
    <div
      className={`mx-auto w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS} pb-[clamp(2rem,4vw,3rem)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
    >
      <div
        className={`mx-auto flex min-h-full w-full flex-col gap-6 pt-5 sm:pt-8 ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
      >
        <section>
          <div className="">
            <h1
              className={`${APP_PAGE_TITLE_CLASS} font-bold leading-[150%] tracking-[0.5px] text-[#E5E7EA]`.trim()}
            >
              도메인
            </h1>
          </div>
        </section>

        <section>
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
