import { useState } from 'react';

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

function getFaviconCandidates(url) {
  const hostname = getHostname(url);
  if (!hostname) return [];

  const isMicrosoftHostname =
    hostname === 'microsoft.com' ||
    hostname.endsWith('.microsoft.com') ||
    hostname === 'bing.com' ||
    hostname.endsWith('.bing.com');

  if (isMicrosoftHostname) {
    return [
      `https://${hostname}/favicon.ico`,
      `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
      getFaviconUrl(url),
    ].filter(Boolean);
  }

  return [
    getFaviconUrl(url),
    `https://${hostname}/favicon.ico`,
    `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
  ].filter(Boolean);
}

export default function ServiceLogoBadge({ name, url, className = '', iconClassName = '' }) {
  const faviconCandidates = getFaviconCandidates(url);
  const [faviconIndex, setFaviconIndex] = useState(0);
  const label = name.trim().charAt(0).toUpperCase() || '?';

  const faviconUrl = faviconCandidates[faviconIndex] ?? '';
  const hasFallbackImage = faviconIndex < faviconCandidates.length - 1;

  if (!faviconUrl) {
    return (
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#D5E5EE] bg-[linear-gradient(135deg,#EFF7FB,#D8ECF4)] text-sm font-black text-[#026E92] shadow-[0_10px_24px_rgba(4,41,58,0.08)] ${className}`.trim()}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#D5E5EE] bg-white shadow-[0_10px_24px_rgba(4,41,58,0.08)] ${className}`.trim()}
    >
      <img
        src={faviconUrl}
        alt={`${name} favicon`}
        className={`h-7 w-7 rounded-md object-contain ${iconClassName}`.trim()}
        loading="lazy"
        onError={() => {
          if (hasFallbackImage) {
            setFaviconIndex(current => current + 1);
            return;
          }

          setFaviconIndex(faviconCandidates.length);
        }}
      />
    </div>
  );
}
