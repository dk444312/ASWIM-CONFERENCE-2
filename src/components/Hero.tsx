import { Link } from 'react-router-dom';
import { useLandingContent } from '../landing/landingContentStore';

export function Hero() {
  const content = useLandingContent();
  const { badge, titlePart1, titleHighlight, titlePart2, description, buttonText } = content.hero;

  return (
    <section className="pt-[40px] max-[650px]:pt-[30px] min-h-[820px] max-[650px]:min-h-[900px] text-white relative overflow-hidden flex flex-col justify-center bg-[linear-gradient(90deg,rgba(4,38,25,.94)_0%,rgba(4,38,25,.78)_43%,rgba(4,38,25,.25)_100%),url('/Hero.png')] bg-center bg-cover">
      <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-[#042619b3] to-transparent z-10"></div>
      
      <div className="container-custom min-h-[700px] max-[650px]:min-h-[790px] flex items-center max-[650px]:items-start relative z-20">
        <div className="max-w-[800px] py-[75px] pb-[110px] max-[650px]:pt-[70px]">
          <div className="inline-flex items-center gap-[10px] uppercase tracking-[.17em] text-[12px] font-bold text-[#f1d36b] mb-6 before:content-[''] before:w-[34px] before:h-[2px] before:bg-brand-gold">
            {badge}
          </div>

          <h1 className="text-[clamp(54px,7.2vw,104px)] max-[650px]:text-[52px] max-w-[900px]">
            {titlePart1}<br/><span className="text-[#e5bb42]">{titleHighlight}</span><br/>{titlePart2}
          </h1>

          <p className="mt-[28px] max-w-[690px] text-[19px] max-[650px]:text-[16px] leading-[1.75] text-white/80">
            {description}
          </p>

          <div className="flex flex-wrap gap-[20px] mt-[40px] items-center">
            <Link 
              to="/register"
              className="bg-brand-green text-white font-extrabold text-[15px] px-[32px] py-[20px] rounded-[16px] hover:bg-brand-green-2 transition-colors shadow-lg border border-transparent hover:border-white/20 inline-flex items-center justify-center"
            >
              {buttonText || 'Register for Conference →'}
            </Link>
            <Link 
              to="/abstract-submission"
              className="bg-white/10 backdrop-blur-md text-white font-bold text-[15px] px-[28px] py-[20px] rounded-[16px] hover:bg-white/20 transition-colors border border-white/20 inline-flex items-center justify-center"
            >
              Submit Abstract Proposal →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
