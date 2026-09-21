import { Link } from 'react-router-dom';
import { useLandingContent } from '../landing/landingContentStore';

export function Hero() {
  const content = useLandingContent();
  const { badge, titlePart1, titleHighlight, titlePart2, description, buttonText } = content.hero;
  const heroBadge = badge || 'CONFERENCE THEME';

  return (
    <section className="pt-[40px] max-[650px]:pt-[30px] min-h-[820px] max-[650px]:min-h-[900px] text-white relative overflow-hidden flex flex-col justify-center bg-[linear-gradient(0deg,rgba(15,15,15,0.92)_0%,rgba(15,15,15,0.82)_50%,rgba(15,15,15,0.90)_100%),url('/Hero.png')] bg-center bg-cover">
      <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-[#111111e6] to-transparent z-10"></div>
      
      <div className="container-custom min-h-[700px] max-[650px]:min-h-[790px] flex items-center justify-center relative z-20">
        <div className="max-w-[860px] py-[75px] pb-[110px] max-[650px]:pt-[70px] text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-[10px] uppercase tracking-[.17em] text-[12px] font-bold text-gray-200 mb-6 bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-xs">
            {heroBadge}
          </div>

          <h1 className="text-[clamp(50px,7vw,96px)] max-[650px]:text-[48px] max-w-[900px] font-extrabold tracking-tight leading-[1.08] mx-auto">
            {titlePart1} <span className="text-white">{titleHighlight}</span><br className="hidden sm:inline" /> {titlePart2}
          </h1>

          <p className="mt-[28px] max-w-[700px] text-[18px] sm:text-[20px] max-[650px]:text-[16px] leading-[1.7] text-gray-200 mx-auto font-normal">
            {description}
          </p>

          <div className="flex flex-wrap gap-[16px] sm:gap-[20px] mt-[40px] items-center justify-center">
            <Link 
              to="/register"
              className="bg-white text-black font-extrabold text-[15px] px-[34px] py-[18px] rounded-[14px] hover:bg-gray-100 transition-all shadow-xl border border-transparent inline-flex items-center justify-center cursor-pointer"
            >
              {buttonText || 'Register Now →'}
            </Link>
            <Link 
              to="/abstract-submission"
              className="bg-white/15 backdrop-blur-md text-white font-bold text-[15px] px-[30px] py-[18px] rounded-[14px] hover:bg-white/25 transition-all border border-white/20 inline-flex items-center justify-center cursor-pointer"
            >
              Submit Abstract Proposal →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
