import claudeLogo from '../assets/icons/claude-color.svg';
import copilotLogo from '../assets/icons/copilot-color.svg';
import geminiLogo from '../assets/icons/gemini-color.svg';
import gensparkLogo from '../assets/icons/genspark-ai-logo-icon-hd.png';
import openaiLogo from '../assets/icons/openai.svg';

export const ALL_SERVICE_LOGO_NAMES = ['ChatGPT', 'Gemini', 'Claude', 'Genspark', 'MS Copilot'];

const SERVICE_LOGO_MAP = {
  chatgpt: openaiLogo,
  gemini: geminiLogo,
  claude: claudeLogo,
  genspark: gensparkLogo,
  'ms copilot': copilotLogo,
  copilot: copilotLogo,
};

function getServiceLogo(name) {
  return SERVICE_LOGO_MAP[name.trim().toLowerCase()] ?? null;
}

export default function ServiceLogoBadge({
  name,
  className = '',
  iconClassName = '',
  variant = 'card',
}) {
  const serviceLogo = getServiceLogo(name);
  const label = name.trim().charAt(0).toUpperCase() || '?';
  const isCompact = variant === 'compact';

  if (!serviceLogo) {
    return (
      <div
        className={`flex items-center justify-center ${
          isCompact
            ? 'h-8 w-8 rounded-lg border border-[#D5E5EE] bg-[linear-gradient(135deg,#EFF7FB,#D8ECF4)] text-[10px] font-black text-[#026E92] shadow-[0_10px_24px_rgba(4,41,58,0.08)]'
            : 'h-11 w-11 rounded-xl border border-[#D5E5EE] bg-[linear-gradient(135deg,#EFF7FB,#D8ECF4)] text-sm font-black text-[#026E92] shadow-[0_10px_24px_rgba(4,41,58,0.08)]'
        } ${className}`.trim()}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${
        isCompact
          ? 'h-8 w-8 rounded-lg border border-[#D5E5EE] bg-white shadow-[0_10px_24px_rgba(4,41,58,0.08)]'
          : 'h-11 w-11 rounded-xl border border-[#D5E5EE] bg-white shadow-[0_10px_24px_rgba(4,41,58,0.08)]'
      } ${className}`.trim()}
    >
      <img
        src={serviceLogo}
        alt={`${name} logo`}
        className={`${isCompact ? 'h-6 w-6' : 'h-7 w-7'} object-contain ${iconClassName}`.trim()}
        loading="lazy"
      />
    </div>
  );
}
