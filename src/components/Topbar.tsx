import { Link } from 'react-router-dom';
import { useLandingContent } from '../landing/landingContentStore';

export function Topbar() {
  const content = useLandingContent();
  const { badgeText, subtitle, dates, location } = content.topbar;

  return (
    <div className="bg-brand-deep text-white/75 text-xs">
      <div className="container-custom min-h-[38px] flex justify-between items-center gap-5 max-[650px]:justify-center">
        <div><strong className="text-white">{badgeText}</strong> · {subtitle}</div>
        <div className="flex items-center gap-[18px] max-[650px]:hidden">
          <span>{dates}</span>
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
