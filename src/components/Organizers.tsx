import { useLandingContent } from '../landing/landingContentStore';

export function Organizers() {
  const content = useLandingContent();
  const { heading } = content.organizers;

  return (
    <section id="organizers" className="py-[110px] max-[650px]:py-[80px] bg-brand-sand/30 border-t border-brand-line">
      <div className="container-custom">
        <div className="text-center max-w-[680px] mx-auto mb-[60px]">
          <h2 className="text-[32px] max-[650px]:text-[28px] font-heading font-extrabold text-brand-ink leading-[1.05] tracking-tight">
            {heading}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-[80px] max-[650px]:gap-[40px]">
          <img 
            src="/organizing bodies/IFSW LOGO.jpg" 
            alt="IFSW Logo" 
            className="max-h-[120px] max-[650px]:max-h-[90px] w-auto object-contain"
          />
          <img 
            src="/organizing bodies/ASWIM.png" 
            alt="ASWIM Logo" 
            className="max-h-[120px] max-[650px]:max-h-[90px] w-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
