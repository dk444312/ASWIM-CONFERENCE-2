import { useLandingContent } from '../landing/landingContentStore';

export function Stats() {
  const content = useLandingContent();
  const { stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label, stat4Value, stat4Label } = content.stats;

  return (
    <div className="bg-[#18181b] text-white py-[55px] border-y border-neutral-800">
      <div className="container-custom grid grid-cols-4 max-[1000px]:grid-cols-2 gap-[25px]">
        <div className="px-[24px] py-[12px] border-r border-white/10 max-[1000px]:border-r-0">
          <strong className="block font-heading text-[39px] tracking-tight text-white">{stat1Value}</strong>
          <span className="text-gray-400 text-[12px] uppercase tracking-[.1em]">{stat1Label}</span>
        </div>
        <div className="px-[24px] py-[12px] border-r border-white/10 max-[1000px]:border-r-0">
          <strong className="block font-heading text-[39px] tracking-tight text-white">{stat2Value}</strong>
          <span className="text-gray-400 text-[12px] uppercase tracking-[.1em]">{stat2Label}</span>
        </div>
        <div className="px-[24px] py-[12px] border-r border-white/10 max-[1000px]:border-r-0">
          <strong className="block font-heading text-[39px] tracking-tight text-white">{stat3Value}</strong>
          <span className="text-gray-400 text-[12px] uppercase tracking-[.1em]">{stat3Label}</span>
        </div>
        <div className="px-[24px] py-[12px]">
          <strong className="block font-heading text-[39px] tracking-tight text-white">{stat4Value}</strong>
          <span className="text-gray-400 text-[12px] uppercase tracking-[.1em]">{stat4Label}</span>
        </div>
      </div>
    </div>
  );
}
