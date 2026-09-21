import { Link } from 'react-router-dom';
import { useLandingContent } from '../landing/landingContentStore';

export function Cta() {
  const content = useLandingContent();
  const { watermark, eyebrow, heading, description, buttonText } = content.cta;

  return (
    <section id="register" className="bg-[#18181b] text-white text-center relative overflow-hidden py-[110px] max-[650px]:py-[80px] border-t border-neutral-800">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[25vw] font-extrabold text-white/5 whitespace-nowrap pointer-events-none select-none">
        {watermark}
      </div>
      
      <div className="container-custom relative z-10">
        <div className="uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px] text-gray-300">
          {eyebrow}
        </div>
        <h2 className="text-[clamp(42px,5vw,70px)] max-w-[800px] mx-auto font-heading font-extrabold tracking-tight">
          {heading}
        </h2>
        <p className="max-w-[620px] mx-auto mt-[22px] mb-[30px] text-gray-300 text-[17px] leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link 
            to="/register"
            className="inline-flex border border-transparent bg-white text-[#1f1f1f] px-[30px] py-[16px] rounded-full font-extrabold text-[14px] items-center gap-[9px] transition-all hover:-translate-y-0.5 hover:bg-gray-100 shadow-xl"
          >
            {buttonText || 'Register for Conference →'}
          </Link>
          <Link 
            to="/abstract-submission"
            className="inline-flex border border-white/20 bg-white/10 backdrop-blur-md text-white px-[28px] py-[16px] rounded-full font-bold text-[14px] items-center gap-[9px] transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            Submit Abstract Proposal →
          </Link>
        </div>
      </div>
    </section>
  );
}
