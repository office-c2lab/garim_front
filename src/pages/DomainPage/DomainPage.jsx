import { useState } from 'react';
import AppToggle from '../../components/AppToggle.jsx';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../../constants/contentLayout.js';
import { MonitoringDomainTable } from '../../components/monitoring/MonitoringListComponents.jsx';
import ServiceLogoBadge from '../../components/ServiceLogoBadge.jsx';

const initialDomains = [
  {
    id: 1,
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    enabled: true,
  },
  {
    id: 2,
    name: 'Gemini',
    url: 'https://gemini.google.com/',
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
    name: 'Genspark',
    url: 'https://www.genspark.ai/',
    enabled: false,
  },
  {
    id: 5,
    name: 'MS Copilot',
    url: 'https://copilot.microsoft.com/',
    enabled: false,
  },
];

export default function DomainPage() {
  const [domains, setDomains] = useState(initialDomains);

  const handleToggle = id => {
    setDomains(current =>
      current.map(domain => (domain.id === id ? { ...domain, enabled: !domain.enabled } : domain))
    );
  };

  return (
    <div
      className={`mx-auto w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS} pb-[clamp(2rem,4vw,3rem)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
    >
      <div
        className={`mx-auto flex min-h-full w-full flex-col gap-5 pt-5 sm:gap-6 sm:pt-8 ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
      >
        <section className="rounded-[22px] border border-[#E6EAF4] bg-[radial-gradient(circle_at_top,#FFFFFF_0%,#FBFCFF_72%,#F6F8FD_100%)] p-0 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <MonitoringDomainTable
            rows={domains}
            renderLogo={domain => <ServiceLogoBadge name={domain.name} url={domain.url} />}
            renderToggle={domain => (
              <AppToggle
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
