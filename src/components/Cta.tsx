import { Link } from 'react-router-dom';
import { useLandingContent } from '../landing/landingContentStore';

export function Cta() {
  const content = useLandingContent();
  const { watermark, eyebrow, heading, description, buttonText } = content.cta;

  return (
    <section id="register" className="bg-brand-green text-white text-center relative overflow-hidden py-[110px] max-[650px]:py-[80px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[25vw] font-extrabold text-white/5 whitespace-nowrap pointer-events-none select-none">
        {watermark}
      </div>
      
      <div className="container-custom relative z-10">
        <div className="uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px] text-[#f1d36b]">
          {eyebrow}
        </div>
        <h2 className="text-[clamp(42px,5vw,70px)] max-w-[800px] mx-auto">
          {heading}
        </h2>
        <p className="max-w-[620px] mx-auto mt-[22px] mb-[30px] text-white/70 text-[17px]">
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link 
            to="/register"
            className="inline-flex border border-transparent bg-brand-gold text-[#15150f] px-[28px] py-[16px] rounded-full font-extrabold text-[14px] items-center gap-[9px] transition-all hover:-translate-y-0.5 hover:bg-[#e7bb45] shadow-lg"
          >
            {buttonText || 'Register for Conference →'}
          </Link>
          <Link 
            to="/abstract-submission"
            className="inline-flex border border-white/30 bg-white/10 backdrop-blur-md text-white px-[26px] py-[16px] rounded-full font-bold text-[14px] items-center gap-[9px] transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            Submit Abstract Proposal →
          </Link>
        </div>
      </div>
    </section>
  );
}
