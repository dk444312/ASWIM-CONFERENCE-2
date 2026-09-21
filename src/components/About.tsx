import { useLandingContent } from '../landing/landingContentStore';

export function About() {
  const content = useLandingContent();
  const { eyebrow, heading, description, quote } = content.about;

  return (
    <section id="about" className="py-[110px] max-[650px]:py-[80px] bg-white border-b border-gray-200">
      <div className="container-custom max-w-4xl mx-auto text-left">
        <div className="text-[#1f1f1f] uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px]">
          {eyebrow}
        </div>
        <h2 className="text-[clamp(36px,4.5vw,58px)] font-heading font-extrabold text-[#1f1f1f] leading-[1.08] tracking-tight">
          {heading}
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl mt-[24px] leading-relaxed font-normal">
          {description}
        </p>
        <div className="border-l-[4px] border-[#1f1f1f] mt-[36px] pl-[22px] py-2 text-[#1f1f1f] font-heading text-[20px] sm:text-[24px] font-bold leading-snug bg-gray-50 rounded-r-2xl">
          {quote}
        </div>
      </div>
    </section>
  );
}

