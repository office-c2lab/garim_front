import logo from '../assets/icons/logo.png';
import radar from '../assets/icons/GARIM.png';

export default function RadarBrand({
  logoClassName = 'h-10',
  radarClassName = 'w-36',
  className = '',
  logoRef,
  radarRef,
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <img
        ref={logoRef}
        src={logo}
        alt="Radar 로고"
        className={`${logoClassName} w-auto shrink-0`.trim()}
      />
      <img
        ref={radarRef}
        src={radar}
        alt="RADAR"
        className={`${radarClassName} h-auto shrink-0`.trim()}
      />
    </div>
  );
}
